#!/usr/bin/env node
/*
 * Generate per-entry Open Graph images (1200x630) for every content detail page.
 * Renders a small HTML template per entry with headless Chrome into static/og/.
 *
 * Usage: node scripts/generate-og-images.mjs   (run from repo root; needs Google Chrome)
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import os from 'node:os';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'static', 'og');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FRAUNCES = join(
	ROOT,
	'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2'
);
const GEIST_MONO = join(
	ROOT,
	'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2'
);

/* Minimal frontmatter reader: good enough for our simple `key: value` fields. */
function frontmatter(file) {
	const raw = readFileSync(file, 'utf8');
	const m = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!m) return {};
	const out = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^(\w+):\s*(.+)$/);
		if (!kv) continue;
		let v = kv[2].trim();
		if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"')))
			v = v.slice(1, -1);
		out[kv[1]] = v;
	}
	return out;
}

const esc = (s) =>
	String(s ?? '').replace(
		/[&<>"']/g,
		(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
	);

function html({ kicker, title, meta, tags }) {
	return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Fraunces'; src: url('file://${FRAUNCES}'); }
@font-face { font-family: 'Geist Mono'; src: url('file://${GEIST_MONO}'); }
* { margin: 0; box-sizing: border-box; }
body {
  width: 1200px; height: 630px; background: #0a0e1a; color: #e2e8f0;
  font-family: 'Geist Mono', monospace; padding: 64px 72px;
  display: flex; flex-direction: column; justify-content: space-between;
  background-image:
    radial-gradient(circle at 12% 8%, rgba(94,234,212,0.10), transparent 45%),
    radial-gradient(circle at 88% 92%, rgba(139,92,246,0.12), transparent 50%);
}
.brand { display: flex; align-items: center; gap: 12px; color: #94a3b8;
  font-size: 15px; letter-spacing: 0.25em; text-transform: uppercase; }
.dot { width: 10px; height: 10px; border-radius: 9999px; background: #5eead4; }
.kicker { color: #5eead4; font-size: 16px; letter-spacing: 0.2em;
  text-transform: uppercase; margin-bottom: 20px; }
h1 { font-family: 'Fraunces', serif; font-weight: 560; font-size: 52px;
  line-height: 1.15; letter-spacing: -0.01em;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.meta { color: #94a3b8; font-size: 18px; margin-top: 20px; }
.tags { color: #718096; font-size: 15px; }
</style></head><body>
<div class="brand"><span class="dot"></span> Saheed Faremi</div>
<div>
  <p class="kicker">${esc(kicker)}</p>
  <h1>${esc(title)}</h1>
  ${meta ? `<p class="meta">${esc(meta)}</p>` : ''}
</div>
${tags ? `<p class="tags">${esc(tags)}</p>` : '<p class="tags">saheedfaremi.com</p>'}
</body></html>`;
}

function render(file, out) {
	const tmp = join(os.tmpdir(), `og-${out.replace(/\W+/g, '_')}.html`);
	writeFileSync(tmp, file);
	execFileSync(CHROME, [
		'--headless',
		'--disable-gpu',
		'--hide-scrollbars',
		'--window-size=1200,630',
		`--screenshot=${out}`,
		`file://${tmp}`
	]);
	rmSync(tmp, { force: true });
}

/* Per-collection kicker/meta derivation. */
const collections = [
	{
		dir: 'src/content/publications',
		prefix: 'publications',
		map: (fm) => ({
			kicker: `${fm.kind ?? 'publication'} · ${fm.year ?? ''}`,
			title: fm.title,
			meta: [fm.venue, fm.year].filter(Boolean).join(' · ')
		})
	},
	{
		dir: 'src/content/projects',
		prefix: 'projects',
		map: (fm) => ({
			kicker: `${fm.domain ?? 'project'}${fm.role ? ` · ${fm.role}` : ''}`,
			title: fm.title,
			meta: fm.summary
		})
	},
	{
		dir: 'src/content/blog',
		prefix: 'blog',
		map: (fm) => ({
			kicker: `research notes · ${fm.publishedAt ?? ''}`,
			title: fm.title,
			meta: fm.summary
		})
	},
	{
		dir: 'src/content/talks',
		prefix: 'talks',
		map: (fm) => ({
			kicker: `talk · ${fm.year ?? ''}`,
			title: fm.title,
			meta: fm.event
		})
	},
	{
		dir: 'src/content/awards',
		prefix: 'awards',
		map: (fm) => ({
			kicker: `award · ${fm.year ?? ''}`,
			title: fm.title,
			meta: [fm.organization, fm.prize].filter(Boolean).join(' · ')
		})
	},
	{
		dir: 'src/content/news',
		prefix: 'news',
		map: (fm) => ({
			kicker: 'press',
			title: fm.title,
			meta: [fm.outlet, fm.publishedAt].filter(Boolean).join(' · ')
		})
	}
];

mkdirSync(OUT, { recursive: true });
let count = 0;
for (const c of collections) {
	const dir = join(ROOT, c.dir);
	for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
		const fm = frontmatter(join(dir, f));
		if (fm.status !== 'published') continue;
		const slug = f.replace(/\.md$/, '');
		const { kicker, title, meta } = c.map(fm);
		const out = join(OUT, `${c.prefix}-${slug}.png`);
		render(html({ kicker, title, meta }), out);
		count++;
		console.log(`og/${c.prefix}-${slug}.png`);
	}
}
console.log(`\n${count} OG images written to static/og/`);
