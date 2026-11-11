import { describe, expect, it } from 'vitest';
import { load } from './+page';

const summary =
	'PhD researcher and data scientist with five years of experience building production software. I study what brief brain states represent and how they change over time. In industry, I apply machine learning to healthcare, finance and compliance.';

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
			'Applications'
		]);
		expect(track.researchAreas).toEqual([
			'EEG microstates and brain-signal analysis',
			'neuroscientific knowledge discovery',
			'neuroimaging',
			'nonlinear time-series analysis',
			'Explainable Artificial Intelligence',
			'mechanistic interpretability',
			'reproducible machine learning',
			'Deep learning for health and behaviour',
			'production AI and data systems'
		]);
		expect(track.skillGroups).toEqual([
			{
				group: 'Brain-signal analysis',
				items: ['PyTorch', 'scikit-learn', 'MNE']
			},
			{
				group: 'Applied AI and agents',
				items: [
					'Azure OpenAI',
					'AI agents and tool use',
					'prompt engineering',
					'retrieval-augmented generation (RAG)',
					'document question answering',
					'model fine-tuning'
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
					'multi-GPU scheduling',
					'memory-aware job allocation',
					'automated testing'
				]
			},
			{
				group: 'Research evaluation',
				items: [
					'Testing across participants',
					'statistical significance tests',
					'correction for multiple comparisons',
					'time-series and duration analysis'
				]
			}
		]);
	});

	it('keeps source experience detail intact while the CV uses concise highlights', () => {
		expect(load().experience.map((item) => item.highlights.length)).toEqual([4, 5]);
	});

	it('keeps completion years out of the education collections', () => {
		const education = load().education;
		expect(education.map((item) => item.slug)).toEqual([
			'phd-eeg-microstates',
			'msc-cs-tu-dublin',
			'bsc-it-uneswa'
		]);
		for (const item of education) {
			expect(item.summary ?? '').not.toMatch(/\b(19|20)\d\d\b/);
		}
		const bsc = education.find((item) => item.slug === 'bsc-it-uneswa')?.summary ?? '';
		expect(bsc.toLowerCase()).toContain(
			'machine learning, deep learning, data mining, visualisation and statistics'
		);
		expect(bsc).toContain('Second Class Honours, Upper Division (2.1)');
	});
});
