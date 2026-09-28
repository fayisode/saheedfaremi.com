---
title: PhD researcher
status: published
organization: Artificial Intelligence and Cognitive Load Research Lab (AICL), University College Cork
role: PhD researcher
type: employment
summary: Doctoral research on segmenting EEG into microstate sequences with variational autoencoders, supervised by Luca Longo. Builds generative models, large-scale evaluation sweeps, and temporal post-hoc analyses over resting-state EEG.
highlights:
  - 'Developed Conv-VaDE, a convolutional variational autoencoder with a learnable Gaussian-mixture latent prior and four polarity-invariance mechanisms, for segmenting EEG topographic maps into microstate sequences'
  - 'Ran a 4,832-model architecture search (486 configurations per participant across state count, latent dimension, depth, and width), scoring 110 metrics per model with cross-subject ICC consistency analysis on SLURM GPU and IBM Power9 clusters'
  - 'Developed Graph-VaDE, a graph-neural-network VAE with a learnable Gaussian-mixture prior that discovers microstates directly on the electrode graph via static anatomical adjacency, replacing interpolated topographic images; recovers ground-truth maps on a synthetic gate benchmark (ARI 1.0, GEV 0.85)'
  - 'Built a post-hoc hidden semi-Markov backfitting stage that learns per-state dwell-time distributions and transition probabilities, then relabels full recordings coherently'
  - 'Quantified recurrence in resting EEG (single-participant case study): the multichannel signal recurs well above phase-randomised surrogates (determinism 0.83 against 0.60) while the discrete label sequence does not exceed a first-order Markov surrogate'
tags:
  - phd
  - eeg
  - vae
  - research
---

Member of the Artificial Intelligence and Cognitive Load Research Lab (AICL)
at University College Cork, supervised by [Luca Longo](https://lucalongo.eu).
The research segments EEG into microstate sequences using
variational-autoencoder architectures, comparing single-Gaussian and
Gaussian-mixture latent priors, and evaluates segmentation stability and
behavioural predictiveness. Protocols and code are released openly.
