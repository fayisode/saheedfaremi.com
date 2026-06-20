---
title: 'Learning EEG microstates with a variational autoencoder: representation, the explained-variance gap, and the locus of recurrence'
status: published
publishedAt: '2026-06-20'
summary: 'A methods note on a Conv-VaDE pipeline for EEG microstates: why topographic images, why the model trails modified k-means on explained variance, the invariance of sequence statistics across deep variants, and the distinction between recurring patterns and recurrent dynamics.'
tags:
  - eeg
  - microstates
  - vae
  - vade
  - recurrence
  - rqa
  - modkmeans
repo: https://github.com/saheedfaremi/microstate-architecture-search
---

This note documents the methodological decisions and findings of a project that learns EEG microstates with a variational autoencoder. It reports the negative results alongside the positive ones, because several of the negatives are more informative than the wins.

It is written in two layers. The running text states each idea in plain terms, so a reader without a signal-processing background can follow the argument. The indented definitions and the code blocks give the formal detail, so a reader who wants to check that the method is sound can do so. The plain reader can skip every formula and lose none of the argument; the technical reader can read the formulas and find the claims precise.

Three conclusions recur: a variational model does not outperform the classical method on the classical method's own objective; the temporally informative recurrence is not located where it is usually sought; and the term "recurrent" denotes two distinct properties that are easily conflated.

## Aim and scope

In plain terms: the brain at rest cycles through a handful of recurring electrical patterns. The aim is to learn those patterns with a modern generative model instead of a classical clustering algorithm, to ask whether the modern model earns its added complexity, and to use the timing of the patterns as a fingerprint for brain disorders.

More precisely: identify the small set of scalp voltage topographies to which resting EEG repeatedly returns (its microstates), estimate them with a generative latent-variable model rather than with hard clustering, and determine what the generative formulation provides that the classical method does not. The temporal behaviour of the recovered states is then considered as a feature set for brain-disorder classification. All quantitative results below are from a single LEMON participant, which restricts their interpretation to a case study.

## Microstates

Resting EEG does not vary smoothly. The pattern of voltage across the scalp stays roughly stable for a tenth of a second, jumps to another stable pattern, and only a handful of patterns (conventionally four to seven) account for most of the recording. Those patterns are the microstates. How long each persists, how often it appears, what fraction of time it occupies, and which pattern tends to follow which are the standard summaries, and each is altered in schizophrenia, depression, and dementia.

## Representing EEG as topographic images, and why

The plain reason for turning EEG into images: a microstate is a picture of the scalp at one instant (which regions are positive, which negative), not a single wiggling line. To let a vision-style neural network see it, you have to give it that picture on a regular grid, the way a camera gives pixels.

The technical reason is locality. A convolutional encoder assumes that neighbouring inputs are spatially related, so it can slide small filters over local neighbourhoods. A raw vector of 61 electrode values has no such structure: electrode 7 and electrode 8 in the array may sit on opposite sides of the head. You first have to place each electrode where it physically belongs.

### How the 40x40 image is actually made

Step one is to flatten the head. Electrodes sit on a roughly spherical scalp in three dimensions, and an image is two-dimensional, so the 3D positions must be projected to a plane. The projection used is the **azimuthal equidistant projection**, the same family of projection used to draw a globe as a flat disc viewed from a pole.

```
Each electrode has a 3D position on the scalp sphere. Write it in spherical
coordinates as an azimuth theta (angle around the head) and an elevation
(angle up from the equator). Project from the vertex (top of the head):

    rho   = (pi/2) - elevation          # polar angle measured down from vertex
    x_2d  = rho * cos(theta)
    y_2d  = rho * sin(theta)

The vertex maps to the centre of the disc; the line through the ears and the
inion maps to the bounding circle. "Equidistant" means distance from the
centre is preserved (rho is mapped to radius linearly), so no scalp region is
unduly stretched relative to the centre. This gives one (x_2d, y_2d) per
electrode: the array pos_2d in the code.
```

