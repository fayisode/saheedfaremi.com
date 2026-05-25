---
title: Variational autoencoder for SVHN
domain: research
status: published
featured: false
role: Author
tech:
  - Python
  - PyTorch
summary: A VAE for the Street View House Numbers dataset, with an added clustering loss to sharpen latent separation.
highlights:
  - Variational autoencoder trained to learn latent features of SVHN digit images
  - Clustering term added to the objective to improve latent separation and interpretability
tags:
  - vae
  - representation-learning
  - clustering
---

A variational autoencoder trained on the Street View House Numbers (SVHN)
dataset to learn a latent representation of digit images. The standard VAE
objective was extended with a clustering term that pulls latent codes toward
class-consistent regions. The effect is cleaner separation between digit classes
and a latent space that is easier to interpret.
