<script lang="ts">
	import { Container, Section, IndexRow, Tag, Link, Seo } from '$lib/components';
	import type { Award, News } from '$lib/content/schemas';

	type RecognitionEntry =
		| { type: 'award'; year: number; data: Award }
		| { type: 'news'; year: number; data: News };

	let {
		data
	}: {
		data: {
			entries: RecognitionEntry[];
			counts: { awards: number; news: number };
		};
	} = $props();

	// Continuous descending numbering, newest first.
	const numbers = $derived(
		new Map(data.entries.map((e, i) => [e.type + e.data.slug, data.entries.length - i]))
	);
</script>

<Seo
	title="Recognition · Saheed Faremi"
	description="Awards and recognition received by Saheed Faremi."
/>

<Container width="wide">
	<Section
		spacing="loose"
		eyebrow="Index · Recognition"
		heading="Awards and press."
		labelledById="recognition-heading"
	>
		<p class="text-fg-soft mt-4 max-w-2xl text-lg leading-relaxed">
			Competitive wins ({data.counts.awards}) and press coverage ({data.counts.news}), newest-first.
		</p>

		{#if data.entries.length === 0}
			<p class="text-fg-muted mt-8 text-sm">Nothing listed yet.</p>
		{:else}
			<ol class="divide-border border-border mt-12 divide-y border-t">
				{#each data.entries as entry (entry.type + entry.data.slug)}
					<IndexRow
						number={numbers.get(entry.type + entry.data.slug) ?? 0}
						href={entry.type === 'award' ? `/awards/${entry.data.slug}` : `/news/${entry.data.slug}`}
						title={entry.data.title}
					>
						{#snippet overline()}{entry.year}{/snippet}
						{#snippet subline()}
							{#if entry.type === 'award'}
								{entry.data.organization}{entry.data.prize ? ` · ${entry.data.prize}` : ''}
							{:else}
								{entry.data.outlet ?? ''}{entry.data.publishedAt
									? `${entry.data.outlet ? ' · ' : ''}${entry.data.publishedAt}`
									: ''}
							{/if}
						{/snippet}
						<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
							<Tag>{entry.type === 'award' ? 'award' : 'press'}</Tag>
							{#if entry.data.url}
								<Link href={entry.data.url} variant="inline">
									{entry.type === 'award' ? 'Details' : 'Read the source'}
								</Link>
							{/if}
						</div>
					</IndexRow>
				{/each}
			</ol>
		{/if}
	</Section>
</Container>
