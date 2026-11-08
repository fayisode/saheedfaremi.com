<script lang="ts">
	import { toBibtex } from '$lib/content/loader';
	import type { Publication } from '$lib/content/schemas';
	import { isPeerReviewed, isUnderReview } from '$lib/cv/publications';
	import Link from './Link.svelte';

	let {
		items,
		start = 1,
		showBibtex = false,
		linkOrigin = ''
	}: {
		items: Publication[];
		start?: number;
		showBibtex?: boolean;
		linkOrigin?: string;
	} = $props();

	function withLinkOrigin(href: string): string {
		return linkOrigin && href.startsWith('/') ? `${linkOrigin}${href}` : href;
	}

	function venueBadge(p: Publication): string {
		const shortVenue = (p.venue ?? 'Research output').split(/\s*(?:\(|,)/)[0].trim();
		return new RegExp(`\\b${p.year}\\b`).test(shortVenue)
			? shortVenue
			: `${shortVenue} · ${p.year}`;
	}

	function statusDetail(p: Publication): string {
		if (isUnderReview(p)) return '';
		if (!isPeerReviewed(p) && /preprint/i.test(p.venue ?? '')) return 'Preprint';
		const labels: Record<Publication['kind'], string> = {
			journal: 'Journal article',
			conference: 'Conference paper',
			workshop: 'Workshop',
			preprint: 'Preprint',
			thesis: 'Thesis',
			'book-chapter': 'Book chapter'
		};
		return labels[p.kind];
	}
</script>

<ol
	{start}
	class="academic-publication-list divide-border marker:text-fg-muted mt-4 list-decimal divide-y pl-5 marker:font-mono marker:text-xs sm:pl-6"
>
	{#each items as p (p.slug)}
		{@const bibtex = p.bibtex ?? toBibtex(p)}
		<li class="publication-entry min-w-0 py-5 pl-1 first:pt-0 last:pb-0">
			<div class="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
				<h4 class="text-fg min-w-0 text-base leading-6 font-medium text-balance">
					<Link href={withLinkOrigin(`/publications/${p.slug}`)} variant="plain">{p.title}</Link>
				</h4>
				<span
					class="publication-badge border-border font-mono text-fg-muted rounded-soft shrink-0 border px-2 py-0.5 text-[11px] leading-4 whitespace-nowrap"
				>
					{venueBadge(p)}
				</span>
			</div>
			<p class="publication-authors text-fg-soft mt-2 text-sm leading-6">
				{#each p.authors as author, i (i)}
					{@const own = /saheed/i.test(author)}
					{#if own}<strong class="text-fg font-semibold">{author}</strong>{:else}<span
							>{author}</span
						>{/if}{i < p.authors.length - 1 ? ', ' : ''}
				{/each}
			</p>
			<em class="publication-venue text-fg-muted mt-1 block text-sm leading-6">
				{p.venue ? `${p.venue} · ` : ''}{p.year}{statusDetail(p) ? ` · ${statusDetail(p)}` : ''}
			</em>
			{#if p.doi || p.pdf || p.code || p.url}
				<div class="publication-links mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
					{#if p.doi}
						<Link
							href={`https://doi.org/${p.doi}`}
							variant="inline"
							class="inline-flex min-h-6 items-center"
							aria-label={`DOI for ${p.title}`}>DOI</Link
						>
					{/if}
					{#if p.pdf}
						<Link
							href={withLinkOrigin(p.pdf)}
							variant="inline"
							class="inline-flex min-h-6 items-center"
							aria-label={`PDF for ${p.title}`}>PDF</Link
						>
					{/if}
					{#if p.code}
						<Link
							href={p.code}
							variant="inline"
							class="inline-flex min-h-6 items-center"
							aria-label={`Code for ${p.title}`}>Code</Link
						>
					{/if}
					{#if p.url}
						<Link
							href={p.url}
							variant="inline"
							class="inline-flex min-h-6 items-center"
							aria-label={`Publication page for ${p.title}`}>Publication page</Link
						>
					{/if}
				</div>
			{/if}
			{#if showBibtex}
				<details class="publication-bibtex mt-2 text-xs print:hidden">
					<summary
						class="text-fg-soft hover:text-accent focus-visible:outline-accent rounded-soft inline-block cursor-pointer px-1 py-1 font-mono transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2"
					>
						BibTeX
					</summary>
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<pre
						role="region"
						aria-label={`BibTeX for ${p.title}`}
						tabindex="0"
						class="border-border bg-bg-soft focus-visible:outline-accent mt-2 max-w-full overflow-x-auto rounded-soft border p-3 font-mono text-[11px] leading-5 select-text focus-visible:outline-2 focus-visible:outline-offset-2"><code
							>{bibtex}</code
						></pre>
				</details>
			{/if}
		</li>
	{/each}
</ol>

<style>
	@media print {
		.academic-publication-list {
			font-size: 10pt;
		}

		.publication-entry {
			break-inside: avoid;
		}

		.publication-bibtex {
			display: none;
		}
	}
</style>
