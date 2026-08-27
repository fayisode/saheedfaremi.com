---
title: 'The payout that raced the ledger'
status: published
publishedAt: '2026-08-27'
summary: 'A live withdrawal-fraud incident at a fintech taught me more about money movement than any design doc. The fix was not more validation. It was changing the order of operations.'
tags:
  - fintech
  - curnance
  - postmortem
  - mysql
  - idempotency
---

Earlier this year, a payout path in the Curnance wallet let money leave before the
ledger had finished recording it. A fraudster found the gap. We lost money, and
then we learned exactly how every money-out path should have worked in the first
place. This is the engineering account, with the uncomfortable parts left in.

## The race

The naive shape of a withdrawal looks reasonable: call the payment provider,
then record the payout in the database. Most of the time nothing goes wrong.
The failure window is between those two steps. If the provider call succeeds
and the record fails, or if two requests interleave just right, money moves
without a balanced journal behind it. In a system built on a double-entry
general ledger, that is the one thing that must never happen. The ledger is
the truth. If money can move outside it, the ledger is decoration.

## The fix was an ordering change, not a filter

The rebuilt payout paths run debit-before-pay. Debit the wallet first, inside
a locked transaction, and only then call the provider. Three mechanisms carry
the weight:

- **Row-level locking.** `SELECT ... FOR UPDATE` on the wallet rows involved.
  When a transfer touches two wallets, both rows are locked in ascending-id
  order. Deadlock ordering is not glamorous, but getting it wrong is how you
  learn about it at 3am.
- **Deterministic idempotency keys.** Every payout carries an HMAC-derived
  reference computed from the request itself. Retry the same request and you
  get the same reference, so a double-submit, a retry storm, or a webhook
  replay cannot create a second payout.
- **Compensating reversals.** If the provider call fails after the debit, a
  reversal service posts the balancing journal. Every money movement keeps
  the double-entry invariant: debits equal credits, per currency, or the
  transaction does not commit.

Around the edges sit the kill switches. Each provider (VFD, Flutterwave,
Paystack) can be disabled independently, and every webhook verifier fails
closed. If a verification secret is missing, the verifier rejects rather than
waves traffic through.

## What I took from it

Validation would not have caught this. The inputs were valid. The bug was
temporal: two correct steps in the wrong order. Since the rebuild, the rule
in the codebase is blunt: money never moves before the ledger says it can.
Incidents are expensive tuition, but the lesson generalises. Anywhere two
systems must agree, decide which one is the truth, and make the other wait.
