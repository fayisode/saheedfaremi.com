---
title: HIS Core
domain: health
status: draft
role: Engineer
tech:
  - Go
  - PostgreSQL
summary: Backbone of a hospital/health information system. Patient registry, encounter records, and clinical workflows.
highlights:
  - Patient and encounter data model
  - Clinical workflow primitives
  - Designed for low-bandwidth deployments
tags:
  - health-it
  - go
---

> _Draft. This entry is pending review._

HIS Core is the back-end of a hospital information system. It models the core
clinical primitives (patient, encounter, observation) and exposes them through
a Go API to front-end and clinical-workflow modules.
