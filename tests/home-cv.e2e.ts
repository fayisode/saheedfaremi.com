import { expect, test, type Locator } from '@playwright/test';

const sectionNames = [
	'About',
	'Research',
	'Publications',
	'Projects',
	'Talks',
	'Experience',
	'Education'
];
const primaryNavItems = [
	['About', '/#about'],
	['Research', '/#research'],
	['Publications', '/#publications'],
	['Projects', '/#projects'],
	['Talks', '/#talks'],
	['Experience', '/#experience'],
	['Education', '/#education'],
	['Data', '/data'],
	['Blog', '/blog'],
	['CV', '/cv']
] as const;

const aicsTitle =
	'Temporal Dynamics and Latent-Space Interpretability of Generative EEG Microstate Segmentation';
const brainTitle =
	'Integrating Convolutional Variational Autoencoders and the Gaussian Mixture Model for efficient manifold learning and clustering of spatially preserved EEG topographic maps';
const malariaTitle =
	'Machine Learning Models for Identifying Factors Influencing and Predicting Malaria Among Children Under Five Years in Nigeria';
const protocolTitle =
	'Autoencoder-Based Models for Scalp EEG: A Systematic Review of Architectures, Applications, Latent Representations, Interpretability, and Validation';
const preprintTitle =
	'Interpretable EEG Microstate Discovery via Variational Deep Embedding: A Systematic Architecture Search with Multi-Quadrant Evaluation';
const proposalTitle =
	'Explainable Disentangled Representation Learning of Recurring Brain Activation Patterns via Variational Autoencoders';
const cognitiveTitle =
	'Convolutional Variational Deep Embedding Produces Canonical EEG Microstate Maps and Richer Transition Dynamics than Modified K-Means on Resting EEG';
const iclrTitle =
	'Spatial Encoding Geometry Determines the Maps and Transitions Recovered by Deep EEG Microstate Models';
const fashotoTitle =
	'Prediction of Early Detection of Autism Spectrum Disorder in Toddlers Using Explainable Artificial Intelligence';

async function expectPublicationSlugs(list: Locator, slugs: string[], origin = '') {
	const hrefs = await list
		.locator(':scope > li h4 a')
		.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
	expect(hrefs).toEqual(slugs.map((slug) => `${origin}/publications/${slug}`));
}

type PublicationStructuredData = {
	'@type': string;
	author: Array<{ '@type': string; name: string }>;
	datePublished?: string;
};

async function readPublicationStructuredData(scripts: Locator): Promise<PublicationStructuredData> {
	const structuredData = await scripts.evaluateAll((nodes) =>
		nodes
			.map((node) => JSON.parse(node.textContent ?? '{}') as PublicationStructuredData)
			.find((data) => data['@type'] === 'ScholarlyArticle')
	);
	if (!structuredData) throw new Error('ScholarlyArticle JSON-LD block not found');
	return structuredData;
}

const manuscriptMetadataCases = [
	{
		slug: 'cognitive-computation-conv-vade-dynamics',
		authors: ['Saheed Faremi', 'Andrea Visentin', 'Luca Longo']
	},
	{
		slug: 'iclr-2027-spatial-encoding-geometry',
		authors: ['Saheed Faremi']
	},
	{
		slug: 'fashoto-2026-autism-xai',
		authors: ['Stephen Fashoto']
	}
] as const;

for (const { slug, authors } of manuscriptMetadataCases) {
	test(`publication JSON-LD omits unpublished dates and literal et al. names: ${slug}`, async ({
		page
	}) => {
		await page.goto(`/publications/${slug}`);
		const structuredData = await readPublicationStructuredData(
			page.locator('script[type="application/ld+json"]')
		);

		expect(structuredData).not.toHaveProperty('datePublished');
		expect(structuredData.author).toEqual(authors.map((name) => ({ '@type': 'Person', name })));
		for (const author of structuredData.author) {
			expect(author['@type']).toBe('Person');
			expect(author.name).not.toContain('et al.');
		}
	});
}

test('published publication JSON-LD retains its publication year', async ({ page }) => {
	await page.goto('/publications/aics-2026-temporal-dynamics');
	const structuredData = await readPublicationStructuredData(
		page.locator('script[type="application/ld+json"]')
	);

	expect(structuredData.datePublished).toBe('2026');
	expect(structuredData.author).toEqual([
		{ '@type': 'Person', name: 'Saheed Faremi' },
		{ '@type': 'Person', name: 'Andrea Visentin' },
		{ '@type': 'Person', name: 'Luca Longo' }
	]);
});

