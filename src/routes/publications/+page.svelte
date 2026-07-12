<script lang="ts">
	import { Container, Section, PublicationCard, Link, Seo } from '$lib/components';
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

	// Group the filtered list by year, preserving the descending-year order
	// already established by the load function's sortByYearDesc.
	const grouped = $derived.by(() => {
		const groups = new Map<number, Publication[]>();
		for (const p of filtered) {
			const list = groups.get(p.year);
			if (list) list.push(p);
			else groups.set(p.year, [p]);
		}
		return [...groups.entries()].sort((a, b) => b[0] - a[0]);
	});
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

			<div class="mt-12 space-y-16">
				{#each grouped as [year, items] (year)}
					<section>
						<h2
							class="font-display text-fg border-border mb-6 border-b pb-2 text-2xl tracking-tight"
						>
							{year}
							<span class="font-mono text-fg-muted ml-2 align-middle text-sm">
								{items.length}
								{items.length === 1 ? 'entry' : 'entries'}
							</span>
						</h2>
						<div class="grid gap-6 md:grid-cols-2">
							{#each items as publication (publication.slug)}
								<PublicationCard {publication} />
							{/each}
						</div>
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
