import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* Shared primitives                                                  */
/* ------------------------------------------------------------------ */

export const StatusEnum = z.enum(['draft', 'published', 'archived']);

const SlugString = z
	.string()
	.regex(/^[a-z0-9][a-z0-9-]*$/, 'slug must be kebab-case (a–z, 0–9, hyphens)');

const YearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'expected YYYY-MM');

const BaseFields = {
	title: z.string().min(1),
	slug: SlugString,
	status: StatusEnum.default('draft'),
	summary: z.string().max(280).optional(),
	cover: z.string().optional(),
	tags: z.array(z.string()).default([])
} as const;

/* ------------------------------------------------------------------ */
/* Project                                                            */
/* ------------------------------------------------------------------ */

export const ProjectDomain = z.enum([
	'fintech',
	'health',
	'education',
	'hr',
	'agriculture',
	'gis',
	'research',
	'civic',
	'consulting',
	'other'
]);

export const ProjectSchema = z.object({
	...BaseFields,
	domain: ProjectDomain,
	role: z.string().optional(),
	tech: z.array(z.string()).default([]),
	highlights: z.array(z.string()).default([]),
	links: z
		.object({
			live: z.url().optional(),
			repo: z.url().optional(),
			caseStudy: z.url().optional()
		})
		.default({}),
	startedAt: YearMonth.optional(),
	endedAt: YearMonth.optional(),
	featured: z.boolean().default(false)
});

/* ------------------------------------------------------------------ */
/* Publication                                                        */
/* ------------------------------------------------------------------ */

export const PublicationKind = z.enum([
	'journal',
	'conference',
	'workshop',
	'preprint',
	'thesis',
	'book-chapter'
]);

export const PublicationSchema = z.object({
	...BaseFields,
	authors: z.array(z.string()).min(1),
	venue: z.string().optional(),
	year: z.number().int().min(1990).max(2100),
	kind: PublicationKind.default('preprint'),
	doi: z.string().optional(),
	url: z.url().optional(),
	pdf: z.string().optional(),
	abstract: z.string().optional(),
	bibtex: z.string().optional()
});

/* ------------------------------------------------------------------ */
/* Talk                                                               */
/* ------------------------------------------------------------------ */

export const TalkSchema = z.object({
	...BaseFields,
	event: z.string().min(1),
	location: z.string().optional(),
	year: z.number().int().min(1990).max(2100),
	url: z.url().optional(),
	recording: z.url().optional(),
	slides: z.url().optional()
});

/* ------------------------------------------------------------------ */
/* Award                                                              */
/* ------------------------------------------------------------------ */

export const AwardSchema = z.object({
	...BaseFields,
	organization: z.string().min(1),
	year: z.number().int().min(1990).max(2100),
	prize: z.string().optional(),
	url: z.url().optional()
});

/* ------------------------------------------------------------------ */
/* Experience                                                         */
/* ------------------------------------------------------------------ */

export const ExperienceType = z.enum([
	'employment',
	'founder',
	'consulting',
	'volunteer',
	'fellowship'
]);

export const ExperienceSchema = z.object({
	...BaseFields,
	organization: z.string().min(1),
	role: z.string().min(1),
	type: ExperienceType.default('employment'),
	location: z.string().optional(),
	// Optional so DRAFT entries can omit the date until verified. Renderers
	// that surface dates publicly should gate on `status === 'published'` and
	// can warn if a published entry is missing `startedAt`.
	startedAt: YearMonth.optional(),
	endedAt: YearMonth.optional(), // undefined = currently held
	highlights: z.array(z.string()).default([])
});

/* ------------------------------------------------------------------ */
/* Education                                                          */
/* ------------------------------------------------------------------ */

export const EducationStatus = z.enum(['in-progress', 'complete', 'withdrawn']);

export const EducationSchema = z.object({
	...BaseFields,
	institution: z.string().min(1),
	degree: z.string().min(1),
	field: z.string().optional(),
	// Optional during DRAFT (see ExperienceSchema rationale).
	startedAt: YearMonth.optional(),
	endedAt: YearMonth.optional(),
	advisor: z.string().optional(),
	location: z.string().optional(),
	progressionStatus: EducationStatus.default('complete')
});

/* ------------------------------------------------------------------ */
/* News / press                                                       */
/* ------------------------------------------------------------------ */

export const NewsSchema = z.object({
	...BaseFields,
	outlet: z.string().optional(),
	url: z.url(),
	publishedAt: z.iso.date().optional()
});

/* ------------------------------------------------------------------ */
/* Blog                                                               */
/* ------------------------------------------------------------------ */

export const BlogPostSchema = z.object({
	...BaseFields,
	publishedAt: z.iso.date(),
	updatedAt: z.iso.date().optional(),
	readingTime: z.number().int().positive().optional(),
	// Optional source repo URL when the post talks about a specific codebase.
	// Must be a full URL so it can be used directly as an href.
	repo: z.url().optional()
});

/* ------------------------------------------------------------------ */
/* Inferred types                                                     */
/* ------------------------------------------------------------------ */

export type Status = z.infer<typeof StatusEnum>;
export type Project = z.infer<typeof ProjectSchema>;
export type Publication = z.infer<typeof PublicationSchema>;
export type Talk = z.infer<typeof TalkSchema>;
export type Award = z.infer<typeof AwardSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type News = z.infer<typeof NewsSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
