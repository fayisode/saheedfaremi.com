---
title: 'Never let the LLM set the price'
status: published
publishedAt: '2026-08-27'
summary: 'Two production LLM systems, one rule: the model narrates, the code decides. Pricing, risk flags, and anything else that must be right belongs to deterministic logic.'
tags:
  - llm
  - production
  - guardrails
  - gijima
  - curnance
---

I have shipped two systems that put a large language model in front of real
business output: a proposal generator for Gijima, and a fraud/AML intelligence
layer at Curnance. They share one design rule, and I now consider it
non-negotiable. The LLM narrates. The code decides.

## Pricing is not a creative task

The Gijima service drafts seven-section client proposals with Azure OpenAI,
and the sections read well because the model is good at that job. But the
price table in a proposal is not prose. Early on, the boundary was made
explicit: a deterministic engine computes every figure from structured pricing
data, and the numbers are injected into the prompt and the document template.
The model can phrase the discount sentence. It cannot choose the discount.

The same pattern shows up in smaller places. The prompt returns
JSON-constrained output that code parses, so a malformed generation fails
loudly instead of half-rendering. Every generation logs the prompt, duration,
tokens, and estimated cost to a SharePoint list, so quality and spend are
auditable per document. A LangChain + FAISS module handles contract analysis
where retrieval genuinely helps, while SharePoint stays the system of record.
The model is a component. It is never the source of truth.

## Rules first, LLM last

The Curnance intelligence layer pushes the same idea further. Thirty-eight
deterministic SQL detectors (velocity, structuring, impossible travel, ledger
imbalance, and friends) write risk flags. Only then does the model speak: it
narrates pre-aggregated, anonymised numbers into daily reports, drafts
suspicious-activity reports for human review, and answers compliance questions
over the aggregates. Before anything reaches the prompt, a k-anonymity floor
and a PII deny-list gate the data; on the way out, the narrative is scrubbed;
every call lands in an audit table.

The order matters. If the model saw raw transactions, a hallucination becomes
a compliance incident. Because it only ever sees aggregates that survived
deterministic checks, the worst it can do is phrase a true thing badly, and a
reviewer catches that before anything leaves the building.

## The general version

Ask of every number your system emits: would a wrong one be embarrassing,
illegal, or expensive? If yes, that number comes from code, and the model may
only talk about it afterwards. LLMs are excellent narrators and terrible
accountants. Staff them accordingly.
