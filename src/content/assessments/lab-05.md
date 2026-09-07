---
title: "Lab 5: Persistence Laboratory"
description:
  Detect and analyse simulated persistence mechanisms in a prepared
  virtual machine, without deploying real persistence.
week: 6
due: 2027-08-31T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Detect and analyse the simulated persistence mechanisms planted in a
  prepared virtual machine, and explain how each survives a reboot.
submissionItems:
  - A list of persistence mechanisms found in the prepared VM
  - An explanation of how each mechanism survives interruption or reboot
marking:
  mode: holistic
  description:
    Assessed on whether the analysis correctly identifies each planted
    persistence mechanism and explains how it survives interruption.
keyDates:
  - label: Submission due
    date: 2027-08-31T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - each persistence mechanism found is explained, not just listed
---

Getting in once is not the same as staying in. This lab is about
persistence: the strategies malware uses to survive a reboot or an
interruption, and why removing an established piece of malware is
routinely harder than finding it in the first place.

Rather than build any real persistence mechanism, students are handed a
prepared virtual machine with several already planted, and the task is
detection and analysis: find each one, and explain in concrete terms how
it survives the events that would otherwise remove it.
