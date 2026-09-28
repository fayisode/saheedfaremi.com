<script lang="ts">
	import { Container, Section, SocialLinks, Button, Seo } from '$lib/components';
	import type { Track } from '$lib/cv/tracks';
	import type {
		Award,
		Education,
		Experience,
		Project,
		Publication,
		Talk
	} from '$lib/content/schemas';

	let {
		data
	}: {
		data: {
			tracks: readonly Track[];
			experience: Experience[];
			education: Education[];
			awards: Award[];
			peerReviewed: Publication[];
			otherResearch: Publication[];
			talks: Talk[];
			projects: Project[];
		};
	} = $props();

	const EMAIL = 'saheedfaremi@gmail.com';

	// Single Data Scientist profile: one track, no selector.
	const active = $derived(data.tracks[0]);
</script>

<Seo
	title="CV · Saheed Faremi"
	description="Curriculum vitae for Saheed Faremi: data scientist and founding engineer shipping production ML and LLM systems, and PhD researcher in deep learning for EEG at University College Cork."
/>

{#snippet publicationList(items: Publication[])}
	<ol class="mt-4 space-y-3">
		{#each items as p (p.slug)}
			<li class="text-sm">
				<!-- Full author list in published order, candidate's name in bold
					(academic CV convention). Match on "Saheed", not the surname:
					a co-author on the malaria paper is also a Faremi. -->
				{#each p.authors as author, i (author)}
					{@const own = /saheed/i.test(author)}
					{#if own}<strong class="text-fg font-semibold">{author}</strong>{:else}<span
							class="text-fg-soft">{author}</span
						>{/if}{i < p.authors.length - 1 ? ', ' : ''}
				{/each}
				<span class="text-fg-soft">"{p.title}".</span>
				{#if p.venue}<em class="text-fg-soft">{p.venue},</em>{/if}
				<span class="text-fg-muted">{p.year}.</span>
				{#if p.doi}<a class="text-accent" href={`https://doi.org/${p.doi}`}>doi:{p.doi}</a>{/if}
				{#if p.code}<a class="text-accent ml-2" href={p.code}>code</a>{/if}
			</li>
		{/each}
	</ol>
{/snippet}

<Container width="default" class="cv-page">
	<header class="cv-header py-12">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Curriculum Vitae</p>
		<h1 class="font-display text-fg mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
			Saheed Faremi
		</h1>
		<p class="text-fg-soft mt-3 text-lg">
			Data scientist & founding engineer · PhD researcher, deep learning for EEG
		</p>
		<p class="text-fg-muted mt-1 text-sm">Production ML & LLM systems, owned end to end</p>
		<p class="text-fg-soft mt-4 font-mono text-sm">
			<a class="text-accent" href={`mailto:${EMAIL}`}>{EMAIL}</a>
			· Based in Dublin, Ireland
		</p>
		<SocialLinks class="mt-4" />

		<p class="text-fg-soft mt-6 max-w-2xl text-sm leading-relaxed">{active.summary}</p>

		<div class="mt-6 flex flex-wrap gap-2">
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
	</header>

	<Section spacing="tight" labelledById="cv-exp">
		<h2 id="cv-exp" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			Experience
		</h2>
		<ol class="mt-6 space-y-6 border-l border-border pl-6">
			{#each data.experience as item (item.slug)}
				<li class="cv-exp-item">
					<div class="flex flex-wrap items-baseline justify-between gap-2">
						<h3 class="font-display text-fg text-xl">
							{item.role} · <span class="text-fg-soft">{item.organization}</span>
						</h3>
						<p class="font-mono text-fg-muted text-xs tracking-[0.15em]">
							{#if item.startedAt}{item.startedAt}{item.endedAt
									? ` → ${item.endedAt}`
									: ' → present'}{:else if item.endedAt}{item.endedAt}{:else}Present{/if}
						</p>
					</div>
					{#if item.summary}<p class="text-fg-soft mt-2 text-sm">{item.summary}</p>{/if}
					{#if item.highlights.length}
						<ul class="text-fg-soft mt-2 list-disc space-y-1 pl-5 text-sm">
							{#each item.highlights as h (h)}<li>{h}</li>{/each}
						</ul>
					{/if}
				</li>
			{:else}
				<li class="text-fg-muted text-sm italic">No experience listed yet.</li>
			{/each}
		</ol>
	</Section>

	{#if data.peerReviewed.length || data.otherResearch.length}
		<Section spacing="tight" labelledById="cv-pubs">
			<h2 id="cv-pubs" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
				Publications
			</h2>
			{#if data.peerReviewed.length}
				<h3 class="text-fg mt-6 text-sm font-semibold">Peer-reviewed</h3>
				{@render publicationList(data.peerReviewed)}
			{/if}
			{#if data.otherResearch.length}
				<h3 class="text-fg mt-6 text-sm font-semibold">
					Preprints, registered protocols & doctoral work
				</h3>
				{@render publicationList(data.otherResearch)}
			{/if}
		</Section>
	{/if}

	<Section spacing="tight" labelledById="cv-edu">
		<h2 id="cv-edu" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			Education
		</h2>
		<ol class="mt-6 space-y-6 border-l border-border pl-6">
			{#each data.education as item (item.slug)}
				<li>
					<div class="flex flex-wrap items-baseline justify-between gap-2">
						<h3 class="font-display text-fg text-xl">
							{item.degree} · <span class="text-fg-soft">{item.institution}</span>
						</h3>
						<p class="font-mono text-fg-muted text-xs tracking-[0.15em]">
							{#if item.endedAt}
								{item.startedAt ? `${item.startedAt} → ` : ''}{item.endedAt}
							{:else if item.progressionStatus === 'in-progress'}
								{item.startedAt ? `${item.startedAt} → present` : 'In progress'}
							{:else if item.startedAt}
								{item.startedAt}
							{/if}
						</p>
					</div>
					{#if item.field}<p class="text-fg-soft mt-2 text-sm">{item.field}</p>{/if}
					{#if item.advisor}
						<p class="font-mono text-fg-muted mt-1 text-xs tracking-[0.1em]">
							Supervisor: {item.advisor}
						</p>
					{/if}
					{#if item.summary}<p class="text-fg-soft mt-2 text-sm">{item.summary}</p>{/if}
				</li>
			{:else}
				<li class="text-fg-muted text-sm italic">No education listed yet.</li>
			{/each}
		</ol>
	</Section>

	<Section spacing="tight" labelledById="cv-skills">
		<h2 id="cv-skills" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			Technical skills
		</h2>
		<dl class="mt-6 space-y-4">
			{#each active.skillGroups as group (group.group)}
				<div class="grid gap-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-4">
					<dt class="font-mono text-fg-soft text-xs tracking-[0.15em] uppercase sm:pt-0.5">
						{group.group}
					</dt>
					<dd class="text-fg-soft text-sm">{group.items.join(' · ')}</dd>
				</div>
			{/each}
		</dl>
	</Section>

	{#if data.awards.length}
		<Section spacing="tight" labelledById="cv-awards">
			<h2 id="cv-awards" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
				Recognition
			</h2>
			<ol class="mt-6 space-y-4">
				{#each data.awards as a (a.slug)}
					<li>
						<p class="text-fg">
							<span class="font-display text-fg">{a.title}</span>
							<span class="text-fg-muted font-mono ml-2 text-xs">{a.year}</span>
						</p>
						<p class="text-fg-soft mt-1 text-sm">
							{a.organization}{a.prize ? ` · ${a.prize}` : ''}
						</p>
					</li>
				{/each}
			</ol>
		</Section>
	{/if}

	{#if data.projects.length}
		<Section spacing="tight" labelledById="cv-projects">
			<h2 id="cv-projects" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
				Selected projects
			</h2>
			<ol class="mt-6 space-y-4">
				{#each data.projects as p (p.slug)}
					<li>
						<p class="font-display text-fg">{p.title}</p>
						<p class="text-fg-soft mt-1 text-sm">
							{p.summary ?? ''}{p.role ? ` · ${p.role}` : ''}
						</p>
						{#if p.tech.length}
							<p class="font-mono text-fg-muted mt-1 text-xs">{p.tech.join(' · ')}</p>
						{/if}
					</li>
				{/each}
			</ol>
		</Section>
	{/if}

	{#if data.talks.length}
		<Section spacing="tight" labelledById="cv-talks">
			<h2 id="cv-talks" class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
				Talks
			</h2>
			<ol class="mt-6 space-y-3">
				{#each data.talks as t (t.slug)}
					<li class="text-sm">
						<span class="text-fg">{t.title}</span>
						<span class="text-fg-soft">· {t.event},</span>
						<span class="text-fg-muted">{t.year}</span>
					</li>
				{/each}
			</ol>
		</Section>
	{/if}
</Container>

<style>
	@media print {
		/* Force a printable, ink-friendly layout regardless of theme */
		:global(html) {
			background: white !important;
			color: black !important;
		}
		:global(.hero-canvas-frame),
		:global(header[class*='fixed']),
		:global(.cv-print-btn),
		:global(.skip-link),
		:global(footer),
		:global(nav[aria-label='Primary']) {
			display: none !important;
		}
		:global(a) {
			color: black !important;
			text-decoration: underline;
		}
		:global(.font-display),
		:global(.font-mono) {
			color: black !important;
		}
		:global(.text-fg),
		:global(.text-fg-soft),
		:global(.text-fg-muted),
		:global(.text-accent) {
			color: black !important;
		}
		:global(.bg-bg-soft),
		:global(.border-border) {
			background: white !important;
			border-color: #ccc !important;
		}
		:global(.cv-header) {
			padding-top: 0.5rem !important;
			padding-bottom: 1rem !important;
		}
		:global(section[class*='py-']) {
			padding-top: 0.75rem !important;
			padding-bottom: 0.75rem !important;
		}
		/* Sections may flow across pages (avoiding them forces each long section
			to a fresh page and strands page 1 with the header alone); headings and
			list items stay glued to their content instead. */
		:global(h2),
		:global(h3) {
			break-after: avoid;
		}
		:global(li) {
			break-inside: avoid;
		}
		/* Job entries run longer than the space left on a page; keeping them
			unsplittable strands most of page 1 blank. Split between bullets
			instead (individual bullets still avoid breaking via the rule above). */
		:global(.cv-exp-item) {
			break-inside: auto;
		}
	}
</style>
