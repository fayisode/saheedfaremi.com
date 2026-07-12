<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import frauncesLatin from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url';
	import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
	import { SiteNav, Footer } from '$lib/components';

	let { children } = $props();

	// Public anchors / routes · surface only what's currently live. New entries
	// land here per phase (Projects in Phase 5, Publications in Phase 6, etc.).
	const navLinks = [
		{ href: '/#about', label: 'About' },
		{ href: '/#research', label: 'Research' },
		{ href: '/publications', label: 'Publications' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/awards', label: 'Recognition' },
		{ href: '/cv', label: 'CV' },
		{ href: '/contact', label: 'Contact' }
	];

	// Footer site map. Splits the nav into "the work" vs "everything else", and adds
	// Talks/News which have live routes but no top-nav slot, so nothing is unreachable.
	const footerExplore = [
		{ href: '/publications', label: 'Publications' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/talks', label: 'Talks' }
	];
	const footerAbout = [
		{ href: '/#about', label: 'About' },
		{ href: '/now', label: 'Now' },
		{ href: '/#research', label: 'Research' },
		{ href: '/awards', label: 'Recognition' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={frauncesLatin} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={interLatin} />
	<!-- Open Graph + Twitter · global defaults; individual routes can override
	     via their own <svelte:head> if richer cards are needed later. -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Saheed Faremi" />
	<meta property="og:image" content="/og-image.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="/og-image.png" />
	<link rel="alternate" type="application/atom+xml" title="Saheed Faremi" href="/rss.xml" />
</svelte:head>

<SiteNav links={navLinks} />

<main id="main">
	{@render children()}
</main>

<Footer explore={footerExplore} about={footerAbout} />
