---
title: AI proposal generation for Gijima
domain: other
status: published
featured: false
role: ML engineer
tech:
  - Python
  - FastAPI
  - Azure OpenAI
  - LangChain
  - FAISS
  - Microsoft Graph
summary: Azure OpenAI (GPT-4) proposal-generation API for Gijima, with structured prompting, deterministic pricing, SharePoint as the system of record, and RAG contract analysis.
highlights:
  - FastAPI service generating seven-section client proposals with Azure OpenAI (GPT-4.1) via structured, chain-of-thought prompting and JSON-constrained output
  - 'Deterministic pricing engine: costs computed from data and injected into the prompt, never invented by the LLM'
  - SharePoint Online (Microsoft Graph, MSAL client credentials) as system of record across roughly ten lists
  - LangChain + FAISS retrieval module for contract analysis, with DOCX templating (markdown-to-styled-Word) and per-generation token/cost logging
  - Deployed on Azure (South Africa North)
tags:
  - llm
  - rag
  - proposal-automation
  - gijima
---

Built for Gijima, this service drafts complete client proposals from structured
inputs (scope, services, pricing) and a corpus of prior proposals held in
SharePoint Online. Authors edit a strong generated draft instead of starting
from a blank page.

Design choices that keep it trustworthy:

- **The LLM never prices anything.** Costs are computed deterministically from
  structured pricing data and injected into the prompt and the document template.
- **Structured prompting.** A single role-and-process prompt (client analysis →
  problem definition → solution design) returns JSON-constrained output consumed
  programmatically; a parallel service rewrites individual sections on request.
- **Retrieval where it belongs.** A LangChain + FAISS module analyses contract
  documents, while SharePoint (via Microsoft Graph) remains the system of record
  for industries, services, pricing, customers, and generated proposals.
- **Observable by default.** Every generation logs prompt, duration, tokens, and
  estimated cost.
