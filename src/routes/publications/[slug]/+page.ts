import { error } from '@sveltejs/kit';
import { bySlug, loadComponent, publications } from '$lib/content/loader';

export const prerender = true;

export function entries(): Array<{ slug: string }> {
	return publications.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	const meta = bySlug(publications, params.slug);
	if (!meta) throw error(404, `Publication "${params.slug}" not found`);
	const mod = await loadComponent('publications', params.slug);
	return { meta, Component: mod?.default ?? null };
}
