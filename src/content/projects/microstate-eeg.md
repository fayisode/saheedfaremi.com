---
title: EEG microstate analysis with variational autoencoders
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
  - NumPy
  - scikit-learn
summary: Source segmentation of EEG signals via variational autoencoders, including a GMM-VAE for soft clustering.
highlights:
  - 'Conv-VaDE: a convolutional VAE with a learnable GMM latent prior and four polarity-invariance mechanisms (sign-flip augmentation, min-MSE reconstruction, absolute-correlation separation, encoder polarity loss)'
  - '4,832-model architecture search: 486 configurations per participant (K = 3-20 x latent dim x depth x width), 110 metrics per model, cross-subject ICC consistency analysis'
  - Trained on a SLURM GPU cluster and an IBM Power9 server with fully seeded, deterministic pipelines; open-source (MIT) with the public sweep dataset
  - Published in Brain Informatics (2026) and presented at XAI 2026 (late-breaking work + Doctoral Consortium)
tags:
  - eeg
  - variational-autoencoder
  - gmm-vae
  - microstates
---

EEG microstates are quasi-stable scalp topographies (typically four to seven
canonical classes) that segment continuous EEG into a discrete temporal
alphabet. This work asks whether a learned latent geometry, via a variational
autoencoder, produces a microstate segmentation that is more interpretable,
more stable across sessions, or more predictive of behaviour than classical
clustering.

Variants explored:

- **VAE.** Single Gaussian latent prior; learns continuous embedding.
- **GMM-VAE.** Gaussian-mixture latent prior; one component per microstate class.
- Architecture-search experiments to compare codebook capacity, regularisation, and decoder choices.
