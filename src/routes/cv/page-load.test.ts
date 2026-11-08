import { describe, expect, it } from 'vitest';
import { load } from './+page';

const summary =
	'PhD researcher studying brain activity with deep learning, and a data scientist with five years of experience across software engineering and data science. Built AI systems that reduced manual document work by 85% and strengthened fraud detection across eight African markets.';

describe('CV selections', () => {
	it('omits Recognition data and projects from the academic CV', () => {
		const data = load();
		expect(data).not.toHaveProperty('awards');
		expect(data).not.toHaveProperty('projects');
	});

	it('orders nine CV publications within three separate research groups', () => {
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
	});

	it('loads the exact recruiter-readable profile, research areas and skill groups', () => {
		const [track] = load().tracks;
		expect(track.lastUpdated).toBe('November 2026');
		expect(track.summary).toBe(summary);
		expect(track.summary).not.toMatch(/founding engineer/i);
		expect(track.researchAreaGroups.map((group) => group.group)).toEqual([
			'Brain and behaviour',
			'Explainable and reproducible AI',
			'Applied AI and data systems'
		]);
		expect(track.researchAreas).toEqual([
			'EEG microstates and brain-signal analysis',
			'Neuroscientific knowledge discovery',
			'Neuroimaging',
			'Nonlinear time series analysis',
			'Explainable Artificial Intelligence',
			'Mechanistic Interpretability',
			'Interpretable, reproducible machine learning',
			'Deep learning for health and behaviour',
			'Production ML, LLM and data systems'
		]);
		expect(track.skillGroups).toEqual([
			{
				group: 'Brain-signal analysis',
				items: [
					'PyTorch',
					'scikit-learn',
					'MNE',
					'deep generative models',
					'large-scale model evaluation'
				]
			},
			{
				group: 'Production ML & LLMs',
				items: [
					'Azure OpenAI',
					'retrieval-augmented generation (RAG)',
					'fraud and anomaly detection',
					'transformer fine-tuning',
					'document generation and automation'
				]
			},
			{
				group: 'Software & cloud engineering',
				items: [
					'Python',
					'Go',
					'TypeScript',
					'SQL',
					'FastAPI',
					'Azure',
					'CI/CD',
					'SLURM',
					'680+ automated tests'
				]
			},
			{
				group: 'Evaluation & statistics',
				items: [
					'Cross-subject validation',
					'intraclass correlation (ICC)',
					'Wilcoxon tests',
					'multiple-comparison correction',
					'nonlinear time-series and dwell-time analysis'
				]
			}
		]);
	});

	it('keeps source experience detail intact while the CV uses concise highlights', () => {
		expect(load().experience.map((item) => item.highlights.length)).toEqual([4, 5]);
	});
});
