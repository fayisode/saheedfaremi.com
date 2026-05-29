<script lang="ts">
	import type { Track, TrackKeyT } from './tracks';

	type Props = {
		tracks: readonly Track[];
		active: TrackKeyT;
		onselect: (key: TrackKeyT) => void;
	};

	let { tracks, active, onselect }: Props = $props();
</script>

<!--
	Segmented control as a group of toggle buttons (role=group + aria-pressed) rather
	than a tablist: the track-swappable content (summary, skills, focus) is spread
	across the page, not a single contiguous tabpanel, so tablist/aria-controls would
	dangle. Buttons keep normal Tab order and announce their pressed state.
	.cv-print-btn so the existing /cv print rule hides the control.
-->
<div
	role="group"
	aria-label="CV emphasis"
	class="cv-print-btn border-border bg-bg-soft inline-flex flex-wrap gap-1 rounded-soft border p-1"
>
	{#each tracks as track (track.key)}
		{@const selected = track.key === active}
		<button
			type="button"
			aria-pressed={selected}
			onclick={() => onselect(track.key)}
			class="rounded-soft px-3 py-1.5 font-mono text-xs tracking-[0.15em] uppercase
				transition-colors duration-[var(--duration-fast)]
				focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
				{selected ? 'bg-bg text-fg shadow-sm' : 'text-fg-soft hover:text-fg'}"
		>
			{track.label}
		</button>
	{/each}
</div>
