import { sortByYearDesc } from '$lib/content/loader';
import type { Publication } from '$lib/content/schemas';

export function isUnderReview(p: Publication): boolean {
	return /under review|in review|manuscript in preparation/i.test(`${p.venue ?? ''} ${p.status}`);
}

export function isPeerReviewed(p: Publication): boolean {
	if (isUnderReview(p)) return false;
	if (p.kind === 'journal') return true;
	return p.kind === 'conference' && !/preprint/i.test(p.venue ?? '');
}

export function orderPublications(items: readonly Publication[]): Publication[] {
	return sortByYearDesc(items);
}