test('homepage presents a compact academic profile and ordered anchored sections', async ({
	page
}) => {
	await page.setViewportSize({ width: 1920, height: 1080 });
	await page.goto('/');

	const profile = page.getByRole('region', { name: 'Saheed Faremi', exact: true });
	await expect(profile).toBeVisible();
	await expect(profile.getByRole('heading', { level: 1, name: 'Saheed Faremi' })).toBeVisible();
	await expect(
		profile.getByText('PhD researcher, University College Cork · Data scientist', { exact: true })
	).toBeVisible();
	await expect(
		profile.getByRole('link', { name: 'View / Download Curriculum Vitae (PDF)', exact: true })
	).toHaveAttribute('href', '/saheed-faremi-cv.pdf');
	await expect(profile.getByRole('link', { name: 'View web CV', exact: true })).toHaveAttribute(
		'href',
		'/cv'
	);
	await expect(profile.getByRole('link', { name: 'GitHub', exact: true })).toBeVisible();
	await expect(profile.getByRole('link', { name: 'Google Scholar', exact: true })).toBeVisible();

	const portrait = profile.getByRole('img', { name: 'Saheed Faremi', exact: true });
	await expect(portrait).toBeVisible();
	await expect(page.locator('main img')).toHaveCount(1);
	const portraitBox = await portrait.boundingBox();
	expect(portraitBox).not.toBeNull();
	expect(portraitBox?.width).toBeGreaterThanOrEqual(88);
	expect(portraitBox?.width).toBeLessThanOrEqual(112);
	expect(portraitBox?.height).toBe(portraitBox?.width);
	expect(
		await portrait.evaluate((image) => {
			const radius = Number.parseFloat(getComputedStyle(image).borderTopLeftRadius);
			return radius / image.getBoundingClientRect().width;
		})
	).toBeGreaterThanOrEqual(0.5);

	const profileBox = await profile.boundingBox();
	expect(profileBox).not.toBeNull();
	expect(profileBox?.height).toBeLessThan(600);
	await expect(page.locator('main [class*="78dvh"], main [class*="min-h-dvh"]')).toHaveCount(0);

	await expect(page.locator('main h2')).toHaveText(sectionNames);
	await expect(page.locator('#recognition')).toHaveCount(0);
	await expect(page.getByRole('heading', { level: 2, name: 'News', exact: true })).toHaveCount(0);
	await expect(page.locator('#news')).toHaveCount(0);
	for (const name of sectionNames) {
		const id = name.toLowerCase();
		await expect(page.locator(`#${id}`)).toBeVisible();
	}
	const primaryNav = page.locator('nav[aria-label="Primary"]');
	await expect(primaryNav.locator('a')).toHaveText(primaryNavItems.map(([label]) => label));
	for (const [label, href] of primaryNavItems) {
		await expect(primaryNav.getByRole('link', { name: label, exact: true })).toHaveAttribute(
			'href',
			href
		);
	}
	await expect(primaryNav.getByRole('link', { name: 'Recognition', exact: true })).toHaveCount(0);
	await expect(primaryNav.getByRole('link', { name: 'News', exact: true })).toHaveCount(0);
	await expect(page.getByRole('heading', { level: 2, name: 'Contact', exact: true })).toHaveCount(
		0
	);
	await expect(page.locator('#contact')).toHaveCount(0);
	await expect(primaryNav.getByRole('link', { name: 'Contact', exact: true })).toHaveCount(0);
	await expect(page.locator('#research')).toBeVisible();

	await expect(page.getByRole('heading', { name: 'Selected publications' })).toHaveCount(0);
	await expect(page.getByRole('heading', { name: 'Selected projects' })).toHaveCount(0);
	await expect(
		page.getByRole('link', { name: 'View all publications', exact: true })
	).toHaveAttribute('href', '/publications');
	await expect(page.getByRole('link', { name: 'View all projects', exact: true })).toHaveAttribute(
		'href',
		'/projects'
	);
	const footer = page.locator('footer');
	await expect(footer.getByRole('link', { name: 'Recognition', exact: true })).toHaveCount(0);
	await expect(footer.getByRole('link', { name: 'Research', exact: true })).toHaveAttribute(
		'href',
		'/#research'
	);
	await expect(footer.getByText(/Dublin, Ireland/)).toHaveCount(1);
	const footerEmail = footer.getByRole('link', { name: 'saheedfaremi@gmail.com', exact: true });
	await expect(footerEmail).toBeVisible();
	await expect(footerEmail).toHaveAttribute('href', 'mailto:saheedfaremi@gmail.com');
	await expect(
		footer.getByText(
			'I am seeking collaboration, funding, and computing resources for this doctoral research, and welcome sponsorship and research partnerships.',
			{ exact: true }
		)
	).toBeVisible();
	await expect(
		page.getByText('Researcher of the brain. Engineer of the systems people rely on.')
	).toHaveCount(0);
});

