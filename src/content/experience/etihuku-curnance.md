---
title: Data scientist → Founding engineer
status: published
organization: Etihuku (Curnance)
role: Data scientist → Founding engineer
type: employment
startedAt: 2021-05
summary: Data science and engineering at Etihuku, a data analytics consultancy, including founding-engineer ownership of Curnance, its multi-asset fintech venture.
highlights:
  - 'Founding engineer for Curnance, the multi-asset fintech venture built within Etihuku: shipped seven production services covering wallet/ledger, auth, tiered KYC/KYB, a Go jobs handler, a Flutter mobile app (~120 screens), a SvelteKit admin console, and a Next.js site'
  - Closed a live withdrawal-fraud race condition by moving every external payout path to debit-before-pay ordering, with row-level locking and deterministic idempotency keys
  - 'Designed a rules-first, LLM-last fraud/AML intelligence layer: 38 deterministic detectors, LLM-drafted suspicious-activity reports, and a compliance Q&A analyst guarded by k-anonymity floors and PII redaction'
  - Built an end-to-end document-generation system with large language models on Azure ML Studio, cutting manual creation time by 85% while meeting compliance requirements across three regions
  - Deployed ML models via FastAPI on Microsoft Azure, serving predictive analytics for agriculture (500+ farmers), financial inclusion (90% classification accuracy), and compliance systems
  - Automated build and deployment with per-service Azure DevOps pipelines and Bicep infrastructure, reducing time to production by 40%; quality gates include 680+ automated tests and formal VAPT remediation
tags:
  - fintech
  - data-science
  - llm
  - azure
---

Etihuku is a data analytics and solutions consultancy. Within it I worked as
data scientist across client engagements and as founding engineer for
Curnance, the multi-asset fintech venture built by the Etihuku team for
African markets.

For Curnance I set up the engineering organisation and shipped the first
production subsystems: TypeScript Azure Functions backends (wallet/ledger,
auth, KYC) over MySQL, a Go jobs and notifications handler, a Flutter mobile
wallet, a SvelteKit admin console, and the KYC identity-verification pipeline.
Payments run through VFD, Flutterwave, and Paystack across eight African
markets.

The wider Etihuku work ran on several strands: an end-to-end
document-generation system built on large language models served through
Azure ML Studio, which cut manual document-creation time by 85% while meeting
the compliance requirements of three regions; a real-time customer
notification system on Twilio Programmable Messaging with 95% timely
delivery; a face-recognition system in Python and TensorFlow; and
customer-data analysis in SQL and Python producing operational dashboards and
leaner transaction workflows.
