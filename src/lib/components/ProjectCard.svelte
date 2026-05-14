<script lang="ts">
	import type { Project } from '$lib/content/schemas';
	import Tag from './Tag.svelte';

	type Props = {
		project: Project;
	};

	let { project }: Props = $props();

	const href = $derived(`/projects/${project.slug}`);
	const isDraft = $derived(project.status === 'draft');
</script>

<a
	{href}
	class="group rounded-card border-border bg-bg-soft hover:border-accent/50 focus-visible:outline-accent
		relative block border p-6 transition-[border-color,transform,background-color]
		duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] hover:-translate-y-px
		focus-visible:outline-2 focus-visible:outline-offset-2"
>
	<div class="flex items-center justify-between gap-3">
		<Tag variant="accent">{project.domain}</Tag>
		{#if isDraft}
			<span
				class="font-mono text-fg-muted bg-bg/60 rounded-pill border-border border px-2 py-0.5
					text-[10px] tracking-[0.2em] uppercase"
				aria-label="Draft content"
			>
				Draft
			</span>
		{/if}
	</div>

	<h3
		class="font-display text-fg group-hover:text-accent mt-4 text-2xl tracking-tight
			transition-colors duration-[var(--duration-fast)]"
	>
		{project.title}
	</h3>

	{#if project.summary}
		<p class="text-fg-soft mt-3 text-sm leading-relaxed">
			{project.summary}
		</p>
	{/if}

	<div class="mt-5 flex items-center justify-between gap-3">
		{#if project.role}
			<p class="font-mono text-fg-muted text-xs tracking-[0.15em] uppercase">
				{project.role}
			</p>
		{:else}
			<span></span>
		{/if}
		<span
			aria-hidden="true"
			class="text-fg-soft group-hover:text-accent transition-[color,transform]
				duration-[var(--duration-fast)] group-hover:translate-x-0.5"
		>
			→
		</span>
	</div>
</a>
