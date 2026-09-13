---
title: "Lab 8: Malware Analysis Laboratory"
description:
  Analyse a deliberately benign sample using static and dynamic
  techniques, and separate observed from inferred behaviour.
week: 9
due: 2027-10-05T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Analyse a deliberately benign sample using both static and dynamic
  analysis, and produce an investigation that identifies its indicators
  of compromise.
submissionItems:
  - A static analysis of the sample
  - A dynamic analysis of the sample, run in a controlled environment
  - A written investigation listing the indicators of compromise found
marking:
  mode: holistic
  description:
    Assessed on whether the investigation distinguishes directly observed
    behaviour from inferred behaviour and correctly identifies IOCs.
keyDates:
  - label: Submission due
    date: 2027-10-05T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - clearly separates observed behaviour from inferred behaviour
  - covers both a static analysis and a dynamic analysis, the dynamic
    analysis run in a controlled environment
  - the written investigation lists the indicators of compromise
    identified
  - works backward from the sample to reconstruct what it was intended
    to do, not just what it does on the surface
---

Having spent the semester building malware conceptually, this lab flips
the perspective to the investigator's: static and dynamic analysis as an
investigative process, working backward from a sample to reconstruct what
it was intended to do.

Students analyse a deliberately benign sample using both techniques and
write up the investigation as they would for a genuine one, identifying
indicators of compromise while remaining explicit throughout about the
difference between what the analysis directly observed and what it
merely infers.
