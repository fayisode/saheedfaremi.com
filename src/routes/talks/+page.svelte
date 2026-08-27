<script lang="ts">
	import { Container, Section, IndexRow, Link, Seo } from '$lib/components';
	import type { Talk } from '$lib/content/schemas';

	let { data }: { data: { talks: Talk[] } } = $props();

	// Continuous descending numbering, newest first.
	const numbers = $derived(new Map(data.talks.map((t, i) => [t.slug, data.talks.length - i])));
</script>

<Seo
	title="Talks · Saheed Faremi"
	description="Conference talks and presentations by Saheed Faremi."
/>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Talks"
		heading="Talks & presentations."
		labelledById="talks-heading"
	>
		{#if data.talks.length === 0}
			<p class="text-fg-soft mt-12 max-w-2xl text-lg leading-relaxed">
				No talks listed yet. Conference appearances, workshop presentations, and invited lectures
				will appear here when given.
			</p>
		{:else}
			<ol class="divide-border border-border mt-12 divide-y border-t">
				{#each data.talks as talk (talk.slug)}
					<IndexRow
						number={numbers.get(talk.slug) ?? 0}
						href={`/talks/${talk.slug}`}
						title={talk.title}
					>
						{#snippet overline()}{talk.year}{/snippet}
						{#snippet subline()}{talk.event}{talk.location ? ` · ${talk.location}` : ''}{/snippet}
						{#if talk.url || talk.recording || talk.slides}
							<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
								{#if talk.url}
									<Link href={talk.url} variant="inline">Event</Link>
								{/if}
								{#if talk.slides}
									<Link href={talk.slides} variant="inline">Slides</Link>
								{/if}
								{#if talk.recording}
									<Link href={talk.recording} variant="inline">Recording</Link>
								{/if}
							</div>
						{/if}
					</IndexRow>
				{/each}
			</ol>
		{/if}
	</Section>
</Container>
