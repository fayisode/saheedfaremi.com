import { error } from '@sveltejs/kit';
import { blog, bySlug, loadComponent } from '$lib/content/loader';

export const prerender = true;

export function entries(): Array<{ slug: string }> {
	return blog.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	const meta = bySlug(blog, params.slug);
	if (!meta) throw error(404, `Blog post "${params.slug}" not found`);
	const mod = await loadComponent('blog', params.slug);
	return { meta, Component: mod?.default ?? null };
}
