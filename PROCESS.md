# Process overview

## What I built

I built *"SLOP4000: Introduction to Malware Production"*, a farical course complete with weekly content, lectures, labs, staff, and assessments, within a neat and polished Slop University template. This course is focused on the malware lifecycle, teaching students how to create, produce, distribute and maintain persistance through high quality malware, and ensure they don't get caught! Sponsored by the GRU, NSA and ASD.

## How I got here

### Beat 1: The Content
Due to my interest in cybersecurity, I've always found malware fascinating as a concept. I’ve also been slightly afraid of it, as I don’t know enough about malware, and I am thus not fully equipped to defend against it. This was the genisis for my idea for this course; a course that taught students how to make and produce malware. Obviously, this is farcical, as no real university is giving out lessons on malware development and deployment! But many cyber courses have the same structure, and this could very well pass in a western university if you weren't too scrupulous. 

As a software engineer that is concerned with the overall design, direction, and content of a software project, I manually created the "base" content for this course, such as:
- The weekly topics and content progression;
- The assessment timeline; 
- The staff bios; and
- The UI design.

While it took some time to put together a rough plan and course content, I thoroughly enjoyed the process, crafting a progression from introduction, to creation, to distribution, with the course building on its’ own knowledge base progressively, while increasing in complexity and thematic content. This was the entire bulk of the manual labour - after dumping into `CONTENT.md` (`cbc62cd`) the rest was almost entirely automated, starting with the course record itself landing as SLOP4000 in `2b2cd06`.

### Beat 2: The Skill
I constructed a skill called `/execute_plan`, a cumulation of my "harness engineering" work so far this semester, carried into this repo in `c223608` and shaped into its atomic-step form in `6857d5f`. The overall concept is simple; I call the skill, and as input provide a description / brain-dump of what I want built. The main agent (i.e. the orchestrator) then breaks my input down into atomic, actionable steps designed to be executed by a dispatched sub-agent (i.e. the executor) with minimal context. These steps are saved in `BUILD_PLAN.md` by the orchestrator, which serves several goals;

1. The primary is a persistence of the instructions for a specific build step that can then be fed to the executor, which will then update the build plan with it's own observations, including challenges met, design choices, pre-requesites required, and so forth. A nice consequence of this is that `BUILD_PLAN.md` becomes **part of the harness**; it is constantly updated with the executors' design decisions and thought process, so any problems or changes that the agent observes **lands back in the harness**.
2. The secondary is **retention and context efficiency**; the orchestrator is instructed to dispatch executors with only the minimal context required - the single step in the build plan, the `CLAUDE.md` system prompt (containing design principles, the spec, etc), and some general instructions - which are then executed with minimal token usage.
3. The tertiary goal is that `BUILD_PLAN.md` acts as a fine-grained journal of the entire build process that I can review to assess the progress and performance of the agents, with associated commits to help diff the code manually. Commits like `577fb79` and `efa57b7`, plan amendments recording an executor's findings after a step, are that journal in practice.

### Beat 3: The Phases
With the raw content of the course defined, and the build process automated, my work was cut out for me. My general process entailed running the `/execute_plan` skill in 3 main phases;

1. **User Interface Re-design** (`8033433`-`a0891fa`, Steps 1-19): redesigned the website structure slightly to add my own unique flair and streamline the navigation for prospective students.
2. **Content integration** (`2b2cd06`-`df09808`, Steps 20-31): uploading the `CONTENT.md` file with instructions to integrate and subsequently polish the content with a more academic tone.
3. **Visual Polish** (`8b3198c`-`69921cd`, Steps 32-36): including updated images for the hero pages and staff profiles, alongside ensuring my repo was provisioned correctly and passed all checks.

Having the workflow broken down into an orchestrator / executor split was something I found very efficient and allowed high level design decisions from my behalf, and properly aligned grunt-work manual labour from claude Sonnet (I did not need to use Opus at all), while maintaining cohesion throughout the whole project. It was nice to have my agent loop working well - only once did I have to ask the agent to undo something it did (`2abc399`, fixing a rail-side flip its own previous fix had caused), and instead i could keep brain-dummping my instructions, which would then get converted into detailed steps for an agent to carry out.

### Beat 4: Closing the gaps
After the visual-polish phase, a fourth pass (D33, Steps 37-44) went back over the built content, mostly the assessments, sessions and policies pages, and cleaned up prose left over from the earlier automated content-integration phase: em dashes, punctuation, a more consistent formal voice. Step 45 then replaced the home page's last `STARTER_CONTENT` paragraph with real copy about what the course is and who it's for. A separate fix (`d1ab198`) wired the site's GitHub Pages base path into a handful of internal links that had been left as bare paths.

Some of that work sat in the tree without ever landing as its own commit, and a couple of the copyedit steps turned out to be only partly done against their own written acceptance criteria once I checked. Two of the four staff bios (`anastasia-rusakova.md`, `marcus-whitfield.md`) had never actually been committed at all. I went back through `BUILD_PLAN.md`'s own step definitions against what was really in the working tree and landed each real piece of work as its own honestly-scoped commit instead of one catch-all commit (`7498acd`, `f62d77a`, `6e707aa`, `f44bd54` are four of that repair pass). `BUILD_PLAN.md` records what each of these found, including admitting where I couldn't reconstruct the original reasoning after the fact (why the staff list grew from two convenors to four, for instance).