<script lang="ts">
	import { page } from '$app/state';
	import { Container, Section, Link } from '$lib/components';
</script>

<svelte:head>
	<title>{page.status} — Saheed Faremi</title>
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="error-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Error · {page.status}</p>
		<h1
			id="error-heading"
			class="font-display text-fg mt-6 text-5xl leading-[0.95] tracking-tight sm:text-7xl"
		>
			{#if page.status === 404}
				Not <span class="text-accent italic">here</span>.
			{:else}
				Something <span class="text-accent italic">broke</span>.
			{/if}
		</h1>
		<p class="text-fg-soft mt-6 max-w-2xl text-lg leading-relaxed">
			{#if page.status === 404}
				The page you're looking for isn't on this site (yet). The links below should land you
				somewhere intentional.
			{:else}
				An unexpected error — {page.error?.message ?? 'unknown'}. Try again in a moment, or report
				it via the contact page.
			{/if}
		</p>
		<ul class="font-mono mt-10 space-y-2 text-sm">
			<li><Link href="/" variant="arrow">Home</Link></li>
			<li><Link href="/projects" variant="arrow">Projects</Link></li>
			<li><Link href="/awards" variant="arrow">Recognition</Link></li>
			<li><Link href="/contact" variant="arrow">Contact</Link></li>
		</ul>
	</Section>
</Container>
