<script lang="ts">
	import { Container, Section, Link } from '$lib/components';
	import type { Component } from 'svelte';
	import type { Publication } from '$lib/content/schemas';

	let { data }: { data: { meta: Publication; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
</script>

<svelte:head>
	<title>{meta.title} — Publications — Saheed Faremi</title>
	{#if meta.summary}
		<meta name="description" content={meta.summary} />
	{/if}
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="pub-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/publications" variant="plain">← Publications</Link> · {meta.year} · {meta.kind}
		</p>
		<h1
			id="pub-heading"
			class="font-display text-fg mt-6 text-3xl leading-[1.15] tracking-tight sm:text-4xl"
		>
			{meta.title}
		</h1>
		<p class="font-mono text-fg-soft mt-4 text-sm">{meta.authors.join(' · ')}</p>
		{#if meta.venue}
			<p class="text-fg-soft mt-2 italic">{meta.venue}</p>
		{/if}

		{#if meta.abstract}
			<div class="rounded-card border-border bg-bg-soft mt-10 max-w-3xl border p-6">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Abstract</p>
				<p class="text-fg mt-3 leading-relaxed">{meta.abstract}</p>
			</div>
		{/if}

		<article class="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-fg">
			{#if Body}
				<Body />
			{/if}
		</article>

		<div class="mt-10 flex flex-wrap gap-4">
			{#if meta.doi}
				<Link href={`https://doi.org/${meta.doi}`} variant="arrow">DOI: {meta.doi}</Link>
			{/if}
			{#if meta.url}
				<Link href={meta.url} variant="arrow">Read online</Link>
			{/if}
			{#if meta.pdf}
				<Link href={meta.pdf} variant="arrow">PDF</Link>
			{/if}
		</div>

		{#if meta.bibtex}
			<details class="rounded-card border-border bg-bg-soft mt-10 max-w-3xl border p-6">
				<summary class="font-mono text-fg-soft cursor-pointer text-xs tracking-[0.2em] uppercase">
					BibTeX
				</summary>
				<pre
					class="text-fg-soft mt-4 overflow-x-auto font-mono text-xs leading-relaxed">{meta.bibtex}</pre>
			</details>
		{/if}
	</Section>
</Container>