test('homepage renders a complete, continuously numbered academic bibliography', async ({
	page
}) => {
	await page.goto('/');

	const peerReviewed = page.locator('#peer-reviewed ol');
	const otherResearch = page.locator('#other-research ol');
	const underReview = page.locator('#under-review ol');
	await expect(
		page.getByRole('heading', { level: 3, name: 'Peer-reviewed', exact: true })
	).toBeVisible();
	await expect(
		page.getByRole('heading', {
			level: 3,
			name: 'Preprints, registered protocols & doctoral work',
			exact: true
		})
	).toBeVisible();
	await expect(
		page.getByRole('heading', {
			level: 3,
			name: 'Under review and manuscripts',
			exact: true
		})
	).toBeVisible();
	await expectPublicationSlugs(peerReviewed, [
		'aics-2026-temporal-dynamics',
		'cvae-gmm-eeg-topographic-maps',
		'malaria-ml-nigeria'
	]);
	await expectPublicationSlugs(otherResearch, [
		'vade-eeg-microstate-discovery',
		'autoencoder-eeg-systematic-review-protocol',
		'xai-2025-doctoral-proposal'
	]);
	await expectPublicationSlugs(underReview, [
		'cognitive-computation-conv-vade-dynamics',
		'iclr-2027-spatial-encoding-geometry',
		'fashoto-2026-autism-xai'
	]);

	await expect(peerReviewed).toHaveAttribute('start', '1');
	await expect(otherResearch).toHaveAttribute('start', '4');
	await expect(underReview).toHaveAttribute('start', '7');
	for (const list of [peerReviewed, otherResearch, underReview]) {
		await expect(list.locator(':scope > li')).toHaveCount(3);
		await expect(list).toHaveCSS('list-style-type', 'decimal');
	}
	await expect(page.locator('#publications .publication-entry')).toHaveCount(9);

	const entries = page.locator('#publications .publication-entry');
	await expect(entries.locator('.publication-badge')).toHaveText([
		'AICS 2026',
		'Brain Informatics · 2026',
		'IEEE ICTAS 2024',
		'XAI 2026',
		'OSF Registries · 2026',
		'XAI World Conference 2025',
		'Cognitive Computation · 2026',
		'ICLR 2027 · 2026',
		'Under review · 2026'
	]);
	await expect(entries.locator('.publication-authors')).toHaveText([
		'Saheed Faremi, Andrea Visentin, Luca Longo',
		'Saheed Faremi, Luca Longo',
		'Akinpelumi Saheed Faremi, Boluwaji Akinnuwesi, Elliot Mbunge, Petros M. Mashwama, Stephen Fashoto, Polite Zenzo Ncube, John Batani, Shamsudeen Ademola Sanni, Yinusa A. Faremi, Andile Metfula',
		'Saheed Faremi, Andrea Visentin, Luca Longo',
		'Morteza Akbari, Saheed Akinpelumi Faremi, Luca Longo',
		'Saheed Faremi',
		'Saheed Faremi, Andrea Visentin, Luca Longo',
		'Saheed Faremi et al.',
		'Stephen Fashoto et al.'
	]);
	for (let index = 0; index < 8; index += 1) {
		const ownName = entries.nth(index).locator('.publication-authors strong');
		await expect(ownName).toHaveCount(1);
		await expect(ownName).toHaveText(/saheed/i);
	}
	await expect(entries.locator('.publication-venue')).toHaveText([
		'AICS 2026, University College Dublin (accepted; proceedings to appear) · 2026 · Conference paper',
		'Brain Informatics · 2026 · Journal article',
		'IEEE ICTAS 2024 · 2024 · Conference paper',
		'XAI 2026 (Late-breaking work + Doctoral Consortium track), Fortaleza, Brazil (arXiv preprint) · 2026 · Preprint',
		'OSF Registries (registered systematic-review protocol) · 2026 · Preprint',
		'XAI World Conference 2025, Doctoral Proposals track · 2025 · Workshop',
		'Cognitive Computation (manuscript in preparation) · 2026',
		'ICLR 2027 (under review; OpenReview #50003) · 2026',
		'Under review · 2026'
	]);

	const brainEntry = entries.filter({
		has: page.getByRole('link', { name: brainTitle, exact: true })
	});
	await expect(
		brainEntry.getByRole('link', { name: `DOI for ${brainTitle}`, exact: true })
	).toHaveAttribute('href', 'https://doi.org/10.1186/s40708-026-00327-9');
	await expect(
		brainEntry.getByRole('link', { name: `PDF for ${brainTitle}`, exact: true })
	).toHaveAttribute('href', '/publications/cvae-gmm-eeg-topographic-maps.pdf');
	await expect(
		brainEntry.getByRole('link', { name: `Publication page for ${brainTitle}`, exact: true })
	).toHaveAttribute('href', 'https://link.springer.com/article/10.1186/s40708-026-00327-9');

	const malariaEntry = entries.filter({
		has: page.getByRole('link', { name: malariaTitle, exact: true })
	});
	await expect(
		malariaEntry.getByRole('link', { name: `DOI for ${malariaTitle}`, exact: true })
	).toHaveAttribute('href', 'https://doi.org/10.1109/ICTAS59620.2024.10507142');

	const aicsEntry = entries.filter({
		has: page.getByRole('link', { name: aicsTitle, exact: true })
	});
	await expect(
		aicsEntry.getByRole('link', { name: `Publication page for ${aicsTitle}`, exact: true })
	).toHaveAttribute('href', 'https://aics2026.com/');
	await expect(aicsEntry).not.toContainText('PMLR');

	const preprintEntry = entries.filter({
		has: page.getByRole('link', { name: preprintTitle, exact: true })
	});
	await expect(
		preprintEntry.getByRole('link', { name: `DOI for ${preprintTitle}`, exact: true })
	).toHaveAttribute('href', 'https://doi.org/10.48550/arXiv.2605.10947');
	await expect(
		preprintEntry.getByRole('link', { name: `Code for ${preprintTitle}`, exact: true })
	).toHaveAttribute('href', 'https://github.com/fayisode/microstate-architecture-search');
	await expect(
		preprintEntry.getByRole('link', { name: `Publication page for ${preprintTitle}`, exact: true })
	).toHaveAttribute('href', 'https://arxiv.org/abs/2605.10947');

	const protocolEntry = entries.filter({
		has: page.getByRole('link', { name: protocolTitle, exact: true })
	});
	await expect(
		protocolEntry.getByRole('link', { name: `DOI for ${protocolTitle}`, exact: true })
	).toHaveAttribute('href', 'https://doi.org/10.17605/osf.io/v2w3z');

	for (const title of [proposalTitle, cognitiveTitle, iclrTitle, fashotoTitle]) {
		const entry = entries.filter({ has: page.getByRole('link', { name: title, exact: true }) });
		await expect(entry.locator('.publication-links a')).toHaveCount(0);
	}
	await expect(page.locator('#publications img')).toHaveCount(0);

	const disclosures = page.locator('#publications details.publication-bibtex');
	await expect(disclosures).toHaveCount(9);
	await expect(disclosures.locator('summary')).toHaveText(Array(9).fill('BibTeX'));
	await disclosures.first().locator('summary').click();
	await expect(disclosures.first()).toHaveAttribute('open', '');
	const bibtex = disclosures.first().locator('pre');
	await expect(bibtex).toBeVisible();
	await expect(bibtex).toContainText('@inproceedings{');
	await expect(bibtex).toHaveAttribute('tabindex', '0');
	await expect(bibtex).toHaveCSS('overflow-x', 'auto');
	await expect(bibtex).toHaveCSS('user-select', 'text');
});

