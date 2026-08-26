/**
 * Unit tests for the content loader helpers plus integrity invariants over the
 * real content collections (resolved from `virtual:content` at test time, so
 * these run against exactly what the build validated).
 */
import { describe, expect, it } from 'vitest';
import {
	awards,
	blog,
	bySlug,
	education,
	experience,
	featured,
	news,
	projects,
	publications,
	publishedOnly,
	sortByStartedAtDesc,
	sortByYearDesc,
	talks,
	toBibtex
} from './loader';

describe('publishedOnly', () => {
	it('keeps only published entries', () => {
		const items = [
			{ status: 'published' as const, id: 1 },
			{ status: 'draft' as const, id: 2 },
			{ status: 'archived' as const, id: 3 }
		];
		expect(publishedOnly(items).map((i) => i.id)).toEqual([1]);
	});
});

describe('bySlug', () => {
	it('finds the matching entry and returns undefined otherwise', () => {
		const items = [{ slug: 'a' }, { slug: 'b' }];
		expect(bySlug(items, 'b')).toEqual({ slug: 'b' });
		expect(bySlug(items, 'nope')).toBeUndefined();
	});
});

describe('sortByYearDesc', () => {
	it('sorts newest-first and floats undated items to the top', () => {
		const sorted = sortByYearDesc([{ year: 2024 }, { year: 2026 }, {}, { year: 2025 }]);
		expect(sorted.map((i) => i.year)).toEqual([undefined, 2026, 2025, 2024]);
	});

	it('does not mutate the input array', () => {
		const input = [{ year: 2024 }, { year: 2026 }];
		sortByYearDesc(input);
		expect(input.map((i) => i.year)).toEqual([2024, 2026]);
	});
});

describe('sortByStartedAtDesc', () => {
	it('sorts newest-first and floats undated items to the top', () => {
		const sorted = sortByStartedAtDesc([{ startedAt: '2021-05' }, {}, { startedAt: '2024-01' }]);
		expect(sorted.map((i) => i.startedAt)).toEqual([undefined, '2024-01', '2021-05']);
	});
});

describe('featured', () => {
	it('keeps only entries explicitly flagged featured', () => {
		const items = [{ featured: true }, { featured: false }, {}];
		expect(featured(items)).toEqual([{ featured: true }]);
	});
});

describe('toBibtex', () => {
	const base = {
		authors: ['Saheed Faremi', 'Luca Longo'],
		title: 'Integrating Convolutional Variational Autoencoders and the Gaussian Mixture Model',
		year: 2026
	};

	it('maps kinds to BibTeX entry types with the right venue field', () => {
		expect(toBibtex({ ...base, kind: 'journal', venue: 'Brain Informatics' })).toContain(
			'@article{'
		);
		expect(toBibtex({ ...base, kind: 'journal', venue: 'Brain Informatics' })).toContain(
			'journal = {Brain Informatics}'
		);
		expect(toBibtex({ ...base, kind: 'conference', venue: 'XAI 2026' })).toContain(
			'booktitle = {XAI 2026}'
		);
		expect(toBibtex({ ...base, kind: 'preprint' })).toContain('@misc{');
	});

	it('builds a stable citation key from first surname, year, and first long title word', () => {
		expect(toBibtex({ ...base, kind: 'preprint' })).toContain('@misc{faremi2026integrating,');
	});

	it('includes doi and url only when present', () => {
		const withIds = toBibtex({ ...base, kind: 'preprint', doi: '10.1/x', url: 'https://osf.io/x' });
		expect(withIds).toContain('doi = {10.1/x}');
		expect(withIds).toContain('url = {https://osf.io/x}');
		expect(toBibtex({ ...base, kind: 'preprint' })).not.toContain('doi =');
	});

	it('joins multiple authors with "and"', () => {
		expect(toBibtex({ ...base, kind: 'preprint' })).toContain(
			'author = {Saheed Faremi and Luca Longo}'
		);
	});
});

describe('content integrity', () => {
	const collections = { projects, publications, talks, awards, experience, education, news, blog };

	it('every collection has unique slugs', () => {
		for (const [name, items] of Object.entries(collections)) {
			const slugs = items.map((i) => i.slug);
			expect(new Set(slugs).size, `duplicate slug in ${name}`).toBe(slugs.length);
		}
	});

	it('every publication has at least one author and a four-digit year', () => {
		for (const pub of publications) {
			expect(pub.authors.length, pub.slug).toBeGreaterThan(0);
			expect(String(pub.year), pub.slug).toMatch(/^\d{4}$/);
		}
	});

	it('featured projects are published (drafts must not top the listing)', () => {
		for (const project of featured(projects)) {
			expect(project.status, project.slug).toBe('published');
		}
	});

	it('published blog posts have a valid publishedAt date', () => {
		for (const post of publishedOnly(blog)) {
			expect(Number.isNaN(Date.parse(post.publishedAt)), post.slug).toBe(false);
		}
	});

	it('every publication detail page can auto-generate a BibTeX entry', () => {
		for (const pub of publishedOnly(publications)) {
			expect(toBibtex(pub), pub.slug).toMatch(/^@\w+\{\S+,\n/);
		}
	});
});
