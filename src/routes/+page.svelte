<script lang="ts">
	import {
		Container,
		HeroCanvas,
		Section,
		Portrait,
		PulledQuote,
		DiagramFigure,
		Tag,
		Link
	} from '$lib/components';

	const tagline = 'Researcher of the brain. Engineer of the systems people rely on.';
</script>

<svelte:head>
	<title>Saheed Faremi — Researcher & Engineer</title>
	<meta
		name="description"
		content="Saheed Faremi — PhD-track EEG-microstate researcher and full-stack engineer building production systems in fintech, healthcare, education, HR, and agriculture."
	/>
</svelte:head>

<!-- HERO -->
<div class="relative isolate min-h-dvh overflow-hidden">
	<HeroCanvas />

	<Container width="default" class="relative z-10 flex min-h-dvh flex-col justify-between py-24">
		<!-- Decorative version stamp. Not a <header> element: the layout's SiteNav
		     is the page's banner landmark, and ARIA only permits one per page. -->
		<div class="font-mono text-fg-soft text-xs tracking-[0.2em] uppercase">
			<span class="text-accent">●</span> saheed faremi · digital profile · v0.0.1
		</div>

		<section class="my-auto" aria-labelledby="hero-heading">
			<p class="font-mono text-fg-soft text-xs tracking-[0.2em] uppercase">
				Researcher · Engineer · PhD-track
			</p>
			<h1
				id="hero-heading"
				class="font-display text-fg mt-6 text-5xl leading-[0.95] tracking-tight sm:text-7xl
					md:text-8xl"
			>
				Saheed
				<span class="text-accent block italic">Faremi.</span>
			</h1>
			<p class="text-fg mt-8 max-w-xl text-lg leading-relaxed sm:text-xl">
				{tagline}
			</p>
			<div class="mt-8 flex flex-wrap items-center gap-4">
				<Link href="#about" variant="arrow">Read more</Link>
				<Link href="#research" variant="plain">Or jump to the research</Link>
			</div>
		</section>

		<footer
			class="font-mono text-fg-muted flex flex-col gap-1 text-xs tracking-[0.2em] uppercase
				sm:flex-row sm:items-center sm:justify-between"
		>
			<span>SvelteKit · Tailwind v4 · OGL</span>
			<span>Azure Static Web Apps</span>
		</footer>
	</Container>
</div>

<!-- ABOUT -->
<Container width="wide" class="scroll-anchor" id="about">
	<Section
		spacing="loose"
		eyebrow="01 — About"
		heading="A researcher who ships."
		labelledById="about-heading"
	>
		<div class="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16">
			<div class="md:max-w-xs">
				<Portrait caption="Portrait — pending" />
			</div>

			<!-- Bio prose uses manual typography classes rather than @tailwindcss/typography's
			     `prose` + `prose-invert` because `prose-invert` is hardcoded to dark-mode
			     palette regardless of `data-theme` — it would render near-white body text
			     on the cream light-mode background. Manual classes consume the semantic
			     `text-fg` / `text-fg-soft` tokens and rebalance correctly with the theme. -->
			<div class="max-w-none space-y-5 text-lg leading-relaxed text-fg">
				<p>I work at the intersection of cognitive neuroscience and production engineering.</p>
				<p>
					By day I build software people rely on — multi-asset fintech (Curnance), HR for African
					mid-market employers (Etihuku), healthcare data infrastructure (HIS Core, predict-dx), and
					learning systems (Skills Hub, Moodle). The through-line is that infrastructure for
					under-served users — geographically, economically, or computationally — needs the same
					engineering rigour as infrastructure for everyone else, and tends to need it more.
				</p>
				<p>
					My doctoral research turns from the systems people use to the people themselves —
					specifically, what the brain looks like when it's running. <strong>EEG microstates</strong
					>
					are quasi-stable scalp topographies that segment continuous EEG into a discrete temporal alphabet;
					I'm working on whether deep generative models — variational autoencoders and Gaussian-mixture
					VAEs — can learn a microstate segmentation that's more stable across sessions and more behaviourally
					predictive than classical clustering. <Tag variant="accent">DRAFT — verify framing</Tag>
				</p>
				<p>
					In 2022 I represented Eswatini at the
					<Link
						href="https://medium.com/@sonirudrakshi99/unesco-india-africa-hackathon-2022-2ec88cea6eb9"
						variant="inline">UNESCO India-Africa Hackathon</Link
					>
					at Gautam Buddha University in Uttar Pradesh. Team
					<em>Geeks_on_Fire</em> — five countries, five people — won problem statement AGRI12: an AI-assisted
					voice contact centre that lets farmers without smartphones report issues by phone and receive
					guidance back in their language. Gold medals and a ₹3 lakh team prize.
				</p>
				<p class="text-fg-soft text-base">
					Based in Eswatini. Travel for research. <Tag>open to collaboration</Tag>
				</p>
			</div>
		</div>

		<PulledQuote attribution="Working principle">
			Infrastructure for under-served users needs the same engineering rigour as infrastructure for
			everyone else — and tends to need it more.
		</PulledQuote>
	</Section>
