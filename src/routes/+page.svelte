<script lang="ts">
	import { Container, HeroCanvas } from '$lib/components';

	const tagline = 'Researcher of the brain. Engineer of the systems people rely on.';
</script>

<svelte:head>
	<title>Saheed Faremi — Researcher & Engineer</title>
	<meta
		name="description"
		content="Saheed Faremi — PhD-track EEG-microstate researcher and full-stack engineer building production systems in fintech, healthcare, education, HR, and agriculture."
	/>
</svelte:head>

<div class="relative isolate min-h-dvh overflow-hidden">
	<HeroCanvas />

	<Container width="default" class="relative z-10 flex min-h-dvh flex-col py-16">
		<header class="font-mono text-xs tracking-[0.2em] text-fg-soft uppercase">
			<span class="text-accent">●</span> saheed faremi · digital profile · v0.0.1
		</header>

		<section class="my-auto" aria-labelledby="hero-heading">
			<p class="font-mono text-xs tracking-[0.2em] text-fg-soft uppercase">
				Researcher · Engineer · PhD-track
			</p>
			<h1
				id="hero-heading"
				class="font-display mt-6 text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl md:text-8xl"
			>
				Saheed
				<span class="block text-accent italic">Faremi.</span>
			</h1>
			<p class="mt-8 max-w-xl text-lg leading-relaxed text-fg sm:text-xl">
				{tagline}
			</p>
			<p class="mt-6 max-w-xl text-sm text-fg-soft">
				Coming online phase by phase. About, research, projects, publications, and contact arrive
				next — see
				<code class="rounded-soft bg-bg-soft/80 px-1.5 py-0.5 font-mono text-fg backdrop-blur-sm"
					>plan.md</code
				>.
			</p>
		</section>

		<footer
			class="flex flex-col gap-1 font-mono text-xs tracking-[0.2em] text-fg-muted uppercase sm:flex-row sm:items-center sm:justify-between"
		>
			<span>SvelteKit · Tailwind v4 · OGL</span>
			<span>Azure Static Web Apps</span>
		</footer>
	</Container>
</div>
