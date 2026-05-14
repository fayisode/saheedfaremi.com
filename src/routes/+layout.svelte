<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import frauncesLatin from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url';
	import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={frauncesLatin} />
	<link rel="preload" as="font" type="font/woff2" crossorigin="anonymous" href={interLatin} />
</svelte:head>

{@render children()}
