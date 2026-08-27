import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/*
 * Tiny rehype plugin: markdown images render lazy + async-decoded so blog posts
 * with multi-hundred-KB figures don't block first paint. (Markdown syntax can't
 * carry width/height, so layout stability comes from CSS instead.)
 */
function rehypeLazyImages() {
	return (tree) => {
		const visit = (node) => {
			if (node.type === 'element' && node.tagName === 'img') {
				node.properties = {
					loading: 'lazy',
					decoding: 'async',
					...node.properties
				};
			}
			for (const child of node.children ?? []) visit(child);
		};
		visit(tree);
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			rehypePlugins: [rehypeLazyImages]
		})
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, message }) => {
				const planned = ['/about', '/uses'];
				if (planned.some((p) => path === p || path.startsWith(p + '/'))) {
					console.warn(`prerender: planned route ${path} not yet built, skipping`);
					return;
				}
				// Blog figures Saheed will drop in over time, named per-stage. The
				// markdown embed is wired ahead of the asset landing; once the PNG is
				// in static/blog/<slug>/, the prerender check naturally passes.
				if (/^\/blog\/[a-z0-9-]+\/(stage|fig)[\w-]*\.png$/i.test(path)) {
					console.warn(`prerender: blog figure ${path} not yet shipped, skipping`);
					return;
				}
				throw new Error(`Unexpected 404 during prerender: ${message}`);
			},
			// Detail routes prerender one page per content entry via entries(). When a
			// collection is empty, entries() returns [] and SvelteKit flags the route
			// as "marked prerenderable but not seen during crawl" — 'ignore' keeps
			// that from failing the build when a collection has no entries yet.
			handleUnseenRoutes: 'ignore'
		},
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://plausible.io'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self', 'data:'],
				'connect-src': ['self', 'https://plausible.io'],
				// frame-ancestors is spec-defined as HTTP-header-only — meta-tag form
				// is silently ignored by browsers. Set in staticwebapp.config.json.
				'base-uri': ['self'],
				'form-action': ['self']
			}
		}
	}
};

export default config;