In plain terms, that paragraph says: imagine looking straight down at the top of the head and laying the electrodes out on a flat circle, keeping their distances from the crown honest. Step two fills in the gaps between electrodes, because 61 points are not an image. A cubic interpolation estimates a smooth surface that passes through the measured electrode values and evaluates it on a regular 40x40 grid.

```python
# process_eeg_signals.py: create_topographic_map
gy, gx = np.mgrid[ymin:ymax:40j, xmin:xmax:40j]     # a regular 40x40 grid
topo = griddata(pos_2d, vals, (gx, gy), method="cubic", fill_value=0)
```

`griddata` with `method="cubic"` fits a piecewise-cubic surface to the scattered electrode values and samples it at each of the 1600 grid points. The resolution 40x40 is a compromise: fine enough to resolve the spatial structure the electrodes can support, coarse enough to keep the encoder small. Two properties follow and both matter later.

```
1. The electrodes cover only the inscribed head-disc, so the four corners of
   the 40x40 square fall outside the scalp. griddata fills them with the
   constant fill_value=0. They are padding, not measurements, and roughly 30%
   of the pixels under the mask the pipeline applies. Every loss and metric
   excludes them.

2. One image is the scalp at a single instant. It contains no time. Temporal
   information exists only in the ordered sequence of images.
```

Images are extracted at peaks of the Global Field Power, the moments when the overall field is strongest and the topography is most stable and best resolved.

```
Global Field Power at sample t, across C channels v_1(t) .. v_C(t):

    GFP(t) = sqrt( (1/C) * sum_c ( v_c(t) - mean_c v(t) )^2 )

It is the spatial standard deviation of the scalp map at time t. Local maxima
of GFP(t) are the GFP peaks; the model is trained on the topomaps at those peaks.
```

## What the representation preserves and discards

Plainly: the images keep the shape of each brain pattern but throw away its timing and some of its fine detail. That trade is mostly acceptable, and one part of it quietly costs us later.

Preserved: the spatial topography at each peak, in a denoised and z-scored form. Discarded or degraded in three ways. Time is absent within any single image, by design, and is recovered only at the sequence level. Fine spatial detail is attenuated twice, first by the interpolation onto the grid, and again when the decoded grid is later sampled back to electrode space; the second attenuation has measurable consequences, discussed below. Absolute amplitude is partly removed by z-scoring, which is acceptable because microstate analysis is polarity-invariant and concerns the pattern, not its scale.

## The generative model and its objective

In plain terms: a classical clustering algorithm hands you a label for each moment and nothing else. A variational autoencoder instead learns a compact "map" of all the patterns, on which similar topographies sit close together, and from which you can generate new plausible topographies. The model used here, VaDE, builds the clustering directly into that map.

```
A variational autoencoder learns an encoder q(z | x) that compresses an image x
to a low-dimensional latent code z, and a decoder p(x | z) that reconstructs the
image from the code. VaDE replaces the usual single-Gaussian prior on z with a
mixture of K Gaussians, one component c per microstate, so cluster assignment
happens inside the generative model. It maximises the evidence lower bound:

    ELBO = E_q[ log p(x | z) ]            # reconstruct the topography
           - KL( q(z | x) || p(z | c) )   # keep each code near its component
           - KL( q(c | x) || p(c) )       # keep cluster usage sensible

E_q is the expectation under the encoder, and KL is the Kullback-Leibler
divergence, a measure of how far one distribution is from another.
```

The point that determines everything below is simple to state: the objective contains no term in explained variance.

## The encoder and the decoder, concretely

Plainly: the encoder squeezes each 40x40 image down to 32 numbers, and the decoder rebuilds the image from those 32 numbers. The 32 numbers are the pattern's coordinates on the learned map. Training forces those coordinates to be both reconstructable and organised into clusters.

