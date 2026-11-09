---
title: EEG microstate representation learning
domain: research
status: published
featured: true
role: PhD researcher
links:
  repo: https://github.com/fayisode/cnn_vae_microstate
tech:
  - Python
  - PyTorch
  - MNE
  - NumPy
  - scikit-learn
summary: 'Compares image-based scalp maps with maps built from connections between recording electrodes. When both use the same processing step on 203 resting-state recordings, the electrode-based approach accounts for 61.8% of the signal versus 54.2% for the image-based approach. The image-based approach produces tighter groups of activity.'
highlights:
  - Conv-VaDE and Graph-VaDE with learnable Gaussian-mixture priors
  - Synthetic ground-truth recovery with ARI 1.0 and GEV 0.85
tags:
  - eeg
  - microstates
  - representation-learning
  - variational-autoencoder
  - conv-vade
  - graph-vade
---

This project studies discrete EEG microstate representation learning with
Conv-VaDE and Graph-VaDE. Conv-VaDE learns from scalp topographic maps, while
Graph-VaDE represents electrodes as graphs. Both use learnable Gaussian-mixture
priors for probabilistic segmentation.

On synthetic data with known ground truth, Graph-VaDE retained an adjusted Rand
index of 1.0 and global explained variance of 0.85. The
[source code](https://github.com/fayisode/cnn_vae_microstate) is publicly
available.
