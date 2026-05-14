<script lang="ts">
	import { Container, Section, Tag, Link } from '$lib/components';
	import type { Component } from 'svelte';
	import type { Project } from '$lib/content/schemas';

	let { data }: { data: { meta: Project; Component: Component | null } } = $props();

	const meta = $derived(data.meta);
	const Body = $derived(data.Component);
	const isDraft = $derived(meta.status === 'draft');
</script>

<svelte:head>
	<title>{meta.title} — Projects — Saheed Faremi</title>
	{#if meta.summary}
		<meta name="description" content={meta.summary} />
	{/if}
</svelte:head>

<Container width="default">
	<Section spacing="loose" labelledById="project-heading">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			<Link href="/projects" variant="plain">← Projects</Link> · {meta.domain}
		</p>

		<h1
			id="project-heading"
			class="font-display text-fg mt-6 text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
		>
			{meta.title}
		</h1>

		{#if isDraft}
			<p class="mt-4">
				<Tag variant="accent">Draft</Tag>
				<span class="text-fg-muted ml-2 text-sm">
					This entry is a first-pass description drawn from public repos. The body below will be
					replaced with verified content.
				</span>
			</p>
		{/if}

		{#if meta.summary}
			<p class="text-fg mt-6 max-w-2xl text-xl leading-relaxed">
				{meta.summary}
			</p>
		{/if}

		<div class="mt-12 grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
			<article class="space-y-5 text-lg leading-relaxed text-fg">
				{#if Body}
					<Body />
				{:else}
					<p class="text-fg-muted italic">No body content yet for this entry.</p>
				{/if}
			</article>

			<aside class="space-y-6">
				{#if meta.role}
					<div class="rounded-card border-border bg-bg-soft border p-6">
						<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Role</p>
						<p class="text-fg mt-2">{meta.role}</p>
					</div>
				{/if}

				{#if meta.tech.length}
					<div class="rounded-card border-border border p-6">
						<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Stack</p>
						<div class="mt-3 flex flex-wrap gap-2">
							{#each meta.tech as t (t)}
								<Tag>{t}</Tag>
							{/each}
						</div>
					</div>
				{/if}

				{#if meta.highlights.length}
					<div class="rounded-card border-border border p-6">
						<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Highlights</p>
						<ul class="text-fg-soft mt-3 list-disc space-y-2 pl-5 text-sm">
							{#each meta.highlights as h (h)}
								<li>{h}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if meta.links.live || meta.links.repo || meta.links.caseStudy}
					<div class="rounded-card border-border border p-6">
						<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Links</p>
						<ul class="mt-3 space-y-2 text-sm">
							{#if meta.links.live}
								<li><Link href={meta.links.live} variant="arrow">Live site</Link></li>
							{/if}
							{#if meta.links.repo}
								<li><Link href={meta.links.repo} variant="arrow">Repository</Link></li>
							{/if}
							{#if meta.links.caseStudy}
								<li><Link href={meta.links.caseStudy} variant="arrow">Case study</Link></li>
							{/if}
						</ul>
					</div>
				{/if}
			</aside>
		</div>
	</Section>
</Container>
