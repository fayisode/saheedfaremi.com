<script lang="ts">
	import { SocialLinks } from '$lib/components';

	type FooterLink = { href: string; label: string };

	// Grouped site map. Gives every route a reachable entry point from any page, so a
	// visitor who lands deep or scrolls to the bottom of the home page isn't dead-ended.
	let { explore = [], about = [] }: { explore?: FooterLink[]; about?: FooterLink[] } = $props();

	const year = new Date().getFullYear();
</script>

<footer class="border-border mt-32 border-t">
	<div class="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
		<div class="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr]">
			<div>
				<a
					href="/"
					class="font-mono text-fg hover:text-accent text-sm tracking-[0.15em] uppercase
						transition-colors duration-[var(--duration-fast)]"
				>
					<span class="text-accent" aria-hidden="true">●</span>
					<span class="ml-1">Saheed Faremi</span>
				</a>
				<p class="text-fg-soft mt-4 max-w-xs text-sm leading-relaxed">
					Researcher of the brain. Engineer of the systems people rely on.
				</p>
				<SocialLinks class="mt-6" />
			</div>

			<nav aria-label="Explore" class="flex flex-col gap-3">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Explore</p>
				{#each explore as link (link.href)}
					<a
						href={link.href}
						class="text-fg-soft hover:text-accent text-sm transition-colors
							duration-[var(--duration-fast)]"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<nav aria-label="More" class="flex flex-col gap-3">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">More</p>
				{#each about as link (link.href)}
					<a
						href={link.href}
						class="text-fg-soft hover:text-accent text-sm transition-colors
							duration-[var(--duration-fast)]"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>

		<div
			class="border-border mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6"
		>
			<p class="font-mono text-fg-muted text-xs tracking-[0.1em]">
				© {year} Saheed Faremi · Dublin, Ireland
			</p>
			<a
				href="/cv"
				class="font-mono text-fg-soft hover:text-accent text-xs tracking-[0.1em] uppercase
					transition-colors duration-[var(--duration-fast)]"
			>
				Curriculum Vitae →
			</a>
		</div>
	</div>
</footer>
