import { Renderer, Program, Mesh, Triangle } from 'ogl';

export type Stopper = () => void;

/**
 * Mount an OGL-driven microstate field onto a canvas. Returns a teardown function.
 *
 * Only ever loaded via `await import(...)` from the HeroCanvas component, so the
 * OGL runtime and shader source live in a separate chunk that the initial page
 * load never fetches.
 *
 * Lifecycle state machine:
 *   isPaused() = !isIntersecting || document.hidden
 * RAF is scheduled iff !isPaused(). Both observers (IntersectionObserver +
 * visibilitychange) recompute the predicate and call schedule()/cancel()
 * accordingly. `webglcontextrestored` resumes after iOS Safari memory eviction.
 */
export function startMicrostateField(canvas: HTMLCanvasElement): Stopper {
	const parent = canvas.parentElement;
	if (!parent) {
		throw new Error('startMicrostateField: canvas must be mounted in the DOM');
	}

	const renderer = new Renderer({
		canvas,
		dpr: Math.min(window.devicePixelRatio || 1, 1.75),
		alpha: true,
		antialias: false,
		premultipliedAlpha: true
	});
	const gl = renderer.gl;
	gl.clearColor(0, 0, 0, 0);

	const geometry = new Triangle(gl);

	const program = new Program(gl, {
		vertex: VERTEX_SHADER,
		fragment: FRAGMENT_SHADER,
		uniforms: {
			uTime: { value: 0 },
			uResolution: { value: [parent.clientWidth, parent.clientHeight] }
		}
	});

	const mesh = new Mesh(gl, { geometry, program });

	let rafId = 0;
	let isIntersecting = true;
	const startTime = performance.now();

	function isPaused(): boolean {
		return !isIntersecting || document.hidden;
	}

	function schedule() {
		if (rafId !== 0) return;
		if (isPaused()) return;
		rafId = requestAnimationFrame(tick);
	}

	function cancel() {
		if (rafId !== 0) {
			cancelAnimationFrame(rafId);
			rafId = 0;
		}
	}

	function tick(now: number) {
		// Clear the id first so re-entrant schedule() calls (e.g., from a callback
		// that fires synchronously during render) don't double-book the next frame.
		rafId = 0;
		if (isPaused()) return;
		program.uniforms.uTime.value = (now - startTime) / 1000;
		renderer.render({ scene: mesh });
		rafId = requestAnimationFrame(tick);
	}

	function resize() {
		const w = parent!.clientWidth;
		const h = parent!.clientHeight;
		renderer.setSize(w, h);
		program.uniforms.uResolution.value = [w, h];
	}

	resize();
	schedule();

	const ro = new ResizeObserver(() => resize());
	ro.observe(parent);

	const io = new IntersectionObserver(
		([entry]) => {
			isIntersecting = entry?.isIntersecting ?? true;
			if (isPaused()) cancel();
			else schedule();
		},
		{ threshold: 0 }
	);
	io.observe(canvas);

	function onVisibilityChange() {
		if (isPaused()) cancel();
		else schedule();
	}
	document.addEventListener('visibilitychange', onVisibilityChange);

	function onContextLost(e: Event) {
		e.preventDefault();
		cancel();
	}
	canvas.addEventListener('webglcontextlost', onContextLost);

	// iOS Safari aggressively evicts WebGL contexts under memory pressure and
	// emits `webglcontextrestored` when the context comes back. Without resuming
	// here the canvas stays dark forever (until full page reload).
	function onContextRestored() {
		schedule();
	}
	canvas.addEventListener('webglcontextrestored', onContextRestored);

	return () => {
		cancel();
		ro.disconnect();
		io.disconnect();
		document.removeEventListener('visibilitychange', onVisibilityChange);
		canvas.removeEventListener('webglcontextlost', onContextLost);
		canvas.removeEventListener('webglcontextrestored', onContextRestored);
		// Explicitly release the WebGL context. OGL doesn't expose dispose() but
		// the `WEBGL_lose_context` extension lets us free GPU resources promptly.
		const ext = gl.getExtension('WEBGL_lose_context');
		ext?.loseContext();
	};
}

const VERTEX_SHADER = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Palette in linear values matching app.css @theme tokens:
//   phosphor #5EEAD4 → vec3(0.369, 0.918, 0.831)
//   violet   #A78BFA → vec3(0.655, 0.545, 0.980)
//   ink      #0A0E1A → vec3(0.039, 0.055, 0.102)
const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// 2D gradient (Perlin-style) noise. Cheap and only used for subtle texture.
vec2 hash22(vec2 p) {
	p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
	return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
		    dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
		mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
		    dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
		u.y
	);
}

void main() {
	// Aspect-corrected centered UV
	vec2 uv = vUv - 0.5;
	uv.x *= uResolution.x / uResolution.y;

	// Two dipole centres on irrational-ratio orbits so the pattern never visibly
	// loops. Slow speeds preserve the meditative feel.
	float t = uTime * 0.18;
	vec2 mA = vec2(cos(t * 0.7) * 0.40, sin(t * 0.83) * 0.32);
	vec2 mB = vec2(cos(t * 0.53 + 2.4) * 0.36, sin(t * 0.61 + 1.1) * 0.38);

	// Dipole field strength. The +0.15 softener prevents a singularity at centre.
	float field = 0.45 / (length(uv - mA) + 0.15)
	            - 0.45 / (length(uv - mB) + 0.15);

	// Subtle drifting noise on top
	field += noise(uv * 2.5 + vec2(uTime * 0.04, uTime * 0.025)) * 0.18;

	// Soft circular vignette so the edges fall to ink
	float vig = 1.0 - smoothstep(0.35, 1.05, length(uv));

	vec3 phosphor = vec3(0.369, 0.918, 0.831);
	vec3 violet   = vec3(0.655, 0.545, 0.980);
	vec3 ink      = vec3(0.039, 0.055, 0.102);

	vec3 col = ink;
	col = mix(col, phosphor, smoothstep(0.0, 1.6, field));
	col = mix(col, violet,   smoothstep(0.0, 1.6, -field));

	col *= vig;

	gl_FragColor = vec4(col, 1.0);
}
`;
