import { news } from '$lib/content/loader';

export const prerender = true;

export function load() {
	// Sort newest-first by publishedAt; entries without a date float to the top.
	const sorted = [...news].sort((a, b) =>
		(b.publishedAt ?? '9999-99-99').localeCompare(a.publishedAt ?? '9999-99-99')
	);
	return { news: sorted };
}
