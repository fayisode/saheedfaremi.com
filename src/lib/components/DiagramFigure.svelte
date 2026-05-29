<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		src?: string;
		alt?: string;
		title: string;
		caption?: string;
		children?: Snippet;
	};

	let { src, alt, title, caption, children }: Props = $props();
</script>

<figure class="space-y-3">
	{#if src}
		<!-- aspect-[16/10] reserves space so the image load doesn't cause CLS once a real
		     SVG/PNG lands (the img carries no intrinsic width/height attributes). -->
		<div class="rounded-card border-border bg-bg-soft aspect-[16/10] overflow-hidden border p-4">
			<img
				{src}
				alt={alt ?? title}
				class="block h-full w-full object-contain"
				loading="lazy"
				decoding="async"
			/>
		</div>
	{:else if children}
		<div class="rounded-card border-border bg-bg-soft border p-4">
			{@render children()}
		</div>
	{:else}
		<!--
			Placeholder diagram slot. Replace by exporting the corresponding
			.drawio file from ~/Documents/ to SVG and passing as `src`.
		-->
		<div
			class="rounded-card border-border bg-bg-soft relative flex aspect-[16/10] items-center
				justify-center border border-dashed p-4"
		>
			<!-- Placeholder graphic only. The title shows up once below via the figcaption
			     prefix; rendering it twice (here + figcaption) was confusing. -->
			<div class="text-center">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.25"
					class="text-fg-muted mx-auto"
					aria-hidden="true"
				>
					<rect x="3" y="3" width="7" height="7" rx="1" />
					<rect x="14" y="3" width="7" height="7" rx="1" />
					<rect x="3" y="14" width="7" height="7" rx="1" />
					<rect x="14" y="14" width="7" height="7" rx="1" />
					<path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
				</svg>
				<p class="text-fg-muted mt-3 text-xs">diagram forthcoming</p>
			</div>
		</div>
	{/if}
	<figcaption class="text-fg-soft text-sm">
		<span class="font-mono text-fg-muted mr-2 text-xs tracking-[0.15em] uppercase">{title}</span>
		{#if caption}{caption}{/if}
	</figcaption>
</figure>
