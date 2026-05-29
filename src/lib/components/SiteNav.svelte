<script lang="ts">
	import { ThemeToggle } from '$lib/components';
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';

	type NavLink = { href: string; label: string };

	let { links = [] }: { links?: NavLink[] } = $props();

	let scrolled = $state(false);
	let open = $state(false);
	let reducedMotion = $state(false);
	let toggleButton = $state<HTMLButtonElement | null>(null);
	let mobileNav = $state<HTMLElement | null>(null);

	// "You are here": highlight the route link matching the current page (incl. its
	// detail pages, e.g. /projects/x → Projects). In-page anchors (/#about) are not
	// route changes, so they never read as the active page.
	function isActive(href: string): boolean {
		const path = href.split('#')[0];
		if (!path || path === '/') return false;
		const current = page.url.pathname;
		return current === path || current.startsWith(path + '/');
	}

	$effect(() => {
		const onScroll = () => {
			scrolled = window.scrollY > 16;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (reducedMotion = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	// While the mobile menu is open: close on Escape, lock body scroll so the page
	// behind the overlay can't drift, and move focus into the menu (restoring it to
	// the toggle on close) so keyboard users aren't stranded behind the panel.
	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		window.addEventListener('keydown', onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const firstLink = mobileNav?.querySelector<HTMLElement>('a');
		firstLink?.focus();
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prevOverflow;
			toggleButton?.focus();
		};
	});
</script>

<a
	href="#main"
	class="skip-link sr-only focus:not-sr-only focus:bg-bg focus:text-fg focus:rounded-soft focus:fixed
		focus:top-3 focus:left-3 focus:z-50 focus:border focus:border-border focus:px-3 focus:py-2
		focus:text-sm focus:font-mono"
>
	Skip to main content
</a>

<header
	class="fixed top-0 right-0 left-0 z-30 transition-[background-color,border-color,backdrop-filter]
		duration-[var(--duration-normal)] ease-[var(--ease-out-quart)]"
	class:scrolled={scrolled || open}
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

		<nav aria-label="Primary" class="hidden items-center gap-1 md:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					class="rounded-soft px-3 py-2 font-mono text-xs tracking-[0.15em] uppercase
						transition-colors duration-[var(--duration-fast)] hover:text-fg hover:bg-bg-soft
						focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
						{isActive(link.href)
						? 'text-fg underline decoration-accent decoration-2 underline-offset-[6px]'
						: 'text-fg-soft'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<ThemeToggle />
			<!-- Mobile menu toggle. Desktop uses the inline <nav> above; below the
			     `sm` breakpoint that nav is display:none, so this disclosure is the
			     only way to reach the links on a phone. -->
			<button
				bind:this={toggleButton}
				type="button"
				class="text-fg-soft hover:text-fg hover:bg-bg-soft rounded-soft inline-flex h-9 w-9
					items-center justify-center transition-colors duration-[var(--duration-fast)]
					focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
					md:hidden"
				aria-label={open ? 'Close menu' : 'Open menu'}
				aria-expanded={open}
				aria-controls="mobile-nav"
				onclick={() => (open = !open)}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					aria-hidden="true"
				>
					{#if open}
						<line x1="6" y1="6" x2="18" y2="18" />
						<line x1="6" y1="18" x2="18" y2="6" />
					{:else}
						<line x1="4" y1="7" x2="20" y2="7" />
						<line x1="4" y1="12" x2="20" y2="12" />
						<line x1="4" y1="17" x2="20" y2="17" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	{#if open}
		<nav
			bind:this={mobileNav}
			id="mobile-nav"
			aria-label="Primary"
			class="bg-bg border-border flex flex-col border-t px-4 pb-4 md:hidden"
			transition:slide={{ duration: reducedMotion ? 0 : 150 }}
		>
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					onclick={() => (open = false)}
					class="rounded-soft px-3 py-3 font-mono text-sm tracking-[0.15em] uppercase
						transition-colors duration-[var(--duration-fast)] hover:text-fg hover:bg-bg-soft
						focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
						{isActive(link.href) ? 'text-fg' : 'text-fg-soft'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
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