</Container>

<!-- RESEARCH -->
<Container width="wide" class="scroll-anchor" id="research">
	<Section
		spacing="loose"
		eyebrow="02 — Research"
		heading="EEG microstates with deep generative models."
		labelledById="research-heading"
	>
		<div class="mt-10 grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
			<div class="space-y-5 text-lg leading-relaxed text-fg">
				<p>
					EEG microstates are quasi-stable scalp topographies — typically four to seven canonical
					classes — that segment continuous EEG signal into a discrete temporal alphabet. The
					classical approach uses modified k-means clustering over the global field power maxima. It
					works, but it depends on hard choices (the number of states, the reference electrode, the
					band-pass) and the resulting segmentation can be brittle across sessions.
				</p>
				<p>
					This project asks whether a <em>learned</em> latent geometry — via a variational
					autoencoder — produces a microstate alphabet that is more interpretable, more stable
					across sessions, and more predictive of behaviour than the classical pipeline.
					<Tag variant="accent">DRAFT — confirm with supervisor</Tag>
				</p>

				<h3
					id="research-approach"
					class="font-display text-fg pt-6 text-2xl tracking-tight sm:text-3xl"
				>
					Approach
				</h3>
				<ul class="text-fg-soft list-disc space-y-2 pl-5">
					<li>
						<strong class="text-fg">VAE.</strong> Single Gaussian latent prior; learn a continuous embedding
						of topography frames; segment by latent-space clustering or by direct decoder reconstruction
						error.
					</li>
					<li>
						<strong class="text-fg">GMM-VAE.</strong> Gaussian-mixture latent prior — one component per
						microstate class — so the segmentation falls out of the latent prior structure rather than
						a post-hoc clustering step.
					</li>
					<li>
						<strong class="text-fg">Architecture search.</strong> Sweep over latent dim, regularisation,
						and decoder choices; compare reconstruction-vs-segmentation tradeoff curves across architectures.
					</li>
				</ul>
			</div>

			<aside class="space-y-6">
				<div class="rounded-card border-border bg-bg-soft border p-6">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Status</p>
					<p class="font-display text-fg mt-2 text-2xl">In progress</p>
					<p class="text-fg-soft mt-3 text-sm">
						Preprints, publications, and code releases will land on a dedicated publications section
						here — coming in Phase 6.
					</p>
				</div>
				<div class="rounded-card border-border border p-6">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Stack</p>
					<div class="mt-3 flex flex-wrap gap-2">
						<Tag>Python</Tag>
						<Tag>PyTorch</Tag>
						<Tag>MNE</Tag>
						<Tag>NumPy</Tag>
						<Tag>scikit-learn</Tag>
					</div>
				</div>
			</aside>
		</div>

		<div class="mt-16 grid gap-8 md:grid-cols-3">
			<DiagramFigure
				title="VAE"
				caption="Vanilla variational autoencoder — single Gaussian latent prior."
			/>
			<DiagramFigure
				title="VAE-GMM"
				caption="VAE with a Gaussian-mixture posterior at the latent level."
			/>
			<DiagramFigure
				title="GMM-VAE"
				caption="Mixture-of-Gaussians latent prior — class structure native to the prior."
			/>
		</div>
		<p class="font-mono text-fg-muted mt-6 text-xs tracking-[0.15em] uppercase">
			Diagrams export from <code class="text-fg-soft">~/Documents/*.drawio</code> as SVG and drop
			into
			<code class="text-fg-soft">src/lib/assets/</code>; pass via
			<code class="text-fg-soft">src</code>.
		</p>
	</Section>
</Container>
