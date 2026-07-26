// Lesson 49 — The Bigger Picture
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-49",
  "num": 49,
  "arc": "Becoming a Builder",
  "title": "The Bigger Picture",
  "coreQuestion": "AI is going to change things. How do I plan my own move instead of waiting to see what happens?",
  "blurb": "Skip the panic and the shrug. Write a three-line plan for one thing you care about, then prove it works anywhere.",
  "minutes": 16,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Two loud stories",
      "scenario": "Scroll for long enough and you get two stories about AI.\n\nOne says it takes every job and there is nothing you can do.\n\nThe other says it is all hype and nothing really changes.\n\nBoth are loud. Both are easy to repeat at dinner.",
      "prompt": "Notice what they share. Neither one asks you to do anything this week. Which one do you catch yourself repeating?"
    },
    {
      "kind": "classify",
      "title": "Panic, shrug, or something you can use?",
      "prompt": "Sort each one. The useful ones are boring and specific, and they leave room for your own choices.",
      "buckets": [
        "Panic or shrug",
        "Something you can use"
      ],
      "items": [
        {
          "text": "AI will replace everyone, so there is no point learning anything.",
          "answer": 0
        },
        {
          "text": "It is all hype. In five years we will laugh that we worried.",
          "answer": 0
        },
        {
          "text": "Most of my students will draft with AI, so 'did they write it?' stops being the useful question.",
          "answer": 1
        },
        {
          "text": "AI wants to take over creative work.",
          "answer": 0
        },
        {
          "text": "This could handle my meeting notes, so I will test it on Friday's call.",
          "answer": 1
        }
      ],
      "reveal": "A note about words. People say AI will 'decide' or 'want' to replace jobs. That is a figure of speech. It wants nothing. It has read an enormous amount of writing and guesses the words that fit next. People and companies choose where to point it. The choosing stays human, for better and worse. That includes yours."
    },
    {
      "kind": "reveal",
      "title": "Plan your own move",
      "body": "The changes are uneven and hard to guess. People make choices, and those choices drive them. So build your plan from what you can actually see, not from a headline.\n\nFour parts. One change you can point at. One thing it opens up, or one risk. One small thing you control. And a date to look again.\n\nIf you use an outside app, keep the area broad or made up. Take out your employer, school, family, town, money and anything private. What you type there leaves LearningAI.\n\nIf it searches the web, open the original pages yourself. Check the dates. Ask who benefits from the story. Anything about the future is a guess, so label it as one.\n\nAnd if the doom stuff is genuinely making you anxious, talk to somebody you trust. Do not use a chat app as your only support.",
      "mistake": "Waiting to see what happens. Or picking 'the world' as your area, which is far too big to act on.",
      "good": "Picking one specific thing you can actually move in, like being a history teacher. Then writing the boring, doable action first."
    },
    {
      "kind": "tryLive",
      "title": "Draft your three lines",
      "prompt": "Give me a fair, honest view of how AI might realistically affect [my area] over the next few years. Then write it as three lines. One, the most likely change, boring and specific, not a headline. Two, one real thing it opens up for me. Three, one small thing I could start this week. Be clear about what is genuinely uncertain. Do not hype it and do not doom it. About me: [one detail].",
      "note": "Pick a broad area that does not identify you. Fixing bikes, looking after animals, making music, helping at a library, running a stall, learning a trade, working shifts, teaching. Do not name an employer, school, customer, or private plan. Open two original pages behind any claim about a trend, and write down what is still unclear. Then edit the plan so the action is specific, cheap, and yours to approve."
    },
    {
      "kind": "toolkitSave",
      "title": "Save both plans",
      "cardType": "My three lines",
      "fields": [
        {
          "key": "area",
          "label": "The area",
          "placeholder": "e.g. being a history teacher"
        },
        {
          "key": "change",
          "label": "The likely change, boring and specific",
          "placeholder": "e.g. most of my students will draft essays with AI"
        },
        {
          "key": "opportunity",
          "label": "What it opens up",
          "placeholder": "e.g. I can mark the thinking instead: sources, argument, redrafts"
        },
        {
          "key": "action",
          "label": "One action, and a day this week",
          "placeholder": "e.g. rewrite one task to be done in class, by Thursday"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove the skill is yours",
      "question": "You wrote one plan. Now run the same three lines on a completely different area. If the first was work, try a hobby, your town, or somebody in your family. Which second plan passes?",
      "options": [
        {
          "text": "Change I can see: the library is testing AI search. Opens up: faster starting points. Action: ask for a demonstration on Saturday, compare one result with the normal catalogue, and change the plan based on what I find.",
          "ok": true,
          "feedback": "Passes. No panic, no shrug. A stranger reading line three would know exactly what to do, on which day."
        },
        {
          "text": "Change: parts of my hobby might get automated. Opens up: saving time. Action: follow the trend and decide later, with no source and no test.",
          "ok": false,
          "feedback": "Believable, but there is nothing to test. Name something you can look at, a cheap experiment, a date, and what would change your mind."
        },
        {
          "text": "Change: an AI feature might turn up in my field. Opens up: using it right away. Action: switch it on next week without checking what it can reach.",
          "ok": false,
          "feedback": "Switching it on without checking what it can touch hands over control. Try it small first, and put a person's check before anything real."
        }
      ]
    }
  ]
};
