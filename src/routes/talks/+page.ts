import { sortByYearDesc, talks } from '$lib/content/loader';

export const prerender = true;

export function load() {
	return { talks: sortByYearDesc([...talks]) };
}
