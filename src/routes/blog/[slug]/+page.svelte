<script lang="ts">
	import { Container, Section, Tag, Link, Seo } from '$lib/components';
	import type { Component } from 'svelte';
	import type { BlogPost } from '$lib/content/schemas';

	let { data }: { data: { meta: BlogPost; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
	const description = $derived(meta.summary ?? `${meta.title}, a post by Saheed Faremi.`);

	// Table of contents: built client-side from the rendered <h2>s inside the
	// article body. We can't extract them server-side because the body is a
	// compiled Svelte component (<Body />), not static HTML we own.
	let articleEl: HTMLElement | undefined;
	let headings = $state<{ id: string; text: string }[]>([]);

	$effect(() => {
		if (!articleEl) return;
		const h2s = articleEl.querySelectorAll('h2');
		headings = Array.from(h2s).map((h) => {
			const text = h.textContent?.trim() ?? '';
			const id =
				h.id ||
				text
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '');
			if (!h.id) h.id = id;
			return { id, text };
		});
	});
</script>

<Seo title={`${meta.title} · Blog · Saheed Faremi`} {description} />

<Container width="default">
	<Section spacing="loose" labelledById="post-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/blog" variant="plain">← Blog</Link> · {meta.publishedAt}{#if meta.readingTime}
				· {meta.readingTime} min read{/if}
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

		<div class="mt-12 flex flex-col gap-12 xl:flex-row xl:items-start xl:justify-center">
			{#if headings.length > 0}
				<aside class="hidden xl:block xl:w-64 xl:shrink-0">
					<nav aria-label="Table of contents" class="xl:sticky xl:top-24">
						<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">On this page</p>
						<ul class="mt-3 space-y-2 border-l border-border">
							{#each headings as heading (heading.id)}
								<li>
									<a
										href={`#${heading.id}`}
										class="-ml-px block border-l-2 border-transparent pl-4 text-sm leading-snug text-fg-muted transition-colors duration-[var(--duration-fast)] hover:border-accent hover:text-fg"
									>
										{heading.text}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				</aside>
			{/if}

			<article
				bind:this={articleEl}
				class="blog-prose w-full max-w-2xl space-y-5 text-lg leading-relaxed text-fg"
			>
				{#if Body}
					<Body />
				{:else}
					<p class="text-fg-muted italic">No body content yet for this entry.</p>
				{/if}
			</article>
		</div>
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
