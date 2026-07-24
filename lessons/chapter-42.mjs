// Lesson 42 — Delegate the Work, Keep the Judgment
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-42",
  "num": 42,
  "arc": "Building with AI",
  "title": "Delegate the Work, Keep the Judgment",
  "coreQuestion": "Which parts of a real task should I hand to AI, and which parts should stay mine?",
  "blurb": "Hand off the typing and the first draft. Keep the calls only you should make.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The end-of-year reviews",
      "scenario": "A group project needs a fair summary of what three people contributed. The job mixes gathering evidence, drafting clear wording, deciding what is true and fair, and fitting it into a template. You open an AI assistant to speed it up.",
      "prompt": "Before you read on: which of those four parts would you be uneasy handing entirely to the AI, and why?"
    },
    {
      "kind": "reveal",
      "title": "Delegate the work, keep the judgment",
      "body": "A skilled AI user does not maximize delegation; they protect the judgment that affects people. AI can draft, sort, or format, but it cannot know what truly happened, obtain consent, weigh a relationship, or accept responsibility for the result. Keep a part yourself when it must be true, carries your values, affects someone, requires permission, or goes out under your name. Delegate reversible labor only when you will inspect and approve it. Before an outside assistant sees any material, remove names, contact details, private messages, performance information, or another person's data. Data entered there leaves LearningAI.",
      "mistake": "Telling the AI 'write the full reviews for my three teammates' and pasting its answer straight into the template.",
      "good": "Letting the AI draft warm wording from YOUR notes, while you decide what's true and fair about each person — and keeping private details about named coworkers on your side."
    },
    {
      "kind": "classify",
      "title": "Run the keep-test",
      "prompt": "Sort each part of the year-end-review task. Delegate (D) = typing, drafting, formatting, sorting you'll still approve. Keep (M) = it must be true about real people, carries your values, or your name is on it.",
      "buckets": [
        "Delegate to AI (D)",
        "Keep for me (M)"
      ],
      "items": [
        {
          "text": "Draft warm wording from the notes I paste in",
          "answer": 0
        },
        {
          "text": "Decide what each teammate actually did well this year",
          "answer": 1
        },
        {
          "text": "Format the finished text into the company template",
          "answer": 0
        },
        {
          "text": "Judge whether the tone is fair and consistent across all three",
          "answer": 1
        },
        {
          "text": "Summarize a long project doc into three bullet points",
          "answer": 0
        },
        {
          "text": "Decide which sensitive details about a named coworker to include",
          "answer": 1
        }
      ],
      "reveal": "The D parts are labor: drafting, formatting, summarizing — you still read and approve them. The M parts all pass the keep-test: they need to be true about real people or your name is on the call. Notice the AI can't verify what's true about your teammates, even if it browses the web — so 'what really happened' and 'what's fair' stay yours."
    },
    {
      "kind": "tryLive",
      "title": "Get the map of parts",
      "prompt": "Here's a task I need to do: [your task]. Break it into its separate parts. For each part, tell me whether I should hand it to you or do it myself, and flag any part where my own judgment, values, or knowledge of real people matters — explain why in one line. Don't do the task yet; just give me the map of parts.",
      "note": "Use a real or invented task with several parts: planning a meal, community event, game night, shift handoff, repair, application, or group project. Give the assistant no identifying details. Hand it one reversible D part, keep one M part, and write who must approve before anything is sent, posted, booked, graded, or spent."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your keep-test",
      "cardType": "Delegate-vs-do rule",
      "fields": [
        {
          "key": "task",
          "label": "A task I'll do this week",
          "placeholder": "e.g. Plan my sister's birthday dinner"
        },
        {
          "key": "delegate",
          "label": "One part I'll hand to AI (D)",
          "placeholder": "e.g. Draft the invite text and list venue options"
        },
        {
          "key": "keep",
          "label": "One part I'll keep (M)",
          "placeholder": "e.g. Deciding who to invite"
        },
        {
          "key": "why",
          "label": "One word for why the kept part is mine",
          "placeholder": "truth? values? relationship? my name?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a new task",
      "question": "For a fresh task — choosing a training program, job, volunteer role, or major purchase and preparing the application or request — which delegation split keeps responsibility human?",
      "options": [
        {
          "text": "Delegate: tidy and format my rough draft. Keep: the choice, every claim about me, and final approval before submission.",
          "ok": true,
          "feedback": "That's it. You delegated the labor and kept the part that must be true and carries your name — and you named the real reason."
        },
        {
          "text": "Delegate: compare the opportunities and rank the fit. Keep: rewrite the winning application's wording in my voice and approve submission.",
          "ok": false,
          "feedback": "The final wording is yours, but the ranking decision was delegated. Keep the fit criteria and choice; let AI organize evidence or format your draft."
        },
        {
          "text": "Delegate: draft claims from my notes. Keep: formatting, because the template carries my name.",
          "ok": false,
          "feedback": "Formatting is reversible labor. The claims about you require your evidence and approval; AI may help phrase only after you decide what is true."
        }
      ]
    }
  ]
};
