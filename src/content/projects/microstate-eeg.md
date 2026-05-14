---
title: EEG microstate analysis with variational autoencoders
domain: research
status: draft
featured: true
role: PhD researcher
tech:
  - Python
  - PyTorch
  - MNE
  - NumPy
  - scikit-learn
summary: Source segmentation of EEG signals via variational autoencoders, including a GMM-VAE for soft clustering.
highlights:
  - Vanilla VAE and Gaussian-mixture VAE architectures for EEG topography embeddings
  - Microstate sequence analysis on resting-state and task data
  - Architecture-search experiments to compare latent geometries
tags:
  - eeg
  - variational-autoencoder
  - gmm-vae
  - microstates
---

> _Draft. This entry is pending review._

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