test('homepage presents the doctoral questions and prioritised work without mobile overflow', async ({
	page
}) => {
	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');

		await expect(page.locator('#about')).toContainText(
			'Over the past five years, I have built payment systems, fraud-detection tools, document-automation pipelines and machine-learning models for healthcare.'
		);
		const researchGroups = page.locator('#research .research-group');
		await expect(researchGroups).toHaveCount(3);
		await expect(researchGroups.locator('dt')).toHaveText([
			'Brain and behaviour',
			'Explainable and reproducible AI',
			'Applications'
		]);
		await expect(researchGroups.locator('dd')).toHaveText([
			'EEG microstates and brain-signal analysis; neuroscientific knowledge discovery; neuroimaging; nonlinear time-series analysis',
			'Explainable Artificial Intelligence; mechanistic interpretability; reproducible machine learning',
			'Deep learning for health and behaviour; production AI and data systems'
		]);
		await expect(
			page.getByRole('heading', { level: 3, name: 'Doctoral research focus', exact: true })
		).toBeVisible();
		await expect(page.locator('#research')).toContainText(
			'My PhD uses deep learning to test what an EEG microstate actually is, rather than assuming that the classical definition is complete.'
		);
		await expect(page.locator('#research ol > li')).toHaveText([
			'Do brain-state sequences have memory beyond the current state?',
			'Are brain states truly separate, or are they parts of a continuous flow, and what information is lost when we divide that flow into labels?',
			'Does the time spent in a state shape the next one, and does the brain’s switching rule stay fixed?',
			'Which patterns are stable enough to identify a person across sessions and predict cognition or clinical outcomes better than standard statistics?'
		]);
		await expect(page.locator('#research')).toContainText(
			'The work asks which patterns are genuine properties of brain activity and which are created by the model or the way it processes the signal.'
		);

		const projectLinks = page.locator('#projects ol > li h3 a');
		await expect(projectLinks).toHaveText([
			'EEG microstate temporal dynamics',
			'EEG microstate representation learning',
			'EEG microstate architecture search',
			'Curnance'
		]);
		expect(
			await projectLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))
		).toEqual([
			'/projects/microstate-temporal-dynamics',
			'/projects/microstate-representation-learning',
			'/projects/microstate-architecture-search',
			'/projects/curnance'
		]);
		await expect(page.locator('#projects')).not.toContainText(
			/Conv-VaDE|Graph-VaDE|\bARI\b|\bGEV\b|HSMM|LEMON|Holm/i
		);
		await expect(page.locator('#projects')).toContainText(
			'When both use the same processing step on 203 resting-state recordings, the electrode-based approach accounts for 61.8% of the signal versus 54.2% for the image-based approach. The image-based approach produces tighter groups of activity.'
		);
		await expect(page.locator('#projects')).toContainText(
			'Tests whether including the duration of a brain state improves the model’s match to the recording. With nine states, including duration improves the match from 55.7% to 63.7%, compared with using only the current state. A separate comparison finds that its state-switching patterns differ more from chance than those from standard clustering (35.6% versus 23.6%).'
		);
		await expect(page.locator('#projects')).toContainText(
			'A 4,832-model architecture search on two high-performance computing clusters, scoring 110 metrics per model and testing consistency across participants.'
		);
		await expect(page.locator('#experience')).toContainText(
			'Uses deep learning to identify recurring patterns in brain activity and to test how long they last and how they change over time.'
		);

		const homepageTalks = page.locator('#talks ol > li');
		await expect(homepageTalks).toHaveCount(3);
		await expect(homepageTalks.first().getByRole('link', { name: aicsTitle })).toHaveAttribute(
			'href',
			'/talks/aics-2026-temporal-dynamics'
		);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
			width
		);
	}
});

