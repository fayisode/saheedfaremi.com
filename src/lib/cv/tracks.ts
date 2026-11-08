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
 * pdfFile: points to the single already-scrubbed CV PDF generated from LaTeX.
 */

const SkillGroupSchema = z.object({
	group: z.string().min(1),
	items: z.array(z.string().min(1)).min(1)
});

const TrackSchema = z
	.object({
		key: z.literal('data-science'),
		label: z.string().min(1),
		summary: z.string().min(1),
		researchAreaGroups: z.array(SkillGroupSchema).min(1),
		researchAreas: z.array(z.string().min(1)).default([]),
		lastUpdated: z.string().min(1),
		skillGroups: z.array(SkillGroupSchema).min(1),
		pdfFile: z.string().min(1)
	})
	.transform((track) => ({
		...track,
		researchAreas: track.researchAreaGroups.flatMap((group) => group.items)
	}));

export type Track = z.infer<typeof TrackSchema>;

const RAW_TRACKS = [
	{
		key: 'data-science',
		label: 'Data Science',
		summary:
			'PhD researcher studying brain activity with deep learning, and a data scientist with five years of experience across software engineering and data science. Built AI systems that reduced manual document work by 85% and strengthened fraud detection across eight African markets.',
		researchAreaGroups: [
			{
				group: 'Brain and behaviour',
				items: [
					'EEG microstates and brain-signal analysis',
					'Neuroscientific knowledge discovery',
					'Neuroimaging',
					'Nonlinear time series analysis'
				]
			},
			{
				group: 'Explainable and reproducible AI',
				items: [
					'Explainable Artificial Intelligence',
					'Mechanistic Interpretability',
					'Interpretable, reproducible machine learning'
				]
			},
			{
				group: 'Applied AI and data systems',
				items: ['Deep learning for health and behaviour', 'Production ML, LLM and data systems']
			}
		],
		lastUpdated: 'November 2026',
		skillGroups: [
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
		],
		pdfFile: 'saheed-faremi-cv.pdf'
	}
];

// Validate at module load so a malformed profile fails the build, not the browser.
export const TRACKS: readonly Track[] = z.array(TrackSchema).parse(RAW_TRACKS);
