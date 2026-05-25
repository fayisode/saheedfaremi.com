---
title: 'Interpretable EEG Microstate Discovery via Variational Deep Embedding: A Systematic Architecture Search with Multi-Quadrant Evaluation'
status: published
authors:
  - Saheed Faremi
  - Andrea Visentin
  - Luca Longo
year: 2026
kind: conference
venue: 'XAI 2026 (Late-breaking work + Doctoral Consortium track), Fortaleza, Brazil. arXiv preprint.'
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
summary: 'Convolutional Variational Deep Embedding for EEG microstate discovery, evaluated through a systematic architecture search on the LEMON dataset. Late-breaking work at XAI 2026.'
tags:
  - eeg
  - microstates
  - variational-deep-embedding
  - conv-vade
  - lemon-dataset
  - xai-2026
---

Co-located with the 4th World Conference on eXplainable Artificial Intelligence
(XAI 2026), Fortaleza, Brazil, 1-3 July 2026. School of Computer Science and IT,
University College Cork. Affiliated with the AI and Cognitive Load Research Lab
(UCC) and the Insight SFI Research Centre for Data Analytics (UCC).

Companion repo with the full sweep code and 4,832 trained-model results:
[microstate-architecture-search](https://github.com/fayisode/microstate-architecture-search).
A stage-by-stage walkthrough of the preprocessing pipeline is on the
[blog](/blog/eeg-preprocessing-stages).
