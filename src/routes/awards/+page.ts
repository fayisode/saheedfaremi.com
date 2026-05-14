import { awards, sortByYearDesc } from '$lib/content/loader';

export const prerender = true;

export function load() {
	return {
		awards: sortByYearDesc([...awards])
	};
}
