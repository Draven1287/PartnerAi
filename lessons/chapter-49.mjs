// Lesson 49 — The Bigger Picture
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-49",
  "num": 49,
  "arc": "Becoming a Builder",
  "title": "The Bigger Picture",
  "coreQuestion": "AI will change a lot — so how do I design my own adaptation instead of waiting for change to arrive?",
  "blurb": "Skip doom and denial. Build a 3-line Adapt Plan for one area you care about — then prove the method works anywhere.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Two loud stories",
      "scenario": "Scroll far enough and you hear two takes on AI. One: 'It takes all the jobs — you're powerless.' The other: 'It's all hype — nothing really changes.' Both are loud. Both are easy to repeat at dinner.",
      "prompt": "Notice what both stories have in common: neither one asks you to do anything this week. Which story do you catch yourself repeating — and what would change if the truth sat somewhere in between?"
    },
    {
      "kind": "classify",
      "title": "Doom, denial, or grounded?",
      "prompt": "Sort each take into the bucket it belongs in. The grounded ones are boring, concrete, and leave room for your own choices.",
      "buckets": [
        "Doom or denial",
        "Grounded"
      ],
      "items": [
        {
          "text": "AI will replace everyone — there's no point learning anything.",
          "answer": 0
        },
        {
          "text": "It's all hype; in five years we'll laugh that we worried.",
          "answer": 0
        },
        {
          "text": "Most of my students will draft with AI, so 'did they write it?' stops being the useful question.",
          "answer": 1
        },
        {
          "text": "AI 'wants' to take over creative work.",
          "answer": 0
        },
        {
          "text": "This tool could handle my meeting notes, so I'll test it on Friday's call.",
          "answer": 1
        }
      ],
      "reveal": "One quick note on words: people say AI will 'decide' or 'want' to replace work. That's a comparison, not the reality. AI has no wants — it's a pattern-prediction tool that learned patterns from huge amounts of human writing and predicts the most likely next words. The choice of WHERE to use it is made by people and companies. The agency, for better or worse, stays human — including yours."
    },
    {
      "kind": "reveal",
      "title": "Design your adaptation",
      "body": "AI changes are uneven, uncertain, and shaped by choices made by people and organizations. Build an adaptation plan from evidence, not a headline: one specific change you can observe, one opportunity or risk, one action you control, and one checkpoint for revising the plan. Before using an outside assistant, remove employer, school, family, location, financial, and private details; use a broad or invented area. Data entered there leaves LearningAI. If the assistant browses, open the original sources, check dates and incentives, and label forecasts as uncertain. If doom content is causing real anxiety, talk with a trusted person rather than using a chatbot as the only support.",
      "mistake": "Wait to see what happens, or pick 'the world' and 'humanity' as your area — too big to act on.",
      "good": "Pick one concrete area you can move in ('being a high school history teacher') and write the boring, doable action first."
    },
    {
      "kind": "tryLive",
      "title": "Draft your Adapt Plan",
      "prompt": "Give me a balanced, honest view of how AI might realistically affect [my area] over the next few years. Then write it as a 3-line Adapt Plan: (1) one likely change — boring and concrete, not a headline; (2) one real opportunity it opens for me; (3) one small action I could start this week. Be clear about what's genuinely uncertain. Don't hype it and don't catastrophize. My situation: [one detail about me].",
      "note": "Choose a broad, non-identifying area you can act in: repairing bikes, caring for pets, making music, helping at a library, running a food stall, learning a trade, working a shift, or teaching. Do not name an employer, school, customer, or private plan. Open two original sources behind any trend claim and record what remains uncertain. Edit the plan so the action is specific, affordable, and yours to approve."
    },
    {
      "kind": "toolkitSave",
      "title": "Save both plans",
      "cardType": "Adapt Plan",
      "fields": [
        {
          "key": "area",
          "label": "Area",
          "placeholder": "e.g. being a high school history teacher"
        },
        {
          "key": "change",
          "label": "Likely change (boring, concrete)",
          "placeholder": "e.g. Most of my students will draft essays with AI"
        },
        {
          "key": "opportunity",
          "label": "Real opportunity",
          "placeholder": "e.g. I can grade the thinking — sourcing, argument, revisions"
        },
        {
          "key": "action",
          "label": "One action + a day this week",
          "placeholder": "e.g. Rewrite one assignment to be done in class, by Thursday"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove the skill is yours",
      "question": "You built one Adapt Plan. Now run the SAME three-line method on a second, unrelated area (if the first was your job, try your hobby, your town, or a family member's situation). Which second plan actually passes?",
      "options": [
        {
          "text": "Observed change: the public library is testing AI search. Opportunity: faster starting points. Action: ask for a demo Saturday, compare one result with the existing catalog, and revise the plan from that evidence.",
          "ok": true,
          "feedback": "Passes. Both plans avoid doom and denial, and a stranger reading line 3 knows exactly what to do — a specific thing, on a specific day."
        },
        {
          "text": "Likely change: some parts of my hobby may be automated. Opportunity: save time. Action: follow the trend and decide later, without naming a source or a test.",
          "ok": false,
          "feedback": "This is plausible but not testable yet. Name an observable source, a low-cost experiment, a date, and the evidence that would change the plan."
        },
        {
          "text": "Likely change: an AI feature may appear in my field. Opportunity: use it immediately. Action: turn it on next week without checking permissions or consequences.",
          "ok": false,
          "feedback": "Acting without a permission or consequence check hands over control. Add a small sandbox test and a human review point before enabling the feature."
        }
      ]
    }
  ]
};
