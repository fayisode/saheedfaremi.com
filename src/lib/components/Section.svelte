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
		/** When provided, renders an internal <h2> at this section's top. */
		heading?: string;
		/**
		 * Overrides the id of the internal <h2> (and the section's aria-labelledby).
		 *
		 * Contract: if you pass `labelledById` WITHOUT `heading`, you MUST also
		 * render an element with that id inside or above this section's children
		 * (e.g., a custom heading layout). Otherwise the section's aria-labelledby
		 * will point at nothing and screen readers will announce an unnamed
		 * region. The component does not (and cannot) verify the target exists.
		 */
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
	// When a caller provides `labelledById`, it's an *override* for the heading's id
	// (and the section's aria-labelledby). The internal h2 still renders if `heading`
	// is set — `labelledById` just changes what its id is. To omit the internal h2
	// entirely (e.g. caller renders their own external heading), pass no `heading`.
	const headingId = $derived(labelledById ?? internalId);
	const ariaLabelledBy = $derived(heading ? headingId : labelledById);

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
	{#if heading}
		<h2 id={headingId} class="font-display mt-3 text-4xl tracking-tight text-fg sm:text-5xl">
			{heading}
		</h2>
	{/if}
	{@render children()}
</section>
