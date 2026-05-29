<script lang="ts">
	import { Container, Section, SocialLinks, Seo } from '$lib/components';
	import TrackSelector from '$lib/cv/TrackSelector.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { DEFAULT_TRACK, type Track, type TrackKeyT } from '$lib/cv/tracks';
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
			defaultTrack: TrackKeyT;
			experience: Experience[];
			education: Education[];
			awards: Award[];
			publications: Publication[];
			talks: Talk[];
			projects: Project[];
		};
	} = $props();

	const EMAIL = 'saheedfaremi@gmail.com';

	// Track selector. The page is prerendered to one static file, so track state is a
	// pure render concern: default track is server-rendered, then on the client the
	// effect reads ?track for deep links and the buttons drive state + the querystring.
	let activeTrack = $state<TrackKeyT>(DEFAULT_TRACK);
	$effect(() => {
		const q = page.url.searchParams.get('track');
		const match = data.tracks.find((t) => t.key === q);
		if (match) activeTrack = match.key;
	});
	const active = $derived(data.tracks.find((t) => t.key === activeTrack) ?? data.tracks[0]);

	function selectTrack(key: TrackKeyT) {
		activeTrack = key;
		if (browser) goto(`?track=${key}`, { replaceState: false, noScroll: true, keepFocus: true });
	}
</script>

<Seo
	title="CV · Saheed Faremi"
	description="Curriculum vitae for Saheed Faremi: PhD-track EEG-microstate researcher and multi-domain software engineer. Switch emphasis between research, data science, and software."
/>

<Container width="default" class="cv-page">
	<header class="cv-header py-12">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Curriculum Vitae</p>
		<h1 class="font-display text-fg mt-4 text-4xl leading-tight tracking-tight sm:text-5xl">
			Saheed Faremi
		</h1>
		<p class="text-fg-soft mt-3 text-lg">
			PhD-track EEG-microstate researcher · multi-domain software engineer
		</p>
		<p class="text-fg-soft mt-4 font-mono text-sm">
			<a class="text-accent" href={`mailto:${EMAIL}`}>{EMAIL}</a>
			· Based in Dublin, Ireland
		</p>
		<SocialLinks class="mt-4" />

		<!-- Track selector: swaps the summary, skills emphasis, and selected work below.
		     Experience, education, recognition, publications, and talks stay constant. -->
		<div class="mt-6">
			<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Emphasis</p>
			<div class="mt-2">
				<TrackSelector tracks={data.tracks} active={activeTrack} onselect={selectTrack} />
			</div>
		</div>
		<p class="text-fg-soft mt-4 max-w-2xl text-sm leading-relaxed">{active.summary}</p>

		<div class="mt-6 flex flex-wrap gap-2">
			<a
				href={`/${active.pdfFile}`}
				download
				class="cv-print-btn font-mono text-fg-soft hover:text-fg hover:bg-bg-soft rounded-soft
					border-border inline-flex h-9 items-center gap-2 border px-3 text-xs
					tracking-[0.15em] uppercase transition-colors duration-[var(--duration-fast)]"
			>
				Download PDF
			</a>
			<button
				type="button"
				class="cv-print-btn font-mono text-fg-soft hover:text-fg hover:bg-bg-soft rounded-soft
					border-border inline-flex h-9 items-center gap-2 border px-3 text-xs
					tracking-[0.15em] uppercase transition-colors duration-[var(--duration-fast)]"
				onclick={() => window.print()}
			>
				Print
			</button>
		</div>
	</header>

	<Section spacing="tight" eyebrow="Experience" labelledById="cv-exp">
		<ol class="mt-6 space-y-6 border-l border-border pl-6">
			{#each data.experience as item (item.slug)}
				<li>
					<div class="flex flex-wrap items-baseline justify-between gap-2">
						<h3 class="font-display text-fg text-xl">
							{item.role} · <span class="text-fg-soft">{item.organization}</span>
						</h3>
						<p class="font-mono text-fg-muted text-xs tracking-[0.15em]">
							{item.startedAt ?? '·'}{item.endedAt ? ` → ${item.endedAt}` : ' → present'}
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

	<Section spacing="tight" eyebrow="Education" labelledById="cv-edu">
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
					{#if item.summary}<p class="text-fg-soft mt-2 text-sm">{item.summary}</p>{/if}
				</li>
			{:else}
				<li class="text-fg-muted text-sm italic">No education listed yet.</li>
			{/each}
		</ol>
	</Section>

	<Section spacing="tight" eyebrow="Technical skills" labelledById="cv-skills">
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

	<Section spacing="tight" eyebrow={`Selected for ${active.label.toLowerCase()}`} labelledById="cv-focus">
		<ul class="text-fg-soft mt-6 list-disc space-y-2 pl-5 text-sm">
			{#each active.highlightFocus as item (item)}<li>{item}</li>{/each}
		</ul>
		{#if active.featuredProjects.length}
			<ul class="mt-6 space-y-2">
				{#each active.featuredProjects as project (project)}
					<li class="text-fg text-sm">{project}</li>
				{/each}
			</ul>
		{/if}
	</Section>

	{#if data.awards.length}
		<Section spacing="tight" eyebrow="Recognition" labelledById="cv-awards">
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
		<Section spacing="tight" eyebrow="Selected projects" labelledById="cv-projects">
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

	{#if data.publications.length}
		<Section spacing="tight" eyebrow="Publications" labelledById="cv-pubs">
			<ol class="mt-6 space-y-3">
				{#each data.publications as p (p.slug)}
					<li class="text-sm">
						<span class="text-fg">{p.authors.join(', ')}</span>
						<span class="text-fg-soft">"{p.title}".</span>
						{#if p.venue}<em class="text-fg-soft">{p.venue},</em>{/if}
						<span class="text-fg-muted">{p.year}.</span>
						{#if p.doi}<a class="text-accent" href={`https://doi.org/${p.doi}`}>doi:{p.doi}</a>{/if}
					</li>
				{/each}
			</ol>
		</Section>
	{/if}

	{#if data.talks.length}
		<Section spacing="tight" eyebrow="Talks" labelledById="cv-talks">
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
		:global(section[class*='py-']) {
			padding-top: 1rem !important;
			padding-bottom: 1rem !important;
			break-inside: avoid;
		}
		:global(li) {
			break-inside: avoid;
		}
	}
</style>
