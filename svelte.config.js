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
				// Allowlist routes that are referenced from the design-system kitchen
				// sink but don't exist yet. They get built in later phases (see plan.md).
				const planned = ['/projects', '/about', '/publications', '/cv', '/now', '/uses'];
				if (planned.some((p) => path === p || path.startsWith(p + '/'))) {
					console.warn(`prerender: planned route ${path} not yet built — skipping`);
					return;
				}
				throw new Error(`Unexpected 404 during prerender: ${message}`);
			}
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
