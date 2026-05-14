---
title: Integrating Convolutional Variational Autoencoders and the Gaussian Mixture Model for efficient manifold learning and clustering of spatially preserved EEG topographic maps
status: published
authors:
  - Saheed Faremi
  - Luca Longo
year: 2026
kind: preprint
venue: Brain Informatics (under review)
summary: A Convolutional Variational Deep Embedding (Conv-VaDE) for EEG microstate analysis, with polarity-invariance preserved through sign-flip augmentation and evaluated against ModKMeans on the LEMON dataset.
abstract: |
  EEG microstate analysis segments continuous brain activity into brief, quasi-stable
  topographic configurations whose quantity, duration, and transition dynamics index
  cognitive state and neuropsychiatric conditions. The standard algorithm, modified
  k-means (ModKMeans), operates in electrode space. However, it focuses on hard
  partitioning where each data point is assigned to exactly one cluster and provides
  neither a learned representation, a generative decoder where output data are
  typically transformed into a compact internal representation, nor probabilistic
  soft assignment.

  In this research, a Convolutional Variational Deep Embedding model (Conv-VaDE) is
  designed, a topographic-map adaptation of Variational Deep Embedding (VaDE) that
  places a Gaussian Mixture Model (GMM) prior on the latent space of a convolutional
  variational autoencoder and jointly trains the encoder, decoder, and GMM.
  Microstate polarity invariance, the property that a topography x and its sign-inverted
  counterpart -x index the same underlying configuration, is preserved through three
  coordinated mechanisms: sign-flip augmentation of the training set, a
  polarity-invariant reconstruction loss, and an encoder regulariser on the latent
  embedding.

  The model is evaluated on a sample of healthy participants (N = 203 healthy adults,
  eyes-closed) from the LEMON resting-state EEG dataset using a multi-quadrant
  evaluation framework, with each method assessed in its native frame and
  cross-method comparisons performed via rank-based Wilcoxon signed-rank tests.

  Conv-VaDE's focused set of capabilities that the standard ModKMeans pipeline does
  not provide: a learned generative latent manifold (silhouette 0.232 at K=3, with
  very narrow cross-subject interquartile-range width approx 0.02 across the 203
  participants, indicating highly reproducible latent geometry), decoded GMM cluster
  centres inspectable as scalp topographies, probabilistic soft assignment for
  transitional states, and a generative framework supporting downstream representation
  analysis.

  A rank-based meta-criterion over silhouette, Calinski-Harabasz, and Davies-Bouldin
  yields modal K=4 for Conv-VaDE (39.4%) and K=3 for ModKMeans (29.6%); K=4 is
  adopted to align with the canonical Lehmann A/B/C/D literature. Within the classical
  cluster-validity register, ModKMeans attains a higher silhouette and 4-5 percentage
  points higher Global Explained Variance (GEV) at every K (Wilcoxon, BH-corrected,
  p < 10^-30); the two methods occupy distinct positions in the methodological design
  space, with the cross-method comparison characterising the trade-off between direct
  electrode-space optimisation and learned generative representation rather than
  adjudicating method superiority.
tags:
  - eeg
  - microstates
  - cvae
  - gaussian-mixture-model
  - manifold-learning
  - brain-informatics
---
