<script lang="ts">
	import { page } from '$app/state';

	type Props = {
		title: string;
		description: string;
		/** Override the canonical URL; defaults to the current page URL. */
		canonical?: string;
	};

	let { title, description, canonical }: Props = $props();

	// Strip any querystring/hash for a stable canonical (e.g. /cv?track=software).
	const url = $derived(canonical ?? page.url.origin + page.url.pathname);
</script>

<!--
	Per-page SEO/social metadata. The layout supplies site-wide og:image,
	twitter:card, og:site_name, and a default og:type=website; this component adds
	the per-page title, description, canonical, and og:/twitter title+description so
	shared links render a populated social card instead of a blank one.
	It deliberately does NOT re-emit og:image/og:type to avoid duplicate tags.
-->
<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
