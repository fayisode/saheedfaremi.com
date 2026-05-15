import { blog } from '$lib/content/loader';

export const prerender = true;

export function load() {
	const sorted = [...blog].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
	return { blog: sorted };
}
