---
title: Founding engineer
status: published
organization: Curnance
role: Founding engineer
type: founder
summary: Founding engineer at a multi-asset fintech for African markets. Set up the engineering organisation and shipped seven production services (ledger, auth, KYC/KYB, Go jobs handler, Flutter app, admin console) at 1,000+ daily transactions and 99.9% reliability.
highlights:
  - 'Founded the engineering side and shipped seven production services: wallet/ledger, auth, tiered KYC/KYB, a Go jobs handler, a Flutter mobile app (~120 screens), a SvelteKit admin console, and a Next.js site'
  - Built a double-entry general ledger that refuses unbalanced entries, scaling to 1,000+ daily transactions at 99.9% reliability across eight African markets
  - Rebuilt all external payout paths debit-before-pay with row-level locking and deterministic idempotency keys after a live withdrawal-fraud incident
  - 'Designed a rules-first, LLM-last fraud/AML intelligence layer: 38 deterministic detectors, LLM-drafted suspicious-activity reports, and a compliance Q&A analyst guarded by k-anonymity floors and PII redaction'
  - Integrated three payment providers (VFD, Flutterwave, Paystack) with fail-closed webhook verification and per-provider kill switches
  - Automated build and deployment with per-service Azure DevOps pipelines and Bicep infrastructure, reducing time to production by 40%; quality gates include 680+ automated tests and formal VAPT remediation
  - Now building an in-app assistant that maps natural-language banking requests (balance, exchange rate, recent transactions) to app actions
tags:
  - founder
  - fintech
---

As founding engineer I set up the engineering organisation and shipped the first
production subsystems: TypeScript Azure Functions backends (wallet/ledger, auth,
KYC) over MySQL, a Go jobs and notifications handler, a Flutter mobile wallet, a
SvelteKit admin console, and the KYC identity-verification pipeline. The platform
is multi-asset by design and built for African markets first.
