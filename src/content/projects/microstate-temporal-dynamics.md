---
title: EEG microstate temporal dynamics
domain: research
status: published
featured: true
role: PhD researcher
links:
  caseStudy: https://saheedfaremi.com/blog/do-brain-states-repeat
tech:
  - Python
  - PyTorch
  - MNE
  - NumPy
  - scikit-learn
summary: 'Tests whether including the duration of a brain state improves the model’s match to the recording. With nine states, including duration improves the match from 55.7% to 63.7%, compared with using only the current state. A separate comparison finds that its state-switching patterns differ more from chance than those from standard clustering (35.6% versus 23.6%).'
highlights:
  - Tests structure beyond Markov and semi-Markov sequence dynamics
  - Examines dwell-time effects and switching stability across sessions
tags:
  - eeg
  - microstates
  - temporal-dynamics
  - deep-learning
  - interpretability
---

This project uses deep learning to investigate EEG microstate temporal
dynamics. It asks whether sequences contain structure beyond Markov and
semi-Markov models, whether discrete labels discard meaningful continuous brain
dynamics, whether dwell time shapes the next state, and whether switching rules
remain stable across sessions.

These are research questions rather than reported outcomes. The
[case study](https://saheedfaremi.com/blog/do-brain-states-repeat) introduces
the question of whether brain states repeat.
