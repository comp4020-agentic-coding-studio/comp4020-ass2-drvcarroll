# Content source — SLOP4xxx: Introduction to Malware Production

This file is the raw course content supplied for Assignment 2, kept verbatim
(bar the "Content notes" callouts, which are mine, not the source). It is the
input `BUILD_PLAN.md`'s new steps convert into real `src/content/` entries,
`src/course-config.ts`, `src/decks/` and page copy. Nothing in this file has
been written into the site yet.

## Content notes (flagged, not silently fixed)

- **Week 7's date is malformed** ("21th Sep") and its date does not fit the
  sequence: Weeks 1–6 run weekly (27 Jul → 31 Aug), then Week 7 jumps to 21
  Sep — a three-week gap consistent with a mid-semester break, and Weeks 7–12
  then continue weekly (21 Sep → 26 Oct). Read as 21 September, mid-semester
  break between Weeks 6 and 7.
- **No explicit year is given anywhere.** Dates are day/month only. The build
  step assigns a concrete year (see the "Schedule" table below) and a course
  period that contains it.
- **Assessment 1 and Assessment 2 have no stated due date or week**, only a
  weight and a description of what they cover. Assessment 1 ("My First
  Malware") is design work that can land once the architecture/execution
  material (Weeks 3–4) has been taught; Assessment 2 ("Don't Get Caught") is
  practical work that depends on nearly the whole lifecycle (through Week 11,
  Operational Security) having been covered. The build step places both on
  this basis and records the reasoning as a decision, not a guess dressed up
  as fact.
- **The weekly labs (Lab 1–10) map one-to-one onto Weeks 2–11.** Week 1
  (Introduction) and Week 12 (Review) have no lab in the source content —
  confirmed against both the week-by-week list and the "Lab progression"
  summary, which names exactly ten labs against exactly ten weeks (2–11).
- **Weekly Lab Work is 20% of the course mark across ten labs** — the source
  does not split that 20% per lab, so an even split (2% each) is the only
  reading that doesn't invent a weighting scheme the brief never gave.
- **Assessment weights, as given, sum to exactly 100%**: Weekly Labs 20 +
  Assessment 1 20 + Assessment 2 20 + Final Exam 40 = 100. This is the first
  time this repo's content has had real weights — see `BUILD_PLAN.md` D6's
  and Step 8's long-standing documented red check (assessment weights must
  sum to 100%); this content is what finally closes it.
- Two convenor bios are supplied, no other staff. The template ships two
  `people` entries (a lecturer and a tutor) — the build step maps the two
  convenors onto both, since no tutor is named in the source.

---

## Course record

- **Code:** SLOP4xxx (the course's own materials use this placeholder
  throughout; the repo's own scaffold has SLOP1000 allocated, last three
  digits `000`, kept per the template's rule — see `BUILD_PLAN.md` for the
  resulting code).
- **Title:** Introduction to Malware Production
- **One-line framing (Week 1, Slide 3):** "A systems course about hostile
  software as an engineering discipline."
- **Registers to hold throughout:** deadpan seriousness about a farcical
  subject (Week 1, Slide 21); all practical/lab work uses deliberately
  benign samples and simulated environments only, stated repeatedly across
  the labs and the lecture decks; curiosity required, real malice is not.

## Course convenors

### Professor Ivan Sidorov — Course Convenor

Professor Sidorov researches malware production, hostile software
infrastructure and the relationship between software engineering and
malicious computing.

His academic career began in the late Cold War period. Following the
collapse of the Soviet Union, he relocated internationally and subsequently
worked across government and private-sector security research before joining
Slop University.

His current research interests include malware lifecycle modelling,
operational security and the institutional management of malicious software
research.

### Professor Fulan Al-Fulani — Co-Convenor

Professor Al-Fulani researches cyber operations, malware analysis and
state-sponsored computing.

His academic career began after relocating to Australia in 2012 from Iran,
where Professor Al-Fulani worked across several government-funded research
programs before joining Slop University's Cybersecurity Research Group.

His current research focuses on malware analysis, attribution and the
difficulties involved in distinguishing sophisticated malicious activity from
poorly maintained enterprise software.

---

## Weekly schedule (source table, dates as given)

| Week | Topic | Date (as given) | Lab | Assessment |
|---|---|---|---|---|
| 1 | Introduction to Malware | 27 July | — | — |
| 2 | From Idea to Malware | 3 August | Lab 1 — From Idea to Threat Model | — |
| 3 | Malware Architecture | 10 August | Lab 2 — Build a Malware Blueprint | — |
| 4 | Execution | 17 August | Lab 3 — Execution Laboratory | — |
| 5 | Infiltration | 24 August | Lab 4 — Infiltration Investigation | — |
| 6 | Persistence | 31 August | Lab 5 — Persistence Laboratory | — |
| 7 | Distribution | 21 September* | Lab 6 — Distribution & Infrastructure | mid-semester retro / assessment discussion |
| 8 | Command, Control & Communication | 28 September | Lab 7 — C2 Communications Laboratory | — |
| 9 | Malware Analysis | 5 October | Lab 8 — Malware Analysis Laboratory | — |
| 10 | Detection & Evasion | 12 October | Lab 9 — Detection & Evasion Laboratory | — |
| 11 | Operational Security | 19 October | Lab 10 — "How Did They Get Caught?" | — |
| 12 | Review | 26 October | — | exam preparation |

\* Given as "21th Sep" in the source; read as 21 September (see Content
notes).

## Weekly content (topics as given, per week)

**Week 1: Introduction to Malware**
- What counts as malware?
- History of malicious software
- Major categories
- Malware as a software-production problem

**Week 2: From Idea to Malware**
- Threat models and motivations
- Malware development lifecycle
- Anatomy of a malicious program
- Analysis of historical examples

**Week 3: Malware Architecture**
- Components of a malware system
- Payloads, loaders and supporting infrastructure
- Designing for modularity
- Why malware increasingly resembles ordinary software

**Week 4: Execution**
- How malicious software gets code to run
- Execution environments
- Triggers and user interaction
- The eternal problem of "how do I get this thing to actually start?"

**Week 5: Infiltration**
- How malware gets into a target environment
- Social engineering
- Exploiting software weaknesses
- Physical and network vectors
- Case studies in successful infiltration

