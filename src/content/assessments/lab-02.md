---
title: "Lab 2: Build a Malware Blueprint"
description:
  Design a modular malware architecture on paper, without writing a
  functioning payload.
week: 3
due: 2027-08-10T17:00:00+10:00
# 2% (10 labs x 2% = 20% of course total; BUILD_PLAN.md D24).
weight: 2
brief: >
  Design a modular, non-functional malware architecture: its loaders,
  payloads, supporting modules and the infrastructure they depend on.
submissionItems:
  - An architecture diagram naming each component and its role
  - A short justification of the modularity choices made
marking:
  mode: holistic
  description:
    Assessed on whether the design shows a working understanding of
    loaders, payloads, modules and infrastructure as separable components.
keyDates:
  - label: Submission due
    date: 2027-08-10T17:00:00+10:00
spec:
  - submitted by the deadline, in the format named below
  - the architecture separates loaders, payloads, modules and
    infrastructure rather than describing one undifferentiated blob
  - the architecture diagram names each component and the role it plays
  - the modularity choices made are justified, not just asserted
  - reasons about separation of concerns and maintainability the way
    ordinary software architecture would, not just a single exploit
---

Once a lifecycle exists, it needs an architecture: the pieces a real
system would be built from, and how they fit together. This lab asks for
that blueprint — a design only, never a running program — laying out
loaders, payloads and the modules and infrastructure they call on.

The design work here mirrors ordinary software architecture more than it
mirrors a single exploit: the same pressures toward modularity, separation
of concerns and maintainability apply, which is exactly the point the
lecture makes about why malware increasingly resembles the software
engineering it borrows from.
