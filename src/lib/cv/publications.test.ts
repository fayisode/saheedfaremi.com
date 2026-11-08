import { describe, expect, it } from 'vitest';
import { publications, publishedOnly } from '$lib/content/loader';
import type { Publication } from '$lib/content/schemas';
import { isPeerReviewed, isUnderReview, orderPublications } from './publications';

const base: Publication = {
	title: 'A minimal publication fixture',
	slug: 'minimal-publication-fixture',
	status: 'published',
	tags: [],
	authors: ['Saheed Faremi'],
	year: 2026,
	kind: 'preprint'
};

describe('publication groups', () => {
	it('accepts journal articles and ordinary conference papers as peer-reviewed', () => {
		expect(isPeerReviewed({ ...base, kind: 'journal' })).toBe(true);
		expect(isPeerReviewed({ ...base, kind: 'conference', venue: 'IEEE ICTAS 2024' })).toBe(true);
	});

	it('rejects preprints, protocols and doctoral work from the peer-reviewed group', () => {
		expect(isPeerReviewed({ ...base, kind: 'preprint', venue: 'arXiv' })).toBe(false);
		expect(
			isPeerReviewed({
				...base,
				kind: 'preprint',
				venue: 'OSF Registries (registered systematic-review protocol)'
			})
		).toBe(false);
		expect(isPeerReviewed({ ...base, kind: 'workshop', venue: 'Doctoral Proposals track' })).toBe(
			false
		);
		expect(isPeerReviewed({ ...base, kind: 'thesis' })).toBe(false);
	});

	it('recognises under-review and manuscript-preparation wording without treating it as peer review', () => {
		for (const venue of [
			'ICLR 2027 (under review; OpenReview #50003)',
			'Journal (in review)',
			'Cognitive Computation (manuscript in preparation)'
		]) {
			const publication = { ...base, venue };
			expect(isUnderReview(publication)).toBe(true);
			expect(isPeerReviewed(publication)).toBe(false);
		}
		expect(isUnderReview({ ...base, venue: 'Brain Informatics' })).toBe(false);
	});
});

describe('orderPublications', () => {
	it('orders the real bibliography by research date within all three groups', () => {
		const ordered = orderPublications(publishedOnly(publications));
		expect(ordered.map((publication) => publication.slug)).toEqual([
			'cognitive-computation-conv-vade-dynamics',
			'aics-2026-temporal-dynamics',
			'iclr-2027-spatial-encoding-geometry',
			'fashoto-2026-autism-xai',
			'cvae-gmm-eeg-topographic-maps',
			'vade-eeg-microstate-discovery',
			'autoencoder-eeg-systematic-review-protocol',
			'xai-2025-doctoral-proposal',
			'malaria-ml-nigeria'
		]);
		expect(ordered.filter(isPeerReviewed).map((publication) => publication.slug)).toEqual([
			'aics-2026-temporal-dynamics',
			'cvae-gmm-eeg-topographic-maps',
			'malaria-ml-nigeria'
		]);
		expect(
			ordered
				.filter((publication) => !isPeerReviewed(publication) && !isUnderReview(publication))
				.map((publication) => publication.slug)
		).toEqual([
			'vade-eeg-microstate-discovery',
			'autoencoder-eeg-systematic-review-protocol',
			'xai-2025-doctoral-proposal'
		]);
		expect(ordered.filter(isUnderReview).map((publication) => publication.slug)).toEqual([
			'cognitive-computation-conv-vade-dynamics',
			'iclr-2027-spatial-encoding-geometry',
			'fashoto-2026-autism-xai'
		]);
	});

	it('returns a sorted copy rather than mutating its input', () => {
		const input = [
			{ ...base, slug: 'older', year: 2025 },
			{ ...base, slug: 'newer', year: 2026 }
		];
		expect(orderPublications(input).map((publication) => publication.slug)).toEqual([
			'newer',
			'older'
		]);
		expect(input.map((publication) => publication.slug)).toEqual(['older', 'newer']);
	});
});
