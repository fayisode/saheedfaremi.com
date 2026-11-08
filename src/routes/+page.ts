import {
	education as educationEntries,
	experience as experienceEntries,
	featured,
	projects,
	publications,
	publishedOnly,
	sortByStartedAtDesc,
	sortByYearDesc,
	talks
} from '$lib/content/loader';
import { isPeerReviewed, isUnderReview, orderPublications } from '$lib/cv/publications';
import { TRACKS } from '$lib/cv/tracks';

export const csr = true;
export const prerender = true;

const projectPriority = [
	'microstate-temporal-dynamics',
	'microstate-representation-learning',
	'microstate-architecture-search',
	'curnance'
];

export function load() {
	const publishedPublications = orderPublications(publishedOnly(publications));
	const publishedProjects = featured(publishedOnly(projects));
	const selectedProjects = projectPriority.flatMap((slug) => {
		const project = publishedProjects.find((candidate) => candidate.slug === slug);
		return project ? [project] : [];
	});
	const publishedTalks = sortByYearDesc(publishedOnly(talks));
	const experience = sortByStartedAtDesc(publishedOnly(experienceEntries));
	const degreeOrder: Record<string, number> = { PhD: 0, MSc: 1, BSc: 2 };
	const education = publishedOnly(educationEntries).sort(
		(a, b) => (degreeOrder[a.degree] ?? 99) - (degreeOrder[b.degree] ?? 99)
	);

	return {
		peerReviewed: publishedPublications.filter(isPeerReviewed),
		otherResearch: publishedPublications.filter(
			(publication) => !isPeerReviewed(publication) && !isUnderReview(publication)
		),
		underReview: publishedPublications.filter(isUnderReview),
		selectedProjects,
		researchAreaGroups: TRACKS[0].researchAreaGroups,
		talks: publishedTalks,
		experience,
		education
	};
}
