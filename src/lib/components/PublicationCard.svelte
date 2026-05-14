<script lang="ts">
	import type { Publication } from '$lib/content/schemas';
	import Tag from './Tag.svelte';

	type Props = { publication: Publication };
	let { publication }: Props = $props();

	const href = $derived(`/publications/${publication.slug}`);
	const isDraft = $derived(publication.status === 'draft');
</script>

<a
	{href}
	class="group rounded-card border-border bg-bg-soft hover:border-accent/50 focus-visible:outline-accent
		block border p-6 transition-[border-color,transform,background-color]
		duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:-translate-y-px
		focus-visible:outline-2 focus-visible:outline-offset-2"
>
	<div class="flex items-center justify-between gap-3">
		<Tag>{publication.kind}</Tag>
		<span class="font-mono text-fg-muted text-xs">{publication.year}</span>
		{#if isDraft}
			<span
				class="font-mono text-fg-muted bg-bg/60 rounded-pill border-border ml-auto border px-2
					py-0.5 text-[10px] tracking-[0.2em] uppercase">Draft</span
			>
		{/if}
	</div>
	<h3
		class="font-display text-fg group-hover:text-accent mt-4 text-xl tracking-tight transition-colors"
	>
		{publication.title}
	</h3>
	<p class="font-mono text-fg-muted mt-2 text-xs tracking-[0.1em]">
		{publication.authors.join(', ')}
	</p>
	{#if publication.venue}
		<p class="text-fg-soft mt-2 text-sm italic">{publication.venue}</p>
	{/if}
</a>
