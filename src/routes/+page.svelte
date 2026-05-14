<script lang="ts">
	const tagline = 'Researcher of the brain. Engineer of the systems people rely on.';
</script>

<svelte:head>
	<title>Saheed Faremi — Researcher & Engineer</title>
	<meta
		name="description"
		content="Saheed Faremi — PhD-track EEG-microstate researcher and full-stack engineer building production systems in fintech, healthcare, education, HR, and agriculture."
	/>
</svelte:head>

<main class="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-16 sm:px-10">
	<header class="font-mono text-xs tracking-widest text-signal-200 uppercase">
		<span class="text-phosphor">●</span> saheed faremi · digital profile · v0.0.1
	</header>

	<section class="my-auto" aria-labelledby="hero-heading">
		<p class="font-mono text-xs tracking-widest text-signal-200 uppercase">Phase 0 — Foundation</p>
		<h1
			id="hero-heading"
			class="font-display mt-6 text-5xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
		>
			Saheed
			<span class="block text-phosphor italic">Faremi.</span>
		</h1>
		<p class="mt-8 max-w-xl text-lg leading-relaxed text-signal-50 sm:text-xl">
			{tagline}
		</p>
		<p class="mt-6 max-w-xl text-sm text-signal-200">
			This is the foundation deploy. The full site arrives across the next nine phases — see
			<code class="rounded bg-ink-soft px-1.5 py-0.5 font-mono text-signal-50">plan.md</code>.
		</p>
	</section>

	<footer
		class="flex flex-col gap-1 font-mono text-xs tracking-widest text-signal-400 uppercase sm:flex-row sm:items-center sm:justify-between"
	>
		<span>SvelteKit · Tailwind v4 · Static Adapter</span>
		<span>Azure Static Web Apps</span>
	</footer>
</main>
