<script lang="ts">
	import { Container, Section, Tag, Link } from '$lib/components';
	import type { Component } from 'svelte';
	import type { BlogPost } from '$lib/content/schemas';

	let { data }: { data: { meta: BlogPost; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
</script>

<svelte:head>
	<title>{meta.title} · Blog · Saheed Faremi</title>
	{#if meta.summary}
		<meta name="description" content={meta.summary} />
	{/if}
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="post-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/blog" variant="plain">← Blog</Link> · {meta.publishedAt}
		</p>

		<h1
			id="post-heading"
			class="font-display text-fg mt-6 text-4xl leading-[1.1] tracking-tight sm:text-5xl"
		>
			{meta.title}
		</h1>

		{#if meta.summary}
			<p class="text-fg mt-6 max-w-2xl text-xl leading-relaxed">{meta.summary}</p>
		{/if}

		{#if meta.tags.length > 0}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each meta.tags as tag (tag)}
					<Tag>{tag}</Tag>
				{/each}
			</div>
		{/if}

		{#if meta.repo}
			<p class="font-mono text-fg-soft mt-6 text-sm">
				Repo: <Link href={meta.repo} variant="inline">{meta.repo}</Link>
			</p>
		{/if}

		<article class="blog-prose mt-12 max-w-2xl space-y-5 text-lg leading-relaxed text-fg">
			{#if Body}
				<Body />
			{:else}
				<p class="text-fg-muted italic">No body content yet for this entry.</p>
			{/if}
		</article>
	</Section>
</Container>

<style>
	/* Scoped typography for blog post bodies. Manual styling because we deliberately
	   avoid @tailwindcss/typography (its prose-invert is hardcoded to dark mode,
	   see Phase 4 lessons). The :global() escapes Svelte's style scoping so the
	   rules reach the MDsveX-rendered HTML elements that don't exist on this
	   component itself. */
	.blog-prose :global(h2) {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 500;
		line-height: 1.2;
		letter-spacing: -0.01em;
		margin-top: 2.5rem;
		margin-bottom: 0.5rem;
		color: var(--color-fg);
	}
	.blog-prose :global(h3) {
		font-family: var(--font-display);
		font-size: 1.375rem;
		font-weight: 500;
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		color: var(--color-fg);
	}
	.blog-prose :global(p) {
		color: var(--color-fg);
	}
	.blog-prose :global(a) {
		color: var(--color-accent);
		text-decoration: underline;
		text-decoration-color: color-mix(in oklab, var(--color-accent) 35%, transparent);
		text-underline-offset: 3px;
	}
	.blog-prose :global(a:hover) {
		text-decoration-color: color-mix(in oklab, var(--color-accent) 80%, transparent);
	}
	.blog-prose :global(ul),
	.blog-prose :global(ol) {
		padding-left: 1.25rem;
		color: var(--color-fg-soft);
	}
	.blog-prose :global(li) {
		margin-top: 0.25rem;
	}
	.blog-prose :global(li > strong) {
		color: var(--color-fg);
	}
	.blog-prose :global(img) {
		display: block;
		width: 100%;
		max-width: none;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		border-radius: var(--radius-card);
		border: 1px solid var(--color-border);
		background: var(--color-bg-soft);
	}
	/* Caption pattern: italic paragraph directly after an image renders as
	   small muted block text. Bare inline <em> elsewhere stays inline. */
	.blog-prose :global(img + p > em:only-child),
	.blog-prose :global(p:has(> em:only-child) + p > em:only-child) {
		color: var(--color-fg-muted);
		font-style: italic;
		font-size: 0.875rem;
		display: block;
		margin-bottom: 1rem;
	}
	.blog-prose :global(pre) {
		background: var(--color-bg-soft);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-soft);
		padding: 1rem;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--color-fg);
	}
	.blog-prose :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
	}
	.blog-prose :global(:not(pre) > code) {
		background: var(--color-bg-soft);
		border: 1px solid var(--color-border);
		border-radius: 0.25rem;
		padding: 0.1em 0.35em;
		font-size: 0.85em;
	}
	.blog-prose :global(blockquote) {
		border-left: 3px solid var(--color-accent);
		padding-left: 1rem;
		color: var(--color-fg-soft);
		font-style: italic;
	}
</style>
