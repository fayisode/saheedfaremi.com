<script lang="ts">
	import {
		Container,
		HeroCanvas,
		Section,
		Portrait,
		PulledQuote,
		DiagramFigure,
		Card,
		Tag,
		Link,
		SocialLinks,
		Seo
	} from '$lib/components';
	import portraitUrl from '$lib/assets/portrait.jpg';
	import { publications, sortByYearDesc } from '$lib/content/loader';

	const tagline = 'Researcher of the brain. Engineer of the systems people rely on.';

	// Hero credential strip. Named institutions and outcomes, not abstract
	// counts: each name carries its own context for the reader.
	const heroCredentials = [
		{ label: 'Published', names: 'Brain Informatics · IEEE ICTAS' },
		{ label: 'Built', names: 'Curnance · Etihuku · Gijima' },
		{ label: 'Research', names: 'UCC · AICL Lab' },
		{ label: 'Recognition', names: 'UNESCO Gold · Google NLP Hack' }
	];

	// Recent publications surfaced on the Research section. Sort newest-first;
	// /publications carries the full archive.
	const recentPublications = sortByYearDesc([...publications]);
</script>

<Seo
	title="Saheed Faremi · Researcher & Engineer"
	description="Saheed Faremi: PhD-track EEG-microstate researcher and full-stack engineer building production systems in fintech, healthcare, education, HR, and agriculture."
/>

