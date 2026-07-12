<script lang="ts">
	import { Container, Section, AwardCard, NewsCard, Seo } from '$lib/components';
	import type { Award, News } from '$lib/content/schemas';

	type RecognitionEntry =
		| { type: 'award'; year: number; data: Award }
		| { type: 'news'; year: number; data: News };

	let {
		data
	}: {
		data: {
			entries: RecognitionEntry[];
			counts: { awards: number; news: number };
		};
	} = $props();
</script>

<Seo
	title="Recognition · Saheed Faremi"
	description="Awards and recognition received by Saheed Faremi."
/>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Recognition"
		heading="Awards and press."
		labelledById="recognition-heading"
	>
		<p class="text-fg-soft mt-4 max-w-2xl text-lg leading-relaxed">
			Competitive wins ({data.counts.awards}) and press coverage ({data.counts.news}), newest-first.
		</p>

		{#if data.entries.length === 0}
			<p class="text-fg-muted mt-8 text-sm">Nothing listed yet.</p>
		{:else}
			<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.entries as entry (entry.type + entry.data.slug)}
					{#if entry.type === 'award'}
						<AwardCard award={entry.data} />
					{:else}
						<NewsCard item={entry.data} />
					{/if}
				{/each}
			</div>
		{/if}
	</Section>
</Container>
