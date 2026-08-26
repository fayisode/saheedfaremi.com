---
title: 'Do brain states actually repeat?'
status: published
publishedAt: '2026-06-26'
summary: 'A story from my PhD: getting a machine to rediscover the brain''s "atoms of thought" on its own, and what it told me about whether those states genuinely recur.'
tags:
  - eeg
  - microstates
  - machine-learning
  - neuroscience
  - phd
---

Imagine watching the voltage map across someone's scalp for a few seconds. It does not change smoothly. It settles into one configuration for roughly a tenth of a second, jumps to another, settles again. These transient configurations are what the EEG literature calls microstates. Lehmann once described them as the atoms of thought, and a small set of them recurs across recordings, in health and in illness alike.

My doctoral work keeps returning to two questions about them. First, whether a machine can recover these states on its own, with no templates and no labels to guide it. Second, and the one I find more interesting, whether they genuinely recur, or whether we have simply inherited that assumption along with the name.

## What troubled me about the standard approach

The established method takes the moments of strongest signal, sorts them into a small number of groups, and treats each group's average as a state. It has served the field for three decades. Three things about it troubled me.

It is categorical: every instant is assigned to a single state, even when the activity sits plainly between two of them. It defines the states without reference to order, grouping the moments independently, so the sequence in which states occur plays no part in how they are found. And the average it returns is hard to interrogate; it offers little purchase on why a given moment belongs where it does.

So I went the other way. Rather than sorting each moment into one box, I let a model represent it as a blend, and learn the structure from the data instead of imposing a set of templates on it. How it does that is the part I am holding back for the thesis. What it found is the part worth telling.

## It recovered the maps

The first result was the one I needed before anything else would matter. With no templates to copy, the model recovered most of the canonical microstates. At the four-state solution, three of the four textbook maps returned cleanly.

That agreement is the point. A clustering method from the 1990s and a modern learned model share almost none of their assumptions, yet they arrive at the same small set of maps. When two methods with so little in common converge, the thing they converge on is more likely to be a property of the brain than an artefact of either procedure. It is the firmest evidence I have that these states sit in the data and not in the method.

The fourth map is the one that taught me something. The standard method's fourth state matches the textbook template. My model produced a fourth state too, but its map stayed diffuse and never settled onto the canonical shape. It is a long-dwelling, low-specificity state, the kind of configuration the brain seems to drop into between the sharper ones. I read the model's reluctance to sharpen it as honesty rather than as a fault.

## Recurring is not the same as recurrent

This is where the work surprised me. The literature tends to fold two different claims into a single word. There are the patterns that recur, the maps themselves, and there is the separate question of whether the sequence of states is recurrent, whether the brain returns to the same trajectories again and again.

I tested the two apart. The underlying multichannel signal does return to earlier trajectories far more often than chance would allow. The simplified version, the string of state labels we usually work with, largely does not, once you account for the plain probability of one state following another. Most of what looks like structure in the label sequence turns out to be those pairwise odds.

![Recurrence in the brain signal compared against a surrogate null, by representation](/blog/do-brain-states-repeat/recurrence.png)

I read this as a sharper question rather than a disappointment. The repetition is real, but it lives in the full signal; reduce that signal to a handful of labels and most of it washes out. There is also a longer memory at work. The brain's tendency to favour some states over others stays correlated across long stretches of a recording, not merely from one moment to the next.

## What this is, and is not

All of this rests on one person's brain. A single recording, examined carefully, but a single one. I would rather say that plainly than dress it up. It is a signpost, not a conclusion, and the next step is the obvious one: repeat the analysis across many people and see which of these findings hold once a crowd is involved.

I find that prospect more energising than deflating. The questions have grown sharper as the work has gone on. If a model can recover these states and stay honest about which of them are solid, the same approach might in time become something a clinician could actually read, rather than a number handed down from a black box. That is the direction of travel. This was the stage at which I wanted to be sure the foundations would hold.
