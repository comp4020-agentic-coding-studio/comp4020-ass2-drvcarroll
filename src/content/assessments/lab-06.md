---
title: "Lab 6: Distribution & Infrastructure"
description:
  Design and analyse a simulated distribution infrastructure for a
  fictional malware campaign.
week: 7
due: 2027-09-21T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Design a distribution infrastructure for a fictional malware campaign,
  and analyse its delivery mechanisms, scaling and failure points.
submissionItems:
  - A diagram of the campaign's distribution infrastructure
  - An analysis of its delivery mechanisms, costs and failure points
marking:
  mode: holistic
  description:
    Assessed on whether the design and analysis show a working grasp of
    delivery, scaling, infrastructure dependencies and failure points.
keyDates:
  - label: Submission due
    date: 2027-09-21T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - names the campaign's delivery mechanisms, scaling approach and at
    least one realistic failure point
  - includes a diagram of the campaign's distribution infrastructure,
    not only a written description of it
  - the analysis weighs the costs of running that infrastructure, not
    only its delivery mechanisms and failure points
  - shows what would be expected to happen to the infrastructure and
    delivery as the campaign scales up
---

Falling in the mid-semester week, this lab steps back from a single
target to a whole campaign: how malware travels from its creator to many
targets, the infrastructure that delivery depends on, and what happens
once that operation is required to scale.

Students design a distribution infrastructure for a fictional campaign,
covering delivery mechanisms, supporting infrastructure and the costs of
running it, and analyse where that infrastructure would be expected to
fail. The exercise sits alongside this week's own mid-semester
retrospective, matching the lecture's pause to take stock of the
semester's assessment work so far.
