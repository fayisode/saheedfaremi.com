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
	import portraitUrl from '$lib/assets/portrait.jpg';
	import { publications, sortByYearDesc } from '$lib/content/loader';

	const tagline = 'Researcher of the brain. Engineer of the systems people rely on.';

	// Recent publications surfaced on the Research section. Sort newest-first;
	// /publications carries the full archive.
	const recentPublications = sortByYearDesc([...publications]);
</script>

<svelte:head>
	<title>Saheed Faremi · Researcher & Engineer</title>
	<meta
		name="description"
		content="Saheed Faremi: PhD-track EEG-microstate researcher and full-stack engineer building production systems in fintech, healthcare, education, HR, and agriculture."
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
				Researcher · Engineer · Dublin
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
	</Container>
</div>

<!-- ABOUT -->
<Container width="wide" class="scroll-anchor" id="about">
	<Section
		spacing="loose"
		eyebrow="01 · About"
		heading="A researcher who ships."
		labelledById="about-heading"
	>
		<div class="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16">
			<div class="md:max-w-xs">
				<Portrait src={portraitUrl} alt="Saheed Faremi" />
			</div>

			<!-- Bio prose uses manual typography classes rather than @tailwindcss/typography's
			     `prose` + `prose-invert` because `prose-invert` is hardcoded to dark-mode
			     palette regardless of `data-theme`. it would render near-white body text
			     on the cream light-mode background. Manual classes consume the semantic
			     `text-fg` / `text-fg-soft` tokens and rebalance correctly with the theme. -->
			<div class="max-w-none space-y-5 text-lg leading-relaxed text-fg">
				<p>
					Two thinkers, one head. The left side is a researcher whose PhD goal is finding recurrent
					patterns toward real-time detection of disorder. The right side is an engineer shipping
					production systems people rely on.
				</p>
				<p>
					Production work spans fintech (Curnance), HR (Etihuku), healthcare data (HIS Core,
					Predict-Dx), advisory tooling (Gatsheni Advisory, CFI Eswatini), AI-assisted proposal
					generation (Cleva, built for Gijima), and learning systems (Skills Hub, Moodle).
					Infrastructure for under-served users (geographically, economically, or computationally)
					needs the same engineering rigour as infrastructure for everyone else. It tends to need
					more.
				</p>
				<p>
					The doctoral side: <strong>EEG microstates</strong> are quasi-stable scalp topographies that
					segment continuous brain signal into a discrete temporal alphabet. Find the recurrent patterns
					and you have a candidate biomarker. The work asks whether deep generative models, variational
					autoencoders and Gaussian-mixture VAEs, can learn a microstate alphabet that's more stable across
					sessions and more behaviourally predictive than classical clustering. Target: a representation
					reliable enough to anchor real-time detection of disorder-relevant brain states.
				</p>
				<p>
					In 2022 I represented Eswatini at the
					<Link
						href="https://medium.com/@sonirudrakshi99/unesco-india-africa-hackathon-2022-2ec88cea6eb9"
						variant="inline">UNESCO India-Africa Hackathon</Link
					>
					at Gautam Buddha University in Uttar Pradesh. Team
					<em>Geeks_on_Fire</em> (five countries, five people) won problem statement AGRI12: an AI-assisted
					voice contact centre that lets farmers without smartphones report issues by phone and receive
					guidance back in their language. Gold medals and a ₹3 lakh team prize.
				</p>
				<p class="text-fg-soft text-base">
					Based in Dublin, Ireland. Travel for research. <Tag>open to collaboration</Tag>
				</p>
			</div>
		</div>

		<PulledQuote attribution="Working hypothesis">
			Find the recurrent patterns and you have a candidate biomarker.
		</PulledQuote>
	</Section>
</Container>

<!-- RESEARCH -->
<Container width="wide" class="scroll-anchor" id="research">
	<Section
		spacing="loose"
		eyebrow="02 · Research"
		heading="EEG microstates with deep generative models."
		labelledById="research-heading"
	>
		<div class="mt-10 grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
			<div class="space-y-5 text-lg leading-relaxed text-fg">
				<p>
					EEG microstates are quasi-stable scalp topographies, typically four to seven canonical
					classes, that segment continuous EEG signal into a discrete temporal alphabet. The
					classical approach uses modified k-means clustering over the global field power maxima. It
					works, but it depends on hard choices (the number of states, the reference electrode, the
					band-pass) and the resulting segmentation can be brittle across sessions.
				</p>
				<p>
					This project asks whether a <em>learned</em> latent geometry, via a variational autoencoder,
					produces a microstate alphabet that is more interpretable, more stable across sessions, and
					more predictive of behaviour than the classical pipeline.
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
						<strong class="text-fg">GMM-VAE.</strong> Gaussian-mixture latent prior with one component
						per microstate class, so the segmentation falls out of the latent prior structure rather than
						a post-hoc clustering step.
					</li>
					<li>
						<strong class="text-fg">Architecture search.</strong> Sweep over latent dim, regularisation,
						and decoder choices; compare reconstruction-vs-segmentation tradeoff curves across architectures.
					</li>
				</ul>

				{#if recentPublications.length > 0}
					<h3
						id="research-publications"
						class="font-display text-fg pt-8 text-2xl tracking-tight sm:text-3xl"
					>
						Recent publications
					</h3>
					<ul class="mt-2 space-y-5">
						{#each recentPublications as pub (pub.slug)}
							<li class="border-l-2 border-border pl-4">
								<a
									href={`/publications/${pub.slug}`}
									class="font-display text-fg hover:text-accent text-lg leading-tight
										transition-colors duration-[var(--duration-fast)]"
								>
									{pub.title}
								</a>
								<p class="font-mono text-fg-muted mt-1 text-xs tracking-[0.1em]">
									{pub.authors.join(', ')}
								</p>
								<p class="text-fg-soft mt-1 text-sm">
									{#if pub.venue}{pub.venue} ·
									{/if}{pub.year}
								</p>
							</li>
						{/each}
					</ul>
					<p class="mt-6">
						<Link href="/publications" variant="arrow">View all publications</Link>
					</p>
				{/if}
			</div>

			<aside class="space-y-6">
				<div class="rounded-card border-border bg-bg-soft border p-6">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Status</p>
					<p class="font-display text-fg mt-2 text-2xl">In progress</p>
					<p class="text-fg-soft mt-3 text-sm">
						PhD at University College Cork. {recentPublications.length}
						{recentPublications.length === 1 ? 'publication' : 'publications'} so far across microstate
						analysis and adjacent ML/health work.
					</p>
				</div>
				<div class="rounded-card border-border border p-6">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Supervisor</p>
					<p class="text-fg mt-2">
						<Link href="https://lucalongo.eu" variant="inline">Luca Longo</Link>, UCC
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
				caption="Vanilla variational autoencoder with a single Gaussian latent prior."
			/>
			<DiagramFigure
				title="VAE-GMM"
				caption="VAE with a Gaussian-mixture posterior at the latent level."
			/>
			<DiagramFigure
				title="GMM-VAE"
				caption="Mixture-of-Gaussians latent prior with class structure native to the prior."
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
