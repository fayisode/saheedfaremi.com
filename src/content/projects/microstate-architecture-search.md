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
summary: 'Evaluation of 4,832 model configurations using 110 measures of model fit, clustering quality, and consistency across participants on two high-performance computing clusters.'
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
