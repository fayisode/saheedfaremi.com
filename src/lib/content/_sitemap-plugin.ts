/**
 * Build-time sitemap generator. Emits `sitemap.xml` into the static output
 * once SvelteKit's adapter-static has written all prerendered HTML.
 *
 * The sitemap is built by walking the `build/` directory after prerender and
 * listing every `.html` file as a URL. That's the canonical source of truth
 * (whatever SvelteKit actually prerendered is what crawlers should know about).
 */
import { readdirSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import type { Plugin } from 'vite';

const DEFAULT_ORIGIN = 'https://saheedfaremi.com';
const EXCLUDED_PREFIXES = ['/dev/', '/api/'];

function walk(dir: string, base: string): string[] {
	const out: string[] = [];
	for (const name of readdirSync(dir)) {
		const full = resolve(dir, name);
		const stat = statSync(full);
		if (stat.isDirectory()) {
			out.push(...walk(full, base));
		} else if (name.endsWith('.html')) {
			const rel = relative(base, full).replace(/\\/g, '/');
			out.push('/' + rel);
		}
	}
	return out;
}

function htmlPathToRoute(p: string): string {
	// /index.html → /
	// /about.html → /about
	// /projects/curnance.html → /projects/curnance
	if (p === '/index.html') return '/';
	return p.replace(/\.html$/, '');
}

export function sitemapPlugin(origin: string = DEFAULT_ORIGIN): Plugin {
	let outDir = '';
	return {
		name: 'saheed-cv:sitemap',
		apply: 'build',
		configResolved(config) {
			// adapter-static writes to ./build by default
			outDir = resolve(config.root, 'build');
		},
		closeBundle: {
			order: 'post',
			handler() {
				if (!existsSync(outDir)) return; // dev build or skipped
				const paths = walk(outDir, outDir)
					.map(htmlPathToRoute)
					.filter((p) => !EXCLUDED_PREFIXES.some((prefix) => p.startsWith(prefix)))
					.sort();
				const today = new Date().toISOString().slice(0, 10);
				const urls = paths
					.map((p) => `  <url><loc>${origin}${p}</loc><lastmod>${today}</lastmod></url>`)
					.join('\n');
				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
				writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf-8');
			}
		}
	};
}
