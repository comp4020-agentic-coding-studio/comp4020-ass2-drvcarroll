---
title: Detection & evasion
description:
  Week 10 — how defenders identify malware, and why authors design around
  being noticed
week: 10
date: 2027-10-12
teachers:
  - ivan-sidorov
lecture: week-10
lab: lab-09
spec:
  - your revised detection rules reduce at least one false positive or
    false negative from the originals
  - you can explain why the change worked
---

Detection and evasion are a continuous contest, not a solved problem on
either side. This session looks at both halves of it.

## Before the session

Nothing to prepare — Lab 9 gives you a starting set of detection rules to
test.

## In the session

The lecture covers signature-based detection (precise, but brittle against
variation) and behavioural detection (more general, but noisier), then the
evasion goals authors design toward and why ignoring detection eventually
makes a campaign ineffective. Lab 9 then has you test signatures and
behavioural rules against benign simulated malware behaviours, and improve
them where they miss or over-trigger.

## Afterwards

You should be able to justify each rule change against a measured false
positive or false negative it fixed. Operational security — the failures
that end campaigns even when the technical work holds up — is next.
