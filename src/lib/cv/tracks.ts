import { z } from 'zod';

/*
 * CV tracks — the data behind the /cv track selector.
 *
 * Kept as a typed, Zod-validated TS config (not a content collection) because the
 * data is a small, closed set of structured fields with no prose body, mirroring
 * the existing hard-coded skills matrix. Validating at module load means a
 * malformed track fails the build loudly rather than rendering blank.
 *
 * Framing is deliberately honest and verifiable (see project memory): no inflated
 * titles or templated metrics, and the research framing matches the published
 * Conv-VaDE result (which does NOT claim to beat modified k-means on silhouette/GEV).
 *
 * pdfFile: all tracks currently point to the single already-scrubbed CV PDF. The
 * source per-role PDFs in the owner's drive carry private data (phone, legacy email,
 * referee contacts) and must NOT be published unedited. Replace per track once a
 * scrubbed per-role PDF exists at static/<file>.
 */

const SkillGroupSchema = z.object({
	group: z.string().min(1),
	items: z.array(z.string().min(1)).min(1)
});

export const TrackKey = z.enum(['research', 'data-science', 'software']);

const TrackSchema = z.object({
	key: TrackKey,
	label: z.string().min(1),
	summary: z.string().min(1),
	skillGroups: z.array(SkillGroupSchema).min(1),
	highlightFocus: z.array(z.string().min(1)).min(1),
	featuredProjects: z.array(z.string().min(1)),
	pdfFile: z.string().min(1)
});

export type Track = z.infer<typeof TrackSchema>;
export type TrackKeyT = z.infer<typeof TrackKey>;

export const DEFAULT_TRACK: TrackKeyT = 'research';

const SHARED_PDF = 'saheed-faremi-cv.pdf';

