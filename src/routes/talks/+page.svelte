<script lang="ts">
	import { Container, Section, TalkCard } from '$lib/components';
	import type { Talk } from '$lib/content/schemas';

	let { data }: { data: { talks: Talk[] } } = $props();
</script>

<svelte:head>
	<title>Talks — Saheed Faremi</title>
	<meta name="description" content="Talks and presentations by Saheed Faremi." />
</svelte:head>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index — Talks"
		heading="Talks & presentations."
		labelledById="talks-heading"
	>
		{#if data.talks.length === 0}
			<p class="text-fg-soft mt-12 max-w-2xl text-lg leading-relaxed">
				No talks listed yet. Conference appearances, workshop presentations, and invited lectures
				will appear here when given.
			</p>
		{:else}
			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.talks as talk (talk.slug)}
					<TalkCard {talk} />
				{/each}
			</div>
		{/if}
	</Section>
</Container>
