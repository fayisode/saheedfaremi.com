<script lang="ts">
	import { Container, Section, IndexRow, Link, Seo } from '$lib/components';
	import type { BlogPost } from '$lib/content/schemas';

	let { data }: { data: { blog: BlogPost[] } } = $props();

	// Continuous descending numbering, newest post first.
	const numbers = $derived(new Map(data.blog.map((p, i) => [p.slug, data.blog.length - i])));
</script>

<Seo
	title="Blog · Saheed Faremi"
	description="Notes on EEG microstate research, deep learning methods, and engineering practice."
/>

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
			<ol class="divide-border border-border mt-12 divide-y border-t">
				{#each data.blog as post (post.slug)}
					<IndexRow
						number={numbers.get(post.slug) ?? 0}
						href={`/blog/${post.slug}`}
						title={post.title}
					>
						{#snippet overline()}{post.publishedAt}{/snippet}
						{#snippet subline()}{post.summary ?? ''}{/snippet}
						<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
							{#if post.readingTime}
								<span class="font-mono text-fg-muted text-xs">{post.readingTime} min read</span>
							{/if}
							{#if post.repo}
								<Link href={post.repo} variant="inline">Code</Link>
							{/if}
						</div>
						{#if post.tags.length}
							<p class="font-mono text-fg-muted mt-3 text-xs leading-relaxed">
								{post.tags.join(' · ')}
							</p>
						{/if}
					</IndexRow>
				{/each}
			</ol>
		{/if}
	</Section>
</Container>
