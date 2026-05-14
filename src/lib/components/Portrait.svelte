<script lang="ts">
	type Props = {
		src?: string;
		alt?: string;
		caption?: string;
	};

	let { src, alt = 'Saheed Faremi', caption }: Props = $props();
</script>

<figure class="relative">
	{#if src}
		<div class="aspect-[4/5] overflow-hidden rounded-card border border-border bg-bg-soft">
			<img {src} {alt} class="h-full w-full object-cover" loading="lazy" decoding="async" />
		</div>
	{:else}
		<!--
			Placeholder portrait. Replace with a real <Portrait src="…"> once the photo
			lands in src/lib/assets/. Until then, render as a clearly intentional
			placeholder (not a broken box) so the layout reads as designed.
		-->
		<div class="relative aspect-[4/5] overflow-hidden rounded-card border border-border bg-bg-soft">
			<div
				class="absolute inset-0 opacity-70"
				style="background:
					radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--color-phosphor) 35%, transparent), transparent 55%),
					radial-gradient(circle at 70% 75%, color-mix(in oklab, var(--color-violet) 30%, transparent), transparent 55%);"
			></div>
			<div class="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.25"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-fg-soft"
					aria-hidden="true"
				>
					<circle cx="12" cy="8" r="4" />
					<path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
				</svg>
				<p class="font-mono text-fg-soft mt-3 text-xs tracking-[0.2em] uppercase">Portrait</p>
				<p class="text-fg-muted mt-1 text-xs">forthcoming</p>
			</div>
		</div>
	{/if}
	{#if caption}
		<figcaption class="font-mono text-fg-muted mt-3 text-xs tracking-[0.15em] uppercase">
			{caption}
		</figcaption>
	{/if}
</figure>
