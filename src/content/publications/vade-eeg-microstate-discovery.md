---
title: 'Interpretable EEG Microstate Discovery via Variational Deep Embedding: A Systematic Architecture Search with Multi-Quadrant Evaluation'
status: published
authors:
  - Saheed Faremi
  - Andrea Visentin
  - Luca Longo
year: 2026
kind: preprint
venue: arXiv
url: https://arxiv.org/abs/2605.10947
abstract: |
  A Convolutional Variational Deep Embedding (Conv-VaDE) model for analysing brain
  electrical activity. The approach jointly learns topographic reconstruction and
  probabilistic soft clustering in a shared latent space, replacing traditional
  hard-assignment methods with probabilistic alternatives. Through a systematic
  architecture search across cluster counts (K=3-20), latent dimensionality, network
  depth, and channel width, optimal results are reported at depth L=4, achieving a
  best-case GEV of 0.730 and a silhouette of 0.229 at K=4. Tested on the LEMON
  resting-state EEG dataset.
summary: Convolutional Variational Deep Embedding for EEG microstate discovery, with an architecture search and multi-quadrant evaluation on the LEMON dataset.
tags:
  - eeg
  - microstates
  - variational-deep-embedding
  - conv-vade
  - lemon-dataset
---

Companion preprint to the ongoing doctoral work on EEG microstate analysis with
deep generative models. The paper replaces the classical k-means clustering of
microstate topographies with a Convolutional VaDE that jointly performs
topographic reconstruction and probabilistic soft clustering, evaluated through
a systematic sweep over architecture and cluster-count hyperparameters.
