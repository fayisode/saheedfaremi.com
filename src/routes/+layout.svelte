<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import frauncesLatin from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url';
	import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
	import { SiteNav } from '$lib/components';

	let { children } = $props();

	// Public anchors / routes — surface only what's currently live. New entries
	// land here per phase (Projects in Phase 5, Publications in Phase 6, etc.).
	const navLinks = [
		{ href: '/#about', label: 'About' },
		{ href: '/#research', label: 'Research' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={frauncesLatin} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={interLatin} />
</svelte:head>

<SiteNav links={navLinks} />

<main id="main">
	{@render children()}
</main>
