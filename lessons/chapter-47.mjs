// Lesson 47 — Build a Capstone
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-47",
  "num": 47,
  "arc": "Becoming a Builder",
  "title": "Build One Small Thing That Lasts",
  "coreQuestion": "How do I turn everything I have learned into one small tool I will actually use again?",
  "blurb": "Build it in three stages you can save. Design it, test it where it hurts, then keep proof of what changed.",
  "minutes": 35,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The Tuesday test",
      "scenario": "This whole course has been doing, not reading.\n\nNow think of one annoying job that comes back every single week. Turning messy notes into a revision sheet. Digging out what actually needs a reply. Planning meals around what is already in the cupboard.",
      "prompt": "What is ONE job like that you would genuinely want to hand over? The kind of thing you would open again next Tuesday."
    },
    {
      "kind": "reveal",
      "title": "It is small on purpose",
      "body": "This is your final build. A capstone just means the one thing you make at the end to show what you can do.\n\nIt is not a longer request. It is one small tool that survives being used a second time.\n\nBuild it in three stages, and save after each one. Stopping after any stage is fine.\n\nSTAGE 1, design, about 5 to 10 minutes. Write the numbered steps, one clear blank slot for the thing that changes, what counts as good enough, and what it is allowed to touch.\n\nSTAGE 2, test, about 10 to 15 minutes. Run it on one ordinary made-up example. Then on one deliberately awkward made-up example.\n\nSTAGE 3, proof, about 10 minutes. Save a before and after, one note about what broke and what you changed, and one fact you checked yourself.\n\nPaper counts. A checklist counts. A block of text you reuse counts. An empty spreadsheet counts. Code is optional, and so is any outside app.\n\nDo not paste in real names, addresses, messages, account details, confidential material, or anything about another person. If your tool affects other people, tell them AI helped when they would want to know. Anything serious still ends with a person who is answerable.",
      "mistake": "Deciding a real AI tool has to be huge and impressive, so you never build one. Or building it and trusting whatever comes out.",
      "good": "Picking one boring, repeating job. Writing it as reusable steps with one blank slot. Adding a stop if it can affect anything real. Then testing it and checking the facts yourself."
    },
    {
      "kind": "workflowChain",
      "title": "Put the build in order",
      "goal": "Build a small tool you will reuse, one stage at a time.",
      "correct": [
        "Name the repeating job, what you will feed it, what you want back, and what counts as good enough",
        "Have it write the whole thing as numbered steps with ONE clearly marked blank slot",
        "Write what it may look at or change, and add a person's yes before anything real or hard to undo",
        "Run it on one ordinary made-up example and keep a before and after",
        "Run it again on one deliberately awkward example, and fix the worst break",
        "Check the facts against what you actually know, then name your tool and save it"
      ],
      "note": "Both tests use safe made-up material. First an ordinary example, then an awkward one. You never need a real person's details to prove something is reusable. Save after each stage, so a 35-minute build can be split across a few sittings."
    },
    {
      "kind": "tryLive",
      "title": "Build yours now",
      "prompt": "I am building one small tool in three stages I can save. It might end up as steps on paper, a checklist, a block of text I reuse, an empty spreadsheet, a layout with no code, or an optional small digital version kept somewhere safe.\nThe repeating job, described with nothing private in it: [your job].\nAn ordinary made-up example to feed it: [safe example].\nWhat I want back: [the result].\nGood enough means: [one thing I can actually check].\nSTAGE 1. Write the numbered steps with ONE blank slot, what it is allowed to touch, and the point where a person has to say yes. Then stop so I can save it.\nSTAGE 2. Run those same steps on my ordinary example, then on this awkward one: [awkward example]. Say what broke worst, and suggest one change. Then stop again.\nSTAGE 3. Help me write a short record: before, after, what broke, what I changed, the result, and one fact I have to go and check myself. Do not ask me to connect an account, install anything, or hand over a real message, a real file, or anybody else's details.",
      "note": "You do not need an outside app. You can write all three stages here or on paper and compare them with the examples. If you do use one, only put in made-up text, or text with the details taken out. Save the three stages so your proof does not depend on memory or on one long sitting."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your tool as a card",
      "cardType": "My final build",
      "fields": [
        {
          "key": "name",
          "label": "What I call it",
          "placeholder": "e.g. Sunday revision-sheet maker"
        },
        {
          "key": "need",
          "label": "The repeating job it handles",
          "placeholder": "The real weekly annoyance, in your words"
        },
        {
          "key": "inputSlot",
          "label": "The blank slot I fill each time",
          "placeholder": "e.g. this week's messy, typo-covered notes"
        },
        {
          "key": "output",
          "label": "What comes back, and what counts as good enough",
          "placeholder": "e.g. one page sorted by topic, plus 5 questions, nothing invented"
        },
        {
          "key": "safetyLimit",
          "label": "Safety limit",
          "placeholder": "e.g. ask me before saving over a file or emailing anyone, or 'text only'"
        },
        {
          "key": "evidence",
          "label": "What broke, what I changed, what I checked",
          "placeholder": "What the awkward example broke, my fix, and the fact I checked"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you built a tool",
      "question": "You built it. What shows it is a real tool you can reuse, rather than one good answer?",
      "options": [
        {
          "text": "A fresh made-up example works without rebuilding anything. The limits and the human yes still hold. I saved a before and after, plus one break and my fix. And I checked one fact myself.",
          "ok": true,
          "feedback": "That is your graduation. Paper, text, spreadsheet, no-code or careful code all count. Reusing it, testing it, fixing a break and checking a fact are what make it real."
        },
        {
          "text": "It gave polished results on two examples, but I never wrote down what it could reach, or where a person says yes.",
          "ok": false,
          "feedback": "Two good results show some reuse. There is still no safety line. Write what it may touch and where a person approves before you call it done."
        },
        {
          "text": "The result came out in exactly the format I wanted, so I took that as proof the facts were right.",
          "ok": false,
          "feedback": "The right shape is not the same as the right facts. Go and check the claim the whole thing rests on, and keep that check with the result."
        },
        {
          "text": "You rewrote the whole thing from scratch to handle the new example.",
          "ok": false,
          "feedback": "If you rebuild it every time, nothing was saved. A real tool swaps the blank slot and reuses the same steps."
        }
      ]
    }
  ]
};
