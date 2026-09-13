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

Once a lifecycle exists, it requires an architecture: the components a
real system would be built from, and how those components fit together.
This lab asks for that blueprint, a design only and never a running
program, laying out loaders, payloads and the supporting modules and
infrastructure they depend on.

The design work here more closely mirrors ordinary software architecture
than it does a single exploit. The same pressures toward modularity,
separation of concerns and maintainability apply, which is precisely the
point the lecture makes about why malware increasingly resembles the
software engineering discipline it borrows from.
