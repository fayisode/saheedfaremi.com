/**
 * Build-time content loader. Runs in Node during Vite's build; never ships to
 * the client. Reads every `src/content/<collection>/*.md` file, parses its
 * YAML frontmatter with gray-matter, validates against the appropriate Zod
 * schema, and exposes the result as a virtual module (`virtual:content`) that
 * the runtime loader imports as plain JSON.
 *
 * Effect on bundle: Zod runtime + every markdown component body stay out of
 * the client because consumers import `virtual:content` (JSON) instead of
 * `import.meta.glob({ eager: true })` over the markdown directories.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, extname, basename } from 'node:path';
import matter from 'gray-matter';
import type { Plugin } from 'vite';
import type { ZodType } from 'zod';

import {
	AwardSchema,
	EducationSchema,
	ExperienceSchema,
	NewsSchema,
	ProjectSchema,
	PublicationSchema,
	TalkSchema
} from './schemas';

const COLLECTIONS: Record<string, ZodType> = {
	projects: ProjectSchema,
	publications: PublicationSchema,
	talks: TalkSchema,
	awards: AwardSchema,
	experience: ExperienceSchema,
	education: EducationSchema,
	news: NewsSchema
};

const VIRTUAL_ID = 'virtual:content';
const RESOLVED_ID = '\0virtual:content';

// Slugs that would collide with conventional route names. Mirrors the
// runtime loader's old denylist; centralised here now that validation
// happens at build time.
const RESERVED_SLUGS = new Set(['index', 'readme', 'default', '_index', 'admin']);

function isMarkdownFile(name: string): boolean {
	return extname(name).toLowerCase() === '.md';
}

function loadCollection(dir: string, schema: ZodType, collectionName: string): unknown[] {
	if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];

	const files = readdirSync(dir).filter(isMarkdownFile);
	const items: unknown[] = [];

	for (const filename of files) {
		const slug = basename(filename, '.md');
		if (!slug || slug.startsWith('.')) continue;
		if (RESERVED_SLUGS.has(slug)) {
			throw new Error(
				`[content plugin] '${dir}/${filename}' produces reserved slug '${slug}'. Rename the file.`
			);
		}

		const filepath = resolve(dir, filename);
		const raw = readFileSync(filepath, 'utf-8');
		const { data: frontmatter } = matter(raw);

		const result = schema.safeParse({ slug, ...frontmatter });
		if (!result.success) {
			const issues = result.error.issues
				.map((i) => `  · ${i.path.join('.')}: ${i.message}`)
				.join('\n');
			throw new Error(
				`[content plugin] Invalid ${collectionName} content in ${filepath}\n${issues}`
			);
		}

		items.push(result.data);
	}

	return items;
}

export function contentPlugin(): Plugin {
	let contentRoot = '';

	return {
		name: 'saheed-cv:content',

		configResolved(config) {
			contentRoot = resolve(config.root, 'src/content');
		},

		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_ID;
			return null;
		},

		load(id) {
			if (id !== RESOLVED_ID) return null;

			const data: Record<string, unknown[]> = {};
			for (const [collection, schema] of Object.entries(COLLECTIONS)) {
				const dir = resolve(contentRoot, collection);
				data[collection] = loadCollection(dir, schema, collection);
			}
			// JSON.stringify drops undefined fields, so the runtime bundle stays
			// minimal even when frontmatter omits optional values.
			return `export default Object.freeze(${JSON.stringify(data)});`;
		},

		// Dev-only: invalidate the virtual module whenever a markdown file under
		// src/content/ changes, so the running app sees new content immediately.
		handleHotUpdate(ctx) {
			if (!ctx.file.endsWith('.md')) return;
			if (!ctx.file.includes('src/content/')) return;
			const mod = ctx.server.moduleGraph.getModuleById(RESOLVED_ID);
			if (mod) {
				ctx.server.moduleGraph.invalidateModule(mod);
				return [mod];
			}
			return undefined;
		}
	};
}
