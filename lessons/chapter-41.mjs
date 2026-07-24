// Lesson 41 — Planning a Big Project Together
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-41",
  "num": 41,
  "arc": "Building with AI",
  "title": "Planning a Big Project Together",
  "coreQuestion": "How do I turn a project that feels too big to start into an ordered plan I actually own?",
  "blurb": "Overwhelm is a planning problem, not a you problem. Let AI break the mountain into stairs, then you decide which stair to climb first.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The project that's been sitting heavy",
      "scenario": "There's a project you keep not-starting. A family reunion. A move. A thesis. A big essay. It feels too big to even begin, so it just sits there getting heavier every week you look at it.",
      "prompt": "Choose the first decision the plan must protect: deadline, cost, another person's availability, safety, or your energy. Which constraint can move, and which one cannot?"
    },
    {
      "kind": "reveal",
      "title": "AI cuts the mountain into stairs — you decide where they lead",
      "body": "Overwhelm is often a planning problem, not a personal failure. An AI can generate a familiar project breakdown quickly, but it does not know your calendar, budget, energy, tools, permissions, or the people affected. It fills missing details with plausible guesses. You therefore choose the constraints, cut unnecessary phases, reorder the work, and add human approval before spending, booking, publishing, or involving someone else. Before an outside assistant sees the project, replace names with roles, round amounts, generalize locations, and remove addresses, account numbers, schedules, private messages, and another person's information. Data entered there leaves LearningAI.",
      "mistake": "Treating the AI's plan as finished truth and just following it, as if it knew your real situation.",
      "good": "Treating yourself as the editor, not the audience: you supply the real-world facts it can only guess at, then cut and reorder."
    },
    {
      "kind": "tryLive",
      "title": "Run the plan prompt on a real project",
      "prompt": "Help me plan [the big project]. Here's my real situation: [deadline / what I already have / what's blocking or scaring me]. Break it into [4–6] phases, and for each phase give me the very first small step. Then suggest one good checkpoint where I should pause and re-decide before continuing. Ask me one question if something important is missing — don't guess it.",
      "note": "Worked example: 'Help me plan a medium-sized family gathering in about three months. I have a rough guest count but no venue, and cost is the hard limit. Use five phases and add an approval checkpoint before any booking.' Use relevant but non-identifying facts; a community event, room reorganization, repair, move, creative build, or family plan all work. The assistant proposes; you approve every commitment."
    },
    {
      "kind": "workflowChain",
      "title": "Be the editor: the order that makes the plan yours",
      "goal": "Turn the AI's plan into a plan you actually own and will start today",
      "correct": [
        "Brain-dump three honest facts: your deadline, what you already have, what's blocking or scaring you",
        "Run the prompt and let the AI break the goal into phases with a first step for each",
        "Cross out one phase you don't actually need",
        "Drag one step earlier or later — because you know your life better than the AI does",
        "Add one checkpoint where you or the affected person approves before money, booking, publishing, or irreversible action",
        "Circle the single first step and write down when today you'll do it"
      ],
      "note": "The cutting and reordering are the whole point. The AI predicts a generic breakdown; you're the one who knows the real-world facts it can't see."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your project plan",
      "cardType": "Project plan",
      "fields": [
        {
          "key": "project",
          "label": "The project",
          "placeholder": "e.g. Organize a 30-person family reunion"
        },
        {
          "key": "firstStep",
          "label": "My single first step (today)",
          "placeholder": "e.g. Text 3 relatives to shortlist possible dates"
        },
        {
          "key": "when",
          "label": "When today I'll do it",
          "placeholder": "e.g. After dinner, 7pm"
        },
        {
          "key": "checkpoint",
          "label": "My checkpoint to pause & re-decide",
          "placeholder": "e.g. After I have a venue quote, check the budget before booking"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do you own the plan?",
      "question": "Take a DIFFERENT heavy project you haven't touched yet. Run the same prompt, edit the result (cut one phase, move one step, add one checkpoint), then say your first step out loud in one sentence — and why you chose it. What proves you own the plan?",
      "options": [
        {
          "text": "You can name your first step AND the reason you chose it, without re-reading the AI's answer",
          "ok": true,
          "feedback": "That's ownership. The plan lives in your head now, not just on the screen — and you know why you're starting there."
        },
        {
          "text": "I cut one phase and chose a first step, but left the booking checkpoint after money would already be spent",
          "ok": false,
          "feedback": "You edited the plan, but the checkpoint arrives after the irreversible consequence. Move approval before spending or booking."
        },
        {
          "text": "I reordered the phases to fit my week but did not ask an affected person whether the new timing works",
          "ok": false,
          "feedback": "The timing may fit you but still fail the people affected. Ask for their input before locking the schedule."
        },
        {
          "text": "I can name the first step and reason, but the reason depends on a cost estimate I have not checked",
          "ok": false,
          "feedback": "Your reasoning is clear, but it rests on an unchecked cost. Confirm that load-bearing fact before committing."
        }
      ]
    }
  ]
};
