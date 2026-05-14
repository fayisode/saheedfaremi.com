<script lang="ts">
	import { Container, Section, Button, Link, Tag, Card, ThemeToggle } from '$lib/components';

	const colorTokens = [
		{ name: '--color-bg', token: 'bg-bg' },
		{ name: '--color-bg-soft', token: 'bg-bg-soft' },
		{ name: '--color-surface', token: 'bg-surface' },
		{ name: '--color-fg', token: 'bg-fg' },
		{ name: '--color-fg-soft', token: 'bg-fg-soft' },
		{ name: '--color-fg-muted', token: 'bg-fg-muted' },
		{ name: '--color-accent', token: 'bg-accent' },
		{ name: '--color-border', token: 'bg-border' },
		{ name: '--color-phosphor', token: 'bg-phosphor' },
		{ name: '--color-violet', token: 'bg-violet' }
	];

	const typeScale = [
		{ label: 'display-xl', class: 'text-display-xl' },
		{ label: 'display-lg', class: 'text-display-lg' },
		{ label: 'display-md', class: 'text-display-md' },
		{ label: 'display-sm', class: 'text-display-sm' },
		{ label: '4xl', class: 'text-4xl' },
		{ label: '2xl', class: 'text-2xl' },
		{ label: 'lg', class: 'text-lg' },
		{ label: 'base', class: 'text-base' },
		{ label: 'sm', class: 'text-sm' },
		{ label: 'xs', class: 'text-xs' }
	];
</script>

<svelte:head>
	<title>Kitchen Sink · Design System · Saheed Faremi</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="Internal design-system reference." />
</svelte:head>

<Container width="wide">
	<header class="flex items-center justify-between py-10">
		<div>
			<p class="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
				<span class="text-accent">●</span> Internal — not indexed
			</p>
			<h1 class="font-display mt-3 text-4xl tracking-tight text-fg sm:text-5xl">Kitchen sink</h1>
			<p class="mt-2 max-w-prose text-fg-soft">
				Every component, every variant, every state. Reference page for design-system drift checks.
			</p>
		</div>
		<ThemeToggle />
	</header>

	<Section eyebrow="01 — Color tokens" heading="Semantic palette" labelledById="sec-color">
		<p class="mt-2 text-fg-soft">
			Theme-aware tokens. Switch the theme above and watch them rebalance.
		</p>
		<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
			{#each colorTokens as { name, token } (name)}
				<div class="flex flex-col gap-2">
					<div
						class="aspect-square rounded-card border border-border {token}"
						aria-hidden="true"
					></div>
					<code class="font-mono text-xs text-fg-muted">{name}</code>
				</div>
			{/each}
		</div>
	</Section>

	<Section eyebrow="02 — Typography" heading="Type scale" labelledById="sec-type">
		<div class="mt-8 space-y-4">
			{#each typeScale as { label, class: cls } (label)}
				<div class="flex items-baseline gap-6 border-b border-border pb-4">
					<code class="w-28 shrink-0 font-mono text-xs text-fg-muted">{label}</code>
					<p class="font-display {cls} leading-none tracking-tight text-fg">Saheed Faremi</p>
				</div>
			{/each}
		</div>
		<div class="mt-10 space-y-3">
			<p class="font-display text-2xl text-fg">Fraunces — display serif</p>
			<p class="font-sans text-base text-fg-soft">
				Inter — body sans. The quick brown fox jumps over the lazy dog. 0123456789.
			</p>
			<p class="font-mono text-sm text-fg-soft">
				Geist Mono — for code, captions, metadata. `const microstate = ...`
			</p>
		</div>
	</Section>

	<Section eyebrow="03 — Buttons" heading="Action affordances" labelledById="sec-btn">
		<div class="mt-8 flex flex-wrap items-end gap-4">
			<Button variant="primary" size="lg">Primary · lg</Button>
			<Button variant="primary" size="md">Primary · md</Button>
			<Button variant="primary" size="sm">Primary · sm</Button>
		</div>
		<div class="mt-4 flex flex-wrap items-end gap-4">
			<Button variant="ghost" size="lg">Ghost · lg</Button>
			<Button variant="ghost" size="md">Ghost · md</Button>
			<Button variant="ghost" size="sm">Ghost · sm</Button>
		</div>
		<div class="mt-4 flex flex-wrap items-end gap-4">
			<Button variant="subtle" size="md">Subtle</Button>
			<Button variant="primary" size="md" disabled>Disabled</Button>
		</div>
	</Section>

	<Section eyebrow="04 — Tags" heading="Inline labels" labelledById="sec-tag">
		<div class="mt-8 flex flex-wrap gap-3">
			<Tag>outline</Tag>
			<Tag variant="solid">solid</Tag>
			<Tag variant="accent">accent</Tag>
			<Tag variant="outline">TypeScript</Tag>
			<Tag variant="outline">SvelteKit</Tag>
			<Tag variant="outline">EEG · Microstates</Tag>
		</div>
	</Section>

	<Section eyebrow="05 — Links" heading="Navigation affordances" labelledById="sec-link">
		<div class="mt-8 space-y-4">
			<p class="text-fg-soft">
				This is an
				<Link href="/">inline link</Link>
				inside a paragraph, mid-sentence.
			</p>
			<Link href="/" variant="arrow">See projects</Link>
			<br />
			<Link href="https://github.com/fayisode" variant="arrow">GitHub profile</Link>
			<br />
			<Link href="/" variant="plain">About (plain)</Link>
		</div>
	</Section>

	<Section eyebrow="06 — Cards" heading="Content containers" labelledById="sec-card">
		<div class="mt-8 grid gap-6 md:grid-cols-3">
			<Card>
				<p class="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">Default</p>
				<h3 class="font-display mt-3 text-xl text-fg">Microstate Analysis</h3>
				<p class="mt-2 text-sm text-fg-soft">
					EEG source segmentation via variational autoencoders.
				</p>
			</Card>
			<Card variant="elevated" interactive>
				<p class="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
					Elevated · Interactive
				</p>
				<h3 class="font-display mt-3 text-xl text-fg">Curnance</h3>
				<p class="mt-2 text-sm text-fg-soft">
					Multi-asset fintech platform — admin, wallet, KYC, monorepo.
				</p>
			</Card>
			<Card variant="outlined">
				<p class="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">Outlined</p>
				<h3 class="font-display mt-3 text-xl text-fg">Etihuku HRIS</h3>
				<p class="mt-2 text-sm text-fg-soft">Go-based HR system for African mid-market.</p>
			</Card>
		</div>
	</Section>

	<Section eyebrow="07 — Surfaces" heading="Radii & motion" labelledById="sec-surface">
		<div class="mt-8 grid gap-4 sm:grid-cols-4">
			<div class="aspect-square rounded-sharp bg-bg-soft border border-border p-4">
				<code class="font-mono text-xs text-fg-muted">sharp</code>
			</div>
			<div class="aspect-square rounded-soft bg-bg-soft border border-border p-4">
				<code class="font-mono text-xs text-fg-muted">soft</code>
			</div>
			<div class="aspect-square rounded-card bg-bg-soft border border-border p-4">
				<code class="font-mono text-xs text-fg-muted">card</code>
			</div>
			<div class="aspect-square rounded-pill bg-bg-soft border border-border p-4">
				<code class="font-mono text-xs text-fg-muted">pill</code>
			</div>
		</div>
	</Section>

	<footer
		class="border-t border-border py-10 font-mono text-xs tracking-[0.2em] text-fg-muted uppercase"
	>
		Saheed Faremi · design system · v0.1
	</footer>
</Container>
