<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement> & {
		variant?: 'outline' | 'solid' | 'accent';
		children: Snippet;
		class?: string;
	};

	let { variant = 'outline', children, class: classProp = '', ...rest }: Props = $props();

	const variants = {
		outline: 'border border-border text-fg-soft bg-transparent',
		solid: 'bg-bg-soft text-fg-soft border border-transparent',
		accent: 'bg-accent/10 text-accent border border-accent/30'
	} as const;
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-pill px-3 py-1 font-mono text-xs tracking-wide {variants[
		variant
	]} {classProp}"
	{...rest}
>
	{@render children()}
</span>
