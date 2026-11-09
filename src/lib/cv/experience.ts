import type { Experience } from '$lib/content/schemas';

const phdHighlights = [
	'Developed and compared image-based scalp maps with maps built from connections between recording electrodes. When both used the same processing step on 203 resting-state recordings, the electrode-based approach accounted for 61.8% of the signal versus 54.2% for the image-based approach. The image-based approach produced tighter groups of activity.',
	'Tested whether including the duration of a brain state improves the model’s match to the recording. With nine states, including duration improved the match from 55.7% to 63.7%, compared with using only the current state. A separate comparison found that its state-switching patterns differed more from chance than those from standard clustering (35.6% versus 23.6%).',
	'Showed that processing choices can change the reported duration of brain states. The gap between the two models narrowed from 70.2 versus 143.2 milliseconds to 70.2 versus 71.0 milliseconds when both used the same processing step. In a separate test, changing a duration setting moved the average from 402 to 24 milliseconds.'
];

const etihukuHighlights = [
	'Delivered seven production services for payments, account security, identity checks and background processing, plus a 120-screen mobile app, an admin dashboard and a public website.',
	'Fixed a live withdrawal-fraud issue by debiting the customer’s account before making an external payout and rejecting duplicate transfer requests.',
	'Built a fraud and anti-money-laundering system with 38 rule-based checks, AI-drafted suspicious-activity reports, and privacy controls that hide personal details.',
	'Built an Azure AI document service that cut manual document work by 85% across three compliance regions.'
];

export function cvHighlights(item: Experience): string[] {
	if (item.slug === 'aicl-lab-phd-researcher') return [...phdHighlights];
	if (item.slug === 'etihuku-curnance') return [...etihukuHighlights];
	return item.highlights;
}
