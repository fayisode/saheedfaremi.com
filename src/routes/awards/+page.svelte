<script lang="ts">
	import { Container, Section, AwardCard } from '$lib/components';
	import type { Award } from '$lib/content/schemas';

	let { data }: { data: { awards: Award[] } } = $props();
</script>

<svelte:head>
	<title>Recognition · Saheed Faremi</title>
	<meta
		name="description"
		content="Awards, prizes, and external recognition received by Saheed Faremi."
	/>
</svelte:head>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Recognition"
		heading="Awards & external recognition."
		labelledById="awards-heading"
	>
		{#if data.awards.length === 0}
			<p class="text-fg-muted mt-8 text-sm">No awards listed yet.</p>
		{:else}
			<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.awards as award (award.slug)}
					<AwardCard {award} />
				{/each}
			</div>
		{/if}
	</Section>
</Container>
