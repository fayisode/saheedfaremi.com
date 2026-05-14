import { error } from '@sveltejs/kit';
import { bySlug, loadComponent, projects } from '$lib/content/loader';

export const prerender = true;

// Tell SvelteKit which slug values to prerender. With adapter-static, every
// returned entry becomes a static HTML page.
export function entries(): Array<{ slug: string }> {
	return projects.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	const meta = bySlug(projects, params.slug);
	if (!meta) throw error(404, `Project "${params.slug}" not found`);
	const mod = await loadComponent('projects', params.slug);
	return {
		meta,
		Component: mod?.default ?? null
	};
}
