<script lang="ts">
	import type { News } from '$lib/content/schemas';
	import Tag from './Tag.svelte';

	type Props = { item: News };
	let { item }: Props = $props();

	const href = $derived(`/news/${item.slug}`);
	const formattedDate = $derived(item.publishedAt ?? '');
</script>

<a
	{href}
	class="group rounded-card border-border bg-bg-soft hover:border-accent/50 focus-visible:outline-accent
		block border p-6 transition-[border-color,transform,background-color]
		duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:-translate-y-px
		focus-visible:outline-2 focus-visible:outline-offset-2"
>
	<div class="flex items-center justify-between gap-3">
		{#if item.outlet}<Tag>{item.outlet}</Tag>{/if}
		{#if formattedDate}
			<span class="font-mono text-fg-muted text-xs">{formattedDate}</span>
		{/if}
	</div>
	<h3
		class="font-display text-fg group-hover:text-accent mt-4 text-xl tracking-tight transition-colors"
	>
		{item.title}
	</h3>
	{#if item.summary}
		<p class="text-fg-soft mt-3 text-sm leading-relaxed">{item.summary}</p>
	{/if}
</a>
