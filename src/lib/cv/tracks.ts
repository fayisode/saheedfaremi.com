import { z } from 'zod';

/*
 * CV profile: the data behind the /cv page.
 *
 * Kept as a typed, Zod-validated TS config (not a content collection) because the
 * data is a small, closed set of structured fields with no prose body, mirroring
 * the existing hard-coded skills matrix. Validating at module load means a
 * malformed profile fails the build loudly rather than rendering blank.
 *
 * Framing is deliberately honest and verifiable (see project memory): every
 * quantified claim is traceable to a codebase, a paper, or the owner's original
 * CV. The CV is a single Data Scientist profile that reads credibly to both
 * industry (production ownership, scale, outcomes) and academia (peer review,
 * reproducibility, statistical rigour).
 *
 * pdfFile: points to the single already-scrubbed CV PDF rendered from this page.
 */

const SkillGroupSchema = z.object({
	group: z.string().min(1),
	items: z.array(z.string().min(1)).min(1)
});

const TrackSchema = z.object({
	key: z.literal('data-science'),
	label: z.string().min(1),
	summary: z.string().min(1),
	skillGroups: z.array(SkillGroupSchema).min(1),
	pdfFile: z.string().min(1)
});

export type Track = z.infer<typeof TrackSchema>;

const RAW_TRACKS: Track[] = [
	{
		key: 'data-science',
		label: 'Data Science',
		// Hybrid positioning statement: research identity + production impact, every
		// claim quantified and traceable. No stack list here (the skills section
		// carries it); no adjectives (recruiter-scan evidence: buzzwords substitute
		// for evidence and read as template-thinking).
		summary:
			'Data scientist and founding engineer shipping production ML systems in fintech and agriculture since 2021, and a PhD researcher in deep learning for EEG at University College Cork (Artificial Intelligence and Cognitive Load Research Lab, supervised by Luca Longo). Built the fraud/AML intelligence layer for a payments platform operating in eight African markets, and shipped LLM document automation that cut manual work by 85%. First-author research published in Brain Informatics and IEEE, with code released open-source. UNESCO India-Africa Hackathon 2022 gold medallist.',
		// Grouped, interview-defensible skills; every item is traceable to the content
		// corpus (experience, publications, projects, talks). Unevidenced tools are
		// omitted by design: one unsupported keyword poisons the real claims around it.
		skillGroups: [
			{
				group: 'AI & machine learning',
				items: [
					'PyTorch',
					'TensorFlow',
					'scikit-learn',
					'CatBoost',
					'LLMs (Azure OpenAI, OpenAI, Anthropic)',
					'RAG',
					'Fraud and anomaly detection',
					'Transformer fine-tuning (BERT, RoBERTa)',
					'Explainable AI'
				]
			},
			{ group: 'Programming', items: ['Python', 'SQL', 'Go', 'TypeScript', 'Bash'] },
			{
				group: 'Cloud & MLOps',
				items: [
					'Azure (ML Studio, AI Studio, Functions, DevOps, Bicep)',
					'CI/CD (GitHub Actions, Azure DevOps)',
					'SLURM cluster computing'
				]
			},
			{
				group: 'Data & systems',
				items: [
					'ETL/ELT pipelines',
					'MySQL',
					'Double-entry ledger systems',
					'RESTful APIs and microservices'
				]
			},
			{
				group: 'Statistics & analytics',
				items: ['Statistical hypothesis testing (Wilcoxon, ICC, multiple-comparison correction)']
			}
		],
		pdfFile: 'saheed-faremi-cv.pdf'
	}
];

// Validate at module load so a malformed profile fails the build, not the browser.
export const TRACKS: readonly Track[] = z.array(TrackSchema).parse(RAW_TRACKS);
