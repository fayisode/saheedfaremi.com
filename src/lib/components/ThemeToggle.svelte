<script lang="ts">
	import { browser } from '$app/environment';

	type Theme = 'dark' | 'light';

	// On the client, read the live `data-theme` attribute set by /theme-init.js
	// before the component hydrates. On the server (prerender), default to dark
	// so the rendered HTML is consistent — the client immediately corrects after
	// hydration if the user's actual preference is light.
	let theme = $state<Theme>(
		browser ? (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark') : 'dark'
	);

	function toggle() {
		const next: Theme = theme === 'dark' ? 'light' : 'dark';
		theme = next;
		document.documentElement.setAttribute('data-theme', next);
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage unavailable (private mode, quota); the data-theme attribute
			// still applies for the current session.
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label="Toggle colour theme"
	aria-pressed={theme === 'light'}
	title="Toggle theme ({theme === 'dark' ? 'currently dark' : 'currently light'})"
	class="group inline-flex h-9 w-9 items-center justify-center rounded-pill
		border border-border bg-bg-soft text-fg-soft
		transition-[background-color,border-color,color] duration-[var(--duration-fast)]
		ease-[var(--ease-out-quart)] hover:border-accent hover:text-accent
		focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
>
	{#if theme === 'dark'}
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{:else}
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		</svg>
	{/if}
</button>
