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
      "prompt": "Before you read on: do you actually need the whole plan figured out in your head before you're allowed to ask for help? What if you could think out loud, messy and half-formed, and let the plan take shape with the AI?"
    },
    {
      "kind": "reveal",
      "title": "AI cuts the mountain into stairs — you decide where they lead",
      "body": "Overwhelm is usually a planning problem, not a you problem. Hand a big goal to an AI assistant and it can break it into phases fast. Here's the real mechanism: it isn't 'planning' the way you do — there's no calendar in its head, no memory of your kitchen or your boss. It learned patterns from huge amounts of text about how projects like yours usually get broken down, and it's predicting a sensible-looking breakdown. ('Cutting a mountain into stairs' is imagery, not a claim about how it thinks.) Modern assistants can hold context across a chat and even look things up — but they still don't know YOUR private real-world facts, so they fill the gaps with a confident guess. That's exactly why the cutting, reordering, and checkpoints are your job. One privacy note: keep your brain-dump to things you'd be fine sharing — skip real names, addresses, and account numbers.",
      "mistake": "Treating the AI's plan as finished truth and just following it, as if it knew your real situation.",
      "good": "Treating yourself as the editor, not the audience: you supply the real-world facts it can only guess at, then cut and reorder."
    },
    {
      "kind": "tryLive",
      "title": "Run the plan prompt on a real project",
      "prompt": "Help me plan [the big project]. Here's my real situation: [deadline / what I already have / what's blocking or scaring me]. Break it into [4–6] phases, and for each phase give me the very first small step. Then suggest one good checkpoint where I should pause and re-decide before continuing. Ask me one question if something important is missing — don't guess it.",
      "note": "Worked example: 'Help me plan organizing a 30-person family reunion. Here's my real situation: it's in 3 months, I have the guest list but no venue, and I'm scared the cost will spiral. Break it into 5 phases, and for each phase give me the very first small step. Then suggest one good checkpoint where I should pause and re-decide before continuing. Ask me one question if something important is missing — don't guess it.' Pick a project that's been sitting heavy on you and use YOUR honest facts — the realer they are, the more usable the plan."
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
        "Add one checkpoint where you'll pause and re-decide before charging on",
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
          "text": "The AI produced a clean 5-phase plan with a step for each phase",
          "ok": false,
          "feedback": "That's the AI's generic breakdown — a confident guess from patterns. You own it only once you've cut, reordered, and can say the first step and why yourself."
        },
        {
          "text": "You followed every phase in the exact order the AI gave them",
          "ok": false,
          "feedback": "Following the AI's order unedited means you skipped the editing that makes it fit your real life. Cut one phase, move one step, add a checkpoint."
        },
        {
          "text": "You re-read the AI's answer to remember what came first",
          "ok": false,
          "feedback": "If you have to re-read it to know your first step, the plan isn't yours yet. Aim to name the step and the reason without looking."
        }
      ]
    }
  ]
};
