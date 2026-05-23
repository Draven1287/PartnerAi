# Learning AI Learning Architecture Plan

Date: 2026-05-22

## Purpose

This document defines what Learning AI should become after the first public test. It is not a bug list. It is the product and lesson architecture that should guide the next build pass so the site teaches better instead of collecting random feature patches.

## Product Truth

Learning AI V1 is a static AI literacy prototype. Its job is to answer a few questions with real users:

- Do people understand what the site is trying to teach?
- Do they keep going after the assessment?
- Do the lessons feel useful, or do they feel like reading homework?
- Do different learners feel like the site is made for them?
- Where do learners get confused, bored, or stuck?

V1 should not pretend to be a full adaptive learning platform yet. It should be honest, useful, and easy to test with friends.

## Current Problem

The current site has a strong mission, but the learning model is not strong enough yet.

The assessment changes labels and framing, but the actual lesson experience still feels mostly the same. A Builder, Explorer, and Foundation learner can all land in material that reads like the same course with a different badge.

That creates several problems:

- Builder learners expect deeper explanations but still receive beginner-style reading.
- Foundation learners may need clearer analogies, visuals, and hands-on practice earlier.
- Explorer learners need judgment tasks, comparison exercises, and trust checks.
- The lessons explain concepts, but they do not always teach through action.
- Some copy sounds clever but is not clear enough for a real beginner.
- Progress exists, but it needs to feel connected to learning milestones.
- Projects are useful, but they should connect more directly to each learner's level and track.

The honest fix is not to keep adding small patches to every page. The fix is to define a repeatable lesson system.

## V1 Rule

Do not overbuild V1 before friend testing.

For V1, keep the current five-chapter structure. Make only narrow changes that help testers understand the product:

- Keep the assessment.
- Keep progress saving.
- Keep the starting point at Lesson 1.
- Keep retaking the assessment from erasing progress.
- Keep early-access labels for unfinished chapters.
- Add a simple feedback/contact line once the final email address is chosen.
- Avoid paid accounts, reminders, backend work, and a large lesson expansion until after testing.

The goal is to get feedback from real people, not to build the whole V2 course in advance.

## Core Learning Decision

The assessment should not decide which lesson number someone starts on.

The assessment should decide how the learner is taught.

Every learner starts at the beginning of their current path. The difference is the lesson version they receive:

- Foundation gets simple explanations, analogies, and guided practice.
- Explorer gets comparison tasks, trust checks, and applied use cases.
- Builder gets technical models, system thinking, and build-focused exercises.

This keeps the starting point clean while still making the course feel personalized.

## Recommended Levels

For now, keep three levels. More levels may sound better, but too many tiers will make the product harder to explain and harder to build well.

### Foundation

Audience: beginners, younger learners, or people who do not yet understand how AI works.

Goal: help the learner understand what AI is, what an LLM is, what it can do, what it cannot do, and how to use it without blindly trusting it.

Teaching style:

- Plain language.
- Short sections.
- Concrete analogies.
- Visual examples.
- Guided prompts.
- Quick checks.
- Low-pressure practice.

### Explorer

Audience: learners who have used AI before but do not yet have strong judgment.

Goal: help the learner use AI with agency, compare outputs, catch mistakes, improve prompts, and apply AI to school, work, creative, or personal tasks.

Teaching style:

- Less hand-holding.
- More comparison.
- More "which answer is better and why?"
- More bias, hallucination, and source-checking practice.
- More real-world workflow examples.

### Builder

Audience: learners who want to build tools, automations, agents, workflows, or AI-powered projects.

Goal: help the learner understand the parts of AI systems and build useful things without pretending the model is magic.

Teaching style:

- Technical but still clear.
- System diagrams.
- Prompt architecture.
- Agent and workflow concepts.
- Testing and evaluation.
- Project checkpoints.
- Real build tasks.

## Recommended Tracks

Levels describe difficulty. Tracks describe context.

Do not make completely separate websites for each track yet. Instead, design each lesson so examples, projects, and practice prompts can change by track.

Recommended V2 tracks:

- Student: homework help, studying, writing, research, projects, avoiding cheating, learning agency.
- Teacher or Educator: classroom activities, 20/40/20 workshops, student safety, lesson planning, assessment.
- Builder or Coder: apps, agents, workflows, APIs, debugging, structured prompts, evaluation.
- Business or Workflow: operations, email, voice agents, customer workflows, automation, decision support.
- Creative or Personal: writing, planning, brainstorming, daily life, art, reflection, organization.

The user should feel, "This example is actually for someone like me."

## Lesson Unit Format

Every future lesson should follow the same teaching pattern. This keeps the course consistent while allowing each level and track to feel different.

1. Big idea

   One clear sentence explaining what the learner is about to understand.