const RAW_TRACKS: Track[] = [
	{
		key: 'research',
		label: 'Research',
		summary:
			'PhD researcher at University College Cork (supervised by Luca Longo) working on unsupervised deep learning for EEG signal analysis: variational autoencoders and Gaussian-mixture models for interpretable EEG microstate discovery. First Class Honours MSc in Computer Science (Data Science). IEEE-published, with work under review at Brain Informatics.',
		skillGroups: [
			{ group: 'Core', items: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'MATLAB'] },
			{
				group: 'Methods',
				items: [
					'Variational autoencoders',
					'Gaussian mixture models',
					'Custom loss functions',
					'Transfer learning',
					'Explainable AI',
					'EEG signal processing'
				]
			},
			{ group: 'Tools', items: ['Git', 'Docker', 'AWS (SageMaker, S3)', 'MNE', 'NumPy', 'LaTeX'] }
		],
		highlightFocus: [
			'Doctoral research on variational deep embedding for EEG microstate discovery, with a focus on interpretability and systematic architecture search.',
			'Conv-VaDE: a convolutional variational deep embedding with a GMM latent prior and polarity-invariant losses, giving a learned generative manifold and probabilistic soft assignment that modified k-means does not provide.',
			'Multi-quadrant evaluation against modified k-means on the LEMON resting-state dataset using rank-based tests.',
			'IEEE-published study on machine-learning prediction of malaria risk in under-fives in Nigeria.'
		],
		featuredProjects: [
			'Interpretable EEG Microstate Discovery via Variational Deep Embedding (XAI-2026, late-breaking work)',
			'Integrating Convolutional VAE and GMM for clustering of EEG topographic maps (Brain Informatics, under review)',
			'MSc thesis: optimising EEG signal clustering with an unsupervised CNN-VAE and GMM',
			'Machine Learning Models for Predicting Malaria Among Children Under Five in Nigeria (IEEE ICTAS 2024)'
		],
		pdfFile: SHARED_PDF
	},
	{
		key: 'data-science',
		label: 'Data Science',
		summary:
			'Data scientist with production ML experience across financial services, legal, and healthcare. Focus on predictive modelling, generative AI and LLM deployment, and MLOps on AWS and Azure. IEEE-published researcher and 2022 UNESCO India-Africa Hackathon gold medalist.',
		skillGroups: [
			{
				group: 'AI & machine learning',
				items: [
					'LLMs and generative AI (OpenAI, Anthropic, Llama)',
					'Retrieval-augmented generation (RAG)',
					'Transformers',
					'PyTorch',
					'TensorFlow',
					'scikit-learn',
					'XGBoost / LightGBM / CatBoost',
					'LLM fine-tuning (LoRA)',
					'Explainable AI'
				]
			},
			{ group: 'Programming', items: ['Python', 'SQL', 'R', 'JavaScript', 'Go', 'Bash'] },
			{
				group: 'Cloud & MLOps',
				items: [
					'AWS (SageMaker, Lambda, EC2, S3, Glue)',
					'Azure ML / AI Studio',
					'Docker',
					'CI/CD (GitHub Actions, Jenkins)',
					'Databricks'
				]
			},
			{
				group: 'Data engineering',
				items: [
					'ETL/ELT pipelines',
					'Apache Spark',
					'Apache Kafka',
					'Airflow',
					'Feature engineering',
					'Vector databases'
				]
			},
			{
				group: 'Analytics & visualisation',
				items: ['Power BI', 'Tableau', 'Matplotlib', 'Seaborn', 'Statistical analysis']
			}
		],
		highlightFocus: [
			'Generative-AI document and contract tooling on Azure AI Studio for clause extraction and risk classification under compliance constraints.',
			'LLM proposal-generation pipeline in production, cutting document-creation time by 85%.',
			'Customer-intent classification with transformer models for real-time ticket routing.',
			'Financial inclusion modelling with gradient-boosted trees and random forests.',
			'ML infrastructure on AWS (SageMaker, EC2, Lambda, S3) with CI/CD.'
		],
		featuredProjects: [
			'Machine Learning Models for Predicting Malaria Among Children Under Five in Nigeria (IEEE ICTAS 2024)',
			'Variational autoencoder on SVHN with a Gaussian reconstruction loss',
			'Swahili sentiment analysis (RoBERTa and BERT ensemble)',
			'Multi-label ocular-disease classification with transfer learning'
		],
		pdfFile: SHARED_PDF
	},
	{
		key: 'software',
		label: 'Software',
		summary:
			'Software engineer building data-driven, scalable systems in Python, Go, and JavaScript across AWS and Azure. Distributed financial services, microservices and API design, CI/CD automation, and ML integration.',
		skillGroups: [
			{ group: 'Languages', items: ['Python', 'Go', 'SQL', 'JavaScript', 'TypeScript'] },
			{
				group: 'Backend & APIs',
				items: [
					'FastAPI',
					'Flask',
					'RESTful API design',
					'Microservices',
					'Domain-driven design',
					'Clean architecture',
					'Twilio API'
				]
			},
			{ group: 'Data & storage', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
			{
				group: 'Cloud & DevOps',
				items: ['AWS', 'AWS Bedrock', 'Azure DevOps', 'Docker', 'CI/CD pipelines', 'Jenkins', 'Git']
			},
			{ group: 'Practices', items: ['Agile / Scrum', 'Code review', 'Data visualisation'] }
		],
		highlightFocus: [
			'Distributed cross-border financial transaction systems with a focus on reliability and low latency.',
			'Twilio Programmable Messaging integration for real-time customer notifications.',
			'CI/CD automation to shorten deployment time.',
			'Real-time compliance and regulatory-analysis systems delivered as a team.'
		],
		featuredProjects: [
			'Distributed cross-border financial transaction systems (Curnance, Etihuku)',
			'Real-time compliance and regulatory-analysis system (Gatsheni Advisory)',
			'Twilio-integrated customer notification system'
		],
		pdfFile: SHARED_PDF
	}
];

// Validate at module load so a malformed track fails the build, not the browser.
export const TRACKS: readonly Track[] = z.array(TrackSchema).parse(RAW_TRACKS);

export function trackByKey(key: string | null | undefined): Track {
	return (
		TRACKS.find((t) => t.key === key) ?? TRACKS.find((t) => t.key === DEFAULT_TRACK) ?? TRACKS[0]
	);
}
