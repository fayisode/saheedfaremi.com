<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		title,
		children
	}: {
		id: string;
		title: string;
		children: Snippet;
	} = $props();
</script>

<section
	{id}
	aria-labelledby={`${id}-heading`}
	class="scroll-anchor border-border border-t py-10 sm:py-12"
>
	<div class="grid gap-6 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-10">
		<h2
			id={`${id}-heading`}
			class="font-mono text-fg-muted text-xs leading-6 tracking-[0.2em] uppercase"
		>
			{title}
		</h2>
		<div class="min-w-0">
			{@render children()}
		</div>
	</div>
</section>