2. Simple model

   A visual, analogy, diagram, or concrete example. This is where Foundation learners need the most care.

3. Do it now

   A short interactive task. The learner should not read for too long without doing something.

4. Mistake to catch

   Show a bad AI answer, weak prompt, fake source, hallucination, or unclear output. Ask the learner what is wrong.

5. Better move

   Show the improved prompt, evaluation step, or reasoning pattern.

6. Try it in an AI tool

   Give clear instructions for copying a prompt into an external AI tool. Say exactly what to paste and what to look for.

7. Save progress

   Let the learner mark the lesson as complete and show how much of the path is done.

8. Project connection

   Connect the concept to a small project or a larger future build.

## Example Topic: What AI Actually Is

The same topic should be taught differently by level.

### Foundation Version

Goal: understand that AI is software trained on patterns, not a person.

Possible activities:

- Show three sentence completions and ask which one sounds most likely.
- Explain tokens as small chunks of text.
- Show that the model predicts likely next tokens, not truth.
- Ask the learner to explain the idea back in one sentence.

Tone: simple, visual, patient.

### Explorer Version

Goal: understand why AI can sound right while being wrong.

Possible activities:

- Compare two AI answers, one correct and one confident but wrong.
- Ask what evidence is missing.
- Give a prompt that asks the model to show uncertainty.
- Teach "trust but verify" as an active skill.

Tone: practical, judgment-focused, less basic.

### Builder Version

Goal: understand the system parts behind an AI output.

Possible activities:

- Explain tokens, model weights, context window, inference, retrieval, and evaluation at a high level.
- Show why prompt structure changes output.
- Compare a one-shot prompt to a structured system-style prompt.
- Ask the learner to design a tiny evaluation checklist for an AI feature.

Tone: direct, technical, project-oriented.

## Interaction Standard

No long wall of text without action.

Every lesson should include at least two of these:

- A quick check.
- A small prompt lab.
- A compare-the-outputs task.
- A mistake spotting activity.
- A mini project step.
- A reflection checkpoint.
- A visual model or diagram.
- A scenario choice.

Interactive does not always mean complex JavaScript. A good `details` quiz, side-by-side comparison, checklist, or prompt exercise is enough for V1/V2 if it teaches clearly.

## Progress Model

Progress should be simple and believable.

- The assessment updates the learner profile.
- The assessment does not erase old progress.
- The starting lesson is the first lesson in the current path.
- Each completed lesson unit counts toward 100%.
- Projects can have separate progress from lessons.
- When lesson progress hits 100%, the site should guide the learner to projects.
- Retaking the assessment can update the framing and recommended projects, but it should not punish the learner.

Do not use "Builder" to mean "skip the basics." Use Builder to mean "teach the basics in a builder-level way."

## What Not To Build Yet

Avoid these until after friend testing:

- Paid accounts.
- Member dashboards.
- Backend authentication.
- Email reminders.
- A full 15+ lesson course.
- Complex tier trees.
- Fake adaptive personalization.
- Embedded AI chat unless there is a real backend and safety plan.

These ideas may be good later, but they will distract from the V1 test.

## First V2 Prototype

Build one vertical slice before expanding the whole course.

Recommended first slice:

- Topic: What AI actually is.
- Track: Student.
- Levels: Foundation, Explorer, Builder.

This means building three versions of the same lesson topic:

- Foundation Student version.
- Explorer Student version.
- Builder Student version.

Then test those with friends. If that slice works, expand the pattern to other tracks and topics.

This is better than writing 15 weak lessons. One excellent adaptive lesson proves the model.

## Friend Testing Questions

Ask testers simple questions after they use V1:

- What did you think this site was for?
- Where did you get bored?
- Where did you get confused?
- Did your path feel like it was made for you?
- Did you understand what an LLM is after the first lesson?
- Did anything feel too childish?
- Did anything feel too advanced?
- Did you know what to do after copying a prompt?
- Did progress saving make sense?
- What would make you come back?

These answers should decide V2 more than our guesses.

## Open Decisions

These need owner decisions before implementation:

- What email should the feedback/contact line use?
- Should friend feedback be collected by email, form, or both?
- Which track should V2 prototype first: Student, Builder, or Business?
- Should V2 keep three levels or add a fourth level later?
- What is the minimum lesson quality bar before adding more lessons?

## Recommended Next Steps

1. Add a simple V1 feedback/contact line once the email address is chosen.
2. Stop major V1 feature changes.
3. Give the site to friends.
4. Collect feedback using the friend testing questions above.
5. Build one V2 vertical slice instead of expanding immediately to 15+ lessons.

The main product standard is this:

Learning AI should not only explain AI. It should make the learner practice agency with AI.
