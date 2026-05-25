/**
 * Runtime content loader. Imports validated metadata from the build-time
 * `virtual:content` module. Zod runtime never reaches the client because
 * validation happens Node-side during build (see `_plugin.ts`).
 *
 * Prose bodies (the Svelte components produced by MDsveX from each .md file)
 * are accessed lazily via `loadComponent(collection, slug)`. Routes that only
 * render listings (titles, tags, dates) never pay the body-bundle cost.
 */
import content from 'virtual:content';
import type {
	Award,
	BlogPost,
	Education,
	Experience,
	News,
	Project,
	Publication,
	Talk
} from './schemas';

/* ------------------------------------------------------------------ */
/* Collections. Plain JSON, no Zod runtime, no component bodies.       */
/* ------------------------------------------------------------------ */

export const projects: readonly Project[] = content.projects;
export const publications: readonly Publication[] = content.publications;
export const talks: readonly Talk[] = content.talks;
export const awards: readonly Award[] = content.awards;
export const experience: readonly Experience[] = content.experience;
export const education: readonly Education[] = content.education;
export const news: readonly News[] = content.news;
export const blog: readonly BlogPost[] = content.blog;

/* ------------------------------------------------------------------ */
/* Lazy component access. Used by detail pages that render prose.       */
/* ------------------------------------------------------------------ */

type LazyMap = Record<string, () => Promise<unknown>>;

// Vite's import.meta.glob with eager:false returns a map of
// `{ '/src/content/<collection>/<slug>.md': () => Promise<MdsvexModule> }`.
// The Svelte components live in separate chunks that the bundler only emits
// once a caller actually invokes the loader function for a given slug.
const lazyModules: Record<string, LazyMap> = {
	projects: import.meta.glob('/src/content/projects/*.md'),
	publications: import.meta.glob('/src/content/publications/*.md'),
	talks: import.meta.glob('/src/content/talks/*.md'),
	awards: import.meta.glob('/src/content/awards/*.md'),
	experience: import.meta.glob('/src/content/experience/*.md'),
	education: import.meta.glob('/src/content/education/*.md'),
	news: import.meta.glob('/src/content/news/*.md'),
	blog: import.meta.glob('/src/content/blog/*.md')
};

export type MdsvexModule = {
	default: unknown; // Svelte 5 component constructor, typed loosely on purpose
	metadata?: Record<string, unknown>;
};

function slugFromPath(path: string): string {
	const filename = path.split('/').pop() ?? '';
	return filename.replace(/\.md$/i, '');
}

/**
 * Lazy-load the prose body for a single content entry. Returns null if the
 * slug is unknown for the given collection.
 *
 * Use only in detail-page routes; listing routes should consume metadata
 * (titles, summaries, dates) via the typed arrays above and not call this.
 */
export async function loadComponent(
	collection: keyof typeof lazyModules,
	slug: string
): Promise<MdsvexModule | null> {
	const loaders = lazyModules[collection];
	if (!loaders) return null;
	const entry = Object.entries(loaders).find(([path]) => slugFromPath(path) === slug);
	if (!entry) return null;
	return (await entry[1]()) as MdsvexModule;
}

/* ------------------------------------------------------------------ */
/* Helpers. Pure, no I/O, no Zod.                                       */
/* ------------------------------------------------------------------ */

export function publishedOnly<T extends { status: 'draft' | 'published' | 'archived' }>(
	items: readonly T[]
): T[] {
	return items.filter((i) => i.status === 'published');
}

export function bySlug<T extends { slug: string }>(
	items: readonly T[],
	slug: string
): T | undefined {
	return items.find((i) => i.slug === slug);
}

// Sort newest-first by `year`. Items missing a year float to the TOP
// (treated as "current/ongoing"). Renderers that want strict chronological
// ordering should pre-filter to items with a year.
export function sortByYearDesc<T extends { year?: number }>(items: readonly T[]): T[] {
	return [...items].sort((a, b) => (b.year ?? Infinity) - (a.year ?? Infinity));
}

// Sort newest-first by `startedAt` (YYYY-MM). Items missing the date float
// to the TOP (treated as "current/ongoing"). Same rationale as sortByYearDesc.
export function sortByStartedAtDesc<T extends { startedAt?: string }>(items: readonly T[]): T[] {
	return [...items].sort((a, b) =>
		(b.startedAt ?? '9999-99').localeCompare(a.startedAt ?? '9999-99')
	);
}

export function featured<T extends { featured?: boolean }>(items: readonly T[]): T[] {
	return items.filter((i) => i.featured === true);
}

// Build a BibTeX entry from publication metadata. Used as the default for the
// "cite" widget so every publication is citable without hand-maintaining a
// `bibtex` field; an explicit `pub.bibtex` (if set) overrides this.
type CitablePub = {
	authors: string[];
	title: string;
	year: number;
	venue?: string;
	kind: string;
	doi?: string;
	url?: string;
};

export function toBibtex(pub: CitablePub): string {
	const typeMap: Record<string, string> = {
		journal: 'article',
		conference: 'inproceedings',
		workshop: 'inproceedings',
		preprint: 'misc',
		thesis: 'phdthesis',
		'book-chapter': 'incollection'
	};
	const entry = typeMap[pub.kind] ?? 'misc';

	const slugPart = (s: string) =>
		s
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[^a-z0-9]/g, '');
	const firstSurname = slugPart(pub.authors[0]?.split(/\s+/).pop() ?? 'anon') || 'anon';
	const firstTitleWord = slugPart(pub.title.split(/\s+/).find((w) => w.length > 3) ?? 'untitled');
	const key = `${firstSurname}${pub.year}${firstTitleWord}`;

	const venueField =
		entry === 'inproceedings' ? 'booktitle' : entry === 'article' ? 'journal' : 'howpublished';

	const fields: string[] = [
		`  author = {${pub.authors.join(' and ')}}`,
		`  title = {${pub.title}}`
	];
	if (pub.venue) fields.push(`  ${venueField} = {${pub.venue}}`);
	fields.push(`  year = {${pub.year}}`);
	if (pub.doi) fields.push(`  doi = {${pub.doi}}`);
	if (pub.url) fields.push(`  url = {${pub.url}}`);

	return `@${entry}{${key},\n${fields.join(',\n')}\n}`;
}