test('academic section anchors resolve to their targets', async ({ page }) => {
	for (const name of sectionNames) {
		const id = name.toLowerCase();
		const target = page.locator(`#${id}`);
		await page.goto(`/#${id}`);
		await expect
			.poll(() =>
				target.evaluate((element) => {
					const scrollMarginTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop);
					return Math.abs(element.getBoundingClientRect().top - scrollMarginTop);
				})
			)
			.toBeLessThanOrEqual(2);
		await expect(page).toHaveURL(new RegExp(`#${id}$`));
		await expect(target).toBeInViewport();
	}
});

test('CV matches the LaTeX profile and single-column academic content', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/cv');

	await expect(page.locator('.cv-page h2')).toHaveText([
		'Research areas',
		'Technical skills',
		'Education',
		'Experience',
		'Publications',
		'Talks'
	]);
	await expect(page.getByText('Last updated November 2026', { exact: true })).toBeVisible();
	await expect(page.locator('.cv-role')).toHaveText(
		'PhD researcher, University College Cork · Data scientist'
	);
	await expect(page.locator('.cv-summary')).toHaveText(
		'PhD researcher and data scientist with five years of experience building production software. I study what brief brain states represent and how they change over time. In industry, I apply machine learning to healthcare, finance and compliance.'
	);
	await expect(page.locator('.cv-summary')).not.toContainText('founding engineer');
	await expect(page.locator('.cv-header')).toHaveCSS('text-align', 'center');
	await expect(page.locator('.cv-social-links a')).toHaveText([
		'GitHub',
		'LinkedIn',
		'Google Scholar',
		'ORCID'
	]);
	await expect(page.getByRole('heading', { name: 'Selected projects', exact: true })).toHaveCount(
		0
	);

	const research = page.locator('section[aria-labelledby="cv-research"]');
	const researchGroups = research.locator('.research-group');
	await expect(researchGroups).toHaveCount(3);
	await expect(researchGroups.locator('dt')).toHaveText([
		'Brain and behaviour',
		'Explainable and reproducible AI',
		'Applications'
	]);
	await expect(researchGroups.locator('dd')).toHaveText([
		'EEG microstates and brain-signal analysis; neuroscientific knowledge discovery; neuroimaging; nonlinear time-series analysis',
		'Explainable Artificial Intelligence; mechanistic interpretability; reproducible machine learning',
		'Deep learning for health and behaviour; production AI and data systems'
	]);

	const skillRows = page.locator('.cv-skill-row');
	await expect(skillRows).toHaveCount(4);
	await expect(skillRows.locator('dt')).toHaveText([
		'Brain-signal analysis:',
		'Applied AI and document automation:',
		'Software & cloud engineering:',
		'Research evaluation:'
	]);
	await expect(skillRows.locator('dd')).toHaveText([
		'PyTorch; scikit-learn; MNE; large-scale model evaluation',
		'Azure OpenAI; document question answering; fraud and anomaly detection; model fine-tuning; document generation and automation',
		'Python; Go; TypeScript; SQL; FastAPI; Azure; CI/CD; SLURM; automated testing',
		'Testing across participants; statistical significance tests; correction for multiple comparisons; time-series and duration analysis'
	]);
	for (let index = 0; index < 4; index += 1) {
		await expect(skillRows.nth(index)).toHaveCSS('display', 'block');
		await expect(skillRows.nth(index)).toHaveCSS('grid-template-columns', 'none');
		await expect(skillRows.nth(index).locator('dt')).toHaveCSS('font-weight', '700');
	}

	const education = page.locator('section[aria-labelledby="cv-education"]');
	const educationItems = education.locator('.cv-education-item');
	await expect(educationItems).toHaveCount(3);
	await expect(educationItems.locator('h3')).toHaveText([
		'PhD · University College Cork',
		'MSc Computer Science · Technological University Dublin',
		'BSc Information Technology · University of Eswatini'
	]);
	await expect(educationItems.locator('.cv-date')).toHaveText([
		'In progress',
		'Completed 2025',
		'Completed'
	]);
	await expect(educationItems.nth(0)).toContainText(
		'Neural engineering and machine learning. Supervisor: Luca Longo.'
	);
	await expect(educationItems.nth(1)).toContainText(
		'Machine learning, deep learning, data mining, visualisation and statistics. 4.0/4.0 GPA (80/100).'
	);
	await expect(educationItems.nth(2)).toContainText('Second Class Honours, Upper Division (2.1).');
	await expect(education.locator('.cv-entry-list')).toHaveCSS('display', 'block');
	await expect(education.locator('.cv-entry-list')).toHaveCSS('border-left-width', '0px');
	for (const index of [0, 1]) {
		const geometry = await educationItems
			.nth(index)
			.locator('.cv-entry-header')
			.evaluate((header) => {
				const title = header.querySelector('h3')?.getBoundingClientRect();
				const date = header.querySelector('.cv-date')?.getBoundingClientRect();
				return { titleTop: title?.top, dateTop: date?.top };
			});
		expect(Math.abs((geometry.titleTop ?? 0) - (geometry.dateTop ?? 0))).toBeLessThanOrEqual(2);
	}

	const experienceItems = page.locator('section[aria-labelledby="cv-experience"] > ol > li');
	await expect(experienceItems).toHaveCount(2);
	await expect(experienceItems.nth(0).locator('.cv-highlights li')).toHaveText([
		'Developed and compared image-based scalp maps with maps built from connections between recording electrodes. When both used the same processing step on 203 resting-state recordings, the electrode-based approach accounted for 61.8% of the signal versus 54.2% for the image-based approach. The image-based approach produced tighter groups of activity.',
		'Tested whether including the duration of a brain state improves the model’s match to the recording. With nine states, including duration improved the match from 55.7% to 63.7%, compared with using only the current state. A separate comparison found that its state-switching patterns differed more from chance than those from standard clustering (35.6% versus 23.6%).',
		'Showed that processing choices can change the reported duration of brain states. The gap between the two models narrowed from 70.2 versus 143.2 milliseconds to 70.2 versus 71.0 milliseconds when both used the same processing step. In a separate test, changing a duration setting moved the average from 402 to 24 milliseconds.'
	]);
	await expect(experienceItems.nth(1).locator('.cv-highlights li')).toHaveText([
		'Delivered seven production services for payments, account security, identity checks and background processing, plus a 120-screen mobile app, an admin dashboard and a public website.',
		'Fixed a live withdrawal-fraud issue by debiting the customer’s account before making an external payout and rejecting duplicate transfer requests.',
		'Built a fraud and anti-money-laundering system with 38 rule-based checks, AI-drafted suspicious-activity reports, and privacy controls that hide personal details.',
		'Built an Azure AI document service that cut manual document work by 85% across three compliance regions.'
	]);
	await expect(page.locator('.cv-page')).not.toContainText(/Conv-VaDE|Graph-VaDE|VAE\/GMM/);
	await expect(page.getByText('Etihuku (Curnance), continued', { exact: true })).toHaveCount(0);
});

