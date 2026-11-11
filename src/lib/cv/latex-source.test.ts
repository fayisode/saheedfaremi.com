import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TRACKS } from './tracks';

const source = readFileSync(
	fileURLToPath(new URL('./saheed-faremi-cv.tex', import.meta.url)),
	'utf8'
);
const summary =
	'PhD researcher and data scientist with five years of experience building production software. I study what brief brain states represent and how they change over time. In industry, I apply machine learning to healthcare, finance and compliance.';
const phdHighlights = [
	'Compared image-based and electrode-based representations of brain activity on 203 recordings. The electrode-based approach explained 61.8% of the variation, versus 54.2% for the image-based approach, which grouped similar activity better.',
	'Analysed brain-activity recordings from 203 people to understand how activity changes from one state to another. Paired statistical tests showed that accounting for state duration represented these changes more accurately than the current state alone, improving the result from 55.7% to 63.7%.',
	'Showed that analysis settings can change average reported brain-state durations from 402 to 24 milliseconds. Using the same processing method for both approaches changed the image-based result from 143.2 to 71.0 milliseconds, close to the electrode result of 70.2 milliseconds.',
	'Evaluated 4,832 model configurations on SLURM-managed GPU and IBM Power9 systems, scoring 110 measures per model and testing consistency across participants.'
];
const etihukuHighlights = [
	'Led a four-person team to develop a compliance dashboard for tracking legal obligations, document submissions, compliance scores and risk levels, reducing manual handling by 60%.',
	'Built a facial-recognition system for Know Your Customer (KYC) checks, using identity documents and liveness verification to flag potentially fraudulent user profiles for review. Developed automated checks to identify suspicious financial transactions, improving fraud detection by up to 35%.',
	'Built an LLM proposal generator from scratch for business bids, using RAG to turn past proposals, contracts and client requirements into seven-section drafts and cut manual preparation time by 80%.'
];