```
Encoder (model.py: Encoder). Four Conv2d layers (kernel 4, stride 2, padding 1),
each halving the spatial size and growing the channel count
(40 -> 20 -> 10 -> 5 -> 3; channels ndf, 2*ndf, 4*ndf, 8*ndf with ndf = 32),
then a 1x1 convolution to 1024, a fully connected 1024 -> 512, and two heads
512 -> 32 that output the mean (mu) and log-variance (logvar) of the posterior
q(z | x). The code is then sampled as

    z = mu + exp(logvar / 2) * eps,    eps ~ N(0, I)       # reparameterisation

so the encoder emits a distribution over codes, not a single point.

Decoder (model.py: Decoder). Latent 32 -> Linear 32 -> 512 -> 1024 -> reshape,
then ConvTranspose2d layers mirroring the encoder back up to 40x40 with a single
output channel and a linear final layer (no sigmoid, because z-scored data is
unbounded and can be negative).

Cluster prior. K learnable component means mu_c (K x 32) and log-variances
log_var_c, with mixture weights pi. A frame is assigned by the posterior
q(c | z) over these K Gaussians.
```

So the model has three learnable pieces: the encoder (image to code), the decoder (code to image), and K Gaussian components in code-space that are the microstates. The components are learned jointly with the encoder and decoder, which is what distinguishes VaDE from clustering a latent after the fact.

## Why not PCA, a plain autoencoder, or k-means

Plainly: simpler tools exist that turn data into components or clusters. Each is missing one of the three properties this problem needs, and only the combination of all three motivates a VaDE.

- **PCA** is linear. It returns orthogonal directions of maximum variance, not recurring patterns, and it is not a generative model. Microstate structure is a set of recurring modes, not a set of orthogonal axes, so PCA components are not interpretable as microstates. PCA also cannot represent nonlinear structure or sample a new topography with a state identity.
- **A plain autoencoder** is nonlinear and reconstructs well, but its latent is a single deterministic point with no probability, no prior, and no clustering. You would still have to cluster the latent afterwards, as a separate, bolted-on step.
- **k-means and modified k-means** cluster directly and hard-assign, and modified k-means maximises explained variance. This is the classical microstate method and the baseline here. It has no continuous latent, no generative model, no soft assignment, and no uncertainty. It is excellent at the variance objective and returns nothing beyond labels.
- **VaDE** combines a nonlinear encoder, a probabilistic latent, and a Gaussian-mixture prior that performs the clustering inside the generative model, jointly with representation learning. It is the only one of the four that is at once nonlinear, generative, probabilistic, and clustering.

The honest qualification is that doing all four does not imply doing any one of them better than the corresponding specialist. On explained variance the specialist (modified k-means) wins, as the next section shows. The case for VaDE is the combination and the downstream uses, not superiority on any single axis.

## The explained-variance gap with modified k-means

Plainly: the classical method is built to maximise exactly the score everyone uses to compare microstate models, and the variational model is built to maximise something else. So on that score, the classical method wins almost by definition, and tuning the neural network will not change that.

The classical method is modified k-means (Pascual-Marqui et al., 1995). Its quality is reported as global explained variance (GEV), the fraction of the signal's power that the assigned templates account for.

```
For GFP peaks t with maps x_t, assigned template centroids a_t, and the
polarity-invariant correlation corr(x_t, a_t):

    GEV = sum_t  GFP(t)^2 * corr(x_t, a_t)^2   /   sum_t GFP(t)^2

Modified k-means updates its templates to minimise residual variance at the
peaks, which is the same as maximising GEV. GEV is the objective it descends,
not an external grade. The VAE descends the ELBO, which has no GEV term.
```

So the two methods are not evaluated on equal footing, and the variational model is at a structural disadvantage on GEV. The gap is therefore not a matter of configuration: no setting of the learning rate, latent dimension, or loss weights makes a model that maximises the ELBO begin to maximise explained variance. This is a deductive point about the two objectives, not a tuning result.

## Interpolation attenuation and a parity-restoring correction

Plainly: most of the gap is not the neural network clustering badly. It is an artifact of converting its picture-shaped output back into electrode readings, which blurs it, and the score punishes blur severely. Undo the blur and the gap mostly closes.

