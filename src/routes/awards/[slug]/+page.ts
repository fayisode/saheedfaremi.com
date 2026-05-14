import { error } from '@sveltejs/kit';
import { awards, bySlug, loadComponent } from '$lib/content/loader';

export const prerender = true;

export function entries(): Array<{ slug: string }> {
	return awards.map((a) => ({ slug: a.slug }));
}

export async function load({ params }) {
	const meta = bySlug(awards, params.slug);
	if (!meta) throw error(404, `Award "${params.slug}" not found`);
	const mod = await loadComponent('awards', params.slug);
	return {
		meta,
		Component: mod?.default ?? null
	};
}
