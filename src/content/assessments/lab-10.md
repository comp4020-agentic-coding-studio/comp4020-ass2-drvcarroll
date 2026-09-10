---
title: 'Lab 10: "How Did They Get Caught?"'
description:
  Reconstruct a fictional actor from logs, metadata and operational-security
  mistakes, and assess the attribution evidence.
week: 11
due: 2027-10-19T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Reconstruct a fictional threat actor from a set of logs, infrastructure
  metadata and operational-security mistakes, and assess how confidently
  the evidence supports that attribution.
submissionItems:
  - A reconstruction of the actor from the supplied logs and metadata
  - A written assessment of the attribution's confidence level
marking:
  mode: holistic
  description:
    Assessed on whether the attribution is supported by the evidence
    given, with confidence stated honestly rather than overclaimed.
keyDates:
  - label: Submission due
    date: 2027-10-19T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - the stated confidence in the attribution matches the strength of the
    supporting evidence
  - reconstructs the actor using only the supplied logs, infrastructure
    metadata and operational-security mistakes given
  - the reconstruction reflects the operational-security failures used
    as its model, without inventing detail beyond that evidence
  - the confidence assessment is honest about what the evidence does
    not establish, not only what it does
---

The course's final lab turns to the mistake side of operational security:
attribution, infrastructure hygiene, and the logs, metadata and human
errors that let defenders work backward from an operation to the people
running it.

Given a set of famous operational-security failures as a model, students
reconstruct a fictional actor from supplied evidence and write an
assessment of how confidently that evidence actually supports the
attribution — the same question every real "how did they get caught?"
case ultimately turns on.
