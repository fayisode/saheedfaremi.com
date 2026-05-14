<script lang="ts">
	import { ThemeToggle } from '$lib/components';

	type NavLink = { href: string; label: string };

	let { links = [] }: { links?: NavLink[] } = $props();

	let scrolled = $state(false);

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 16;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:bg-bg focus:text-fg focus:rounded-soft focus:fixed
		focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-border focus:px-3 focus:py-2
		focus:text-sm focus:font-mono"
>
	Skip to main content
</a>

<header
	class="fixed top-0 right-0 left-0 z-30 transition-[background-color,border-color,backdrop-filter]
		duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]"
	class:scrolled
>
	<div
		class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:px-10 sm:py-4"
	>
		<a
			href="/"
			class="font-mono text-fg hover:text-accent rounded-soft text-sm tracking-[0.15em]
				uppercase transition-colors duration-[var(--duration-fast)]
				focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
		>
			<span class="text-accent" aria-hidden="true">●</span>
			<span class="ml-1">Saheed Faremi</span>
		</a>

		<nav aria-label="Primary" class="hidden items-center gap-1 sm:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="text-fg-soft hover:text-fg hover:bg-bg-soft rounded-soft px-3 py-2 font-mono
						text-xs tracking-[0.15em] uppercase transition-colors duration-[var(--duration-fast)]
						focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<ThemeToggle />
		</div>
	</div>
</header>

<style>
	header {
		background-color: transparent;
		border-bottom: 1px solid transparent;
	}

	header.scrolled {
		background-color: color-mix(in oklab, var(--color-bg) 80%, transparent);
		border-bottom-color: var(--color-border);
		backdrop-filter: blur(12px) saturate(140%);
		-webkit-backdrop-filter: blur(12px) saturate(140%);
	}
</style>
