<script lang="ts">
	import type { BlogPost } from '$lib/content/schemas';
	import Tag from './Tag.svelte';

	type Props = { post: BlogPost };
	let { post }: Props = $props();

	const href = $derived(`/blog/${post.slug}`);
	const isDraft = $derived(post.status === 'draft');
</script>

<a
	{href}
	class="group rounded-card border-border bg-bg-soft hover:border-accent/50 focus-visible:outline-accent
		block border p-6 transition-[border-color,transform,background-color]
		duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:-translate-y-px
		focus-visible:outline-2 focus-visible:outline-offset-2"
>
	<div class="flex items-center justify-between gap-3">
		<span class="font-mono text-fg-muted text-xs">{post.publishedAt}</span>
		{#if isDraft}
			<span
				class="font-mono text-fg-muted bg-bg/60 rounded-pill border-border border px-2 py-0.5
					text-[10px] tracking-[0.2em] uppercase">Draft</span
			>
		{/if}
	</div>

	<h3
		class="font-display text-fg group-hover:text-accent mt-4 text-xl tracking-tight transition-colors"
	>
		{post.title}
	</h3>

	{#if post.summary}
		<p class="text-fg-soft mt-3 text-sm leading-relaxed">{post.summary}</p>
	{/if}

	{#if post.tags.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each post.tags.slice(0, 3) as tag (tag)}
				<Tag>{tag}</Tag>
			{/each}
		</div>
	{/if}
</a>
