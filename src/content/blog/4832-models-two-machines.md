---
title: '4,832 models on two machines that do not talk to each other'
status: published
publishedAt: '2026-08-27'
summary: 'The XAI 2026 architecture sweep trained 486 configurations per participant across a SLURM GPU cluster and an IBM Power9 CPU server. The models were the easy part. The logistics were the project.'
tags:
  - eeg
  - microstates
  - hpc
  - slurm
  - reproducibility
repo: https://github.com/fayisode/microstate-architecture-search
---

The headline number in the architecture-search paper is 4,832 trained models.
People hear that and imagine a cluster humming away under one scheduler. The
reality was two machines with nothing in common: a SLURM-managed GPU cluster,
and an IBM Power9 CPU server (ppc64le, Python 3.6, no GPU) that I kept busy
with a slot-filling shell script. Getting one coherent dataset out of both was
most of the work.

## The grid

Per participant: K from 3 to 20, latent dim in {16, 32, 64}, encoder depth in
{2, 3, 4}, channel width in {32, 64, 128}. That is 486 configurations per
participant before anything trains, and each configuration logs 110 metrics.
A few cells died to OOM and stayed dead; the dataset records them as missing
rather than silently dropping the row.

## Two schedulers, one dataset

On the SLURM side, jobs requested two GPUs with a 336-hour walltime budget and
an adaptive slot allocator that packed models by expected VRAM. A model took
about five minutes on a GPU. On the Power9, none of that applied. No SLURM,
no GPU, and a Python so old that dependency pinning became an archaeological
exercise. The answer was a dumb, reliable loop: a pool script that kept up to
80 single-CPU workers fed, each grinding through a model in about half an
hour. Dumb scales further than clever when the clever thing needs the cluster
to cooperate.

The part that made the merge possible was not compute but discipline. Every
run wrote the same JSON metric files with the same schema, seeded the same
way (seed 42 everywhere, deterministic cuDNN flags, `CUBLAS_WORKSPACE_CONFIG`
set), regardless of which machine produced it. An extraction script walks the
tree afterwards and builds one CSV per participant, then one merged dataset.
Machine of origin is a column, not a complication.

## Why I would do it this way again

The reproducibility artefacts are the actual result. The public repo ships
the full 4,832-row dataset, the extraction scripts, the per-participant
files, and the exact configs. Anyone can recompute any cell of the grid.
The finding from the paper (low K, small latent, mid-depth wins; K=3
dominates the top of the composite ranking) stands or falls on that, not on
my say-so. A sweep nobody can rerun is just a very large anecdote.
