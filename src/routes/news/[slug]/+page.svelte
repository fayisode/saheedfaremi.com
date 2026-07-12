<script lang="ts">
	import { Container, Section, Link, Seo } from '$lib/components';
	import type { Component } from 'svelte';
	import type { News } from '$lib/content/schemas';

	let { data }: { data: { meta: News; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
</script>

<Seo
	title={`${meta.title} · News · Saheed Faremi`}
	description={meta.summary ?? 'News mentioning Saheed Faremi.'}
/>

<Container width="default">
	<Section spacing="loose" labelledById="news-item-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/awards" variant="plain">← Recognition</Link>
			{#if meta.publishedAt}· {meta.publishedAt}{/if}
		</p>
		<h1
			id="news-item-heading"
			class="font-display text-fg mt-6 text-3xl leading-[1.15] tracking-tight sm:text-4xl"
		>
			{meta.title}
		</h1>
		{#if meta.outlet}
			<p class="font-mono text-fg-soft mt-4 text-sm tracking-[0.15em] uppercase">{meta.outlet}</p>
		{/if}
		{#if meta.summary}
			<p class="text-fg mt-6 max-w-2xl text-xl leading-relaxed">{meta.summary}</p>
		{/if}

		<article class="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-fg">
			{#if Body}<Body />{/if}
		</article>

		{#if meta.url}
			<p class="mt-10">
				<Link href={meta.url} variant="arrow">Read the source</Link>
			</p>
		{/if}
	</Section>
</Container>
