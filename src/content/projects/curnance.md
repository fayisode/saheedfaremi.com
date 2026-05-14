---
title: Curnance
domain: fintech
status: draft
featured: true
role: Founding engineer
tech:
  - TypeScript
  - Svelte
  - Go
  - PostgreSQL
  - Kubernetes
summary: Multi-asset fintech platform spanning admin, wallet, KYC, and a Go-based service monorepo.
highlights:
  - Founded the engineering side and shipped admin, wallet, and KYC subsystems
  - Built a Go service monorepo with shared auth and event plumbing
  - Mobile wallet integrated with the backend (stack TBC — verify the wallet repo)
tags:
  - founding-engineer
  - multi-app
---

> **DRAFT — VERIFY.** This page summarises Curnance based on the repository inventory at
> `~/WebstormProjects/curnance_*` and `~/GolangProjects/curnance-admin-svelte`. The
> founding-engineer framing is inferred — replace with the actual founding history when
> you confirm what to disclose publicly.

Curnance is a fintech platform with several first-party clients:

- **Admin console** — Svelte + TypeScript single-page app for internal operators.
- **Wallet** — mobile-first Flutter app for end users.
- **KYC** — identity-verification flow, web + API.
- **Backend monorepo** — Go services sharing auth, event bus, and a Postgres-backed state layer.

The system is multi-asset by design (multiple ledger primitives) and built for African
markets first.

Outcomes, scale, and any non-public detail to be filled in by Saheed.
