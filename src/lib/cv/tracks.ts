import { z } from 'zod';

/*
 * CV profile — the data behind the /cv page.
 *
 * Kept as a typed, Zod-validated TS config (not a content collection) because the
 * data is a small, closed set of structured fields with no prose body, mirroring
 * the existing hard-coded skills matrix. Validating at module load means a
 * malformed profile fails the build loudly rather than rendering blank.
 *
 * Framing is deliberately honest and verifiable (see project memory): no inflated
 * titles or templated metrics. The CV is a single Data Scientist profile; the
 * software-engineering strengths are folded in as production-ML credibility
 * (owning systems end to end), not as a separate career track.
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
	highlightFocus: z.array(z.string().min(1)).min(1),
	featuredProjects: z.array(z.string().min(1)),
	pdfFile: z.string().min(1)
});

export type Track = z.infer<typeof TrackSchema>;

const RAW_TRACKS: Track[] = [
	{
		key: 'data-science',
		label: 'Data Science',
		summary:
			'Data scientist shipping production machine-learning and LLM systems across financial services, legal, healthcare, and agriculture. Pairs predictive modelling, generative AI, and MLOps on AWS and Azure with the software-engineering depth (Python, Go, TypeScript) to own systems end to end. PhD researcher in deep learning for EEG at University College Cork; published in Brain Informatics and IEEE; 2022 UNESCO India-Africa Hackathon gold medalist.',
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
			{ group: 'Programming', items: ['Python', 'SQL', 'R', 'Go', 'TypeScript', 'Bash'] },
			{
				group: 'Cloud & MLOps',
				items: [
					'AWS (SageMaker, Lambda, EC2, S3, Glue)',
					'Azure ML / AI Studio',
					'Docker',
					'Kubernetes',
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
				group: 'Systems & APIs',
				items: [
					'RESTful API design',
					'Microservices',
					'PostgreSQL',
					'MongoDB',
					'Redis',
					'Domain-driven design'
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
			'Distributed cross-border financial transaction systems, built for reliability and low latency.',
			'ML infrastructure on AWS (SageMaker, EC2, Lambda, S3) with CI/CD.'
		],
		featuredProjects: [
			'Etihuku document automation: LLM generation pipeline on Azure ML Studio, 85% less manual document work across three compliance regions',
			'Curnance: multi-asset fintech platform (admin, wallet, KYC) as founding engineer — Go, TypeScript, PostgreSQL, Kubernetes',
			'AI-assisted Farmer Call Center: voice AI for farmers without smartphones — UNESCO India-Africa Hackathon 2022 gold (AGRI12)',
			'Machine Learning Models for Predicting Malaria Among Children Under Five in Nigeria (IEEE ICTAS 2024)',
			'Swahili sentiment analysis with a RoBERTa/BERT ensemble — 4th of 29, Google NLP Hack Series 2023',
			'Variational autoencoder on SVHN with a clustering-regularised latent space'
		],
		pdfFile: 'saheed-faremi-cv.pdf'
	}
];

// Validate at module load so a malformed profile fails the build, not the browser.
export const TRACKS: readonly Track[] = z.array(TrackSchema).parse(RAW_TRACKS);
