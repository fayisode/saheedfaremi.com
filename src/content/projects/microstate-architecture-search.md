---
title: EEG microstate architecture search
domain: research
status: published
featured: true
role: PhD researcher
links:
  repo: https://github.com/fayisode/microstate-architecture-search
tech:
  - Python
  - PyTorch
  - MNE
  - scikit-learn
  - SLURM
  - IBM Power9
summary: 'A 4,832-model architecture search on two high-performance computing clusters, scoring 110 metrics per model and testing consistency across participants.'
highlights:
  - 4,832 trained models with 110 metrics per model
  - Cross-subject ICC analysis on SLURM GPU and IBM Power9 systems
tags:
  - eeg
  - microstates
  - architecture-search
  - reproducibility
  - cross-subject-validation
---

This project systematically compares generative EEG microstate architectures
across 4,832 trained models. Each model is assessed with 110 metrics, including
cross-subject intraclass correlation analysis, using SLURM GPU and IBM Power9
systems.

The [architecture-search repository](https://github.com/fayisode/microstate-architecture-search)
contains the code and trained-model results.
