<script lang="ts">
	import { browser } from '$app/environment';
	import { Container, Section, Tag, Link, Button, Seo } from '$lib/components';
	import { toBibtex } from '$lib/content/loader';
	import type { Publication } from '$lib/content/schemas';

	let { data }: { data: { publications: Publication[] } } = $props();

	// Derive the kind union from the Publication type so the filter tracks the
	// schema without importing the Zod enum value (which is a runtime object,
	// not a type).
	type Kind = Publication['kind'];
	type Filter = 'all' | Kind;
	let filter = $state<Filter>('all');

	const counts = $derived.by(() => {
		const map: Record<string, number> = { all: data.publications.length };
		for (const p of data.publications) {
			map[p.kind] = (map[p.kind] ?? 0) + 1;
		}
		return map;
	});

	// Fixed order for the kinds we know about; only render chips with count > 0.
	const knownKinds: Kind[] = [
		'journal',
		'conference',
		'workshop',
		'preprint',
		'thesis',
		'book-chapter'
	];

	const visibleFilters: Filter[] = ['all', ...knownKinds.filter((kind) => (counts[kind] ?? 0) > 0)];

	const filtered = $derived(
		filter === 'all' ? data.publications : data.publications.filter((p) => p.kind === filter)
	);

	// Continuous descending numbering across the whole filtered list, newest
	// first, so entry numbers read like a classic bibliography index.
	const numbers = $derived(new Map(filtered.map((p, i) => [p.slug, filtered.length - i])));

	// Group the filtered list by year, preserving the descending-year order
	// already established by the load function's sortByYearDesc. Returns an
	// array of [year, items] pairs sorted by year descending.
	const grouped = $derived.by(() => {
		const groups: Record<number, Publication[]> = {};
		for (const p of filtered) {
			(groups[p.year] ??= []).push(p);
		}
		return Object.entries(groups)
			.map(([year, items]) => [Number(year), items] as [number, Publication[]])
			.sort((a, b) => b[0] - a[0]);
	});

	function bibtexOf(p: Publication): string {
		return p.bibtex ?? toBibtex(p);
	}

	// Human label for an external link, derived from the host so the
	// availability row reads like a bibliography (arXiv, OSF, Springer, ...).
	function linkLabel(url: string): string {
		try {
			const host = new URL(url).hostname.replace(/^www\./, '');
			if (host.includes('arxiv.org')) return 'arXiv';
			if (host.includes('osf.io')) return 'OSF';
			if (host.includes('springer.com')) return 'Springer';
			if (host.includes('researchgate.net')) return 'ResearchGate';
			if (host.includes('doi.org')) return 'Publisher';
			return 'Read online';
		} catch {
			return 'Read online';
		}
	}

	function hasLinks(p: Publication): boolean {
		return Boolean(p.doi || p.url || p.pdf || p.code);
	}

	// Per-entry copy feedback: tracks which slug was last copied.
	let copiedSlug = $state<string | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;
	async function copyBibtex(slug: string, text: string) {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(text);
			copiedSlug = slug;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => (copiedSlug = null), 1800);
		} catch {
			// clipboard can fail without HTTPS / in private mode; the <pre> stays
			// selectable as a fallback.
		}
	}
</script>

<Seo
	title="Publications · Saheed Faremi"
	description="Publications and preprints by Saheed Faremi on EEG microstates, variational autoencoders, and machine learning for health."
