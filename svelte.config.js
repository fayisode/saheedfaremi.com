import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	preprocess: [
		mdsvex({
			extensions: ['.md']
		})
	],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, message }) => {
				const planned = ['/about', '/now', '/uses'];
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
			// /publications/[slug] and /talks/[slug] are declared prerenderable but
			// their collections (publications, talks) are currently empty — `entries()`
			// returns []. SvelteKit flags this as "marked prerenderable but not seen
			// during crawl". 'ignore' is correct here: when Saheed adds his first
			// publication or talk to src/content/, entries() returns the new slug and
			// the route prerenders without further config change.
			handleUnseenRoutes: 'ignore'
		},
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
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
