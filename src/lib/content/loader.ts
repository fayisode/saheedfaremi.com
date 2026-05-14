import type { Component } from 'svelte';
import type { ZodType, z } from 'zod';
import {
	AwardSchema,
	EducationSchema,
	ExperienceSchema,
	NewsSchema,
	ProjectSchema,
	PublicationSchema,
	TalkSchema,
	type Award,
	type Education,
	type Experience,
	type News,
	type Project,
	type Publication,
	type Talk
} from './schemas';

/* ------------------------------------------------------------------ */
/* Glob loader                                                        */
/* ------------------------------------------------------------------ */

type MdsvexModule = {
	default: Component;
	metadata?: Record<string, unknown>;
};

type LoadedEntry<T> = T & {
	Component: Component;
};

// Slugs that would collide with conventional route names (e.g. /projects/index)
// or with framework files. Reject at load time rather than risk silent shadowing.
const RESERVED_SLUGS = new Set(['index', 'readme', 'default', '_index', 'admin']);

function slugFromPath(path: string): string {
	const filename = path.split('/').pop() ?? '';
	const slug = filename.replace(/\.(md|svx)$/i, '');
	if (!slug) {
		throw new Error(`Content file has empty slug after stripping extension: ${path}`);
	}
	if (RESERVED_SLUGS.has(slug)) {
		throw new Error(`Content file '${path}' produces reserved slug '${slug}'. Rename the file.`);
	}
	return slug;
}

function loadCollection<TSchema extends ZodType>(
	schema: TSchema,
	modules: Record<string, unknown>,
	collectionName: string
): Array<LoadedEntry<z.infer<TSchema>>> {
	return Object.entries(modules).map(([path, mod]) => {
		const m = mod as MdsvexModule;
		const slug = slugFromPath(path);
		const meta = m.metadata ?? {};
		const result = schema.safeParse({ slug, ...meta });
		if (!result.success) {
			const issues = result.error.issues
				.map((i) => `  · ${i.path.join('.')}: ${i.message}`)
				.join('\n');
			throw new Error(`Invalid ${collectionName} content in ${path}\n${issues}`);
		}
		return {
			...(result.data as object),
			Component: m.default
		} as LoadedEntry<z.infer<TSchema>>;
	});
}

/* ------------------------------------------------------------------ */
/* Collections (eager glob — resolved at build time)                  */
/* ------------------------------------------------------------------ */

export const projects: Array<LoadedEntry<Project>> = loadCollection(
	ProjectSchema,
	import.meta.glob('/src/content/projects/*.md', { eager: true }),
	'project'
);

export const publications: Array<LoadedEntry<Publication>> = loadCollection(
	PublicationSchema,
	import.meta.glob('/src/content/publications/*.md', { eager: true }),
	'publication'
);

export const talks: Array<LoadedEntry<Talk>> = loadCollection(
	TalkSchema,
	import.meta.glob('/src/content/talks/*.md', { eager: true }),
	'talk'
);

export const awards: Array<LoadedEntry<Award>> = loadCollection(
	AwardSchema,
	import.meta.glob('/src/content/awards/*.md', { eager: true }),
	'award'
);

export const experience: Array<LoadedEntry<Experience>> = loadCollection(
	ExperienceSchema,
	import.meta.glob('/src/content/experience/*.md', { eager: true }),
	'experience'
);

export const education: Array<LoadedEntry<Education>> = loadCollection(
	EducationSchema,
	import.meta.glob('/src/content/education/*.md', { eager: true }),
	'education'
);

export const news: Array<LoadedEntry<News>> = loadCollection(
	NewsSchema,
	import.meta.glob('/src/content/news/*.md', { eager: true }),
	'news'
);

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export function publishedOnly<T extends { status: 'draft' | 'published' | 'archived' }>(
	items: T[]
): T[] {
	return items.filter((i) => i.status === 'published');
}

export function bySlug<T extends { slug: string }>(items: T[], slug: string): T | undefined {
	return items.find((i) => i.slug === slug);
}

// Sort newest-first by `year`. Items missing a year float to the TOP
// (treated as "current/ongoing") rather than sinking to the bottom. Renderers
// that want strict chronological ordering should pre-filter to items with a year.
export function sortByYearDesc<T extends { year?: number }>(items: T[]): T[] {
	return [...items].sort((a, b) => (b.year ?? Infinity) - (a.year ?? Infinity));
}

// Sort newest-first by `startedAt` (YYYY-MM). Items missing the date float
// to the TOP (treated as "current/ongoing"). Same rationale as sortByYearDesc.
export function sortByStartedAtDesc<T extends { startedAt?: string }>(items: T[]): T[] {
	return [...items].sort((a, b) =>
		(b.startedAt ?? '9999-99').localeCompare(a.startedAt ?? '9999-99')
	);
}

export function featured<T extends { featured?: boolean }>(items: T[]): T[] {
	return items.filter((i) => i.featured === true);
}
