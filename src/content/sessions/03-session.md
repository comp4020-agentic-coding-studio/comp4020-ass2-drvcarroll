---
title: Malware architecture
description:
  Week 3 addresses the components of a malware system, and designing them
  as separate, replaceable modules rather than one binary.
week: 3
date: 2027-08-10
teachers:
  - fulan-al-fulani
  - marcus-whitfield
lecture: week-03
lab: lab-02
related:
  - sessions/09-session
spec:
  - your blueprint separates loader, payload and infrastructure into
    distinct modules
  - you can justify one modularity decision you made
---

Modern malware is rarely a single executable. This session concerns the
components a working system is assembled from, and why dividing them apart
is worth the additional coordination cost it imposes.

## Before the session

Students should bring forward the threat model produced for Lab 1, since
Lab 2 builds an architecture for that same fictional scenario.

## In the session

The lecture covers the architectural layers common to such systems
(delivery, execution, persistence, and command and control) and examines
the trade-off at the centre of the week's material: modularity purchases
independent updates and a smaller blast radius per detected component, at
the cost of additional artefacts and additional places for versions to
drift apart. Lab 2 then asks students to design a modular, non-functional
blueprint for their Lab 1 scenario, covering loaders, payloads, supporting
modules and the infrastructure each depends on, without writing anything
that actually runs.

## Afterwards

The finished blueprint should identify each component's role clearly enough
that a reader could say which one would be replaced first once it is
detected. Execution, the question of how any of these components is
actually made to run, is the subject of the following week.
