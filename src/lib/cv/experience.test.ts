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
	it('uses exactly four plain-language PhD highlights', () => {
		expect(cvHighlights(bySlug('aicl-lab-phd-researcher'))).toEqual([
			'Compared image-based and electrode-based representations of brain activity on 203 recordings. The electrode-based approach explained 61.8% of the variation, versus 54.2% for the image-based approach, which grouped similar activity better.',
			'Analysed brain-activity recordings from 203 people to understand how activity changes from one state to another. Paired statistical tests showed that accounting for state duration represented these changes more accurately than the current state alone, improving the result from 55.7% to 63.7%.',
			'Showed that analysis settings can change average reported brain-state durations from 402 to 24 milliseconds. Using the same processing method for both approaches changed the image-based result from 143.2 to 71.0 milliseconds, close to the electrode result of 70.2 milliseconds.',
			'Evaluated 4,832 model configurations on SLURM-managed GPU and IBM Power9 systems, scoring 110 measures per model and testing consistency across participants.'
		]);
	});

	it('uses exactly three plain-language Etihuku highlights', () => {
		expect(cvHighlights(bySlug('etihuku-curnance'))).toEqual([
			'Led a four-person team to develop a compliance dashboard for tracking legal obligations, document submissions, compliance scores and risk levels, reducing manual handling by 60%.',
			'Built a facial-recognition system for Know Your Customer (KYC) checks, using identity documents and liveness verification to flag potentially fraudulent user profiles for review. Developed automated checks to identify suspicious financial transactions, improving fraud detection by up to 35%.',
			'Built an LLM proposal generator from scratch for business bids, using RAG to turn past proposals, contracts and client requirements into seven-section drafts and cut manual preparation time by 80%.'
		]);
	});

	it('keeps the ambiguous removed wording out of the PhD highlights', () => {
		const highlights = cvHighlights(bySlug('aicl-lab-phd-researcher')).join(' ');
		expect(highlights).not.toMatch(
			/maps|tighter groups|explained signal|nine-state model|35\.6|23\.6/i
		);
		expect(cvHighlights(bySlug('aicl-lab-phd-researcher'))).toHaveLength(4);
		expect(cvHighlights(bySlug('etihuku-curnance'))).toHaveLength(3);
	});

	it('leaves highlights for other experience unchanged', () => {
		const item = { ...bySlug('aicl-lab-phd-researcher'), slug: 'another-role' };
		expect(cvHighlights(item)).toBe(item.highlights);
	});

	it('keeps technical model jargon and unexplained evaluation acronyms out of the CV', () => {
		const highlights = experience.flatMap((item) => cvHighlights(item)).join(' ');
		expect(highlights).not.toMatch(
			/Conv-VaDE|Graph-VaDE|VAE\/GMM|\bARI\b|\bGEV\b|HSMM|LEMON|Holm/i
		);
		expect(highlights).not.toMatch(/\b38\b/);
	});
});