/>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Publications"
		heading="Preprints, papers, and citable work."
		labelledById="publications-heading"
	>
		{#if data.publications.length === 0}
			<div class="mt-12 max-w-2xl space-y-4">
				<p class="text-fg-soft text-lg leading-relaxed">
					Doctoral work on EEG microstates with deep generative models is in progress. Preprints and
					papers will appear here as they land.
				</p>
				<p class="text-fg-soft text-base">
					Until then, the
					<Link href="/#research" variant="inline">research section</Link>
					on the home page sketches the approach.
				</p>
			</div>
		{:else}
			<!-- Filter chip row. Pure client-side filter · works only with JS. Without JS,
			     the list below renders all publications (default state), which is correct. -->
			<div class="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
				{#each visibleFilters as kind (kind)}
					{@const isActive = filter === kind}
					<button
						type="button"
						onclick={() => (filter = kind)}
						aria-pressed={isActive}
						class="rounded-pill border px-3 py-1 font-mono text-xs tracking-wide
							transition-[background-color,border-color,color] duration-[var(--duration-fast)]
							focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
							{isActive
							? 'bg-accent text-bg border-accent'
							: 'border-border text-fg-soft hover:border-accent hover:text-fg'}"
					>
						{kind}
						<span class="ml-1 opacity-60">({counts[kind]})</span>
					</button>
				{/each}
			</div>

			<div class="mt-12 space-y-14">
				{#each grouped as [year, items] (year)}
					<section>
						<h2
							class="font-display text-fg border-border mb-2 border-b pb-2 text-2xl tracking-tight"
						>
							{year}
							<span class="font-mono text-fg-muted ml-2 align-middle text-sm">
								{items.length}
								{items.length === 1 ? 'entry' : 'entries'}
							</span>
						</h2>
						<ol class="divide-border divide-y">
							{#each items as publication (publication.slug)}
								{@const isDraft = publication.status === 'draft'}
								<li class="flex gap-4 py-6 sm:gap-8">
									<span
										class="font-mono text-fg-muted w-8 shrink-0 pt-1 text-right text-sm select-none"
										aria-hidden="true">{numbers.get(publication.slug)}</span
									>
									<div class="min-w-0 flex-1">
										<p class="font-mono text-fg-muted text-xs tracking-[0.05em]">
											{publication.authors.join(', ')}
										</p>
										<h3 class="mt-1.5">
											<a
												href={`/publications/${publication.slug}`}
												class="font-display text-fg hover:text-accent text-lg leading-snug tracking-tight
													transition-colors duration-[var(--duration-fast)] focus-visible:outline-2
													focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-xl"
											>
												{publication.title}
											</a>
											{#if isDraft}
												<span
													class="font-mono text-fg-muted bg-bg-soft rounded-pill border-border ml-2 inline-block
														border px-2 py-0.5 align-middle text-[10px] tracking-[0.2em] uppercase">Draft</span
												>
											{/if}
										</h3>
										<p class="text-fg-soft mt-1 text-sm">
											{#if publication.venue}<em>{publication.venue}</em>,{/if}
											{publication.year}
										</p>
										<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
											<Tag>{publication.kind}</Tag>
											{#if hasLinks(publication)}
												<span class="font-mono text-fg-muted text-[10px] tracking-[0.2em] uppercase"
													>Available</span
												>
											{/if}
											{#if publication.doi}
												<Link href={`https://doi.org/${publication.doi}`} variant="inline">DOI</Link
												>
											{/if}
											{#if publication.url}
												<Link href={publication.url} variant="inline"
													>{linkLabel(publication.url)}</Link
												>
											{/if}
											{#if publication.pdf}
												<Link href={publication.pdf} variant="inline">PDF</Link>
											{/if}
											{#if publication.code}
												<Link href={publication.code} variant="inline">Code</Link>
											{/if}
										</div>
										{#if publication.tags.length}
											<p class="font-mono text-fg-muted mt-3 text-xs leading-relaxed">
												{publication.tags.join(' · ')}
											</p>
										{/if}
										<details class="group/bib mt-3">
											<summary
												class="font-mono text-fg-muted hover:text-fg inline-flex cursor-pointer items-center
													gap-1 text-xs tracking-[0.15em] uppercase transition-colors
													duration-[var(--duration-fast)] focus-visible:outline-2
													focus-visible:outline-offset-2 focus-visible:outline-accent"
											>
												<span class="group-open/bib:hidden">BibTeX ↓</span>
												<span class="hidden group-open/bib:inline">BibTeX ↑</span>
											</summary>
											<div class="rounded-card border-border bg-bg-soft relative mt-2 border p-4">
												<Button
													variant="ghost"
													size="sm"
													onclick={() => copyBibtex(publication.slug, bibtexOf(publication))}
													class="absolute top-3 right-3"
													aria-live="polite"
												>
													{copiedSlug === publication.slug ? 'Copied ✓' : 'Copy'}
												</Button>
												<pre
													class="text-fg-soft overflow-x-auto font-mono text-xs leading-relaxed">{bibtexOf(
														publication
													)}</pre>
											</div>
										</details>
									</div>
								</li>
							{/each}
						</ol>
					</section>
				{/each}
			</div>

			{#if grouped.length === 0}
				<p class="text-fg-muted mt-12 text-center text-sm">
					No publications match the current filter.
				</p>
			{/if}
		{/if}
	</Section>
</Container>
