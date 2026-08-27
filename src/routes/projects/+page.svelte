<script lang="ts">
	import { Container, Section, IndexRow, Tag, Link, Seo } from '$lib/components';
	import type { Project } from '$lib/content/schemas';

	let { data }: { data: { projects: Project[] } } = $props();

	// Domain filter · defaults to "all". Counts derived from the current dataset
	// so the UI never claims a domain has projects it doesn't.
	type Filter = 'all' | Project['domain'];
	let filter = $state<Filter>('all');

	const counts = $derived.by(() => {
		const map: Record<string, number> = { all: data.projects.length };
		for (const p of data.projects) {
			map[p.domain] = (map[p.domain] ?? 0) + 1;
		}
		return map;
	});

	const visibleDomains: Filter[] = [
		'all',
		'fintech',
		'health',
		'education',
		'hr',
		'agriculture',
		'gis',
		'research',
		'civic',
		'consulting',
		'other'
	];

	const filtered = $derived(
		filter === 'all' ? data.projects : data.projects.filter((p) => p.domain === filter)
	);

	// Sort: featured first, then recently-started (or undated → top), then by title
	const sorted = $derived(
		[...filtered].sort((a, b) => {
			if (a.featured !== b.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
			const aStart = a.startedAt ?? '9999-99';
			const bStart = b.startedAt ?? '9999-99';
			if (aStart !== bStart) return bStart.localeCompare(aStart);
			return a.title.localeCompare(b.title);
		})
	);

	// Continuous descending numbering across the filtered list.
	const numbers = $derived(new Map(sorted.map((p, i) => [p.slug, sorted.length - i])));

	function hasLinks(p: Project): boolean {
		return Boolean(p.links.live || p.links.repo || p.links.caseStudy);
	}
</script>

<Seo
	title="Projects · Saheed Faremi"
	description="Production systems Saheed Faremi has built across fintech, healthcare, HR, education, agriculture, GIS, and research."
/>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Projects"
		heading="Production work across many verticals."
		labelledById="projects-heading"
	>
		<p class="text-fg-soft mt-4 max-w-2xl text-lg leading-relaxed">
			Each entry below summarises a project shipped or in-progress. Entries marked
			<span
				class="font-mono text-fg-muted bg-bg-soft rounded-pill border-border mx-1 inline-block
					border px-2 py-0.5 align-middle text-xs tracking-[0.2em] uppercase">Draft</span
			>
			are first-pass descriptions drawn from public repos and will be edited as I verify each one.
		</p>

		<!-- Filter chip row. Pure client-side filter · works only with JS. Without JS,
		     the list below renders all projects (default state), which is correct. -->
		<div class="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by domain">
			{#each visibleDomains as domain (domain)}
				{#if (counts[domain] ?? 0) > 0}
					{@const isActive = filter === domain}
					<button
						type="button"
						onclick={() => (filter = domain)}
						aria-pressed={isActive}
						class="rounded-pill border px-3 py-1 font-mono text-xs tracking-wide
							transition-[background-color,border-color,color] duration-[var(--duration-fast)]
							focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
							{isActive
							? 'bg-accent text-bg border-accent'
							: 'border-border text-fg-soft hover:border-accent hover:text-fg'}"
					>
						{domain}
						<span class="ml-1 opacity-60">({counts[domain]})</span>
					</button>
				{/if}
			{/each}
		</div>

		<ol class="divide-border border-border mt-12 divide-y border-t">
			{#each sorted as project (project.slug)}
				<IndexRow
					number={numbers.get(project.slug) ?? 0}
					href={`/projects/${project.slug}`}
					title={project.title}
					draft={project.status === 'draft'}
				>
					{#snippet overline()}{project.role ?? ''}{/snippet}
					{#snippet subline()}{project.summary ?? ''}{/snippet}
					<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
						<Tag>{project.domain}</Tag>
						{#if project.featured}
							<Tag variant="accent">featured</Tag>
						{/if}
						{#if hasLinks(project)}
							<span class="font-mono text-fg-muted text-[10px] tracking-[0.2em] uppercase"
								>Links</span
							>
						{/if}
						{#if project.links.live}
							<Link href={project.links.live} variant="inline">Live site</Link>
						{/if}
						{#if project.links.repo}
							<Link href={project.links.repo} variant="inline">Code</Link>
						{/if}
						{#if project.links.caseStudy}
							<Link href={project.links.caseStudy} variant="inline">Case study</Link>
						{/if}
					</div>
					{#if project.tech.length}
						<p class="font-mono text-fg-muted mt-3 text-xs leading-relaxed">
							{project.tech.join(' · ')}
						</p>
					{/if}
				</IndexRow>
			{/each}
		</ol>

		{#if sorted.length === 0}
			<p class="text-fg-muted mt-12 text-center text-sm">No projects match the current filter.</p>
		{/if}
	</Section>
</Container>
