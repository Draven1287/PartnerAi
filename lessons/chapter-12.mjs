// Lesson 12 — Asking well
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-12",
  "num": 12,
  "arc": "Talking to AI",
  "title": "Asking well",
  "coreQuestion": "How do I turn a vague request into a prompt that gets a genuinely useful answer?",
  "blurb": "A prompt is an instruction, not a wish. Add four parts and watch the answer sharpen.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The lazy one-liner",
      "scenario": "You open an AI assistant and type the first thing that comes to mind: \"give me a study plan.\" It answers instantly with a generic seven-day plan for no particular subject, no particular you. It's fine. It's also useless.",
      "prompt": "Before you read on: the AI didn't fail. Given only \"give me a study plan,\" what did it actually have to work with? What could you have told it that would change the answer?"
    },
    {
      "kind": "reveal",
      "title": "A prompt is an instruction, not a wish",
      "body": "Remember the engine from earlier lessons: AI predicts the most likely next words from patterns in the huge amount of human writing it learned from. So the more you say about what you want, the more you narrow what it predicts, and the closer the answer lands to what fits YOU. The fix isn't a longer or fancier sentence. A long, vague ask still gets a vague answer. What helps is being specific, not being wordy. Extra words only help when they tell the AI something real: your goal, your situation, your limits, the shape you want back.",
      "mistake": "Padding a vague request with more words: \"Please kindly provide me a comprehensive and detailed study plan.\" Still vague, just longer.",
      "good": "Telling the AI something real: what you want to achieve, who you are, your limits, and how the answer should look."
    },
    {
      "kind": "classify",
      "title": "Which part is missing?",
      "prompt": "Each line adds ONE real thing to a prompt. Is it telling the AI your Goal + Context (who you are and what you want to do), or your Constraints + Format (your limits and the shape of the answer)?",
      "buckets": [
        "Goal / Context",
        "Constraints / Format"
      ],
      "items": [
        {
          "text": "\"Help me make a 5-day plan to study for my biology test.\"",
          "answer": 0
        },
        {
          "text": "\"I'm 15, the test is Friday, and I get confused by cell diagrams.\"",
          "answer": 0
        },
        {
          "text": "\"I have 45 minutes a day and no weekends.\"",
          "answer": 1
        },
        {
          "text": "\"Give it to me as a short table with a row for each day.\"",
          "answer": 1
        },
        {
          "text": "\"Include one practice question each day.\"",
          "answer": 1
        }
      ],
      "reveal": "Goal is what you want to DO (not \"tell me about X\" but \"help me do Y\"). Context is who you are, so the answer fits you and not a stranger. Constraints are your limits and must-haves: time, money, reading level, things to avoid. Format is the shape you want back: a list, a table, three sentences, steps."
    },
    {
      "kind": "compare",
      "title": "Watch the gap appear",
      "weak": "\"give me a study plan\" -> a bland, generic week-long plan for no subject and no particular person.",
      "strong": "\"Goal: help me make a 5-day plan to study for my biology test. Context: I'm 15, the test is Friday, and I get confused by cell diagrams. Constraints: I have 45 minutes a day, no weekends, one practice question each day. Format: a short table, a row per day.\" -> a plan built around cell diagrams, sized to 45 minutes, with a daily practice question.",
      "why": "Same AI, same engine. The strong prompt just narrowed what it had to predict. Every part you added removed a whole cloud of answers that were about someone else."
    },
    {
      "kind": "tryLive",
      "title": "Rebuild your own, one part at a time",
      "prompt": "Goal: [what you want to achieve, stated as a doing]. Context: [who you are and your situation]. Constraints: [your limits and must-haves]. Format: [the shape you want the answer in]. Write the answer, then tell me in one line which part of my request shaped it most.",
      "note": "Add the parts one at a time and re-run after each: Goal, re-run. Add Context, re-run. Add Constraints, re-run. Add Format, re-run. Re-running is cheap: today's assistants keep the thread, so each try builds on the last. Put your first answer and last answer side by side; that gap is the whole lesson. Share only what's relevant in Context, no private details you don't need to give out."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your four-part prompt frame",
      "cardType": "Prompt frame",
      "fields": [
        {
          "key": "goal",
          "label": "Goal",
          "placeholder": "help me make a 5-day plan to study for my biology test"
        },
        {
          "key": "context",
          "label": "Context",
          "placeholder": "I'm 15, the test is Friday, I get confused by cell diagrams"
        },
        {
          "key": "constraints",
          "label": "Constraints",
          "placeholder": "45 min/day, no weekends, one practice question each day"
        },
        {
          "key": "format",
          "label": "Format",
          "placeholder": "a short table, one row per day: topic, what to do, question"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "You've got it when...",
      "question": "Pick a brand-new weak prompt you haven't touched today (\"help me plan a birthday party\" or \"write a message to my landlord\"). You add the four parts one at a time, re-running each time. What tells you that you actually understand the skill?",
      "options": [
        {
          "text": "You can point to the single part that made the biggest difference for THAT prompt, and say why.",
          "ok": true,
          "feedback": "Yes. The win isn't memorizing four words. It's knowing what each part is for and seeing which one did the heavy lifting for this particular ask."
        },
        {
          "text": "You wrote the longest, most detailed prompt you could.",
          "ok": false,
          "feedback": "Length isn't the point. A long, vague ask still gets a vague answer. Specific beats wordy every time."
        },
        {
          "text": "You got a good answer on the very first try without changing anything.",
          "ok": false,
          "feedback": "Maybe you got lucky, but the skill is being able to steer. If you can't name what shaped the answer, you can't repeat it on the next prompt."
        },
        {
          "text": "You used all four exact words Goal, Context, Constraints, Format as headings.",
          "ok": false,
          "feedback": "The labels are just scaffolding. What matters is that you told the AI something real in each one, not that you typed the words."
        }
      ]
    }
  ]
};
