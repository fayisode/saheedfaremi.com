import type { Experience } from '$lib/content/schemas';

const phdHighlights = [
	'Developed two deep-learning approaches for identifying recurring brain-activity patterns, one using image-based maps and another using the brain’s electrode network. In a synthetic benchmark, the electrode-network approach matched the known microstate maps exactly and explained 85% of the variance in the test recordings.',
	'Evaluated 4,832 model configurations using 110 measures of model fit, clustering quality, and consistency across participants, running the analysis on SLURM GPU and IBM Power9 clusters.',
	'In a single-participant case study, the recurrence measure called determinism was 0.83 for recorded brain activity and 0.60 for phase-randomised controls. The brain-state label sequence showed no evidence of memory beyond the previous state.'
];

const etihukuHighlights = [
	'Shipped seven production services covering payments, account security, identity checks, background processing, a 120-screen mobile app, an admin dashboard, and a public website.',
	'Fixed a live withdrawal-fraud issue by ensuring accounts were charged before payouts, with safeguards against double spending and duplicate payments.',
	'Built a fraud and anti-money-laundering system with 38 rule-based checks, AI-drafted suspicious-activity reports, and privacy controls that hide personal details.',
	'Built an Azure-based AI document service that reduced manual document creation time by 85% across three compliance regions.'
];

export function cvHighlights(item: Experience): string[] {
	if (item.slug === 'aicl-lab-phd-researcher') return [...phdHighlights];
	if (item.slug === 'etihuku-curnance') return [...etihukuHighlights];
	return item.highlights;
}
