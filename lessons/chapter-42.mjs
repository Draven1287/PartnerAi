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
      "scenario": "Your manager asks you to write year-end reviews for your three teammates. It's a mix of stuff: gathering what each person actually did, writing warm wording, checking the tone is fair, and dropping it all into the company template. You open a chat with an AI to speed it up.",
      "prompt": "Before you read on: which of those four parts would you be uneasy handing entirely to the AI, and why?"
    },
    {
      "kind": "reveal",
      "title": "Delegate the work, keep the judgment",
      "body": "A common belief is that a skilled AI user delegates as much as possible. That's backwards. A skilled user PROTECTS the thinking that matters and delegates everything around it. Maxing out delegation is how people hand over decisions they'll regret. Here's the mechanism, not a personality flaw: today's AI learned patterns from huge amounts of human writing and predicts likely wording from those patterns. Even in 2026, when it can browse the live web and use tools, it still can't know what's genuinely true about your people or what you believe — and it still sometimes makes things up. So keep a part yourself (mark it M) if it needs to be TRUE about your real life, carries your VALUES, affects a RELATIONSHIP, or is something YOUR NAME is on. Delegate a part (mark it D) if it's typing, formatting, a rough first draft, sorting, summarizing, or listing options — work where you'll still read and approve the result.",
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
      "note": "Use a real task with several moving pieces, not one tiny thing. When the map comes back, hand ONE D part to the AI for real now, and keep ONE M part to do yourself later. Keep private details about named people on your side — give the AI only the general wording to polish."
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
      "question": "Pick a DIFFERENT task than the review one — say, choosing which colleges to apply to and writing the applications. You point to one part you'd delegate and one you'd keep. Which pairing shows you've got the skill?",
      "options": [
        {
          "text": "Delegate: tidy and format the essay draft. Keep: what I genuinely claim about myself — my name is on it and it has to be true.",
          "ok": true,
          "feedback": "That's it. You delegated the labor and kept the part that must be true and carries your name — and you named the real reason."
        },
        {
          "text": "Delegate: everything, so I finish fastest. Keep: nothing — a skilled user hands off as much as possible.",
          "ok": false,
          "feedback": "That's the misconception this lesson fixes. Maxing out delegation hands over decisions you'll regret. Protect the parts that must be true or carry your name."
        },
        {
          "text": "Keep: formatting the essay into the template. Delegate: deciding which schools fit me and what to say about myself.",
          "ok": false,
          "feedback": "Backwards. Formatting is exactly the kind of labor to delegate; deciding what fits you and what's true about you is the judgment to keep."
        }
      ]
    }
  ]
};