```
The decoded centroids are 40x40 images. Comparing them to electrode-space EEG
means sampling them back onto 61 electrodes, which low-pass filters (blurs)
them. Because the corr term in GEV is squared, a small drop in correlation
costs roughly twice as much GEV (d(corr^2) = 2*corr*d(corr)). So the blur is
penalised quadratically. A single modified-k-means-style template refinement of
the decoded centroids raised GEV from 0.71 to 0.77, against about 0.80 for
modified k-means: roughly two thirds of the gap is resampling blur, not poor
clustering. The remaining third is the objective mismatch.
```

That refinement was computed only as a diagnostic and was not propagated, so the backfitting, the temporal statistics, and the published figures still use the unrefined centroids. The proper correction is a decoder head that outputs electrode space directly and avoids the resampling; it requires retraining but does not depend on the classical method. A complementary check makes the same point: the model's active centroids correlate with the canonical modified-k-means maps at 0.93 to 0.99. The model finds the right maps and reports a lower variance only because of how its output is sampled.

## Where the variational model has an advantage

The model's candidate advantages lie on axes the classical method does not address. It assigns each moment a probability across states rather than a single hard label, so it carries an uncertainty estimate. It can generate new topographies. It provides a continuous latent geometry. And those representations can feed downstream clinical or task decoding. Within this single-subject study these are potential rather than demonstrated advantages; the deep-microstate methods that report genuine improvements on them (SPADE, Wang et al., 2025, and the schizophrenia-biomarker literature) do so on cohorts, and on these axes rather than on GEV. The strategy is to compete where the model may have an edge, not where the baseline owns the objective.

## Invariance of sequence statistics across encoder variants

Plainly: I built fancier encoders (with temporal and attention components) expecting richer dynamics, and they produced sequence statistics indistinguishable from the plain one within sampling variation. That is not a bug; a known result predicts it.

```
von Wegner et al. (2018) show, and this work reproduces across deep
architectures, that the microstate label sequence is generated by assigning
each sample to its best-matching template. The resulting dynamics are a
function of two things only: the template set and the assignment rule. The
encoder influences only where the templates land, and every variant lands on
essentially the same canonical maps. Therefore the encoder's temporal machinery
cannot reach the sequence, and the dynamics are invariant to it.
```

The null result is predicted, not anomalous, and it points to the fix.

## Two senses of recurrence

Plainly: "recurring" can mean two different things, and I had been treating a result about the first as if it proved the second.

The first sense is recurring activation patterns: a small set of spatial maps that re-occur across the recording. This is the foundational microstate premise, and the model satisfies it, as the occurrence and coverage statistics show. The second sense is recurrent temporal dynamics: the property that the sequence of states contains motifs or determinism beyond chance. These are distinct claims, and establishing the first does not establish the second.

## Recurrence quantification: methods and results

Plainly: I tested whether the brain revisits its states in a structured, repeating way, beyond what randomness would produce, and I tested it on three different views of the data. The answer depends sharply on which view.

```
Recurrence Quantification Analysis. Build a recurrence matrix on a windowed
trajectory of states x_t:

    R[i, j] = 1   if  distance(x_i, x_j) <= epsilon,   else 0

with epsilon chosen so a fixed small fraction of pairs recur. Determinism (DET)
is the fraction of recurrence points that lie on diagonal line segments of
length >= 2; diagonals mean the trajectory revisits a past path, i.e. genuine
recurrence rather than isolated coincidences. Significance is assessed against
phase-randomised and label-shuffle surrogates, which preserve the linear or
first-order structure but destroy higher-order recurrence.
```

The microstate label sequence is persistent but non-recurrent: its determinism does not exceed a first-order Markov surrogate, which is a citable null. The one-dimensional Global Field Power signal is likewise non-recurrent and parameter-sensitive, because reducing the topography to a single scalar discards the spatial pattern. The full 61-channel signal, in contrast, is consistently recurrent: the whole-brain topography returns to similar configurations far more often than its phase-randomised surrogate (determinism 0.83 against 0.60, a large effect that is stable across the surrogate count and the recurrence threshold). In this participant the recurrence is therefore detectable in the full multichannel signal but not in its scalar summary or its labels, which is consistent with the recurrence residing in the spatial co-activation that both of those discard. A single participant does not exclude alternative explanations such as volume conduction or residual non-stationarity, so this is a localisation claim about one recording, pending multi-subject replication.

