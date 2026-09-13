---
title: "Lab 7: C2 Communications Laboratory"
description:
  Analyse captured command-and-control traffic and build a benign
  request/response simulator.
week: 8
due: 2027-09-28T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Analyse a set of captured command-and-control traffic, then build a
  benign simulator that reproduces its request/response pattern.
submissionItems:
  - A written analysis of the captured C2 traffic's communication pattern
  - A benign request/response simulator reproducing that pattern
marking:
  mode: holistic
  description:
    Assessed on whether the analysis and simulator correctly capture the
    C2 architecture and communication pattern of the traffic given.
keyDates:
  - label: Submission due
    date: 2027-09-28T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - the simulator's request/response pattern matches the analysis of the
    captured traffic
  - connects the traffic analysis and the simulator built from it,
    rather than treating them as two separate exercises
  - the simulator stays benign, reproducing the pattern without
    functioning as real command-and-control
  - the analysis considers what happens to the channel when the C2
    server goes dark, not only while it is live
---

Once malware is running on a target, it typically needs to communicate
with its operator. This lab covers that channel: the basic concepts
behind command-and-control, the forms information exchange between
operator and target can take, and the infrastructure dependencies that
channel relies on, including what happens when the server on the other
end goes dark.

Students analyse a set of captured command-and-control traffic to
determine its communication pattern, then build a benign simulator that
reproduces that same request and response behaviour, connecting analysis
to construction rather than treating the two as separate skills.
