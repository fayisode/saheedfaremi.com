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
  - Mobile wallet integrated with the backend
tags:
  - founding-engineer
  - multi-app
---

> _Draft. This entry is pending review._

Curnance is a fintech platform with several first-party clients:

- **Admin console.** Svelte and TypeScript single-page app for internal operators.
- **Wallet.** Mobile-first app for end users.
- **KYC.** Identity-verification flow, web and API.
- **Backend monorepo.** Go services sharing auth, event bus, and a Postgres-backed state layer.

The system is multi-asset by design (multiple ledger primitives) and built for African markets first.
