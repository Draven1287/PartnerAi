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
      "body": "AI will change a lot, but how it lands on YOU is partly your call. The Builder move is to design your own adaptation, not to wait for change to arrive. The method is three boring lines for one area you can actually act in: (1) one likely change — concrete, not a headline; (2) one real opportunity it opens for you; (3) one small action you'll start THIS WEEK. Modern assistants can browse the live web, so AI may pull in recent news about your field — treat that as a draft to fact-check and edit, not a finished verdict. A forecast of 'the next few years' is always partly uncertain. And if the doom story is making you genuinely anxious, that's worth talking through with a real person you trust — not just a chatbot.",
      "mistake": "Wait to see what happens, or pick 'the world' and 'humanity' as your area — too big to act on.",
      "good": "Pick one concrete area you can move in ('being a high school history teacher') and write the boring, doable action first."
    },
    {
      "kind": "tryLive",
      "title": "Draft your Adapt Plan",
      "prompt": "Give me a balanced, honest view of how AI might realistically affect [my area] over the next few years. Then write it as a 3-line Adapt Plan: (1) one likely change — boring and concrete, not a headline; (2) one real opportunity it opens for me; (3) one small action I could start this week. Be clear about what's genuinely uncertain. Don't hype it and don't catastrophize. My situation: [one detail about me].",
      "note": "[my area] = something you can act in, like 'being a high school history teacher' — not 'humanity.' [one detail about me] = the fact that makes advice fit your reality, like 'I'm not allowed to ban AI in my classroom, and most of my students already use it.' Then YOU edit the draft: cross out anything that reads like a scary headline or a sales pitch, and replace vague advice with a boring action ('learn my workplace's note-taking AI by Friday' beats 'embrace the future')."
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
          "text": "Likely change: my town's library adds AI search. Opportunity: I find local history faster. Action: I'll ask the librarian on Saturday to show me the new catalog search.",
          "ok": true,
          "feedback": "Passes. Both plans avoid doom and denial, and a stranger reading line 3 knows exactly what to do — a specific thing, on a specific day."
        },
        {
          "text": "Likely change: everything about my hobby will be automated. Opportunity: none, honestly. Action: stay aware and keep an eye on it.",
          "ok": false,
          "feedback": "That's the doom story plus a vague action. Rewrite it: name a real change you'd bet money on, and an action with a specific day."
        },
        {
          "text": "Likely change: AI won't touch my field at all. Opportunity: none needed. Action: nothing.",
          "ok": false,
          "feedback": "That's the denial story. A grounded plan names at least one real, boring change and one action you'd start this week."
        }
      ]
    }
  ]
};