<!-- Encoder → latent → decoder schematic, shared across the three model variants.
     Defined at the component top level (not inside a component) so it stays a local
     snippet rather than being read as a component prop. The latent node carries the
     accent colour (theme-remapped); only its label differs between architectures. -->
{#snippet arch(latentTop: string, latentBottom: string)}
	<svg
		viewBox="0 0 330 92"
		fill="none"
		class="font-mono text-fg-soft block w-full"
		role="img"
		aria-label="Encoder to {latentBottom} latent to decoder"
	>
		<defs>
			<marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
				<path d="M0 0L6 3L0 6Z" fill="currentColor" />
			</marker>
		</defs>
		<text x="2" y="50" font-size="11" fill="currentColor">x</text>
		<line x1="12" y1="46" x2="36" y2="46" stroke="currentColor" marker-end="url(#arrowhead)" />
		<rect x="40" y="26" width="68" height="40" rx="6" stroke="currentColor" />
		<text x="74" y="50" font-size="10" fill="currentColor" text-anchor="middle">Encoder</text>
		<line x1="108" y1="46" x2="124" y2="46" stroke="currentColor" marker-end="url(#arrowhead)" />
		<g class="text-accent">
			<rect x="128" y="26" width="74" height="40" rx="6" stroke="currentColor" />
			<text x="165" y="44" font-size="12" fill="currentColor" text-anchor="middle">{latentTop}</text
			>
			<text x="165" y="57" font-size="8" fill="currentColor" text-anchor="middle"
				>{latentBottom}</text
			>
		</g>
		<line x1="202" y1="46" x2="218" y2="46" stroke="currentColor" marker-end="url(#arrowhead)" />
		<rect x="222" y="26" width="68" height="40" rx="6" stroke="currentColor" />
		<text x="256" y="50" font-size="10" fill="currentColor" text-anchor="middle">Decoder</text>
		<line x1="290" y1="46" x2="312" y2="46" stroke="currentColor" marker-end="url(#arrowhead)" />
		<text x="315" y="50" font-size="11" fill="currentColor">x̂</text>
	</svg>
{/snippet}

<!-- HERO -->
<div class="relative isolate min-h-dvh overflow-hidden">
	<HeroCanvas />

	<Container width="default" class="relative z-10 flex min-h-dvh flex-col justify-between py-24">
		<!-- Top-of-hero credential. Carries the strongest external proof above the
		     fold instead of a decorative version stamp. Not a <header> element: the
		     layout's SiteNav is the page's banner landmark (one per page). -->
		<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
			<p class="font-mono text-fg-soft text-xs tracking-[0.2em] uppercase">
				<span class="text-accent" aria-hidden="true">●</span> UNESCO 2022 Gold · PhD-track, UCC
			</p>
			<p
				class="font-mono text-fg-soft rounded-pill border-border bg-bg-soft/60 inline-flex
					items-center gap-2 border px-3 py-1 text-[11px] tracking-[0.15em] uppercase"
			>
				<span class="hero-pulse bg-accent inline-block h-1.5 w-1.5 rounded-full" aria-hidden="true"
				></span>
				Open to collaboration
			</p>
		</div>

		<section class="my-auto" aria-labelledby="hero-heading">
			<div class="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
				<div>
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
					<p class="text-fg mt-8 max-w-xl text-lg leading-relaxed text-balance sm:text-xl">
						{tagline}
					</p>
				</div>

				<div class="relative mx-auto w-56 sm:w-64 md:mx-0 md:w-72">
					<div
						class="bg-accent/20 absolute -inset-3 rounded-[2rem] blur-2xl"
						aria-hidden="true"
					></div>
					<Portrait src={portraitUrl} alt="Saheed Faremi" />
				</div>
			</div>
		</section>

		<!-- Bottom band: proof stats above a drifting EEG trace. The numbers are the
		     same verified figures used on the CV; the trace is the thesis in one glyph. -->
		<div>
			<div
				class="border-border grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-6 sm:grid-cols-4"
				aria-label="Credentials"
			>
				{#each heroCredentials as group (group.label)}
					<div>
						<p class="font-mono text-fg-muted text-[11px] tracking-[0.15em] uppercase">
							{group.label}
						</p>
						<p class="text-fg mt-2 text-sm leading-relaxed">{group.names}</p>
					</div>
				{/each}
			</div>

			<svg
				viewBox="0 0 1200 64"
				preserveAspectRatio="none"
				class="text-accent/50 mt-10 block h-10 w-full"
				fill="none"
				aria-hidden="true"
			>
				<g class="hero-eeg">
					<path
						d="M0,32 L40,30 L72,36 L104,24 L128,32 L160,30 L192,34 L224,28 L240,10 L256,54 L272,32 L304,30 L336,36 L368,26 L400,32 L432,30 L464,34 L496,28 L512,12 L528,52 L544,32 L576,30 L608,36 L640,24 L672,32 L704,30 L736,34 L768,28 L784,10 L800,54 L816,32 L848,30 L880,36 L912,26 L944,32 L976,30 L1008,34 L1040,28 L1056,12 L1072,52 L1088,32 L1120,30 L1152,36 L1184,26 L1200,32"
						stroke="currentColor"
						stroke-width="1.25"
						stroke-linejoin="round"
						stroke-linecap="round"
					/>
					<path
						d="M0,32 L40,30 L72,36 L104,24 L128,32 L160,30 L192,34 L224,28 L240,10 L256,54 L272,32 L304,30 L336,36 L368,26 L400,32 L432,30 L464,34 L496,28 L512,12 L528,52 L544,32 L576,30 L608,36 L640,24 L672,32 L704,30 L736,34 L768,28 L784,10 L800,54 L816,32 L848,30 L880,36 L912,26 L944,32 L976,30 L1008,34 L1040,28 L1056,12 L1072,52 L1088,32 L1120,30 L1152,36 L1184,26 L1200,32"
						stroke="currentColor"
						stroke-width="1.25"
						stroke-linejoin="round"
						stroke-linecap="round"
						transform="translate(1200,0)"
					/>
				</g>
			</svg>
		</div>
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
					I am a PhD researcher at University College Cork, supervised by Luca Longo at the
					<Link href="https://lucalongo.eu/LongoLab.php" variant="inline"
						>Artificial Intelligence and Cognitive Load Lab</Link
					>, working on unsupervised deep learning for EEG signal analysis. Before that I completed
					an MSc in Computer Science (machine-learning concentration) at Technological University
					Dublin with a 4.0/4.0 GPA, and a BSc in Information Technology at the University of
					Eswatini. Alongside the doctorate, I work as a data scientist and engineer, shipping the
					production systems that under-served users (geographically, economically, or
					computationally) depend on.
				</p>
				<p>
					The research: <strong>EEG microstates</strong> are quasi-stable scalp topographies that segment
					ongoing brain activity into a discrete temporal alphabet. Find the recurrent patterns and you
					have a candidate indicator. My doctorate asks whether deep generative models (variational autoencoders
					with a Gaussian-mixture prior) can learn a microstate alphabet that is more stable across sessions
					and more predictive of behaviour than classical clustering. The aim is a representation reliable
					enough to support the detection of disorder-relevant brain states.
				</p>
				<p>
					On the engineering side, I was founding engineer at Curnance, a multi-asset fintech
					platform where I shipped the admin console, wallet, and KYC subsystems, and a data
					scientist at Etihuku, where my LLM document-generation pipeline on Azure ML Studio cut
					manual document creation by 85% across three compliance regions. Infrastructure for
					under-served users demands the same rigour as infrastructure for everyone else; in
					practice, it usually demands more.
				</p>
				<p>
					In 2022 I represented Eswatini at the
					<Link
						href="https://medium.com/@sonirudrakshi99/unesco-india-africa-hackathon-2022-2ec88cea6eb9"
						variant="inline">UNESCO India-Africa Hackathon</Link
					>
					at Gautam Buddha University, Uttar Pradesh. Team <em>Geeks_on_Fire</em> (five people, five countries)
					won problem statement AGRI12 with an AI-assisted voice contact centre that lets farmers without
					smartphones report issues by phone and receive guidance in their own language. The win earned
					gold medals and a &#8377;3 lakh team prize.
				</p>
				<p class="text-fg-soft text-base">
					Based in Dublin, Ireland. Travel for research. <Tag>open to collaboration</Tag>
				</p>
				<SocialLinks class="pt-2" />
			</div>
		</div>

		<PulledQuote attribution="Working hypothesis">
			Find the recurrent patterns and you have a candidate indicator.
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
				<Card>
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Status</p>
					<p class="font-display text-fg mt-2 text-2xl">In progress</p>
					<p class="text-fg-soft mt-3 text-sm">
						PhD at University College Cork. {recentPublications.length}
						{recentPublications.length === 1 ? 'publication' : 'publications'} so far across microstate
						analysis and adjacent ML/health work.
					</p>
				</Card>
				<Card variant="outlined">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Supervisor</p>
					<p class="text-fg mt-2">
						<Link href="https://lucalongo.eu" variant="inline">Luca Longo</Link>, UCC
					</p>
				</Card>
				<Card variant="outlined">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Research group</p>
					<p class="text-fg mt-2">
						<Link href="https://lucalongo.eu/LongoLab.php" variant="inline"
							>Artificial Intelligence and Cognitive Load Lab (AICL)</Link
						>
					</p>
					<p class="text-fg-soft mt-2 text-sm">
						Member. School of Computer Science and Information Technology, University College Cork.
					</p>
				</Card>
				<Card variant="outlined">
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Stack</p>
					<div class="mt-3 flex flex-wrap gap-2">
						<Tag>Python</Tag>
						<Tag>PyTorch</Tag>
						<Tag>MNE</Tag>
						<Tag>NumPy</Tag>
						<Tag>scikit-learn</Tag>
					</div>
				</Card>

				<Card>
					<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
						<span class="text-accent" aria-hidden="true">●</span> Support this work
					</p>
					<p class="text-fg-soft mt-3 text-sm leading-relaxed">
						I am seeking collaboration, funding, and computing resources for this doctoral research,
						and welcome sponsorship and research partnerships.
					</p>
					<p class="mt-3">
						<Link href="mailto:saheedfaremi@gmail.com" variant="arrow">saheedfaremi@gmail.com</Link>
					</p>
				</Card>
			</aside>
		</div>

		<div class="mt-16 grid gap-8 md:grid-cols-3">
			<DiagramFigure
				title="VAE"
				caption="Vanilla variational autoencoder with a single Gaussian latent prior."
			>
				{@render arch('z', 'N(μ,σ)')}
			</DiagramFigure>
			<DiagramFigure
				title="VAE-GMM"
				caption="VAE with a Gaussian-mixture posterior at the latent level."
			>
				{@render arch('z', 'GMM post.')}
			</DiagramFigure>
			<DiagramFigure
				title="GMM-VAE"
				caption="Mixture-of-Gaussians latent prior with class structure native to the prior."
			>
				{@render arch('z', 'GMM prior')}
			</DiagramFigure>
		</div>
	</Section>
</Container>

<style>
	/* EEG trace drift: the duplicated path sits 1200px to the right, so sliding
	   the group one full width loops seamlessly. Reduced-motion users get a
	   static trace via the global animation cap in app.css. */
	.hero-eeg {
		animation: hero-eeg-drift 14s linear infinite;
	}

	@keyframes hero-eeg-drift {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-1200px);
		}
	}

	.hero-pulse {
		animation: hero-pulse 2.4s ease-in-out infinite;
	}

	@keyframes hero-pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.45;
			transform: scale(0.8);
		}
	}
</style>