test('CV retains nine ordered publications and three talks without Recognition', async ({
	page
}) => {
	await page.goto('/cv');

	const peerReviewed = page.locator('#cv-peer-reviewed ol.academic-publication-list');
	const otherResearch = page.locator('#cv-other-research ol.academic-publication-list');
	const underReview = page.locator('#cv-under-review ol.academic-publication-list');
	await expect(
		page.getByRole('heading', { level: 3, name: 'Peer-reviewed', exact: true })
	).toBeVisible();
	await expect(
		page.getByRole('heading', {
			level: 3,
			name: 'Preprints, registered protocols & doctoral work',
			exact: true
		})
	).toBeVisible();
	await expect(
		page.getByRole('heading', {
			level: 3,
			name: 'Under review and manuscripts',
			exact: true
		})
	).toBeVisible();
	await expectPublicationSlugs(
		peerReviewed,
		['aics-2026-temporal-dynamics', 'cvae-gmm-eeg-topographic-maps', 'malaria-ml-nigeria'],
		'https://saheedfaremi.com'
	);
	await expectPublicationSlugs(
		otherResearch,
		[
			'vade-eeg-microstate-discovery',
			'autoencoder-eeg-systematic-review-protocol',
			'xai-2025-doctoral-proposal'
		],
		'https://saheedfaremi.com'
	);
	await expectPublicationSlugs(
		underReview,
		[
			'cognitive-computation-conv-vade-dynamics',
			'iclr-2027-spatial-encoding-geometry',
			'fashoto-2026-autism-xai'
		],
		'https://saheedfaremi.com'
	);
	await expect(peerReviewed).toHaveAttribute('start', '1');
	await expect(otherResearch).toHaveAttribute('start', '4');
	await expect(underReview).toHaveAttribute('start', '7');
	for (const list of [peerReviewed, otherResearch, underReview]) {
		await expect(list.locator(':scope > li')).toHaveCount(3);
	}
	const entries = page.locator('#cv-publications .publication-entry');
	await expect(entries).toHaveCount(9);
	await expect(entries.locator('.publication-authors')).toHaveText([
		'Saheed Faremi, Andrea Visentin, Luca Longo',
		'Saheed Faremi, Luca Longo',
		'Akinpelumi Saheed Faremi, Boluwaji Akinnuwesi, Elliot Mbunge, Petros M. Mashwama, Stephen Fashoto, Polite Zenzo Ncube, John Batani, Shamsudeen Ademola Sanni, Yinusa A. Faremi, Andile Metfula',
		'Saheed Faremi, Andrea Visentin, Luca Longo',
		'Morteza Akbari, Saheed Akinpelumi Faremi, Luca Longo',
		'Saheed Faremi',
		'Saheed Faremi, Andrea Visentin, Luca Longo',
		'Saheed Faremi et al.',
		'Stephen Fashoto et al.'
	]);
	await expect(entries.nth(6).locator('.publication-venue')).toHaveText(
		'Cognitive Computation (manuscript in preparation) · 2026'
	);
	await expect(entries.nth(7).locator('.publication-venue')).toHaveText(
		'ICLR 2027 (under review; OpenReview #50003) · 2026'
	);
	await expect(entries.nth(8).locator('.publication-venue')).toHaveText('Under review · 2026');
	expect(
		await entries
			.locator('.publication-badge')
			.evaluateAll((badges) => badges.every((badge) => getComputedStyle(badge).display === 'none'))
	).toBe(true);
	await expect(page.locator('#cv-publications details.publication-bibtex')).toHaveCount(0);

	const brainEntry = entries.filter({
		has: page.getByRole('link', { name: brainTitle, exact: true })
	});
	await expect(
		brainEntry.getByRole('link', { name: `DOI for ${brainTitle}`, exact: true })
	).toHaveAttribute('href', 'https://doi.org/10.1186/s40708-026-00327-9');
	await expect(
		brainEntry.getByRole('link', { name: `PDF for ${brainTitle}`, exact: true })
	).toHaveAttribute(
		'href',
		'https://saheedfaremi.com/publications/cvae-gmm-eeg-topographic-maps.pdf'
	);
	const preprintEntry = entries.filter({
		has: page.getByRole('link', { name: preprintTitle, exact: true })
	});
	await expect(
		preprintEntry.getByRole('link', { name: `Code for ${preprintTitle}`, exact: true })
	).toHaveAttribute('href', 'https://github.com/fayisode/microstate-architecture-search');

	const cvTalks = page.locator('section[aria-labelledby="cv-talks"] > ol > li');
	await expect(cvTalks).toHaveCount(3);
	await expect(cvTalks.first().getByRole('link', { name: aicsTitle, exact: true })).toHaveAttribute(
		'href',
		'https://aics2026.com/'
	);
	await expect(page.locator('#cv-awards')).toHaveCount(0);
	await expect(page.getByRole('heading', { name: 'Recognition', exact: true })).toHaveCount(0);
});

