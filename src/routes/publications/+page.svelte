<script lang="ts">
	import { Container, Section, PublicationCard, Link } from '$lib/components';
	import type { Publication } from '$lib/content/schemas';

	let { data }: { data: { publications: Publication[] } } = $props();
</script>

<svelte:head>
	<title>Publications — Saheed Faremi</title>
	<meta name="description" content="Preprints, papers, and citable work by Saheed Faremi." />
</svelte:head>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index — Publications"
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
			<div class="mt-12 grid gap-6 md:grid-cols-2">
				{#each data.publications as publication (publication.slug)}
					<PublicationCard {publication} />
				{/each}
			</div>
		{/if}
	</Section>
</Container>
