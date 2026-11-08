import { describe, expect, it } from 'vitest';
import { load } from '../../routes/cv/+page';
import { cvHighlights } from './experience';

const experience = load().experience;

function bySlug(slug: string) {
	const item = experience.find((candidate) => candidate.slug === slug);
	if (!item) throw new Error(`Missing experience fixture: ${slug}`);
	return item;
}

describe('cvHighlights', () => {
	it('uses exactly three plain-language PhD highlights', () => {
		expect(cvHighlights(bySlug('aicl-lab-phd-researcher'))).toEqual([
			'Developed two deep-learning approaches for identifying recurring brain-activity patterns, one using image-based maps and another using the brain’s electrode network. In a synthetic benchmark, the electrode-network approach matched the known microstate maps exactly and explained 85% of the variance in the test recordings.',
			'Evaluated 4,832 model configurations using 110 measures of model fit, clustering quality, and consistency across participants, running the analysis on SLURM GPU and IBM Power9 clusters.',
			'In a single-participant case study, the recurrence measure called determinism was 0.83 for recorded brain activity and 0.60 for phase-randomised controls. The brain-state label sequence showed no evidence of memory beyond the previous state.'
		]);
	});

	it('uses exactly four plain-language Etihuku highlights', () => {
		expect(cvHighlights(bySlug('etihuku-curnance'))).toEqual([
			'Shipped seven production services covering payments, account security, identity checks, background processing, a 120-screen mobile app, an admin dashboard, and a public website.',
			'Fixed a live withdrawal-fraud issue by ensuring accounts were charged before payouts, with safeguards against double spending and duplicate payments.',
			'Built a fraud and anti-money-laundering system with 38 rule-based checks, AI-drafted suspicious-activity reports, and privacy controls that hide personal details.',
			'Built an Azure-based AI document service that reduced manual document creation time by 85% across three compliance regions.'
		]);
	});

	it('leaves highlights for other experience unchanged', () => {
		const item = { ...bySlug('aicl-lab-phd-researcher'), slug: 'another-role' };
		expect(cvHighlights(item)).toBe(item.highlights);
	});

	it('keeps technical model jargon and unexplained evaluation acronyms out of the CV', () => {
		const highlights = experience.flatMap((item) => cvHighlights(item)).join(' ');
		expect(highlights).not.toMatch(/Conv-VaDE|Graph-VaDE|VAE\/GMM|\bARI\b|\bGEV\b/);
	});
});