**Week 6: Persistence**
- Surviving reboots and interruptions
- Maintaining access
- Persistence strategies
- Why removing malware is harder than finding it

**Week 7: Distribution**
- Getting malware from its creator to its targets
- Infrastructure
- Delivery mechanisms
- Scaling an operation
- Mid-semester retro / assessment discussion

**Week 8: Command, Control & Communication**
- Malware communicating with its operator
- Basic command-and-control concepts
- Information exchange
- Infrastructure dependencies
- What happens when the server gets switched off?

**Week 9: Malware Analysis**
- Static vs dynamic analysis
- Reverse engineering as an investigative process
- Indicators of compromise
- Reconstructing what malware was intended to do

**Week 10: Detection & Evasion**
- How defenders identify malware
- Signature-based detection
- Behavioural detection
- Why malware authors care about being noticed

**Week 11: Operational Security**
- Attribution
- Infrastructure hygiene
- Logs, metadata and mistakes
- Human error
- Famous operational-security failures
- "How did they get caught?"

**Week 12: Review**
- The malware production lifecycle
- Connecting the semester's concepts
- Case-study review
- Exam preparation

---

## Weekly Lab Work — 20% of course mark

**Week 2 — Lab 1: From Idea to Threat Model**
- Main concept: Threat modelling & malware lifecycle
- Practical: Analyse a fictional malware scenario and build a
  lifecycle/threat model.
- Outcome: Students can translate an idea into a structured malware
  lifecycle.

**Week 3 — Lab 2: Build a Malware Blueprint**
- Main concept: Malware architecture
- Practical: Design a modular, non-functional malware architecture.
- Outcome: Students understand loaders, payloads, modules and
  infrastructure.

**Week 4 — Lab 3: Execution Laboratory**
- Main concept: Code execution & triggers
- Practical: Experiment with benign programs triggered by different
  execution mechanisms and analyse execution traces.
- Outcome: Students understand how execution conditions affect behaviour and
  what evidence execution generates.

**Week 5 — Lab 4: Infiltration Investigation**
- Main concept: Initial access
- Practical: Investigate simulated phishing, vulnerability,
  removable-media, network and supply-chain scenarios using prepared
  evidence.
- Outcome: Students identify and compare infiltration vectors.

**Week 6 — Lab 5: Persistence Laboratory**
- Main concept: Persistence
- Practical: Detect and analyse simulated persistence mechanisms in a
  prepared VM.
- Outcome: Students understand persistence concepts and how defenders
  investigate them without deploying real persistence.

**Week 7 — Lab 6: Distribution & Infrastructure**
- Main concept: Malware distribution and infrastructure
- Practical: Design and analyse a simulated distribution infrastructure for
  a fictional campaign.
- Outcome: Students understand delivery, scaling, infrastructure
  dependencies, costs and failure points.

**Week 8 — Lab 7: Command and Control (C2) Communications Laboratory**
- Main concept: Command & control
- Practical: Analyse captured C2 traffic and build a benign request/response
  simulator.
- Outcome: Students understand C2 architecture, communication patterns and
  infrastructure dependencies.

**Week 9 — Lab 8: Malware Analysis Laboratory**
- Main concept: Static and dynamic analysis
- Practical: Analyse a deliberately benign sample using static and dynamic
  techniques.
- Outcome: Students produce an investigation, identify IOCs and distinguish
  observed behaviour from inferred behaviour.

**Week 10 — Lab 9: Detection & Evasion Laboratory**
- Main concept: Detection
- Practical: Test and improve signatures and behavioural detection rules
  against benign simulated malware behaviours.
- Outcome: Students understand detection strengths, weaknesses, false
  positives and false negatives.

**Week 11 — Lab 10: "How Did They Get Caught?"**
- Main concept: Attribution & operational security
- Practical: Reconstruct a fictional actor from logs, metadata,
  infrastructure evidence and operational-security mistakes.
- Outcome: Students identify OPSEC failures and assess attribution evidence
  with appropriate confidence.

