import { describe, expect, it } from 'vitest';
import { load } from './+page';

describe('homepage selections', () => {
	it('orders nine publications chronologically within three research groups', () => {
		const data = load();
		expect(data.peerReviewed.map((publication) => publication.slug)).toEqual([
			'aics-2026-temporal-dynamics',
			'cvae-gmm-eeg-topographic-maps',
			'malaria-ml-nigeria'
		]);
		expect(data.otherResearch.map((publication) => publication.slug)).toEqual([
			'vade-eeg-microstate-discovery',
			'autoencoder-eeg-systematic-review-protocol',
			'xai-2025-doctoral-proposal'
		]);
		expect(data.underReview.map((publication) => publication.slug)).toEqual([
			'cognitive-computation-conv-vade-dynamics',
			'iclr-2027-spatial-encoding-geometry',
			'fashoto-2026-autism-xai'
		]);
		expect(
			[...data.peerReviewed, ...data.otherResearch, ...data.underReview].every(
				(publication) => publication.status === 'published'
			)
		).toBe(true);
		expect(data).not.toHaveProperty('selectedPublications');
		expect(data).not.toHaveProperty('newsItems');
	});

	it('prioritises three focused EEG strands and Curnance over the archived EEG overview', () => {
		const data = load();
		expect(data.selectedProjects.map((project) => project.slug)).toEqual([
			'microstate-temporal-dynamics',
			'microstate-representation-learning',
			'microstate-architecture-search',
			'curnance'
		]);
		expect(
			data.selectedProjects.every((project) => project.status === 'published' && project.featured)
		).toBe(true);
		expect(data.selectedProjects.some((project) => project.slug === 'microstate-eeg')).toBe(false);
	});

	it('loads all three published talks in research-date order', () => {
		const data = load();
		expect(data.talks.map((talk) => talk.slug)).toEqual([
			'aics-2026-temporal-dynamics',
			'xai-2026-brazil',
			'ictas-2024-malaria'
		]);
		expect(data.talks.map((talk) => talk.updatedAt)).toEqual([
			'2026-10-16',
			'2026-07-01',
			undefined
		]);
		expect(data.talks.every((talk) => talk.status === 'published')).toBe(true);
	});

	it('loads all published experience with the current role first', () => {
		const data = load();
		expect(data.experience.map((item) => item.slug)).toEqual([
			'aicl-lab-phd-researcher',
			'etihuku-curnance'
		]);
		expect(data.experience.every((item) => item.status === 'published')).toBe(true);
	});

	it('orders education by doctoral, masters, then bachelors study', () => {
		const data = load();
		expect(data.education.map((item) => item.slug)).toEqual([
			'phd-eeg-microstates',
			'msc-cs-tu-dublin',
			'bsc-it-uneswa'
		]);
		expect(data.education.every((item) => item.status === 'published')).toBe(true);
	});

	it('keeps Recognition data off the homepage while preserving its dedicated collection', () => {
		expect(load()).not.toHaveProperty('awards');
	});
});
