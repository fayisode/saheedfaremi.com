<script lang="ts" module>
	let counter = 0;
	function nextSectionId(): string {
		counter += 1;
		return `section-heading-${counter}`;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLElement> & {
		spacing?: 'tight' | 'default' | 'loose';
		eyebrow?: string;
		heading?: string;
		labelledById?: string;
		children: Snippet;
		class?: string;
	};

	let {
		spacing = 'default',
		eyebrow,
		heading,
		labelledById,
		children,
		class: classProp = '',
		...rest
	}: Props = $props();

	const internalId = nextSectionId();
	const ariaLabelledBy = $derived(labelledById ?? (heading ? internalId : undefined));
	const shouldRenderInternalHeading = $derived(!!heading && !labelledById);

	const spacingMap = {
		tight: 'py-10 sm:py-14',
		default: 'py-16 sm:py-24',
		loose: 'py-24 sm:py-32'
	} as const;
</script>

<section class="{spacingMap[spacing]} {classProp}" aria-labelledby={ariaLabelledBy} {...rest}>
	{#if eyebrow}
		<p class="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">{eyebrow}</p>
	{/if}
	{#if shouldRenderInternalHeading}
		<h2 id={internalId} class="font-display mt-3 text-4xl tracking-tight text-fg sm:text-5xl">
			{heading}
		</h2>
	{/if}
	{@render children()}
</section>
