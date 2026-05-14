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

> **DRAFT — VERIFY.** Drawn from the diagrams in `~/Documents` (VAE.drawio,
> VAE_GMM.drawio, GMMVAE.drawio, Variational Autoencoder.docx) and the
> `~/PythonProject-microstate-eeg` repository. Add the formal abstract, supervisor,
> institution, and any preprint or paper links when ready.

EEG microstates are quasi-stable scalp topographies (typically 4–7 canonical classes)
that segment continuous EEG into a discrete temporal alphabet. This work asks whether a
learned latent geometry — via a variational autoencoder — produces a microstate
segmentation that is more interpretable, more stable across sessions, or more
predictive of behaviour than classical clustering.

Variants explored:

- **VAE** — single Gaussian latent prior; learns continuous embedding.
- **GMM-VAE** — Gaussian-mixture latent prior; one component per microstate class.
- Architecture-search experiments to compare codebook capacity, regularisation, and
  decoder choices.

Pending: methods detail, dataset citations, results, supervisor credit, paper links.
