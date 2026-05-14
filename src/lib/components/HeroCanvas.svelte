<script lang="ts">
	import { browser } from '$app/environment';
	import type { Stopper } from '$lib/canvas/microstate-field';

	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (!browser || !canvas) return;

		// Respect prefers-reduced-motion. Never load the OGL chunk at all.
		const prefersReducedMotion =
			window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		// Bail if WebGL isn't available. The CSS gradient under the canvas remains
		// the user's view.
		const ctx = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
		if (!ctx) return;

		let mounted = true;
		let stop: Stopper | null = null;

		(async () => {
			try {
				const mod = await import('$lib/canvas/microstate-field');
				if (!mounted || !canvas) return;
				stop = mod.startMicrostateField(canvas);
				// fade-in: avoid first-frame pop
				canvas.style.opacity = '0.35';
			} catch (err) {
				// Log but do not throw. The gradient fallback is already visible.
				if (typeof console !== 'undefined') {
					console.error('microstate-field failed to load', err);
				}
			}
		})();

		return () => {
			mounted = false;
			stop?.();
		};
	});
</script>

<div class="hero-canvas-frame" aria-hidden="true" role="presentation">
	<canvas bind:this={canvas} class="hero-canvas"></canvas>
</div>

<style>
	.hero-canvas-frame {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		/*
		 * CSS gradient fallback. Visible when JS is off, reduced-motion is set,
		 * WebGL is unavailable, or while the OGL chunk is still downloading.
		 * Same palette as the shader so the canvas painting over it feels
		 * continuous instead of swapping in.
		 */
		background:
			radial-gradient(
				ellipse 70% 60% at 30% 35%,
				color-mix(in oklab, var(--color-phosphor) 30%, transparent) 0%,
				transparent 60%
			),
			radial-gradient(
				ellipse 60% 50% at 70% 65%,
				color-mix(in oklab, var(--color-violet) 28%, transparent) 0%,
				transparent 60%
			),
			var(--color-bg);
		mask-image: radial-gradient(ellipse at center, #000 35%, transparent 100%);
	}

	.hero-canvas {
		width: 100%;
		height: 100%;
		display: block;
		opacity: 0;
		transition: opacity 600ms var(--ease-out-quart);
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-canvas {
			display: none;
		}
	}
</style>
