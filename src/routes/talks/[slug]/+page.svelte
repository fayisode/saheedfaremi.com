<script lang="ts">
	import { Container, Section, Link } from '$lib/components';
	import type { Component } from 'svelte';
	import type { Talk } from '$lib/content/schemas';

	let { data }: { data: { meta: Talk; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
</script>

<svelte:head>
	<title>{meta.title} · Talks · Saheed Faremi</title>
	{#if meta.summary}
		<meta name="description" content={meta.summary} />
	{/if}
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="talk-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/talks" variant="plain">← Talks</Link> · {meta.year}
		</p>
		<h1
			id="talk-heading"
			class="font-display text-fg mt-6 text-3xl leading-[1.15] tracking-tight sm:text-4xl"
		>
			{meta.title}
		</h1>
		<p class="font-mono text-fg-soft mt-4 text-sm tracking-[0.15em] uppercase">{meta.event}</p>
		{#if meta.location}
			<p class="text-fg-soft mt-2">{meta.location}</p>
		{/if}

		<article class="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-fg">
			{#if Body}
				<Body />
			{/if}
		</article>

		<div class="mt-10 flex flex-wrap gap-4">
			{#if meta.url}<Link href={meta.url} variant="arrow">Event link</Link>{/if}
			{#if meta.slides}<Link href={meta.slides} variant="arrow">Slides</Link>{/if}
			{#if meta.recording}<Link href={meta.recording} variant="arrow">Recording</Link>{/if}
		</div>
	</Section>
</Container>
