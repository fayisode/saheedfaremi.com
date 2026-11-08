<script lang="ts">
	import { AcademicPublicationList, Container, SocialLinks, Button, Seo } from '$lib/components';
	import { cvHighlights } from '$lib/cv/experience';
	import type { Track } from '$lib/cv/tracks';
	import type { Education, Experience, Publication, Talk } from '$lib/content/schemas';

	let {
		data
	}: {
		data: {
			tracks: readonly Track[];
			experience: Experience[];
			education: Education[];
			peerReviewed: Publication[];
			otherResearch: Publication[];
			underReview: Publication[];
			talks: Talk[];
		};
	} = $props();

	const EMAIL = 'saheedfaremi@gmail.com';
	const CV_PROFILES = ['GitHub', 'LinkedIn', 'Google Scholar', 'ORCID'];
	const active = $derived(data.tracks[0]);

	function educationDegree(item: Education): string {
		if (item.slug === 'msc-cs-tu-dublin') return 'MSc Computer Science';
		if (item.slug === 'bsc-it-uneswa') return 'BSc Information Technology';
		return item.degree;
	}

	function educationDate(item: Education): string {
		if (item.progressionStatus === 'in-progress') return 'In progress';
		if (item.slug === 'msc-cs-tu-dublin') return 'Completed 2025';
		return item.endedAt ?? '';
	}

	function educationDetails(item: Education): string {
		if (item.slug === 'phd-eeg-microstates') {
			return `${item.field}. Supervisor: ${item.advisor}.`;
		}
		if (item.slug === 'msc-cs-tu-dublin') {
			return 'Machine learning, deep learning, data mining, visualisation and statistics. 4.0/4.0 GPA (80/100).';
		}
		if (item.slug === 'bsc-it-uneswa') {
			return 'Second Class Honours, Upper Division (2.1).';
		}
		return [item.field, item.summary].filter(Boolean).join('. ');
	}

	function experienceRole(item: Experience): string {
		return item.role.replace(' → ', ' to ');
	}

	function experienceDate(item: Experience): string {
		if (item.slug === 'aicl-lab-phd-researcher') return 'In progress';
		if (item.slug === 'etihuku-curnance') return 'May 2021 to present';
		if (item.startedAt)
			return `${item.startedAt}${item.endedAt ? ` to ${item.endedAt}` : ' to present'}`;
		return item.endedAt ?? '';
	}
</script>

<Seo title="CV · Saheed Faremi" description={active.summary} />

