<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		attribution?: string;
		children: Snippet;
	};

	let { attribution, children }: Props = $props();
</script>

<figure class="my-8">
	<blockquote
		class="font-display text-fg relative pl-6 text-2xl leading-snug italic sm:text-3xl md:text-4xl"
	>
		<span
			aria-hidden="true"
			class="text-accent absolute top-1 left-0 text-3xl leading-none not-italic sm:text-4xl">“</span
		>
		{@render children()}
	</blockquote>
	{#if attribution}
		<figcaption class="font-mono text-fg-muted mt-4 pl-6 text-xs tracking-[0.2em] uppercase">
			· {attribution}
		</figcaption>
	{/if}
</figure>
