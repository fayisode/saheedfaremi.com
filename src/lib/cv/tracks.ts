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
			'PhD researcher and data scientist with five years of experience building production software. I study what brief brain states represent and how they change over time. In industry, I apply machine learning to healthcare, finance and compliance.',
		researchAreaGroups: [
			{
				group: 'Brain and behaviour',
				items: [
					'EEG microstates and brain-signal analysis',
					'neuroscientific knowledge discovery',
					'neuroimaging',
					'nonlinear time-series analysis'
				]
			},
			{
				group: 'Explainable and reproducible AI',
				items: [
					'Explainable Artificial Intelligence',
					'mechanistic interpretability',
					'reproducible machine learning'
				]
			},
			{
				group: 'Applications',
				items: ['Deep learning for health and behaviour', 'production AI and data systems']
			}
		],
		lastUpdated: 'November 2026',
		skillGroups: [
			{
				group: 'Brain-signal analysis',
				items: ['PyTorch', 'scikit-learn', 'MNE', 'large-scale model evaluation']
			},
			{
				group: 'Applied AI and document automation',
				items: [
					'Azure OpenAI',
					'document question answering',
					'fraud and anomaly detection',
					'model fine-tuning',
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
		],
		pdfFile: 'saheed-faremi-cv.pdf'
	}
];

// Validate at module load so a malformed profile fails the build, not the browser.
export const TRACKS: readonly Track[] = z.array(TrackSchema).parse(RAW_TRACKS);
