import { z } from 'zod';

/*
 * CV profile — the data behind the /cv page.
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
			'Data scientist and founding engineer who ships production machine-learning and LLM systems end to end: a fraud/AML intelligence layer for a fintech moving cross-border payments across eight African markets, LLM document automation that cut manual work by 85%, and peer-reviewed deep-learning research published in Brain Informatics and IEEE. Core stack: Python, SQL, PyTorch, scikit-learn, Azure ML / AI Studio, AWS, Go, TypeScript. PhD researcher in deep learning for EEG at University College Cork; UNESCO India-Africa Hackathon 2022 gold medalist.',
		skillGroups: [
			{
				group: 'AI & machine learning',
				items: [
					'LLMs and generative AI (Azure OpenAI, OpenAI, Anthropic, DeepSeek, Llama)',
					'Retrieval-augmented generation (RAG), LangChain, FAISS',
					'Transformers and NLP',
					'PyTorch',
					'TensorFlow',
					'scikit-learn',
					'XGBoost / LightGBM / CatBoost',
					'Anomaly and fraud detection',
					'LLM fine-tuning (LoRA)',
					'Explainable AI'
				]
			},
			{ group: 'Programming', items: ['Python', 'SQL', 'Go', 'TypeScript', 'R', 'Bash'] },
			{
				group: 'Cloud & MLOps',
				items: [
					'Azure (ML Studio, AI Studio, Functions, DevOps, Bicep)',
					'AWS (SageMaker, Lambda, EC2, S3, Glue)',
					'Docker',
					'CI/CD (GitHub Actions, Azure DevOps, Jenkins)',
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
					'Microservices and serverless',
					'MySQL',
					'PostgreSQL',
					'Redis',
					'Domain-driven design'
				]
			},
			{
				group: 'Analytics & statistics',
				items: [
					'Statistical hypothesis testing (Wilcoxon, ICC, multiple-comparison correction)',
					'Power BI',
					'Tableau',
					'Matplotlib',
					'Seaborn'
				]
			}
		],
		highlightFocus: [
			'Founding engineer at Curnance: seven production services (double-entry ledger, auth, tiered KYC/KYB, Go jobs handler, Flutter app, admin console) on Azure Functions and MySQL, integrating VFD, Flutterwave, and Paystack across eight African markets.',
			'Built a rules-first, LLM-last fraud/AML intelligence layer: 38 deterministic detectors with LLM-drafted suspicious-activity reports and a compliance Q&A analyst, guarded by k-anonymity floors and PII redaction.',
			'Rebuilt every external payout path debit-before-pay with row-level locking and deterministic idempotency keys after a live withdrawal-fraud incident, eliminating that race-condition class.',
			'LLM document-generation pipeline on Azure ML Studio (Etihuku): 85% less manual document work across three compliance regions.',
			'Azure OpenAI (GPT-4) proposal-generation API for Gijima: structured prompting with a deterministic pricing guardrail, SharePoint/Graph system of record, and a LangChain + FAISS contract-analysis module.',
			'Peer-reviewed deep-learning research: Conv-VaDE for EEG microstate discovery (Brain Informatics 2026; N = 203, Wilcoxon signed-rank with BH correction) and a 4,832-model variational-autoencoder architecture search on SLURM GPU and IBM Power9 HPC (XAI 2026), released open-source under MIT.',
			'In development: an agentic in-app banking assistant that maps natural-language intents (balances, exchange rates, transactions) to concrete app actions.'
		],
		featuredProjects: [
			'Curnance — founding engineer: seven-service Azure fintech, double-entry ledger, fraud/AML AI, eight African markets',
			'Etihuku — LLM document automation on Azure ML Studio: 85% less manual work across three compliance regions',
			'Gijima — GPT-4 proposal-generation API with deterministic pricing and RAG contract analysis',
			'Conv-VaDE for EEG microstate discovery — Brain Informatics 2026 (doi:10.1186/s40708-026-00327-9)',
			'4,832-model VAE architecture search — XAI 2026, open-source (MIT)',
			'AI-assisted Farmer Call Center — UNESCO India-Africa Hackathon 2022 gold (AGRI12)',
			'Swahili sentiment analysis (RoBERTa/BERT ensemble) — 4th of 29, Google NLP Hack Series 2023'
		],
		pdfFile: 'saheed-faremi-cv.pdf'
	}
];

// Validate at module load so a malformed profile fails the build, not the browser.
export const TRACKS: readonly Track[] = z.array(TrackSchema).parse(RAW_TRACKS);
