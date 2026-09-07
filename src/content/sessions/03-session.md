---
title: Malware architecture
description:
  Week 3 — components of a malware system, and designing them as separate,
  replaceable modules rather than one binary
week: 3
date: 2027-08-10
teachers:
  - fulan-al-fulani
lecture: week-03
lab: lab-02
spec:
  - your blueprint separates loader, payload and infrastructure into
    distinct modules
  - you can justify one modularity decision you made
---

Modern malware is rarely a single executable. This session is about the
components that make up a system, and why splitting them apart is worth the
extra coordination cost.

## Before the session

Bring the threat model from Lab 1 — Lab 2 builds an architecture for the
same fictional scenario.

## In the session

The lecture covers the core architectural layers (delivery, execution,
persistence, command and control) and the trade-off at the centre of the
week: modularity buys independent updates and a smaller blast radius per
detected component, at the cost of more artefacts and more places for
versions to drift. Lab 2 then asks you to design a modular, non-functional
blueprint for your Lab 1 scenario — loaders, payloads, supporting modules
and the infrastructure they depend on — without writing anything that runs.

## Afterwards

The blueprint should show each component's role clearly enough that a
reader could say which one gets replaced first when it is burned. Execution —
how any of these components actually starts running — is next.
