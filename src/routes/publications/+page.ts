import { publications, sortByYearDesc } from '$lib/content/loader';

export const prerender = true;

export function load() {
	return { publications: sortByYearDesc([...publications]) };
}
