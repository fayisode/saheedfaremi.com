<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		width?: 'narrow' | 'default' | 'wide' | 'full';
		children: Snippet;
		class?: string;
	};

	let { width = 'default', children, class: classProp = '', ...rest }: Props = $props();

	const widthMap = {
		narrow: 'max-w-2xl',
		default: 'max-w-4xl',
		wide: 'max-w-6xl',
		full: 'max-w-none'
	} as const;
</script>

<div class="mx-auto w-full px-6 sm:px-10 {widthMap[width]} {classProp}" {...rest}>
	{@render children()}
</div>
