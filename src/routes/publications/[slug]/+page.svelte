<script lang="ts">
	import { browser } from '$app/environment';
	import { Container, Section, Link } from '$lib/components';
	import { toBibtex } from '$lib/content/loader';
	import type { Component } from 'svelte';
	import type { Publication } from '$lib/content/schemas';

	let { data }: { data: { meta: Publication; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);

	// Citation. Auto-generate BibTeX from metadata unless the entry overrides it.
	const bibtex = $derived(meta.bibtex ?? toBibtex(meta));

	// ScholarlyArticle structured data so academic crawlers can parse the work.
	// type=application/ld+json is a data block (not executed) so it is not subject
	// to the script-src CSP. The escaped "<\/script>" stops the Svelte compiler
	// from closing this block early, and "<" in the JSON body is escaped to <
	// so a stray close-script sequence in any metadata field cannot break out.
	const ldJson = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'ScholarlyArticle',
			headline: meta.title,
			name: meta.title,
			author: meta.authors.map((a) => ({ '@type': 'Person', name: a })),
			datePublished: String(meta.year),
			inLanguage: 'en',
			// Only journals are schema.org Periodicals; tagging a conference/workshop
			// venue as Periodical fails validation, so the venue stays in page text.
			...(meta.kind === 'journal' && meta.venue
				? { isPartOf: { '@type': 'Periodical', name: meta.venue } }
				: {}),
			...(meta.abstract ? { abstract: meta.abstract } : {}),
			...(meta.doi
				? { sameAs: `https://doi.org/${meta.doi}` }
				: meta.url
					? { sameAs: meta.url }
					: {})
		}).replace(/</g, '\\u003c')
	);
	const ldScript = $derived(`<script type="application/ld+json">${ldJson}<\/script>`);

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | null = null;
	async function copyBibtex() {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(bibtex);
			copied = true;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1800);
		} catch {
			// clipboard can fail without HTTPS / in private mode; the <pre> stays
			// selectable as a fallback.
		}
	}
</script>

<svelte:head>
	<title>{meta.title} · Publications · Saheed Faremi</title>
	{#if meta.summary}
		<meta name="description" content={meta.summary} />
	{/if}
	{@html ldScript}
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="pub-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/publications" variant="plain">← Publications</Link> · {meta.year} · {meta.kind}
		</p>
		<h1
			id="pub-heading"
			class="font-display text-fg mt-6 text-3xl leading-[1.15] tracking-tight sm:text-4xl"
		>
			{meta.title}
		</h1>
		<p class="font-mono text-fg-soft mt-4 text-sm">{meta.authors.join(' · ')}</p>
		{#if meta.venue}
			<p class="text-fg-soft mt-2 italic">{meta.venue}</p>
		{/if}

		{#if meta.abstract}
			<div class="rounded-card border-border bg-bg-soft mt-10 max-w-3xl border p-6">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Abstract</p>
				<p class="text-fg mt-3 leading-relaxed">{meta.abstract}</p>
			</div>
		{/if}

		<article class="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-fg">
			{#if Body}
				<Body />
			{/if}
		</article>

		<div class="mt-10 flex flex-wrap gap-4">
			{#if meta.doi}
				<Link href={`https://doi.org/${meta.doi}`} variant="arrow">DOI: {meta.doi}</Link>
			{/if}
			{#if meta.url}
				<Link href={meta.url} variant="arrow">Read online</Link>
			{/if}
			{#if meta.pdf}
				<Link href={meta.pdf} variant="arrow">PDF</Link>
			{/if}
		</div>

		<details class="rounded-card border-border bg-bg-soft mt-10 max-w-3xl border p-6">
			<summary class="font-mono text-fg-soft cursor-pointer text-xs tracking-[0.2em] uppercase">
				Cite (BibTeX)
			</summary>
			<div class="mt-4 flex justify-end">
				<button
					type="button"
					onclick={copyBibtex}
					class="font-mono text-fg-soft hover:text-fg hover:bg-bg rounded-soft border-border
						inline-flex h-8 items-center gap-2 border px-3 text-xs tracking-[0.15em] uppercase
						transition-colors duration-[var(--duration-fast)] focus-visible:outline-2
						focus-visible:outline-offset-2 focus-visible:outline-accent"
					aria-live="polite"
				>
					{copied ? 'Copied ✓' : 'Copy'}
				</button>
			</div>
			<pre
				class="text-fg-soft mt-2 overflow-x-auto font-mono text-xs leading-relaxed">{bibtex}</pre>
		</details>
	</Section>
</Container>
