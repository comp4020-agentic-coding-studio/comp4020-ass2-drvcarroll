---
title: Persistence
description:
  Week 6 — surviving reboots and interruptions, and why removing malware is
  harder than finding it
week: 6
date: 2027-08-31
teachers:
  - ivan-sidorov
lecture: week-06
lab: lab-05
spec:
  - you have found each persistence mechanism planted in the prepared VM
  - you can explain how each one survives a reboot
---

One execution is rarely enough. This session is about the mechanisms that
turn a single run into an ongoing presence — and why that presence is hard
to remove even once it is found.

## Before the session

No preparation needed — Lab 5 works entirely inside a prepared virtual
machine supplied for the session.

## In the session

The lecture surveys the persistence categories, from well-monitored autostart
locations through service installation to rarer boot-level techniques, and
the privilege trade-offs each one carries. Lab 5 then asks you to detect and
analyse the persistence mechanisms already planted in a prepared VM — no
persistence is deployed by you, only investigated.

## Afterwards

For each mechanism you found, you should be able to say what makes it
survive a reboot and how hard it would be to remove completely. Distribution
— getting the software from one host to many — is next, after the
mid-semester break.
