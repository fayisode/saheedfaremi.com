<script lang="ts">
	import { Container, Section, NewsCard } from '$lib/components';
	import type { News } from '$lib/content/schemas';

	let { data }: { data: { news: News[] } } = $props();
</script>

<svelte:head>
	<title>News · Saheed Faremi</title>
	<meta name="description" content="Press coverage and public mentions of Saheed Faremi's work." />
</svelte:head>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · News"
		heading="Press and public mentions."
		labelledById="news-heading"
	>
		{#if data.news.length === 0}
			<p class="text-fg-soft mt-12 max-w-2xl text-lg leading-relaxed">No press items yet.</p>
		{:else}
			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.news as item (item.slug)}
					<NewsCard {item} />
				{/each}
			</div>
		{/if}
	</Section>
</Container>