## The locus of recurrence and the latent representation

Plainly: to see the recurrence you must look at the full spatial pattern, or at the model's compressed version of it, not at the simplified labels. The labels throw away the very thing that recurs.

A label is a single integer per sample, and discretising the topography to one symbol removes the spatial information in which the recurrence resides, so the label cannot carry it by construction, and it does not. The variational latent is a continuous, denoised compression of the topography, and a good representation should preserve the recurrence, in principle more cleanly than the noisy channels. The latent-trajectory test is the model-specific experiment. Its caveat is that the encoder was trained on GFP peaks, so the between-peak frames are out-of-distribution for it; for that reason the model-free multichannel result is treated as the anchor and the latent result as a complement.

## Temporal modelling by semi-Markov backfitting

Plainly: since the encoder cannot shape the dynamics, put the timing model where it can act, namely on the sequence of labels itself. A semi-Markov model learns how long each state realistically lasts and which transitions are likely, then relabels the whole recording coherently.

```
A Hidden Semi-Markov Model places an explicit dwell-time distribution on each
state (how long it persists) and a transition matrix between states, and decodes
the most likely state sequence over the entire recording at once. It replaces
the argmax-plus-fixed-window-smoothing backfit. It is the only change that
introduces a genuine cross-time dependency into the sequence, so it is the only
one that can move the dynamics. It corrects two artifacts of smoothing: inflated
state durations and a near-empty cluster.
```

The classical backfit remains appropriate for the GEV comparison, since it reproduces the modified-k-means assignment; the semi-Markov backfit is appropriate for analysing dynamics. The two are retained as complementary methods.

## Clinical features and classification

Three feature families are candidates for disorder classification, in decreasing order of established validation. The microstate temporal parameters (coverage, mean duration, occurrence rate, and transition probabilities) are the most validated EEG microstate biomarkers and are altered in schizophrenia, depression, and dementia. The recurrence quantification measures of the multichannel signal (determinism, laminarity, entropy, and trapping time) form an established dynamical biomarker family across epilepsy, depression, schizophrenia, and disorders of consciousness. Long-range temporal correlation, summarised by the Hurst exponent (a value above 0.5 indicates persistent, scale-free memory), is altered in depression, schizophrenia, and attention-deficit disorders.

```
The downstream analysis is a standard supervised classifier. For each subject,
assemble a feature vector
    f = [ microstate coverage, duration, occurrence, transitions,
          RQA determinism, laminarity, longest line, Hurst, ... ]
stack subjects into a matrix (rows = subjects, columns = features), attach
patient/control labels, train logistic regression or an SVM with
cross-validation, and report accuracy and area under the ROC curve.
```

It requires a labelled clinical cohort and cannot be conducted on a single healthy participant.

## Limitations and publishability

The principal limitation is that all results derive from one participant, which restricts every claim to a case study and requires multi-subject replication before any population-level statement. The components are individually sound (recovery of the canonical maps, the localisation of recurrence, and the semi-Markov dynamics), but they are facets of a single study sharing one dataset and one limitation, and partitioning them into several publications would not be defensible. A single substantial paper, possibly two after replication, is the realistic outcome. The defensible framing is the recovery of recurring microstate patterns by a variational model together with the localisation of recurrence in the spatial topography rather than the state sequence; a claim about recurrence in the latent representation is contingent on an experiment not yet performed.

## Conclusion

A variational autoencoder recovers the canonical microstate maps. It trails modified k-means on explained variance by construction, and most of the observed gap is an image-resampling artifact rather than a modelling failure. The objective mismatch is not addressable by tuning, but it is addressable by re-architecting, through a channel-space decoder and a semi-Markov temporal model. The two senses of recurrence dissociate: the activation patterns recur, the discrete state sequence does not recur beyond chance, and the multichannel signal does recur, which is where the temporally informative dynamics reside. The clinical value lies in the feature representation applied to a cohort, and the single-subject work establishes the method rather than the finding.
