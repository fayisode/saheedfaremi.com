<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes & {
		href: string;
		variant?: 'inline' | 'arrow' | 'plain';
		external?: boolean;
		children: Snippet;
		class?: string;
	};

	let {
		href,
		variant = 'inline',
		external,
		children,
		class: classProp = '',
		...rest
	}: Props = $props();

	const isExternal = $derived(external ?? /^https?:\/\//i.test(href) ?? false);

	const variants = {
		inline:
			'text-accent underline decoration-accent/30 decoration-1 underline-offset-4 ' +
			'transition-colors duration-[var(--duration-fast)] hover:decoration-accent/80',
		arrow:
			'group inline-flex items-center gap-1 font-mono text-sm text-fg ' +
			'transition-colors duration-[var(--duration-fast)] hover:text-accent',
		plain: 'text-fg hover:text-accent transition-colors duration-[var(--duration-fast)]'
	} as const;
</script>

<a
	{href}
	class="rounded-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent {variants[
		variant
	]} {classProp}"
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
	{...rest}
>
	{@render children()}
	{#if variant === 'arrow'}
		<span
			aria-hidden="true"
			class="inline-block transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
			>{isExternal ? '↗' : '→'}</span
		>
	{/if}
</a>
