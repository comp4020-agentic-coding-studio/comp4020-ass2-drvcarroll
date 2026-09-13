---
title: "Lab 9: Detection & Evasion Laboratory"
description:
  Test and improve signature-based and behavioural detection rules
  against benign simulated malware behaviours.
week: 10
due: 2027-10-12T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Test a set of detection rules against benign simulated malware
  behaviours, then improve the rules to reduce their false positives and
  false negatives.
submissionItems:
  - Test results for the detection rules against the simulated behaviours
  - A revised set of rules, with an explanation of what each change fixes
marking:
  mode: holistic
  description:
    Assessed on whether the revised detection rules measurably improve on
    the false positive and false negative rates of the originals.
keyDates:
  - label: Submission due
    date: 2027-10-12T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - the revision is justified against the original rules' measured false
    positives and false negatives
  - reports test results for the original rules against the simulated
    behaviours before any revision is made
  - each rule change in the revised set is explained in terms of the
    specific false positive or false negative it fixes
  - the revised rules measurably reduce false positives, false
    negatives, or both, relative to the originals tested
---

If malware authors care about staying hidden, defenders care about
finding them regardless. This lab examines detection from the defender's
position: signature-based rules, behavioural rules, and the trade-off
every detection system makes between catching genuine threats and
flagging benign activity by mistake.

Working against benign simulated malware behaviours, students test the
detection rules provided, measure where they misfire in either direction,
and revise the rules accordingly, a concrete demonstration of why
detection is an ongoing tuning problem rather than a one-off decision.
