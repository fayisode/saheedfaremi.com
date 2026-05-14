// CSR is required from Phase 3 onward — the HeroCanvas component dynamically
// imports OGL for the microstate field. Without CSR, the canvas never mounts
// and visitors see only the CSS gradient fallback (which is fine, just less
// distinctive).
export const csr = true;
export const prerender = true;
