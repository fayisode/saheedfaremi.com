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
import type { Education } from '$lib/content/schemas';

export const prerender = true;

// Education has no reliable startedAt for the master's/bachelor's (the source
// gives years, not months, and inventing YYYY-MM would fabricate a displayed
// date). Order by a content-driven key instead: in-progress degrees first,
// then by graduation date desc when present, then by degree level
// (doctorate > master's > bachelor's) so the timeline reads correctly without
// any fabricated dates.
function degreeRank(degree: string): number {
	const d = degree.toLowerCase();
	if (d.includes('phd') || d.includes('doctor')) return 3;
	if (d.includes('msc') || d.includes('master') || d.includes('ma ') || d === 'ma') return 2;
	return 1;
}

function orderEducation(items: readonly Education[]): Education[] {
	return [...items].sort((a, b) => {
		const aInProgress = a.progressionStatus === 'in-progress' ? 1 : 0;
		const bInProgress = b.progressionStatus === 'in-progress' ? 1 : 0;
		if (aInProgress !== bInProgress) return bInProgress - aInProgress;
		const aEnd = a.endedAt ?? '';
		const bEnd = b.endedAt ?? '';
		if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);
		return degreeRank(b.degree) - degreeRank(a.degree);
	});
}

export function load() {
	return {
		experience: sortByStartedAtDesc([...experience]),
		education: orderEducation(education),
		awards: sortByYearDesc([...awards]),
		publications: sortByYearDesc([...publications]),
		talks: sortByYearDesc([...talks]),
		// "Selected projects" on the CV = those tagged featured, falling back to all.
		projects: [...projects].filter((p) => p.featured) // featured-only for printable density
	};
}
