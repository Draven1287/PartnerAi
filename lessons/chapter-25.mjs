// Lesson 25 — Make the Answer Checkable
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-25",
  "num": 25,
  "arc": "Prompting Craft",
  "title": "Make the Answer Checkable",
  "coreQuestion": "How do I ask for evidence I can inspect without pretending the AI can reveal its private thoughts?",
  "blurb": "Ask for the assumptions, evidence, calculations, and checks behind an answer — then verify one yourself.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Just a number",
      "scenario": "You ask an AI which phone plan is cheaper over a year. It replies: \"Plan B is cheaper.\" No math, no working — just a verdict. It sounds confident. But you have no idea how it got there, or whether it added anything up correctly.",
      "prompt": "Before you read on: if the verdict is wrong, could you tell? What concrete information would make it possible to check?"
    },
    {
      "kind": "reveal",
      "title": "Ask for an audit trail, not private thoughts",
      "body": "AI assistants may do internal processing that you cannot see, and a polished explanation written afterward is not a recording of that private process. So do not ask the system to prove itself by revealing what is inside. Ask for checkable work instead: the facts it used, assumptions it made, calculation it performed, source it relied on, uncertainty it noticed, and a short way to test the result. Those items can still be wrong, but they give you handles for inspection. Your goal is not to watch the AI think. Your goal is to make the answer auditable enough for you to decide whether to rely on it.",
      "mistake": "\"It gave a detailed explanation, so the answer must be right.\" Detail can make a mistake sound more convincing.",
      "good": "Request checkable artifacts, then independently test the part that matters most."
    },
    {
      "kind": "workflowChain",
      "title": "The answer-audit move",
      "goal": "Turn a verdict into a short set of claims you can inspect, then actually inspect one",
      "correct": [
        "Give the real numbers, facts, goal, and limits so the assistant does not have to invent missing context",
        "Ask for a concise answer plus its assumptions, evidence or sources, and calculations",
        "Ask it to separate what is known from what is estimated or uncertain",
        "Choose the claim that would most affect your decision and ask: \"What supports this, and how can I check it?\"",
        "Verify that claim with your own calculation or an independent, trustworthy source before relying on the answer"
      ],
      "note": "An uncertainty label is only a clue about where to inspect. It is not proof. The independent check is the evidence."
    },
    {
      "kind": "compare",
      "title": "Flat verdict vs. checkable answer",
      "weak": "Q: \"Plan A is $30/month, no setup fee. Plan B is $22/month plus a one-time $90 setup fee. Which is cheaper over one year?\" A: \"Plan B is cheaper.\"",
      "strong": "Same question, but: \"Give the total for each plan, list the assumptions you used, show the arithmetic, and give me one quick independent check. Keep it concise.\" A: \"Assumption: 12 months and the setup fee is charged once. Plan A: 30 x 12 = $360. Plan B: 22 x 12 + 90 = $354. Plan B is $6 cheaper. Check: recalculate 22 x 12 separately and confirm the fee is one-time.\"",
      "why": "The flat verdict might be right, but it gives you nothing to inspect. The checkable answer exposes the exact assumptions and arithmetic without claiming to reveal the model's private thoughts."
    },
    {
      "kind": "tryLive",
      "title": "Run it on a real question",
      "prompt": "This optional step uses an external assistant, so anything entered leaves LearningAI. Use invented or redacted numbers; do not enter account numbers, receipts with names, addresses, or another person's private information. Answer using only the information I provide. Give me: (1) a concise answer, (2) assumptions, (3) evidence or arithmetic for important claims, (4) uncertainty, and (5) one independent check: [question and safe facts]",
      "note": "Choose something inspectable: compare two made-up phone plans, divide an invented dinner bill, estimate paint, or check a game score. Include enough context to avoid guessing, then verify the most consequential calculation yourself."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your answer-audit line",
      "cardType": "Reusable prompt",
      "fields": [
        {
          "key": "trigger",
          "label": "When I'll use it",
          "placeholder": "A calculation, comparison, recommendation, or claim that could change a real decision"
        },
        {
          "key": "line",
          "label": "The line I paste",
          "placeholder": "Give the assumptions, evidence or arithmetic, uncertainty, and one independent way to check the result."
        },
        {
          "key": "mymove",
          "label": "What I do after",
          "placeholder": "Verify the most consequential claim using my own calculation or a trustworthy outside source"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you audit the answer?",
      "question": "You ran the answer-audit prompt on a fresh question. What makes this a pass?",
      "options": [
        {
          "text": "The AI gave a detailed explanation and an uncertainty label, so I trusted its final answer.",
          "ok": false,
          "feedback": "Detail and self-rated uncertainty are not independent evidence. You still need to test an important claim yourself."
        },
        {
          "text": "I identified the claim that mattered most, checked it with my own calculation or a trustworthy outside source, and can explain whether that check supported the answer.",
          "ok": true,
          "feedback": "That's the skill. You made the answer inspectable, then used evidence outside the answer to decide whether it deserved trust."
        },
        {
          "text": "I asked the AI to check its own answer a second time and it said the answer was correct.",
          "ok": false,
          "feedback": "A second AI answer is not an independent check. Use your own calculation or a separate trustworthy source."
        }
      ]
    }
  ]
};
