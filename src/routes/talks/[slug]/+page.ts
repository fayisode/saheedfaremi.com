import { error } from '@sveltejs/kit';
import { bySlug, loadComponent, talks } from '$lib/content/loader';

export const prerender = true;

export function entries(): Array<{ slug: string }> {
	return talks.map((t) => ({ slug: t.slug }));
}

export async function load({ params }) {
	const meta = bySlug(talks, params.slug);
	if (!meta) throw error(404, `Talk "${params.slug}" not found`);
	const mod = await loadComponent('talks', params.slug);
	return { meta, Component: mod?.default ?? null };
}