test('CV keeps its PDF download and uses clean single-column print media', async ({ page }) => {
	await page.goto('/cv');

	const download = page.getByRole('link', { name: 'Download PDF', exact: true });
	const print = page.getByRole('button', { name: 'Print', exact: true });
	const primaryNav = page.locator('nav[aria-label="Primary"]');
	await expect(download).toHaveAttribute('href', '/saheed-faremi-cv.pdf');
	await expect(download).toHaveAttribute('download', '');
	await expect(download).toBeVisible();
	await expect(print).toBeVisible();

	await page.emulateMedia({ media: 'print' });
	await expect(primaryNav).toBeHidden();
	await expect(download).toBeHidden();
	await expect(print).toBeHidden();
	await expect(page.locator('footer')).toBeHidden();
	expect(
		await page
			.locator('#cv-publications .publication-badge')
			.evaluateAll((badges) => badges.every((badge) => getComputedStyle(badge).display === 'none'))
	).toBe(true);
	await expect(page.locator('.cv-name')).toHaveCSS('color', 'rgb(0, 0, 0)');
	await expect(page.locator('.cv-entry-list').first()).toHaveCSS('display', 'block');
	await expect(page.locator('.cv-entry-list').first()).toHaveCSS('grid-template-columns', 'none');
	await expect(page.locator('.cv-skill-row').first()).toHaveCSS('display', 'block');
	await expect(page.locator('.cv-skill-row').first()).toHaveCSS('grid-template-columns', 'none');
	expect(
		await page.evaluate(() => Number.parseFloat(getComputedStyle(document.body).fontSize))
	).toBeCloseTo(14.6667, 3);
});

test('CV stays single-column without overflow at mobile and desktop widths in both themes', async ({
	page
}) => {
	for (const width of [390, 1440]) {
		for (const theme of ['dark', 'light']) {
			await test.step(`${width}px ${theme}`, async () => {
				await page.setViewportSize({ width, height: 900 });
				await page.goto('/cv');
				await page.evaluate((selectedTheme) => {
					document.documentElement.dataset.theme = selectedTheme;
				}, theme);

				await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
				await expect(page.locator('.cv-page')).toHaveCSS('font-family', /Fraunces/);
				await expect(page.locator('.cv-entry-list').first()).toHaveCSS('display', 'block');
				await expect(page.locator('.cv-skill-row').first()).toHaveCSS('display', 'block');
				await expect(page.locator('.cv-highlights').first().locator('li')).toHaveCount(3);
				await expect(page.locator('.cv-highlights').nth(1).locator('li')).toHaveCount(4);
				expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
					width
				);
			});
		}
	}
});

