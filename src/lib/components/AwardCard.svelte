<script lang="ts">
	import type { Award } from '$lib/content/schemas';
	import Tag from './Tag.svelte';

	type Props = { award: Award };
	let { award }: Props = $props();

	const href = $derived(`/awards/${award.slug}`);
	const isDraft = $derived(award.status === 'draft');
</script>

<a
	{href}
	class="group rounded-card border-border bg-bg-soft hover:border-accent/50 focus-visible:outline-accent
		relative block border p-6 transition-[border-color,transform,background-color]
		duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:-translate-y-px
		focus-visible:outline-2 focus-visible:outline-offset-2"
>
	<div class="flex items-center justify-between gap-3">
		<Tag variant="accent">{award.year}</Tag>
		{#if isDraft}
			<span
				class="font-mono text-fg-muted bg-bg/60 rounded-pill border-border border px-2 py-0.5
					text-[10px] tracking-[0.2em] uppercase">Draft</span
			>
		{/if}
	</div>

	<h3
		class="font-display text-fg group-hover:text-accent mt-4 text-2xl tracking-tight
			transition-colors duration-[var(--duration-fast)]"
	>
		{award.title}
	</h3>

	<p class="font-mono text-fg-muted mt-2 text-xs tracking-[0.15em] uppercase">
		{award.organization}
	</p>

	{#if award.summary}
		<p class="text-fg-soft mt-4 text-sm leading-relaxed">{award.summary}</p>
	{/if}

	{#if award.prize}
		<p class="text-fg mt-4 text-sm">
			<span class="text-accent">●</span>
			{award.prize}
		</p>
	{/if}
</a>
