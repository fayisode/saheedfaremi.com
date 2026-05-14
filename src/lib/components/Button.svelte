<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		variant?: 'primary' | 'ghost' | 'subtle';
		size?: 'sm' | 'md' | 'lg';
		children: Snippet;
		class?: string;
	};

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		children,
		class: classProp = '',
		...rest
	}: Props = $props();

	const base =
		'inline-flex items-center justify-center gap-2 font-mono font-medium tracking-wide ' +
		'transition-[background-color,color,border-color,transform] ' +
		'duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] ' +
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
		'disabled:cursor-not-allowed disabled:opacity-50';

	const sizes = {
		sm: 'h-8 px-3 text-xs rounded-soft',
		md: 'h-10 px-4 text-sm rounded-soft',
		lg: 'h-12 px-6 text-base rounded-card'
	} as const;

	const variants = {
		primary:
			'bg-accent text-bg hover:bg-phosphor-soft active:translate-y-px ' +
			'shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]',
		ghost:
			'bg-transparent text-fg border border-border hover:border-accent hover:text-accent ' +
			'active:translate-y-px',
		subtle: 'bg-bg-soft text-fg hover:bg-surface border border-transparent hover:border-border'
	} as const;
</script>

<button class="{base} {sizes[size]} {variants[variant]} {classProp}" {type} {...rest}>
	{@render children()}
</button>
