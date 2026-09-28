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
import type { Award, Education, Publication } from '$lib/content/schemas';
import { TRACKS } from '$lib/cv/tracks';

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

// Peer-reviewed venues are listed separately from preprints, registered
// protocols, and doctoral-track work. Folding non-peer-reviewed items into one
// "Publications" list is the most-documented academic-CV integrity failure, so
// the split is enforced here rather than left to formatting.
function isPeerReviewed(p: Publication): boolean {
	if (p.kind === 'journal') return true;
	// Conference papers count unless the venue itself declares a preprint
	// (e.g. the XAI 2026 entry, whose venue notes the arXiv preprint status).
	return p.kind === 'conference' && !/preprint/i.test(p.venue ?? '');
}

function awardRank(a: Award): number {
	const s = `${a.title} ${a.prize ?? ''}`.toLowerCase();
	if (/gold|winner/.test(s)) return 0;
	if (/3rd/.test(s)) return 1;
	if (/4th/.test(s)) return 2;
	return 3;
}

export function load() {
	const pubs = sortByYearDesc([...publications]);
	return {
		tracks: TRACKS,
		experience: sortByStartedAtDesc([...experience]),
		education: orderEducation(education),
		// Recognition is capped at differentiator-grade results: medals and podium
		// finishes. Sub-podium placements (e.g. top-14% hackathon finishes) stay on
		// /awards but dilute a skimmed CV, so they are excluded here. Ordered by
		// placement strength (a win outranks a podium, which outranks a top-%),
		// so the strongest signal leads the section.
		awards: sortByYearDesc([...awards])
			.filter((a) => /gold|winner|3rd|4th|top 11%/i.test(`${a.title} ${a.prize ?? ''}`))
			.sort((a, b) => awardRank(a) - awardRank(b)),
		peerReviewed: pubs.filter(isPeerReviewed),
		otherResearch: pubs.filter((p) => !isPeerReviewed(p)),
		talks: sortByYearDesc([...talks]),
		// "Selected projects" on the CV = featured AND published, minus projects whose
		// work an Experience entry already covers (Curnance, Etihuku document
		// automation) — restating them would duplicate signal, not add it. Drafts stay
		// off the printable CV: they would present unverified copy as fact.
		projects: [...projects].filter(
			(p) =>
				p.featured &&
				p.status === 'published' &&
				!['curnance', 'etihuku-document-automation'].includes(p.slug)
		)
	};
}
