---
title: Persistence
description:
  Week 6 addresses surviving reboots and interruptions, and why removing
  malware is harder than finding it.
week: 6
date: 2027-08-31
teachers:
  - fulan-al-fulani
  - marcus-whitfield
lecture: week-06
lab: lab-05
related:
  - sessions/08-session
spec:
  - you have found each persistence mechanism planted in the prepared VM
  - you can explain how each one survives a reboot
---

A single execution is rarely sufficient. This session concerns the
mechanisms that convert one run into an ongoing presence, and why that
presence is frequently harder to remove than it was to find.

## Before the session

No preparation is needed. Lab 5 is conducted entirely within a prepared
virtual machine supplied for the session.

## In the session

The lecture surveys the categories of persistence mechanism, ranging from
well-monitored autostart locations through service installation to rarer
boot-level techniques, and examines the privilege trade-offs each one
carries. Lab 5 then asks students to detect and analyse persistence
mechanisms already planted within a prepared virtual machine; no
persistence mechanism is deployed by the student, only investigated.

## Afterwards

For each mechanism found, students should be able to state what allows it
to survive a reboot and how difficult it would be to remove completely.
Distribution, the question of moving software from a single host to many,
follows the mid-semester break.