**Lab progression, restated (source's own summary):**
Week 2 Threat modelling · Week 3 Architecture · Week 4 Execution ·
Week 5 Initial access · Week 6 Persistence · Week 7 Distribution &
infrastructure · Week 8 Command & control · Week 9 Malware analysis ·
Week 10 Detection · Week 11 Attribution & OPSEC.

---

## Assessment 1: My First Malware — 20% of course mark

Students design a fictional piece of malware and document:
- its purpose
- target
- architecture
- infection lifecycle
- persistence strategy
- communication model
- detection risks
- operational requirements

## Assessment 2: Don't Get Caught — 20% of course mark

A CTF style assignment, in which students are provided with an IP address (a
separate IP / virtual host per student) for a virtual host machine that has a
unique flag on the operating system. The student must infect the device,
retrieve the sensitive user data (the flag), and establish persistence
without being caught. They also need to write a report documenting the
OSINT, reconnaissance, infection, persistence, communication, and avoidance
methods.

## Final Examination — 40% of course mark

Two-hour, in-person written examination.

---

## Lecture decks

Full slide-by-slide content for all twelve weeks, as supplied. Each week's
deck is reproduced under its own heading.

### Week 1: Introduction to Malware — 27 July

**Slide 1: Course Title**
- SLOP4xxx — Introduction to Malware Production
- Welcome to the only course that treats malware as a serious software
  engineering problem
- Professor Ivan Sidorov & Professor Fulan Al-Fulani

**Slide 2: Who We Are**
- Professor Sidorov: malware lifecycle modelling, operational security,
  institutional management of malicious research
- Professor Al-Fulani: cyber operations, attribution, distinguishing
  advanced malware from poorly maintained enterprise software
- Both have spent careers on the other side of the fence

**Slide 3: What This Course Is Not**
- Not a how-to for real malware
- Not ethical hacking theatre
- Not a catalogue of current CVEs
- A systems course about hostile software as an engineering discipline

**Slide 4: Learning Outcomes**
- Understand malware as a complete software production problem
- Map the full lifecycle from idea to operational use
- Analyse architecture, delivery, persistence and control
- Evaluate operational security failures with appropriate confidence

**Slide 5: What Counts as Malware?**
- Software written or deployed with hostile intent
- Intent matters more than specific techniques
- The same code can be legitimate tool or malware depending on context and
  purpose

**Slide 6: The Intent Problem**
- Remote administration tools vs remote access trojans
- Keyloggers used by parents vs keyloggers used by criminals
- Where does "malicious" begin?

**Slide 7: Early History**
- Experimental self-replicating programs of the 1970s
- Academic curiosity rather than profit or politics
- Limited damage, limited ambition

**Slide 8: The 1980s Shift**
- First widespread personal-computer viruses
- Floppy disk as primary vector
- Proof-of-concept becomes real nuisance

**Slide 9: Commercialisation and Professionalisation**
- Rise of organised groups and later nation-state actors
- Malware becomes a product with customers, support and update cycles
- Software engineering practices appear on both sides

**Slide 10: Major Categories Overview**
- Viruses and worms
- Trojans and droppers
- Ransomware
- Spyware and information stealers
- Botnets and remote access tools

**Slide 11: Viruses and Worms**
- Self-replicating code
- Viruses require a host; worms propagate independently
- Historical impact largely tied to naive network design

**Slide 12: Trojans and Droppers**
- Deceptive delivery of secondary payloads
- Social engineering as primary infection vector
- The "one more download" problem

**Slide 13: Ransomware**
- Encryption as a business model
- Payment infrastructure as critical dependency
- Recovery difficulty often exceeds technical sophistication

**Slide 14: Spyware and Stealers**
- Long-term data collection
- Credential harvesting
- Silent operation preferred over dramatic effects

**Slide 15: Botnets and RATs**
- Distributed control of compromised hosts
- Command infrastructure becomes the real asset
- Scale changes both capability and risk

**Slide 16: Malware as Software Production**
- Requirements, design, implementation, testing, deployment, maintenance
- Version control, modularity, configuration management
- The same engineering problems appear under different constraints

**Slide 17: Why Ordinary Software Engineering Applies**
- Reliability under hostile conditions
- Stealth as a non-functional requirement
- Update mechanisms that must survive defender scrutiny

**Slide 18: Constraints Unique to Malware**
- No legitimate support channels
- Detection is an active adversary
- Attribution risk is permanent

**Slide 19: Course Structure Preview**
- Weeks 2–8: production lifecycle
- Weeks 9–11: analysis, detection, operational security
- Week 12: synthesis and examination preparation

**Slide 20: Assessment Overview**
- Weekly labs (20%)
- Assessment 1: My First Malware (20%)
- Assessment 2: Don't Get Caught (20%)
- Final examination (40%)

**Slide 21: Expectations**
- Deadpan seriousness about a farcical topic
- All practical work uses deliberately benign samples and simulated
  environments
- Curiosity is required; real malice is not

**Slide 22: Questions Before We Begin**
- What do you already believe about malware?
- Where does software engineering end and "malicious" begin?
- Why might a university course on this subject exist?

### Week 2: From Idea to Malware — 3 August

**Slide 1: Week Overview**
- Threat models and motivations
- Malware development lifecycle
- Anatomy of a malicious program
- Analysis of historical examples

**Slide 2: Why Start with Motivation?**
- Technical capability without motive produces toys
- Motive without capability produces failed attempts
- Real campaigns begin with a reason

**Slide 3: Common Motivations**
- Financial gain
- Espionage
- Disruption or destruction
- Ideological or political signalling
- Personal grievance

**Slide 4: Financial Motivation**
- Ransomware as product
- Banking trojans and credential theft
- Monetisation infrastructure becomes part of the design

**Slide 5: Espionage Motivation**
- Long-term access preferred over immediate impact
- Data value often exceeds system damage
- Operational security requirements rise sharply

**Slide 6: Disruption and Destruction**
- Visibility is sometimes the goal
- Collateral damage is frequently accepted
- Attribution pressure increases

**Slide 7: Threat Modelling Basics**
- Who is the target?
- What assets matter?
- What capabilities does the defender possess?
- What constraints does the attacker accept?

**Slide 8: Attacker Resource Model**
- Time available
- Skill level
- Infrastructure budget
- Tolerance for detection

**Slide 9: Defender Resource Model**
- Monitoring maturity
- Incident response speed
- Patching discipline
- User awareness level

**Slide 10: The Malware Development Lifecycle**
- Idea and requirements
- Design and architecture
- Implementation
- Testing in controlled environments
- Deployment and distribution
- Maintenance and updates
- Decommissioning or abandonment

**Slide 11: Requirements Gathering (Hostile Version)**
- What must the software achieve?
- What must it never reveal?
- How long must it remain useful?
- Under what conditions should it self-destruct?

**Slide 12: Design Constraints**
- Stealth vs capability trade-offs
- Platform support decisions
- Update and command channel design
- Failure modes under analysis

**Slide 13: Anatomy of a Malicious Program**
- Loader or dropper
- Core payload
- Persistence mechanisms
- Communication module
- Configuration and staging data

**Slide 14: Loader Responsibilities**
- Initial execution
- Environment checks
- Privilege or capability elevation
- Handoff to payload

**Slide 15: Payload Responsibilities**
- Primary hostile function
- Data collection or system modification
- Interaction with command infrastructure

**Slide 16: Supporting Infrastructure**
- Build systems
- Staging servers
- Command-and-control hosts
- Payment or exfiltration endpoints

**Slide 17: Historical Example Structure**
- Choose a well-documented campaign
- Identify stated or inferred motivation
- Map observed components to lifecycle stages
- Note where engineering quality was high or low

**Slide 18: Common Lifecycle Failures**
- Over-ambitious scope
- Insufficient testing against real defences
- Infrastructure that cannot be replaced
- Operators who reuse identifiers

**Slide 19: Lab Preview — From Idea to Threat Model**
- Receive a fictional scenario
- Extract motivation and constraints
- Produce a structured lifecycle and threat model
- Justify each design decision

**Slide 20: Key Questions for This Week**
- What problem is the malware actually solving for its author?
- Which lifecycle stage is most likely to fail first?
- How does motivation shape architecture?

**Slide 21: Takeaways**
- Malware begins as an idea under constraints
- Threat modelling is the first engineering step
- Anatomy follows from purpose, not from fashion

### Week 3: Malware Architecture — 10 August

**Slide 1: Week Overview**
- Components of a malware system
- Payloads, loaders and supporting infrastructure
- Designing for modularity
- Why malware increasingly resembles ordinary software

**Slide 2: System vs Single Binary**
- Modern malware is rarely a single executable
- Multiple cooperating components
- Infrastructure is part of the system

**Slide 3: Core Architectural Layers**
- Delivery and installation
- Execution and payload
- Persistence
- Command and control
- Supporting services

**Slide 4: Loader / Dropper Role**
- First code that runs
- Responsible for environment preparation
- Often disposable or frequently changed

**Slide 5: Payload Role**
- Implements the actual hostile function
- May be staged in multiple pieces
- Often the most carefully protected component

**Slide 6: Configuration Data**
- Hard-coded vs dynamically retrieved
- Encryption and obfuscation of settings
- Ability to change behaviour without recompilation

**Slide 7: Supporting Infrastructure Components**
- Build and packaging systems
- Staging and distribution servers
- Command servers
- Exfiltration or payment endpoints

**Slide 8: Modularity Benefits**
- Independent update of components
- Reduced blast radius when one piece is detected
- Specialisation of development effort

**Slide 9: Modularity Costs**
- Increased complexity of coordination
- More network or filesystem artefacts
- Greater chance of inconsistent versions

**Slide 10: Interface Design Between Modules**
- Clear contracts for data and control flow
- Versioning of interfaces
- Failure handling when a module is missing

**Slide 11: Why Malware Looks Like Ordinary Software**
- Same languages and build tools
- Same need for reliability and maintainability
- Same pressure to ship updates

**Slide 12: Shared Engineering Practices**
- Source control
- Automated builds
- Staged testing
- Configuration management

**Slide 13: Differences That Remain**
- No public issue tracker
- Detection is an active opponent
- Attribution risk shapes every design choice

**Slide 14: Design for Replacement**
- Assume any single host or binary will be burned
- Prefer designs that allow rapid redeployment
- Avoid single points of failure in infrastructure

**Slide 15: Case Study Approach**
- Examine a modular family
- Identify loader, payload, C2 and configuration
- Note how modules evolved over time

**Slide 16: Anti-Patterns in Architecture**
- Monolithic binaries that do everything
- Hard-coded infrastructure that cannot change
- Tight coupling that forces full rebuilds

**Slide 17: Lab Preview — Build a Malware Blueprint**
- Design a modular, non-functional architecture
- Define modules, interfaces and responsibilities
- Justify modularity decisions

**Slide 18: Evaluation Criteria for Architecture**
- Clarity of component roles
- Ease of independent update
- Resilience to partial compromise

**Slide 19: Key Questions**
- Which component is most likely to be detected first?
- How would you replace a burned module?
- Where does complexity actually help?

**Slide 20: Takeaways**
- Architecture is a first-class concern
- Modularity is both strength and liability
- Good malware design looks increasingly like good software design under
  hostile constraints

### Week 4: Execution — 17 August

**Slide 1: Week Overview**
- How malicious software gets code to run
- Execution environments
- Triggers and user interaction
- The eternal problem of "how do I get this thing to actually start?"

**Slide 2: The Starting Problem**
- Code that never executes is irrelevant
- Every campaign must solve initial execution
- Defenders focus heavily on this moment

**Slide 3: Common Execution Contexts**
- User-launched processes
- Scheduled tasks and services
- Document macros and scripts
- Browser or application plugins

**Slide 4: Process Creation Basics**
- Parent-child relationships
- Command-line arguments as artefacts
- Environment inheritance

**Slide 5: User-Triggered Execution**
- Double-click, open attachment, run installer
- Social engineering still the most reliable method
- User trust as the primary vulnerability

**Slide 6: Automatic Execution Mechanisms**
- Autostart locations
- Service installation
- Scheduled tasks
- Event-driven triggers

**Slide 7: Document and Script Vectors**
- Office macros
- Scripting hosts
- Browser-based execution
- Trust boundaries that users rarely notice

**Slide 8: Environment Checks Before Execution**
- Sandbox and virtual machine detection
- Locale, time zone, installed software
- Decision to run, delay or abort

**Slide 9: Triggers and Conditions**
- Time-based
- Event-based (file open, network connect)
- User presence or interaction
- External command

**Slide 10: Why Triggers Matter**
- Reduce unnecessary exposure
- Align activity with target behaviour
- Complicate dynamic analysis

**Slide 11: Execution Traces**
- Process trees
- File system changes
- Registry or configuration modifications
- Network connections

**Slide 12: Evidence Generated by Execution**
- Logs that defenders can collect
- Artefacts that survive reboot
- Timing information that reveals automation

**Slide 13: The "Just Start" Problem in Practice**
- Many samples fail simply because execution conditions are never met
- Overly strict environment checks can prevent real infections
- Balance between caution and reliability

**Slide 14: Historical Execution Patterns**
- Early viruses: simple file infection
- Later worms: network service exploitation
- Modern: multi-stage loaders with heavy conditionality

**Slide 15: Lab Preview — Execution Laboratory**
- Experiment with benign programs under different triggers
- Capture and compare execution traces
- Observe what evidence each mechanism produces

**Slide 16: Practical Considerations**
- Privilege level at execution time
- Persistence of the execution method itself
- Ability to re-trigger after interruption

**Slide 17: Common Failure Modes**
- Trigger that never fires
- Environment check that is too aggressive
- Dependency on a component that is blocked

**Slide 18: Key Questions**
- What is the simplest reliable way to start?
- What evidence does that method leave?
- How would a defender notice the start?

**Slide 19: Design Trade-offs**
- Stealth versus reliability of execution
- Complexity of triggers versus maintainability
- User interaction versus fully automatic start

**Slide 20: Takeaways**
- Execution is the first mandatory success
- Every method leaves traces
- The "how do I start" problem remains central

### Week 5: Infiltration — 24 August

**Slide 1: Week Overview**
- How malware gets into a target environment
- Social engineering
- Exploiting software weaknesses
- Physical and network vectors
- Case studies in successful infiltration

**Slide 2: Initial Access as a Distinct Problem**
- Separate from later stages
- Often the highest-risk moment for the operator
- Success rate determines campaign viability

**Slide 3: Social Engineering Fundamentals**
- Manipulation of human decision making
- Trust, urgency, authority, curiosity
- Still the most consistent initial access method

**Slide 4: Common Social Engineering Forms**
- Phishing and spear-phishing
- Pretexting and impersonation
- Watering-hole style content
- Supply-chain social elements

**Slide 5: Technical Exploitation**
- Known vulnerabilities in software
- Zero-day versus n-day economics
- Exploit reliability and stability concerns

**Slide 6: Exploit Delivery Methods**
- Drive-by downloads
- Malicious documents
- Network service attacks
- Client-side versus server-side

**Slide 7: Physical Vectors**
- Removable media
- Hardware implants
- Physical access to devices
- Rare but high-impact when available

**Slide 8: Network Vectors**
- Exposed services
- Lateral movement precursors
- Weak authentication and configuration

**Slide 9: Supply-Chain Infiltration**
- Compromised updates or libraries
- Trusted distribution channels
- High trust, high impact, high cost

**Slide 10: Choosing a Vector**
- Target environment constraints
- Operator risk tolerance
- Required privilege level after entry
- Expected defender monitoring

**Slide 11: Case Study Method**
- Identify the initial access vector used
- Note supporting social or technical elements
- Observe what made detection delayed

**Slide 12: Evidence of Infiltration**
- Email headers and attachments
- Web proxy and DNS logs
- Endpoint process and file events
- Authentication anomalies

**Slide 13: Why Some Campaigns Fail at This Stage**
- Poor targeting
- Overly generic lures
- Exploits that crash or are patched
- Monitoring that catches the first attempt

**Slide 14: Lab Preview — Infiltration Investigation**
- Examine simulated phishing, vulnerability, media, network and
  supply-chain evidence
- Identify and compare vectors
- Reconstruct likely sequence of events

**Slide 15: Comparative Analysis**
- Which vector left the most artefacts?
- Which required the least user interaction?
- Which scaled most easily?

**Slide 16: Trade-offs in Vector Selection**
- Reliability versus stealth
- Cost versus reusability
- Skill required versus success probability

**Slide 17: Key Questions**
- What is the weakest link in the target environment?
- How much operator exposure does each vector create?
- What would cause the infiltration to be noticed immediately?

**Slide 18: Design Implications**
- Infiltration method shapes later architecture
- Some vectors constrain payload size or language
- Others constrain required privileges

**Slide 19: Takeaways**
- Initial access is a distinct engineering problem
- Social engineering remains dominant for good reason
- Every successful infiltration leaves a story in the logs

**Slide 20: Looking Ahead**
- Once inside, the problem becomes staying inside
- Persistence is next

### Week 6: Persistence — 31 August

**Slide 1: Week Overview**
- Surviving reboots and interruptions
- Maintaining access
- Persistence strategies
- Why removing malware is harder than finding it

**Slide 2: Why Persistence Matters**
- Single execution is rarely enough
- Reboots, logoffs and process terminations are normal
- Long-term objectives require surviving normal system life

**Slide 3: Categories of Persistence**
- Autostart mechanisms
- Service and scheduled task installation
- Modification of existing legitimate programs
- Firmware or boot-level techniques

**Slide 4: Simple Autostart Locations**
- Run keys and startup folders
- Well-known, heavily monitored
- Easy to implement, easy to detect

**Slide 5: Service-Based Persistence**
- Windows services, systemd units, launch agents
- Privilege and restart behaviour advantages
- More artefacts but greater resilience

**Slide 6: Scheduled and Event-Driven Persistence**
- Time-based or condition-based re-execution
- Can appear less continuous
- Useful for low-and-slow activity

**Slide 7: Hijacking Legitimate Programs**
- DLL search order
- Application shimming
- Shortcut or configuration modification
- Blends with normal system behaviour

**Slide 8: Boot and Firmware Persistence**
- High privilege, high impact, high complexity
- Difficult to remove without specialised tools
- Rare in ordinary campaigns

**Slide 9: Multiple Persistence Mechanisms**
- Redundancy against partial cleanup
- Different mechanisms for different privilege levels
- Risk of increased detection surface

**Slide 10: Persistence and Privilege**
- User-level versus system-level
- What survives user logoff
- What survives system reimage

**Slide 11: Why Removal Is Hard**
- Incomplete knowledge of all mechanisms
- Legitimate software that has been modified
- Re-infection from remaining components

**Slide 12: Defender View of Persistence**
- Enumeration of known locations
- Behavioural detection of unusual autostart
- Integrity checking of system components

**Slide 13: Artefacts of Persistence**
- Registry or configuration changes
- New services or tasks
- Modified binaries or scripts
- Unexpected network activity after reboot

**Slide 14: Lab Preview — Persistence Laboratory**
- Analyse simulated persistence mechanisms in a prepared VM
- Identify and document each method
- Consider removal difficulty without deploying real persistence

**Slide 15: Evaluation of Strategies**
- Reliability across reboots
- Visibility to common monitoring
- Complexity of implementation and maintenance

**Slide 16: Common Mistakes**
- Using only the most obvious locations
- Failing to handle privilege correctly
- Leaving clear text configuration

**Slide 17: Key Questions**
- How many independent mechanisms are justified?
- What survives a competent cleanup attempt?
- What evidence does the chosen method generate?

**Slide 18: Design Trade-offs**
- Stealth versus resilience
- Simplicity versus longevity
- User-level convenience versus system-level power

**Slide 19: Takeaways**
- Persistence turns a one-time execution into an ongoing presence
- Removal difficulty often exceeds initial detection difficulty
- Good persistence design anticipates defender response

**Slide 20: Bridge to Distribution**
- Persistence on one host is local
- Campaigns require getting the software to many hosts

### Week 7: Distribution — 21 September

**Slide 1: Week Overview**
- Getting malware from its creator to its targets
- Infrastructure
- Delivery mechanisms
- Scaling an operation
- Mid-semester retrospective and assessment discussion

**Slide 2: Distribution as a Systems Problem**
- Code must move from build environment to targets
- Multiple stages and intermediaries are common
- Infrastructure becomes a critical asset and liability

**Slide 3: Typical Distribution Chain**
- Build system
- Staging servers
- Delivery servers or channels
- Target endpoints
- Optional update channels

**Slide 4: Delivery Mechanisms**
- Email attachments and links
- Web-based downloads
- Removable media
- Compromised legitimate software updates
- Peer-to-peer or lateral movement

**Slide 5: Infrastructure Requirements**
- Hosting that tolerates abuse reports
- Domain and IP agility
- Capacity for expected volume
- Separation from operator identity

**Slide 6: Scaling Considerations**
- Number of potential targets
- Geographic and network diversity
- Rate limiting and detection thresholds
- Cost of infrastructure versus value of access

**Slide 7: Reliability vs Stealth in Delivery**
- High-volume noisy campaigns
- Low-volume targeted delivery
- Different infrastructure footprints

**Slide 8: Failure Points in Distribution**
- Takedown of staging or delivery servers
- Blocking of domains or IPs
- Email or web filtering
- User non-compliance with lures

**Slide 9: Redundancy Strategies**
- Multiple independent delivery paths
- Fallback domains and servers
- Ability to regenerate infrastructure quickly

**Slide 10: Cost and Operational Overhead**
- Domain registration and hosting fees
- Time spent maintaining infrastructure
- Risk of infrastructure reuse across campaigns

**Slide 11: Mid-Semester Checkpoint**
- Lifecycle so far: idea → architecture → execution → infiltration →
  persistence → distribution
- Remaining: command and control, analysis, detection, operational security

**Slide 12: Assessment 1 Reminder**
- My First Malware design document
- Purpose, target, architecture, lifecycle, persistence, communication,
  detection risks, operational requirements

**Slide 13: Lab Preview — Distribution & Infrastructure**
- Design and analyse a simulated distribution infrastructure
- Identify costs, dependencies and failure points
- Propose mitigations for common takedown scenarios

**Slide 14: Evaluating a Distribution Design**
- How easily can a single server loss be absorbed?
- What artefacts link stages together?
- How does the design scale?

**Slide 15: Historical Distribution Patterns**
- Early: physical media and simple email
- Later: large botnets and fast-flux
- Current: mixed targeted and opportunistic with heavy use of legitimate
  services

**Slide 16: Key Questions**
- What is the weakest link in the distribution chain?
- How quickly can burned infrastructure be replaced?
- What does the defender see at each stage?

**Slide 17: Design Implications for Later Stages**
- Distribution method influences payload size and packaging
- Infrastructure choices affect command-and-control options
- Scaling decisions shape operational security requirements

**Slide 18: Common Anti-Patterns**
- Single hard-coded delivery server
- Reuse of infrastructure across unrelated campaigns
- No monitoring of delivery success rates

**Slide 19: Takeaways**
- Distribution turns a local program into a campaign
- Infrastructure is both enabler and exposure
- Scaling introduces new failure modes

**Slide 20: Looking Ahead**
- Once delivered and running, the malware must talk back
- Command, control and communication next

### Week 8: Command, Control & Communication — 28 September

**Slide 1: Week Overview**
- Malware communicating with its operator
- Basic command-and-control concepts
- Information exchange
- Infrastructure dependencies
- What happens when the server gets switched off?

**Slide 2: Why C2 Exists**
- Static malware has limited usefulness
- Operators need status, data and control
- Updates and tasking require a channel

**Slide 3: Basic C2 Model**
- Implant on target
- Command server or intermediary
- Operator console
- Bidirectional or primarily implant-initiated communication

**Slide 4: Communication Directions**
- Implant to server (beaconing, exfiltration)
- Server to implant (tasking, updates)
- Frequency and volume trade-offs

**Slide 5: Common Channel Types**
- Direct IP or domain connections
- Domain generation algorithms
- Legitimate web services and APIs
- Peer-to-peer or mesh approaches

**Slide 6: Protocol Choices**
- Custom binary protocols
- HTTP/HTTPS mimicry
- DNS tunnelling
- Other covert channels

**Slide 7: Information Exchange Content**
- Heartbeats and status
- Collected data
- Commands and configuration
- Binary updates

**Slide 8: Infrastructure Dependencies**
- Servers must remain reachable
- Domains and certificates must be managed
- Operator access to the infrastructure must be protected

**Slide 9: Resilience Techniques**
- Multiple fallback channels
- Domain generation or fast flux
- Use of high-reputation services
- Encryption and obfuscation of traffic

**Slide 10: What Happens When the Server Is Switched Off?**
- Implants may continue local activity
- Beacons fail and create detectable patterns
- Operators lose visibility and control
- Campaign effectively ends for practical purposes

**Slide 11: Detection Surface of C2**
- Periodic beaconing
- Unusual destinations or volumes
- Protocol anomalies
- Certificate or domain reputation

**Slide 12: Lab Preview — C2 Communications Laboratory**
- Analyse captured benign C2-style traffic
- Build a simple request/response simulator
- Observe patterns and dependencies

**Slide 13: Design Goals for C2**
- Reliability of reachability
- Low visibility to network monitoring
- Ability to task and update
- Graceful degradation when infrastructure is lost

**Slide 14: Trade-offs**
- Complexity of channel versus ease of detection
- Centralised control versus distributed resilience
- Volume of data versus stealth

**Slide 15: Common Failures**
- Single hard-coded C2 address
- Predictable beacon timing
- Unencrypted or poorly obfuscated traffic
- Infrastructure that cannot be replaced

**Slide 16: Key Questions**
- How does the implant discover its controller?
- What information must travel in each direction?
- What is the recovery plan when primary C2 is lost?

**Slide 17: Relationship to Earlier Stages**
- Distribution must deliver a C2-capable implant
- Persistence must keep the communication module alive
- Architecture must allow channel replacement

**Slide 18: Takeaways**
- C2 turns independent implants into a managed system
- Infrastructure availability is a single point of failure
- Communication patterns are a primary detection opportunity

**Slide 19: Mid-Course Synthesis**
- Full production path now covered
- Remaining weeks shift to analysis, defence and operational security

**Slide 20: Looking Ahead**
- How do defenders understand what malware is doing?
- Malware analysis next

### Week 9: Malware Analysis — 5 October

**Slide 1: Week Overview**
- Static vs dynamic analysis
- Reverse engineering as an investigative process
- Indicators of compromise
- Reconstructing what malware was intended to do

**Slide 2: Purpose of Analysis**
- Understand behaviour and intent
- Extract indicators for detection
- Support attribution and response
- Inform defensive improvements

**Slide 3: Static Analysis**
- Examination without execution
- Strings, imports, structure, embedded data
- Disassembly and decompilation
- Safe but limited by obfuscation

**Slide 4: Dynamic Analysis**
- Execution in controlled environment
- Observation of behaviour and artefacts
- Network, file, process and registry activity
- Risk of incomplete or deceptive behaviour

**Slide 5: Complementary Strengths**
- Static reveals structure and possible paths
- Dynamic reveals actual behaviour under conditions
- Combined analysis reduces blind spots

**Slide 6: Reverse Engineering Process**
- Initial triage and classification
- Identification of interesting functions
- Reconstruction of control and data flow
- Hypothesis formation and testing

**Slide 7: Common Obfuscation and Anti-Analysis**
- Packing and encryption of payloads
- Anti-disassembly tricks
- Environment checks and delayed execution
- Misleading strings and decoy code

**Slide 8: Indicators of Compromise**
- File hashes and names
- Network destinations and patterns
- Registry or configuration artefacts
- Behavioural sequences

**Slide 9: Quality of Indicators**
- Uniqueness versus longevity
- Host-based versus network-based
- Atomic versus behavioural

**Slide 10: Reconstructing Intent**
- Observed actions versus possible actions
- Configuration and command handling
- Targeting logic and data selection
- Error handling and failure modes

**Slide 11: Limits of Analysis**
- Incomplete samples
- Missing command-and-control responses
- Environment-specific behaviour
- Deliberate deception by the author

**Slide 12: Lab Preview — Malware Analysis Laboratory**
- Analyse a deliberately benign sample
- Apply static and dynamic techniques
- Produce investigation notes, IOCs and distinction between observed and
  inferred behaviour

**Slide 13: Documentation Standards**
- Clear separation of fact and interpretation
- Confidence levels on conclusions
- Reproducible steps

**Slide 14: Tools and Environment Considerations**
- Isolated analysis systems
- Snapshot and revert capability
- Network simulation or containment

**Slide 15: Key Questions**
- What did the sample actually do in the observed environment?
- What was it capable of doing under different conditions?
- Which indicators are robust enough for detection?

**Slide 16: Common Analysis Pitfalls**
- Over-interpreting decoy content
- Assuming all strings are meaningful
- Treating a single execution as complete behaviour

**Slide 17: Relationship to Production**
- Analysis is the mirror of design decisions
- Good architecture and operational security make analysis harder
- Poor tradecraft makes analysis easier

**Slide 18: Takeaways**
- Analysis is an investigative process, not a single technique
- Static and dynamic methods answer different questions
- Intent reconstruction always involves inference

**Slide 19: Bridge to Detection**
- Indicators and behavioural understanding feed detection
- Detection and evasion next

**Slide 20: Preparation Note**
- Keep analysis notes clear; they become evidence in later assessments

### Week 10: Detection & Evasion — 12 October

**Slide 1: Week Overview**
- How defenders identify malware
- Signature-based detection
- Behavioural detection
- Why malware authors care about being noticed

**Slide 2: Detection as an Adversarial Process**
- Defenders write rules and models
- Authors attempt to avoid them
- Continuous adaptation on both sides

**Slide 3: Signature-Based Detection**
- Exact or approximate matching of known artefacts
- Hashes, byte patterns, strings, YARA-style rules
- Fast and precise when signatures exist

**Slide 4: Strengths of Signatures**
- Low false-positive rate for good signatures
- Efficient scanning
- Clear attribution to known families

**Slide 5: Weaknesses of Signatures**
- Brittle against minor changes
- Require prior knowledge of the sample
- Struggle with polymorphism and packing

**Slide 6: Behavioural Detection**
- Observation of actions and sequences
- Process behaviour, network patterns, system changes
- Can catch previously unseen samples

**Slide 7: Strengths of Behavioural Approaches**
- Less dependent on exact code
- Can generalise across variants
- Useful for anomaly detection

**Slide 8: Weaknesses of Behavioural Approaches**
- Higher false-positive potential
- Requires sufficient observation time
- Can be evaded by living-off-the-land techniques

**Slide 9: Why Authors Care About Detection**
- Detected implants are cleaned or isolated
- Infrastructure may be burned
- Operator exposure increases
- Campaign value drops

**Slide 10: Common Evasion Goals**
- Avoid static signatures
- Appear normal under behavioural monitoring
- Delay or conditionalise malicious actions
- Blend with legitimate software patterns

**Slide 11: Evasion Techniques (Conceptual)**
- Code polymorphism and encryption
- Use of legitimate system tools
- Timing and environment checks
- Traffic mimicry

**Slide 12: Detection Trade-offs for Defenders**
- Coverage versus false positives
- Performance impact
- Update and maintenance cost

**Slide 13: Lab Preview — Detection & Evasion Laboratory**
- Test and improve signatures and behavioural rules against benign
  simulated behaviours
- Observe false positives and false negatives
- Iterate on rule quality

**Slide 14: Evaluating Detection Rules**
- True positive rate on known samples
- False positive rate on clean systems
- Resilience to minor variations

**Slide 15: Key Questions**
- What artefacts are most stable across variants?
- Which behaviours are hardest to hide?
- How quickly can a new signature be deployed?

**Slide 16: Author Perspective on Detection**
- Every detection method is a design constraint
- Over-evasion can reduce reliability
- Simple and quiet often outperforms clever and noisy

**Slide 17: Relationship to Earlier Stages**
- Architecture and C2 choices create detectable patterns
- Persistence mechanisms are high-value detection points
- Distribution infrastructure appears in network logs

**Slide 18: Takeaways**
- Detection and evasion form a continuous contest
- Signatures and behaviour each have clear limits
- Authors who ignore detection do not remain effective

**Slide 19: Bridge to Operational Security**
- Technical detection is only one way campaigns end
- Human and procedural failures matter
- Operational security next

**Slide 20: Practical Note**
- In this course all detection work uses simulated benign behaviour only

### Week 11: Operational Security — 19 October

**Slide 1: Week Overview**
- Attribution
- Infrastructure hygiene
- Logs, metadata and mistakes
- Human error
- Famous operational-security failures
- "How did they get caught?"

**Slide 2: What Operational Security Means Here**
- Practices that reduce the chance of identification and disruption
- Applies to both technical infrastructure and human behaviour
- Failures are often more decisive than technical detection

**Slide 3: Attribution Basics**
- Linking activity to a person, group or state
- Technical, infrastructural and human evidence
- Confidence is rarely absolute

**Slide 4: Sources of Attribution Evidence**
- Reused infrastructure or code
- Language, timezone and working-hour patterns
- Operational mistakes that reveal identity
- External intelligence

**Slide 5: Infrastructure Hygiene**
- Separation of identities and payment methods
- Avoidance of reuse across campaigns
- Monitoring for takedown and replacement readiness

**Slide 6: Logs and Metadata**
- Every service generates records
- Timestamps, IP addresses, account details
- Metadata often outlives the primary artefacts

**Slide 7: Common Metadata Leaks**
- Compilation paths and usernames
- Debug information left in binaries
- Certificate and domain registration data
- Cloud and hosting account linkages

**Slide 8: Human Error Patterns**
- Reuse of handles, emails or wallets
- Logging into personal accounts from operational systems
- Discussing work in insufficiently private channels
- Inconsistent cover stories

**Slide 9: Why Failures Occur**
- Fatigue and time pressure
- Overconfidence after early success
- Complexity that exceeds process discipline
- Lack of separation between identities

**Slide 10: Case Study Approach**
- Examine a publicly documented failure
- Identify the specific OPSEC mistake
- Note how the mistake linked technical activity to identity

**Slide 11: "How Did They Get Caught?" Framework**
- What technical evidence existed?
- What infrastructural links were present?
- What human or procedural error occurred?
- How was confidence established?

**Slide 12: Lab Preview — "How Did They Get Caught?"**
- Reconstruct a fictional actor from logs, metadata, infrastructure
  evidence and OPSEC mistakes
- Assess attribution evidence with stated confidence levels
- Identify the decisive failures

**Slide 13: Confidence in Attribution**
- Low: generic techniques only
- Medium: recurring infrastructure or code
- High: direct identity linkage through error or intelligence

**Slide 14: Defensive Value of OPSEC Failures**
- Provide detection and disruption opportunities
- Support legal and intelligence processes
- Reveal broader campaign structure

**Slide 15: Key Questions**
- Which single mistake would be most damaging?
- How many independent identity layers exist?
- What evidence would survive a careful cleanup?

**Slide 16: Design Implications**
- Architecture and infrastructure must support hygiene
- Processes must be simple enough to follow under pressure
- Automation can reduce some classes of human error

**Slide 17: Limits of Technical Measures Alone**
- Perfect code with poor OPSEC still fails
- Human factors remain the persistent weakness

**Slide 18: Takeaways**
- Operational security is a first-class requirement
- Most public failures combine technical artefacts with human mistakes
- Attribution is probabilistic and evidence-driven

**Slide 19: Course Arc Completion**
- Full lifecycle from idea to operational use and eventual failure modes
  now covered

**Slide 20: Looking Ahead**
- Synthesis and examination preparation
- Week 12 review

### Week 12: Review — 26 October

**Slide 1: Course Review Overview**
- The malware production lifecycle
- Connecting the semester's concepts
- Case-study review
- Examination preparation

**Slide 2: Lifecycle Recap — Idea to Threat Model**
- Motivation and constraints
- Threat modelling as the starting engineering activity
- Requirements that shape everything downstream

**Slide 3: Lifecycle Recap — Architecture**
- Modular components
- Loaders, payloads, configuration, infrastructure
- Design for replacement and independent update

**Slide 4: Lifecycle Recap — Execution**
- Getting code to run
- Triggers, environments and the traces left behind
- Reliability versus stealth at the starting moment

**Slide 5: Lifecycle Recap — Infiltration**
- Initial access vectors
- Social, technical, physical and supply-chain routes
- Highest-risk moment for many operators

**Slide 6: Lifecycle Recap — Persistence**
- Surviving normal system events
- Multiple mechanisms and removal difficulty
- Turning transient execution into ongoing presence

**Slide 7: Lifecycle Recap — Distribution**
- Moving software from creator to targets
- Infrastructure chains and scaling
- Failure points and redundancy

**Slide 8: Lifecycle Recap — Command and Control**
- Communication with operators
- Channels, resilience and the consequence of server loss
- Patterns that enable detection

**Slide 9: Analysis Perspective**
- Static and dynamic methods
- Indicators of compromise
- Reconstructing intent under uncertainty

**Slide 10: Detection and Evasion Perspective**
- Signatures and behavioural methods
- Continuous adversarial adaptation
- Why remaining unnoticed matters

**Slide 11: Operational Security Perspective**
- Attribution evidence
- Infrastructure hygiene and metadata
- Human error as the frequent decisive factor

**Slide 12: Connecting the Concepts**
- Each stage constrains and informs the others
- Architecture decisions appear in analysis and detection
- OPSEC failures can nullify technical sophistication

**Slide 13: Case-Study Synthesis Method**
- Select a documented campaign
- Map observed elements to lifecycle stages
- Identify strongest and weakest engineering choices
- Note decisive OPSEC or detection events

**Slide 14: Common Patterns Across Campaigns**
- Social engineering remains reliable
- Infrastructure reuse is a recurring weakness
- Simple quiet designs often outlast complex noisy ones

**Slide 15: Assessment 2 Reminder**
- Don't Get Caught — CTF-style practical
- Infect, retrieve flag, establish persistence, avoid detection
- Report covering OSINT, reconnaissance, infection, persistence,
  communication and avoidance

**Slide 16: Final Examination Structure**
- Two-hour in-person written examination
- Coverage of full lifecycle, analysis, detection and operational security
- Emphasis on coherent reasoning over memorisation of trivia

**Slide 17: Examination Preparation Advice**
- Be able to explain each lifecycle stage and its trade-offs
- Practise mapping a scenario onto the full production path
- Distinguish observed fact from inferred intent
- State confidence levels when discussing attribution

**Slide 18: Key Questions for Revision**
- How does motivation shape architecture and OPSEC requirements?
- Which stage is most likely to generate detectable artefacts?
- What single OPSEC failure would be most damaging to a campaign?
- How do analysis and detection mirror production decisions?

**Slide 19: Course Values Restated**
- Malware treated as a serious software production problem
- All practical work remains deliberately benign and simulated
- Curiosity and clear reasoning valued over sensationalism

**Slide 20: Final Takeaways**
- A coherent course is one idea explored across a semester
- Technical capability without operational discipline fails
- Understanding the full lifecycle is more valuable than any single
  technique

**Slide 21: Questions and Clarifications**
- Open floor for remaining conceptual questions
- Clarification of assessment expectations
- Administrative notes for the examination

**Slide 22: Close**
- Thank you for treating a farcical subject with appropriate seriousness
- Good luck with the remaining assessments and examination

---
