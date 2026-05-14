import {
	awards,
	education,
	experience,
	projects,
	publications,
	sortByStartedAtDesc,
	sortByYearDesc,
	talks
} from '$lib/content/loader';

export const prerender = true;

export function load() {
	return {
		experience: sortByStartedAtDesc([...experience]),
		education: sortByStartedAtDesc([...education]),
		awards: sortByYearDesc([...awards]),
		publications: sortByYearDesc([...publications]),
		talks: sortByYearDesc([...talks]),
		// "Selected projects" on the CV = those tagged featured, falling back to all.
		projects: [...projects].filter((p) => p.featured) // featured-only for printable density
	};
}
