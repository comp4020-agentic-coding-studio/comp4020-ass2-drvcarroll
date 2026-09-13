---
title: "Assignment 2: Don't Get Caught"
description:
  A CTF-style practical requiring students to infect an assigned target
  machine, retrieve the flag, and remain undetected while doing so.
week: 12
# After Week 12, exam-prep window (D24): Week 12 slide 15 is an
# "Assessment 2 Reminder", and the brief needs Week 11's OPSEC content.
due: 2027-11-02T17:00:00+10:00
weight: 20
brief: >
  Infect your assigned target machine, retrieve its flag, and establish
  persistence without being detected.
submissionItems:
  - The retrieved flag, as evidence of a successful infection
  - A report covering OSINT, reconnaissance, infection, persistence,
    communication and avoidance methods
marking:
  mode: holistic
  description:
    Assessed on whether the target is compromised and the flag retrieved,
    and on whether the report honestly accounts for method and detection
    avoidance across all six named areas, not only the ones that went well.
keyDates:
  - label: Submission due
    date: 2027-11-02T17:00:00+10:00
spec:
  - the assigned target machine is infected and its flag retrieved
  - persistence is established and survives without being caught
  - the report covers OSINT, reconnaissance, infection, persistence,
    communication and avoidance methods
  - the report honestly accounts for what worked and what did not
    across all six named areas, not only the successes
  - a retrieved flag with no account of how it was obtained does not
    meet the brief on its own
---

Each student is assigned a separate virtual host, with its own IP address
and its own target, with a unique flag planted on the operating system.
The task is to infect the machine, retrieve that flag, and establish
persistence, all without being detected by whatever monitoring the target
runs.

Succeeding technically accounts for half the assignment; the other half is
the report. It must cover the whole path taken to get there: the
open-source reconnaissance that informed the approach, the infection
method itself, how persistence was established, how the malware
communicated, if at all, and what was done specifically to avoid
detection. A flag retrieved with no account of how it was obtained, or a
report that describes only what worked, does not meet the brief. This
assignment tests the same operational-security judgement Week 11's "how
did they get caught?" case studies asked students to apply to someone
else's mistakes, now applied to their own work.
