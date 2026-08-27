<script lang="ts">
	import type { Snippet } from 'svelte';

	/*
	 * IndexRow — the shared bibliography-style list row for every index page
	 * (publications, projects, blog, recognition, talks). One continuous
	 * descending number, an optional mono overline, a linked display title, an
	 * optional subline, and a free-form area for tags/links/expanders.
	 *
	 * Usage:
	 *   <IndexRow number={n} href="/projects/x" title="X" draft={...}>
	 *     {#snippet overline()}Founding engineer{/snippet}
	 *     {#snippet subline()}<em>Venue</em>, 2026{/snippet}
	 *     …tags/links/details…
	 *   </IndexRow>
	 */
	type Props = {
		number: number;
		href: string;
		title: string;
		draft?: boolean;
		overline?: Snippet;
		subline?: Snippet;
		children?: Snippet;
	};

	let { number, href, title, draft = false, overline, subline, children }: Props = $props();
</script>

<li class="flex gap-4 py-6 sm:gap-8">
	<span
		class="font-mono text-fg-muted w-8 shrink-0 pt-1 text-right text-sm select-none"
		aria-hidden="true">{number}</span
	>
	<div class="min-w-0 flex-1">
		{#if overline}
			<p class="font-mono text-fg-muted text-xs tracking-[0.05em]">{@render overline()}</p>
		{/if}
		<h3 class={overline ? 'mt-1.5' : ''}>
			<a
				{href}
				class="font-display text-fg hover:text-accent text-lg leading-snug tracking-tight
					transition-colors duration-[var(--duration-fast)] focus-visible:outline-2
					focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-xl"
			>
				{title}
			</a>
			{#if draft}
				<span
					class="font-mono text-fg-muted bg-bg-soft rounded-pill border-border ml-2 inline-block
						border px-2 py-0.5 align-middle text-[10px] tracking-[0.2em] uppercase">Draft</span
				>
			{/if}
		</h3>
		{#if subline}
			<p class="text-fg-soft mt-1 text-sm">{@render subline()}</p>
		{/if}
		{@render children?.()}
	</div>
</li>
