import { awards, news } from '$lib/content/loader';
import type { Award, News } from '$lib/content/schemas';

export const prerender = true;

// Tagged-union entries so the page can render an AwardCard vs NewsCard
// from a single newest-first stream.
type RecognitionEntry =
	| { type: 'award'; year: number; data: Award }
	| { type: 'news'; year: number; data: News };

function yearOf(date?: string): number {
	if (!date) return 0;
	const y = parseInt(date.slice(0, 4), 10);
	return Number.isFinite(y) ? y : 0;
}

export function load() {
	const entries: RecognitionEntry[] = [
		...awards.map((a) => ({ type: 'award' as const, year: a.year, data: a })),
		...news.map((n) => ({
			type: 'news' as const,
			year: yearOf(n.publishedAt),
			data: n
		}))
	];

	// Newest-first by year; ties broken by title.
	entries.sort((a, b) => {
		if (a.year !== b.year) return b.year - a.year;
		return a.data.title.localeCompare(b.data.title);
	});

	return {
		entries,
		counts: { awards: awards.length, news: news.length }
	};
}
