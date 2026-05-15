<script lang="ts">
	import { Container, Section, BlogCard } from '$lib/components';
	import type { BlogPost } from '$lib/content/schemas';

	let { data }: { data: { blog: BlogPost[] } } = $props();
</script>

<svelte:head>
	<title>Blog · Saheed Faremi</title>
	<meta
		name="description"
		content="Notes on research and engineering by Saheed Faremi. EEG microstates, deep generative models, and the production systems sitting next to them."
	/>
</svelte:head>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Blog"
		heading="Notes on the work."
		labelledById="blog-heading"
	>
		<p class="text-fg-soft mt-4 max-w-2xl text-lg leading-relaxed">
			Mostly research notes. Pipeline choices, why they matter, what broke first time.
		</p>

		{#if data.blog.length === 0}
			<p class="text-fg-muted mt-12 text-sm">No posts yet.</p>
		{:else}
			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each data.blog as post (post.slug)}
					<BlogCard {post} />
				{/each}
			</div>
		{/if}
	</Section>
</Container>