test('header keeps its brand, controls, and ten links contained at responsive widths', async ({
	page
}) => {
	for (const width of [390, 1024, 1440, 1536, 1920]) {
		await test.step(`${width}px`, async () => {
			await page.setViewportSize({ width, height: 900 });
			await page.goto('/');

			const geometry = await page.locator('header').evaluate((header) => {
				const inner = header.querySelector(':scope > div');
				const brand = inner?.querySelector(':scope > a');
				const controls = inner?.querySelector(':scope > div');
				const primary = header.querySelector('nav[aria-label="Primary"]');
				if (!inner || !brand || !controls || !primary) throw new Error('Header region missing');
				const rect = (element: Element) => {
					const box = element.getBoundingClientRect();
					return {
						left: box.left,
						right: box.right,
						width: box.width,
						height: box.height
					};
				};
				return {
					inner: rect(inner),
					brand: rect(brand),
					controls: rect(controls),
					primary: rect(primary),
					scrollWidth: document.documentElement.scrollWidth
				};
			});

			expect(geometry.brand.height).toBeLessThanOrEqual(24);
			expect(geometry.brand.width).toBeGreaterThanOrEqual(150);
			expect(geometry.controls.right).toBeLessThanOrEqual(geometry.inner.right + 1);
			expect(geometry.brand.right).toBeLessThanOrEqual(geometry.controls.left);
			expect(geometry.scrollWidth).toBeLessThanOrEqual(width);

			const primaryNav = page.locator('nav[aria-label="Primary"]');
			const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
			if (width < 1536) {
				await expect(primaryNav).toBeHidden();
				await expect(toggle).toBeVisible();
				await toggle.click();
				const mobileNav = page.locator('#mobile-nav');
				await expect(mobileNav).toBeVisible();
				await expect(mobileNav.locator('a')).toHaveCount(10);
				await expect(mobileNav.getByRole('link', { name: 'News', exact: true })).toHaveCount(0);
				await expect(mobileNav.getByRole('link', { name: 'Contact', exact: true })).toHaveCount(0);
				await expect(mobileNav.locator('a').last()).toBeInViewport();
				await page.keyboard.press('Escape');
				await expect(mobileNav).toHaveCount(0);
			} else {
				await expect(primaryNav).toBeVisible();
				await expect(toggle).toBeHidden();
				await expect(primaryNav.locator('a')).toHaveCount(10);
				await expect(primaryNav.getByRole('link', { name: 'Contact', exact: true })).toHaveCount(0);
				expect(geometry.primary.left).toBeGreaterThanOrEqual(geometry.brand.right);
				expect(geometry.primary.right).toBeLessThanOrEqual(geometry.controls.left);
			}
		});
	}
});

test('disclosure scrolls to and activates CV in a short landscape viewport', async ({ page }) => {
	await page.setViewportSize({ width: 844, height: 390 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Open menu', exact: true }).click();

	const mobileNav = page.locator('#mobile-nav');
	await expect(mobileNav).toBeVisible();
	await expect
		.poll(() => mobileNav.evaluate((menu) => getComputedStyle(menu).overflowY))
		.not.toBe('hidden');
	const dimensions = await mobileNav.evaluate((menu) => {
		const box = menu.getBoundingClientRect();
		return {
			top: box.top,
			bottom: box.bottom,
			clientHeight: menu.clientHeight,
			scrollHeight: menu.scrollHeight,
			overflowY: getComputedStyle(menu).overflowY
		};
	});
	expect(dimensions.bottom).toBeLessThanOrEqual(390);
	expect(dimensions.clientHeight).toBeLessThanOrEqual(390 - dimensions.top);
	expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
	expect(dimensions.overflowY).toBe('auto');

	const cvLink = mobileNav.getByRole('link', { name: 'CV', exact: true });
	await cvLink.scrollIntoViewIfNeeded();
	await expect(cvLink).toBeInViewport();
	await cvLink.click();
	await expect(page).toHaveURL(/\/cv$/);
});

test('crossing into 2xl closes the disclosure and restores page scrolling', async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto('/');
	await page.getByRole('button', { name: 'Open menu', exact: true }).click();
	await expect(page.locator('#mobile-nav')).toBeVisible();
	expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

	await page.setViewportSize({ width: 1536, height: 900 });
	await expect(page.locator('#mobile-nav')).toHaveCount(0);
	await expect(page.locator('nav[aria-label="Primary"]')).toBeVisible();
	expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

	await page.evaluate(() => window.scrollTo(0, 500));
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
