/**
 * Atom 1.0 feed of published blog posts. Prerendered to /rss.xml at build
 * time. Origin matches the canonical site used by the sitemap plugin.
 *
 * Dates are emitted as RFC 3339 (publishedAt is already a YYYY-MM-DD ISO
 * date string per BlogPostSchema, which is valid Atom). For each entry we
 * surface updatedAt when it is newer than publishedAt.
 */
import { blog } from '$lib/content/loader';
import type { BlogPost } from '$lib/content/schemas';

export const prerender = true;

const ORIGIN = 'https://saheedfaremi.com';

/** Escape a plain-text string for safe inclusion as XML character data. */
function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

/** Newer of publishedAt / updatedAt, falling back to publishedAt. */
function entryDate(post: BlogPost): string {
	return post.updatedAt && post.updatedAt > post.publishedAt ? post.updatedAt : post.publishedAt;
}

export function GET() {
	const posts = blog
		.filter((p) => p.status === 'published')
		.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

	const feedUpdated = posts.length ? entryDate(posts[0]) : new Date().toISOString();

	const entries = posts
		.map((post) => {
			const url = `${ORIGIN}/blog/${post.slug}`;
			const updated = entryDate(post);
			const html = `<p>${escapeXml(post.summary ?? post.title)}</p>`;

			const lines = [
				'  <entry>',
				`    <id>${url}</id>`,
				`    <title>${escapeXml(post.title)}</title>`,
				`    <link href="${url}" />`,
				`    <updated>${updated}</updated>`
			];
			if (post.summary) {
				lines.push(`    <summary>${escapeXml(post.summary)}</summary>`);
			}
			lines.push(`    <content type="html"><![CDATA[${html}]]></content>`);
			lines.push('  </entry>');
			return lines.join('\n');
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${ORIGIN}</id>
  <title>Saheed Faremi</title>
  <subtitle>Notes on EEG microstate research, deep learning methods, and engineering practice.</subtitle>
  <link href="${ORIGIN}/rss.xml" rel="self" />
  <link href="${ORIGIN}" />
  <updated>${feedUpdated}</updated>
${entries}
</feed>
`;

	return new Response(xml, {
		headers: { 'content-type': 'application/atom+xml; charset=utf-8' }
	});
}
