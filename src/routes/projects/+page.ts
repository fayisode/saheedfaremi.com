import { projects } from '$lib/content/loader';

export const prerender = true;

export function load() {
	return {
		// Plain JSON metadata only — Zod runtime and prose bodies stay out of this
		// route's bundle thanks to the virtual:content plugin.
		projects: [...projects]
	};
}
