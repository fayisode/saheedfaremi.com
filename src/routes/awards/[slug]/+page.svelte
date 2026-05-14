<script lang="ts">
	import { Container, Section, Tag, Link } from '$lib/components';
	import type { Component } from 'svelte';
	import type { Award } from '$lib/content/schemas';

	let { data }: { data: { meta: Award; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
</script>

<svelte:head>
	<title>{meta.title} — Awards — Saheed Faremi</title>
	{#if meta.summary}
		<meta name="description" content={meta.summary} />
	{/if}
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="award-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/awards" variant="plain">← Recognition</Link> · {meta.year}
		</p>

		<h1
			id="award-heading"
			class="font-display text-fg mt-6 text-4xl leading-[1.1] tracking-tight sm:text-5xl"
		>
			{meta.title}
		</h1>

		<p class="font-mono text-fg-soft mt-4 text-sm tracking-[0.15em] uppercase">
			{meta.organization}
		</p>

		{#if meta.prize}
			<div class="mt-6">
				<Tag variant="accent">{meta.prize}</Tag>
			</div>
		{/if}

		{#if meta.summary}
			<p class="text-fg mt-8 max-w-2xl text-xl leading-relaxed">{meta.summary}</p>
		{/if}

		<article class="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-fg">
			{#if Body}
				<Body />
			{:else}
				<p class="text-fg-muted italic">No body content yet for this entry.</p>
			{/if}
		</article>

		{#if meta.url}
			<p class="mt-10">
				<Link href={meta.url} variant="arrow">Read the source coverage</Link>
			</p>
		{/if}
	</Section>
</Container>
