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
		for (const area of TRACKS[0].researchAreas) {
			expect(source).toContain(area);
		}
		for (const group of [
			'Brain and behaviour',
			'Explainable and reproducible AI',
			'Applications',
			'Brain-signal analysis',
			'Applied AI and document automation',
			String.raw`Software \& cloud engineering`,
			'Research evaluation'
		]) {
			expect(source).toContain(String.raw`\skill{${group}}`);
		}
		expect(source).toContain('large-scale model evaluation');
		expect(source).toContain('document generation and automation');
		expect(source).toContain('document question answering');
		expect(source).toContain('statistical significance tests');
		expect(source).toContain('time-series and duration analysis');
		const brainSkill = source.match(/\\skill\{Brain-signal analysis\}\{([^}]+)\}/)?.[1] ?? '';
		expect(brainSkill).not.toContain('4,832');
		expect(brainSkill).not.toContain('110 metrics');
	});

	it('uses the exact three PhD and four Etihuku bullets without model jargon', () => {
		for (const highlight of [...phdHighlights, ...etihukuHighlights]) {
			expect(source).toContain(highlight.replace(/%/g, String.raw`\%`));
		}
		expect(source).toContain(String.raw`\cventry{Data scientist to Founding engineer}`);
		expect(source).toContain(
			String.raw`\cventry{BSc Information Technology, University of Eswatini}{Completed}`
		);
		expect(source).not.toMatch(
			/Conv-VaDE|Graph-VaDE|VAE\/GMM|\bARI\b|\bGEV\b|HSMM|LEMON|Holm|PMLR/i
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
