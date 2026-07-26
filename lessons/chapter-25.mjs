// Lesson 25 — Make the Answer Checkable
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-25",
  "num": 25,
  "arc": "Prompting Craft",
  "title": "Make the Answer Checkable",
  "coreQuestion": "How do I ask for working I can actually look at, without pretending the AI can show me its private thoughts?",
  "blurb": "Ask for what it assumed, where the facts came from, and the sums it did. Then check one of them yourself.",
  "minutes": 16,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Just a verdict",
      "scenario": "You ask an AI which phone deal costs less over a year. It replies: 'Plan B is cheaper.'\n\nNo sums. No working. Just the verdict.\n\nIt sounds sure of itself. You have no idea how it got there, or whether it added anything up correctly.",
      "prompt": "If that verdict is wrong, could you tell? What would it need to show you before you could check?"
    },
    {
      "kind": "reveal",
      "title": "Ask for an audit trail, not private thoughts",
      "body": "An audit trail just means the working, laid out where you can look at it.\n\nHere is the catch. These apps may do things inside that nobody can see. A tidy explanation written afterwards is not a recording of that. It is more writing.\n\nSo do not ask it to prove itself by showing you what is going on inside. Ask for working you can check.\n\nThe facts it used. What it assumed. The sums it did. Where each fact came from. Anything it is unsure about. One quick way for you to test the result.\n\nAll of that can still be wrong. But now you have something to grab hold of.\n\nYour goal is not to watch it think. Your goal is to make the answer open enough that you can decide whether to trust it.",
      "mistake": "'It gave a really detailed explanation, so it must be right.' Detail makes a mistake sound more convincing, not less.",
      "good": "Ask for the working you can check. Then test the part that matters most, yourself."
    },
    {
      "kind": "workflowChain",
      "title": "Open up the answer",
      "goal": "Turn a bare verdict into a few claims you can look at, then actually look at one",
      "correct": [
        "Give it the real numbers, the goal, and the limits, so it does not have to invent the missing bits",
        "Ask for a short answer plus what it assumed, where the facts came from, and the sums",
        "Ask it to say which parts it knows and which parts it is guessing at",
        "Pick the one claim that would change your decision most, and ask what backs it up",
        "Check that claim yourself, with your own maths or a source you trust, before you rely on it"
      ],
      "note": "When it says it is unsure, that is a hint about where to look. It is not proof of anything. The check you do yourself is the proof."
    },
    {
      "kind": "compare",
      "title": "Bare verdict, or working you can see",
      "weak": "Q: 'Plan A is $30 a month with nothing to join. Plan B is $22 a month plus a one-off $90 joining fee. Which costs less over a year?' A: 'Plan B is cheaper.'",
      "strong": "Same question, plus: 'Give the total for each one, say what you assumed, show the sums, and give me one quick way to check it myself. Keep it short.' A: 'Assuming 12 months and the joining fee is charged once. Plan A: 30 x 12 = $360. Plan B: 22 x 12 + 90 = $354. Plan B is $6 less. Check: work out 22 x 12 on your own, and confirm the fee really is one-off.'",
      "why": "The bare verdict might be right. It just gives you nothing to check. The second one puts the assumptions and the sums where you can see them, without pretending to show you anything hidden."
    },
    {
      "kind": "tryLive",
      "title": "Run it on a real question",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use made-up numbers. Do not enter account numbers, receipts with names on, addresses, or anything private about another person. Answer using only the information I give you. Give me: (1) a short answer, (2) what you assumed, (3) the sums or the sources behind the important bits, (4) anything you are unsure about, and (5) one way I can check it myself: [your question and safe facts]",
      "note": "Pick something you can actually check: two made-up phone deals, splitting a bill between friends, working out how much paint a wall needs, adding up a game score. Give it enough detail that it does not have to guess. Then check the sum that matters most, yourself."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your open-up-the-answer line",
      "cardType": "Reusable prompt",
      "fields": [
        {
          "key": "trigger",
          "label": "When I will use it",
          "placeholder": "Any sum, comparison, or recommendation that could change a real decision"
        },
        {
          "key": "line",
          "label": "The line I paste",
          "placeholder": "Show what you assumed, the sums or sources, anything you are unsure of, and one way I can check it."
        },
        {
          "key": "mymove",
          "label": "What I do next",
          "placeholder": "Check the claim that matters most, using my own maths or a source I trust"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually check it?",
      "question": "You ran the open-up-the-answer prompt on a fresh question. What counts as a pass?",
      "options": [
        {
          "text": "It gave a long, detailed explanation and said it was fairly confident, so I trusted the answer.",
          "ok": false,
          "feedback": "Detail and its own confidence are not proof of anything. You still need to test one important claim yourself."
        },
        {
          "text": "I picked out the claim that mattered most and checked it with my own maths, or a source I trust. I can say whether that check backed the answer up.",
          "ok": true,
          "feedback": "That is the skill. You opened the answer up, then used something outside it to decide whether it deserved your trust."
        },
        {
          "text": "I asked it to check its own answer again, and it said the answer was correct.",
          "ok": false,
          "feedback": "A second answer from the same place is not an outside check. Use your own maths, or a separate source you trust."
        }
      ]
    }
  ]
};
