<script lang="ts">
	import { page } from '$app/state';

	type Props = {
		title: string;
		description: string;
		/** Override the canonical URL; defaults to the current page URL. */
		canonical?: string;
		/**
		 * Absolute URL of the social card image. Detail pages pass their generated
		 * per-entry card (static/og/, see scripts/generate-og-images.mjs); anything
		 * else falls back to the site-wide default card.
		 */
		image?: string;
	};

	let { title, description, canonical, image }: Props = $props();

	// Strip any querystring/hash for a stable canonical (e.g. /cv?track=software).
	const url = $derived(canonical ?? page.url.origin + page.url.pathname);
	const ogImage = $derived(image ?? 'https://saheedfaremi.com/og-image.png');
</script>

<!--
	Per-page SEO/social metadata. The layout supplies og:type, og:site_name, and
	twitter:card; this component adds the per-page title, description, canonical,
	social image (exactly one og:image per page), and og:/twitter title+description
	so shared links render a populated social card instead of a blank one.
-->
<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>