describe('ATS-first LaTeX CV source', () => {
	it('uses the required 11pt Charter preamble and local packages only', () => {
		expect(source).toContain(String.raw`\documentclass[11pt]{article}`);
		expect(source).toContain(String.raw`\usepackage[T1]{fontenc}`);
		expect(source).toContain(String.raw`\usepackage[utf8]{inputenc}`);
		expect(source).toContain(String.raw`\usepackage{charter}`);
		expect(source).toContain(String.raw`\usepackage{cmap}`);
		expect(source).toContain(String.raw`\usepackage{microtype}`);
		expect(source).toContain(String.raw`\DisableLigatures{encoding=*, family=*}`);
		expect(source).toContain(String.raw`\usepackage[margin=0.75in]{geometry}`);
		expect(source).toContain(String.raw`\geometry{a4paper}`);
		expect(source).toContain(String.raw`\usepackage[hidelinks,`);
	});

	it('contains exactly six sections in the approved reading order and no Recognition', () => {
		const sections = Array.from(source.matchAll(/\\cvsection\{([^}]+)\}/g), (match) => match[1]);
		expect(sections).toEqual([
			'Research areas',
			'Technical skills',
			'Education',
			'Experience',
			'Publications',
			'Talks'
		]);
		expect(source).not.toContain(String.raw`\cvsection{Recognition}`);
	});

	it('uses the exact summary, grouped research areas and four plain-language skill groups', () => {
		expect(TRACKS[0].summary).toBe(summary);
		expect(source).toContain(summary.replace('85%', String.raw`85\%`));
		expect(source).toContain('PhD researcher, University College Cork · Data scientist');
		expect(source).toContain('Available to work anywhere in Ireland');
		expect(source).not.toContain('Dublin, Ireland');
		for (const area of TRACKS[0].researchAreas) {
			expect(source).toContain(area);
		}
		for (const group of [
			'Brain and behaviour',
			'Explainable and reproducible AI',
			'Applications',
			'Brain-signal analysis',
			'Applied AI and agents',
			String.raw`Software \& cloud engineering`,
			'Research evaluation'
		]) {
			expect(source).toContain(String.raw`\skill{${group}}`);
		}
		expect(source).toContain('multi-GPU scheduling');
		expect(source).toContain('memory-aware job allocation');
		expect(source).toContain(
			'SLURM; multi-GPU scheduling; memory-aware job allocation; automated testing'
		);
		expect(source).toContain('AI agents and tool use');
		expect(source).toContain('prompt engineering');
		expect(source).toContain('retrieval-augmented generation (RAG)');
		expect(source).toContain('document question answering');
		expect(source).toContain('model fine-tuning');
		expect(source).toContain('statistical significance tests');
		expect(source).toContain('time-series and duration analysis');
		const brainSkill = source.match(/\\skill\{Brain-signal analysis\}\{([^}]+)\}/)?.[1] ?? '';
		expect(brainSkill).not.toContain('4,832');
		expect(brainSkill).not.toContain('110 metrics');
	});

	it('uses the exact four PhD and three Etihuku bullets without model jargon', () => {
		for (const highlight of [...phdHighlights, ...etihukuHighlights]) {
			expect(source).toContain(highlight.replace(/%/g, String.raw`\%`));
		}
		expect(source).toContain(String.raw`\cventry{Data scientist to Founding engineer}`);
		expect(source).not.toMatch(
			/Conv-VaDE|Graph-VaDE|VAE\/GMM|\bARI\b|\bGEV\b|HSMM|LEMON|Holm|PMLR/i
		);
		const experienceSection = source.slice(
			source.indexOf(String.raw`\cvsection{Experience}`),
			source.indexOf(String.raw`\cvsection{Publications}`)
		);
		expect(experienceSection).not.toMatch(
			/maps|tighter groups|explained signal|nine-state model|35\.6|23\.6/i
		);
		expect(experienceSection).not.toMatch(/\b38\b/);
	});

	it('marks every completed degree as Completed with no completion year', () => {
		expect(source).toContain(
			String.raw`\cventry{MSc Computer Science, Technological University Dublin}{Completed}`
		);
		expect(source).toContain(
			String.raw`\cventry{BSc Information Technology, University of Eswatini}{Completed}`
		);
		expect(source).not.toMatch(/Completed (19|20)\d\d/);
		const educationSection = source.slice(
			source.indexOf(String.raw`\cvsection{Education}`),
			source.indexOf(String.raw`\cvsection{Experience}`)
		);
		expect(educationSection).not.toMatch(/\b(19|20)\d\d\b/);
		expect(educationSection).toContain(
			'Machine learning, deep learning, data mining, visualisation and statistics. Second Class Honours, Upper Division (2.1).'
		);
		expect(educationSection).toContain(
			'Machine learning, deep learning, data mining, visualisation and statistics. 4.0/4.0 GPA (80/100).'
		);
	});

	it('contains nine publications in three groups with continuous numbering', () => {
		expect(source).toContain(String.raw`\noindent\textbf{Peer-reviewed}`);
		expect(source).toContain(
			String.raw`\noindent\textbf{Preprints, registered protocols \& doctoral work}`
		);
		expect(source).toContain(String.raw`\noindent\textbf{Under review and manuscripts}`);
		expect(source).toContain(String.raw`\setcounter{enumi}{3}`);
		expect(source).toContain(String.raw`\setcounter{enumi}{6}`);
		const publicationSection = source.slice(
			source.indexOf(String.raw`\cvsection{Publications}`),
			source.indexOf(String.raw`\cvsection{Talks}`)
		);
		expect(publicationSection.match(/\\item /g)).toHaveLength(9);
	});

	it('uses only the evidenced manuscript titles, author forms and venues', () => {
		for (const text of [
			'Spatial Encoding Geometry Determines the Maps and Transitions Recovered by Deep EEG Microstate Models',
			String.raw`\textbf{Saheed Faremi et al.}`,
			String.raw`\emph{ICLR 2027 (under review; OpenReview \#50003)}, 2026.`,
			'Convolutional Variational Deep Embedding Produces Canonical EEG Microstate Maps and Richer Transition Dynamics than Modified K-Means on Resting EEG',
			String.raw`\textbf{Saheed Faremi}, Andrea Visentin, Luca Longo`,
			String.raw`\emph{Cognitive Computation (manuscript in preparation)}, 2026.`,
			'Prediction of Early Detection of Autism Spectrum Disorder in Toddlers Using Explainable Artificial Intelligence',
			String.raw`\textbf{Stephen Fashoto et al.}`,
			String.raw`\emph{Under review}, 2026.`
		]) {
			expect(source).toContain(text);
		}
	});

	it('keeps AICS first in peer review with its official venue and no PMLR', () => {
		const peerReviewed = source.slice(
			source.indexOf(String.raw`\noindent\textbf{Peer-reviewed}`),
			source.indexOf(String.raw`\noindent\textbf{Preprints, registered protocols \& doctoral work}`)
		);
		expect(
			peerReviewed.indexOf('Temporal Dynamics and Latent-Space Interpretability')
		).toBeLessThan(peerReviewed.indexOf('Integrating Convolutional Variational Autoencoders'));
		expect(peerReviewed).toContain(
			String.raw`\emph{AICS 2026, University College Dublin (accepted; proceedings to appear)}, 2026.`
		);
		expect(source).not.toMatch(/PMLR/i);
	});

	it('retains all six existing publication titles and every available DOI', () => {
		for (const title of [
			'Integrating Convolutional Variational Autoencoders and the Gaussian Mixture Model for efficient manifold learning and clustering of spatially preserved EEG topographic maps',
			'Machine Learning Models for Identifying Factors Influencing and Predicting Malaria Among Children Under Five Years in Nigeria',
			'Temporal Dynamics and Latent-Space Interpretability of Generative EEG Microstate Segmentation',
			'Autoencoder-Based Models for Scalp EEG: A Systematic Review of Architectures, Applications, Latent Representations, Interpretability, and Validation',
			'Interpretable EEG Microstate Discovery via Variational Deep Embedding: A Systematic Architecture Search with Multi-Quadrant Evaluation',
			'Explainable Disentangled Representation Learning of Recurring Brain Activation Patterns via Variational Autoencoders'
		]) {
			expect(source).toContain(title);
		}
		for (const doi of [
			'10.1186/s40708-026-00327-9',
			'10.1109/ICTAS59620.2024.10507142',
			'10.17605/osf.io/v2w3z',
			'10.48550/arXiv.2605.10947'
		]) {
			expect(source).toContain(doi);
		}
	});

	it('retains exactly three talks and excludes development URLs and filler', () => {
		const talks = source.slice(source.indexOf(String.raw`\cvsection{Talks}`));
		expect(talks.match(/\\item /g)).toHaveLength(3);
		for (const text of [
			'Temporal Dynamics and Latent-Space Interpretability of Generative EEG Microstate Segmentation',
			'34th Irish Conference on Artificial Intelligence and Cognitive Science (AICS 2026)',
			'Interpretable EEG Microstate Discovery via Variational Deep Embedding',
			'Machine Learning Models for Predicting Malaria in Nigerian Children Under Five'
		]) {
			expect(source).toContain(text);
		}
		for (const forbidden of [
			'localhost',
			'lorem ipsum',
			'placeholder',
			'passionate',
			'results-driven',
			'self-motivated',
			'highly motivated',
			'enthusiastic',
			'visionary'
		]) {
			expect(source.toLowerCase()).not.toContain(forbidden);
		}
	});
});
