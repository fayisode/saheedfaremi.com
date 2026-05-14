// Foundation seed: pure static HTML, no interactivity needed.
// CSR is disabled here so the Svelte runtime + router are not shipped on `/`,
// keeping Phase 0 well under the < 50 KB JS gzip budget. Re-enable when the
// hero microstate canvas is added (Phase 3) — see plan.md.
export const csr = false;
