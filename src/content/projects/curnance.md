---
title: Curnance
domain: fintech
status: published
featured: true
role: Founding engineer
tech:
  - TypeScript
  - Go
  - Flutter
  - MySQL
  - Azure Functions
  - Azure DevOps
  - Bicep
summary: Multi-asset fintech platform for African markets. Seven production services spanning a double-entry ledger, tiered KYC/KYB, and a fraud/AML intelligence layer.
highlights:
  - 'Set up the engineering organisation and shipped seven production services: wallet/ledger, auth, tiered KYC/KYB, a Go jobs handler, a Flutter mobile app (~120 screens), a SvelteKit admin console, and a Next.js site'
  - Double-entry general ledger with enforced debit/credit balance; every money movement journaled
  - Rebuilt all external payout paths debit-before-pay with row-level locking and deterministic idempotency keys after a live withdrawal-fraud incident
  - 'Fraud/AML intelligence layer, rules first and LLM last: 38 deterministic detectors, LLM-drafted suspicious-activity reports, and a compliance Q&A analyst under k-anonymity and PII-redaction guardrails'
  - VFD, Flutterwave, and Paystack integrations across eight African markets; 680+ automated tests; formal VAPT remediation
  - Now building an in-app assistant that maps natural-language banking requests (balance, exchange rate, recent transactions) to app actions
tags:
  - founding-engineer
  - fintech
  - fraud-detection
  - llm
---

Curnance is a multi-asset fintech platform built for African markets first. As
founding engineer I set up the engineering organisation and shipped seven
production services:

- **Wallet and ledger.** TypeScript Azure Functions over MySQL, backed by a true
  double-entry general ledger (gl_journals/gl_postings) that refuses to commit
  unbalanced entries. Money-out paths debit before paying, under row-level
  locks, with deterministic idempotency keys.
- **Auth.** Session tokens with PIN, biometrics, multi-account support, and
  device attestation (Play Integrity / App Attest).
- **KYC/KYB.** Tiered identity verification: document plus liveness, BVN/NIN
  checks, and document-based business onboarding with an admin review queue.
- **Jobs handler (Go).** Notifications, exchange-rate sync, statements, and the
  fraud/AML intelligence layer. 38 deterministic SQL detectors flag risk; the
  LLM only narrates anonymised aggregates, drafting suspicious-activity reports
  and answering compliance questions (k-anonymity floor, PII deny-list, full
  audit log).
- **Clients.** A Flutter mobile app (~120 screens), a SvelteKit internal admin
  with step-up authorisation for money actions, and a Next.js marketing site.

Payments run through VFD, Flutterwave, and Paystack across Nigeria, Ghana,
Kenya, South Africa, Uganda, Tanzania, Rwanda, and Zambia. Infrastructure is
Azure Bicep with per-service Azure DevOps pipelines. Quality gates: 680+
automated tests and a formal VAPT with remediation.

Now building an in-app assistant that turns natural-language banking requests
("what's my balance", "exchange rate to Kenya", "my last transactions") into
app actions and screens.
