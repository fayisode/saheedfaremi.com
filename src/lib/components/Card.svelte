<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		variant?: 'default' | 'elevated' | 'outlined';
		interactive?: boolean;
		children: Snippet;
		class?: string;
	};

	let {
		variant = 'default',
		interactive = false,
		children,
		class: classProp = '',
		...rest
	}: Props = $props();

	const variants = {
		default: 'bg-bg-soft border border-border',
		elevated: 'bg-surface border border-border shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]',
		outlined: 'bg-transparent border border-border'
	} as const;

	const interactiveStyles = $derived(
		interactive
			? 'transition-[transform,border-color,background-color] duration-[var(--duration-fast)] ' +
					'ease-[var(--ease-out-quart)] hover:border-accent/50 hover:-translate-y-px ' +
					'focus-within:border-accent/70'
			: ''
	);
</script>

<div class="rounded-card p-6 {variants[variant]} {interactiveStyles} {classProp}" {...rest}>
	{@render children()}
</div>
