import { error } from '@sveltejs/kit';
import { bySlug, loadComponent, news } from '$lib/content/loader';

export const prerender = true;

export function entries(): Array<{ slug: string }> {
	return news.map((n) => ({ slug: n.slug }));
}

export async function load({ params }) {
	const meta = bySlug(news, params.slug);
	if (!meta) throw error(404, `News item "${params.slug}" not found`);
	const mod = await loadComponent('news', params.slug);
	return { meta, Component: mod?.default ?? null };
}