<Container width="default" class="cv-page">
	<header class="cv-header">
		<h1 class="cv-name text-fg">Saheed Faremi</h1>
		<p class="cv-role text-fg-soft">
			PhD researcher, deep generative models for EEG · Data scientist
		</p>
		<p class="cv-contact text-fg-soft">
			<a class="text-accent" href={`mailto:${EMAIL}`}>{EMAIL}</a> · Dublin, Ireland
		</p>
		<SocialLinks class="cv-social-links" only={CV_PROFILES} />
		<p class="cv-summary text-fg-soft">{active.summary}</p>
		<div class="cv-actions">
			<a
				href={`/${active.pdfFile}`}
				download
				class="cv-print-btn font-mono text-fg-soft hover:border-accent hover:text-accent rounded-soft
					border-border inline-flex h-8 items-center gap-2 border px-3 text-xs tracking-wide
					transition-[background-color,color,border-color] duration-[var(--duration-fast)]
					focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
			>
				Download PDF
			</a>
			<Button variant="ghost" size="sm" class="cv-print-btn" onclick={() => window.print()}>
				Print
			</Button>
		</div>
		<p class="cv-updated text-fg-muted">Last updated {active.lastUpdated}</p>
	</header>

	<section class="cv-section" aria-labelledby="cv-research">
		<h2 id="cv-research" class="cv-section-heading text-fg">Research areas</h2>
		<dl class="cv-research-groups">
			{#each active.researchAreaGroups as group (group.group)}
				<div class="research-group">
					<dt class="text-fg">{group.group}</dt>
					<dd class="text-fg-soft">{group.items.join('; ')}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="cv-section" aria-labelledby="cv-skills">
		<h2 id="cv-skills" class="cv-section-heading text-fg">Technical skills</h2>
		<dl class="cv-skills-list">
			{#each active.skillGroups as group (group.group)}
				<div class="cv-skill-row">
					<dt class="text-fg">{group.group}:</dt>
					<dd class="text-fg-soft">{group.items.join('; ')}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section class="cv-section" aria-labelledby="cv-education">
		<h2 id="cv-education" class="cv-section-heading text-fg">Education</h2>
		<ol class="cv-entry-list">
			{#each data.education as item (item.slug)}
				<li class="cv-entry cv-education-item">
					<div class="cv-entry-header">
						<h3 class="text-fg">
							{educationDegree(item)} · <span class="text-fg-soft">{item.institution}</span>
						</h3>
						<p class="cv-date text-fg-muted">{educationDate(item)}</p>
					</div>
					<p class="cv-detail text-fg-soft">{educationDetails(item)}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section class="cv-section" aria-labelledby="cv-experience">
		<h2 id="cv-experience" class="cv-section-heading text-fg">Experience</h2>
		<ol class="cv-entry-list">
			{#each data.experience as item (item.slug)}
				<li class="cv-entry cv-exp-item">
					<div class="cv-entry-header">
						<h3 class="text-fg">
							{experienceRole(item)} · <span class="text-fg-soft">{item.organization}</span>
						</h3>
						<p class="cv-date text-fg-muted">{experienceDate(item)}</p>
					</div>
					<ul class="cv-highlights text-fg-soft">
						{#each cvHighlights(item) as highlight (highlight)}
							<li>{highlight}</li>
						{/each}
					</ul>
				</li>
			{/each}
		</ol>
	</section>

	{#if data.peerReviewed.length || data.otherResearch.length || data.underReview.length}
		<section id="cv-publications" class="cv-section" aria-labelledby="cv-pubs">
			<h2 id="cv-pubs" class="cv-section-heading text-fg">Publications</h2>
			{#if data.peerReviewed.length}
				<section id="cv-peer-reviewed" aria-labelledby="cv-peer-reviewed-heading">
					<h3 id="cv-peer-reviewed-heading" class="cv-subheading text-fg">Peer-reviewed</h3>
					<AcademicPublicationList
						items={data.peerReviewed}
						start={1}
						showBibtex={false}
						linkOrigin="https://saheedfaremi.com"
					/>
				</section>
			{/if}
			{#if data.otherResearch.length}
				<section
					id="cv-other-research"
					aria-labelledby="cv-other-research-heading"
					class="cv-other-research"
				>
					<h3 id="cv-other-research-heading" class="cv-subheading text-fg">
						Preprints, registered protocols &amp; doctoral work
					</h3>
					<AcademicPublicationList
						items={data.otherResearch}
						start={data.peerReviewed.length + 1}
						showBibtex={false}
						linkOrigin="https://saheedfaremi.com"
					/>
				</section>
			{/if}
			{#if data.underReview.length}
				<section
					id="cv-under-review"
					aria-labelledby="cv-under-review-heading"
					class="cv-other-research"
				>
					<h3 id="cv-under-review-heading" class="cv-subheading text-fg">
						Under review and manuscripts
					</h3>
					<AcademicPublicationList
						items={data.underReview}
						start={data.peerReviewed.length + data.otherResearch.length + 1}
						showBibtex={false}
						linkOrigin="https://saheedfaremi.com"
					/>
				</section>
			{/if}
		</section>
	{/if}

	{#if data.talks.length}
		<section class="cv-section" aria-labelledby="cv-talks">
			<h2 id="cv-talks" class="cv-section-heading text-fg">Talks</h2>
			<ol class="cv-compact-list">
				{#each data.talks as talk (talk.slug)}
					<li>
						<a class="text-fg hover:text-accent" href={talk.url}>{talk.title}</a>.
						<p class="text-fg-soft">
							{talk.event}{talk.location ? `, ${talk.location}` : ''}, {talk.year}
						</p>
					</li>
				{/each}
			</ol>
		</section>
	{/if}
</Container>

<style>
	:global(.cv-page) {
		max-width: 54rem;
		padding-bottom: 3rem;
		font-family: var(--font-display);
		line-height: 1.55;
		overflow-wrap: break-word;
	}

	.cv-header {
		padding-block: 2.5rem 1.5rem;
		text-align: center;
	}

	.cv-name {
		font-size: clamp(2rem, 5vw, 2.75rem);
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.cv-role {
		margin-top: 0.5rem;
		font-size: 1.125rem;
	}

	.cv-contact {
		margin-top: 0.375rem;
		font-size: 0.9375rem;
	}

	:global(.cv-social-links) {
		justify-content: center;
		gap: 0.5rem 1rem;
		margin-top: 0.75rem;
	}

	:global(.cv-social-links .profile-pill) {
		min-height: 0;
		padding: 0.25rem 0;
		border: 0;
		border-radius: 0;
		font-family: inherit;
		letter-spacing: normal;
	}

	:global(.cv-social-links .profile-icon) {
		display: none;
	}

	.cv-summary {
		max-width: 46rem;
		margin: 1rem auto 0;
	}

	.cv-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.25rem;
	}

	.cv-updated {
		margin-top: 0.75rem;
		font-size: 0.875rem;
	}

	.cv-section {
		padding-block: 1.5rem;
	}

	.cv-section-heading {
		padding-bottom: 0.375rem;
		border-bottom: 1px solid var(--color-border);
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.cv-research-groups,
	.cv-skills-list,
	.cv-entry-list,
	.cv-compact-list {
		margin-top: 1rem;
	}

	.cv-skill-row {
		display: block;
	}

	.cv-skill-row dt {
		display: inline;
		font-weight: 700;
	}

	.cv-skill-row dd {
		display: inline;
		margin: 0;
	}

	.cv-skill-row + .cv-skill-row {
		margin-top: 0.625rem;
	}

	.research-group dt {
		display: inline;
		font-weight: 700;
	}

	.research-group dd {
		display: inline;
		margin: 0;
	}

	.research-group + .research-group {
		margin-top: 0.625rem;
	}

	.cv-entry-list {
		display: block;
		padding: 0;
		border: 0;
		list-style: none;
	}

	.cv-entry + .cv-entry,
	.cv-compact-list > li + li {
		margin-top: 1.25rem;
	}

	.cv-entry-header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.125rem 1rem;
	}

	.cv-entry-header h3 {
		min-width: 0;
		font-size: 1.0625rem;
		font-weight: 700;
	}

	.cv-date {
		flex-shrink: 0;
		font-size: 0.9375rem;
		white-space: nowrap;
	}

	.cv-date:empty {
		display: none;
	}

	.cv-detail {
		margin-top: 0.25rem;
	}

	.cv-highlights {
		margin-top: 0.5rem;
		padding-left: 1.35rem;
		list-style: disc;
	}

	.cv-highlights > li + li {
		margin-top: 0.375rem;
	}

	.cv-subheading {
		margin-top: 1rem;
		font-weight: 700;
	}

	.cv-other-research {
		margin-top: 1.5rem;
	}

	:global(.cv-page .publication-badge),
	:global(.cv-page .publication-bibtex) {
		display: none;
	}

	:global(.cv-page .publication-links) {
		font-family: inherit;
	}

	@page {
		size: A4;
		margin: 0.75in;
	}

	@media print {
		:global(html),
		:global(body) {
			background: white !important;
			color: black !important;
		}

		:global(body) {
			font-size: 11pt !important;
			line-height: 1.3 !important;
		}

		:global(header[class*='fixed']),
		:global(footer),
		:global(nav[aria-label='Primary']),
		:global(.hero-canvas-frame),
		:global(.skip-link),
		.cv-actions,
		:global(.cv-page .publication-bibtex),
		:global(.cv-page .publication-badge) {
			display: none !important;
		}

		:global(.cv-page) {
			max-width: none !important;
			padding: 0 !important;
			font-family: Charter, 'Bitstream Charter', Palatino, Georgia, serif;
			font-size: 11pt;
		}

		:global(.cv-page h1),
		:global(.cv-page h2),
		:global(.cv-page h3),
		:global(.cv-page h4),
		:global(.cv-page p),
		:global(.cv-page li),
		:global(.cv-page dt),
		:global(.cv-page dd),
		:global(.cv-page span),
		:global(.cv-page a),
		:global(.cv-page em),
		:global(.cv-page strong) {
			color: black !important;
		}

		:global(.cv-page a) {
			text-decoration: none;
		}

		.cv-header {
			padding: 0 0 8pt !important;
		}

		.cv-name {
			font-size: 20pt !important;
		}

		.cv-role {
			margin-top: 2pt;
			font-size: 11pt;
		}

		.cv-contact,
		.cv-summary,
		.cv-updated {
			margin-top: 3pt;
		}

		.cv-summary {
			max-width: none;
		}

		:global(.cv-social-links) {
			margin-top: 3pt;
		}

		.cv-section {
			padding-block: 7pt !important;
		}

		.cv-section-heading {
			padding-bottom: 2pt;
			border-color: black !important;
			font-size: 11.5pt;
			break-after: avoid;
		}

		.cv-research-groups,
		.cv-skills-list,
		.cv-entry-list,
		.cv-compact-list {
			margin-top: 4pt !important;
		}

		.cv-entry-list,
		.cv-skill-row {
			display: block !important;
			grid-template-columns: none !important;
		}

		.cv-entry + .cv-entry,
		.cv-skill-row + .cv-skill-row,
		.cv-compact-list > li + li {
			margin-top: 6pt !important;
		}

		.cv-entry-header h3,
		.cv-subheading,
		:global(.cv-page h4) {
			font-size: 11pt !important;
			break-after: avoid;
		}

		.cv-detail,
		.cv-highlights {
			margin-top: 2pt !important;
		}

		.cv-highlights {
			padding-left: 14pt;
		}

		.cv-highlights > li + li {
			margin-top: 2pt;
		}

		.cv-education-item,
		.cv-skill-row,
		.cv-compact-list > li,
		.cv-highlights > li,
		:global(.cv-page .publication-entry) {
			break-inside: avoid;
		}

		.cv-exp-item {
			break-inside: auto;
		}

		:global(.cv-page .academic-publication-list) {
			margin-top: 4pt !important;
		}

		:global(.cv-page .publication-entry) {
			padding-block: 4pt !important;
		}

		:global(.cv-page .publication-entry > div) {
			display: block !important;
		}

		:global(.cv-page .publication-authors),
		:global(.cv-page .publication-venue),
		:global(.cv-page .publication-links) {
			margin-top: 2pt !important;
		}

		.cv-other-research {
			margin-top: 8pt !important;
		}
	}
</style>
