// Lesson 41 — Planning a Big Project Together
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-41",
  "num": 41,
  "arc": "Building with AI",
  "title": "Planning a Big Project Together",
  "coreQuestion": "How do I turn something too big to start into a plan I actually own?",
  "blurb": "Feeling stuck is usually a planning problem, not a you problem. Cut the mountain into stairs, then pick the first one.",
  "minutes": 17,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The thing you keep not starting",
      "scenario": "There is a project you keep not starting. A big family get-together. Moving house. A long essay.\n\nIt feels too big to even begin.\n\nSo it sits there, getting heavier every week you look at it.",
      "prompt": "What must the plan protect first? The deadline. The money. Somebody else's time. Safety. Your own energy. Which of those can bend, and which cannot?"
    },
    {
      "kind": "reveal",
      "title": "It cuts the mountain into stairs. You decide where they go.",
      "body": "Feeling stuck is usually a planning problem, not a failure of character.\n\nAI is fast at chopping a big thing into ordinary stages. That is genuinely useful when you cannot see the first step.\n\nBut it does not know your calendar. Or your money. Or how tired you are. Or what you are allowed to do. Or who else this lands on.\n\nWhere it does not know, it fills the gap with a sensible guess. That is what it does.\n\nSo you become the editor. You supply the real facts. You cut the stages you do not need. You move steps around. And you add a point where somebody has to say yes before money is spent, a booking is made, something is published, or another person gets pulled in.\n\nBefore an outside app sees any of this, swap names for roles, round the money, keep places vague, and cut addresses, account numbers, timetables, private messages, and anything about somebody else. What you type there leaves LearningAI.",
      "mistake": "Treating its plan as finished and true, and just following it, as though it knew your actual life.",
      "good": "Treating yourself as the editor, not the audience. You add the real facts it can only guess at, then cut and reorder."
    },
    {
      "kind": "tryLive",
      "title": "Ask it to plan a real project",
      "prompt": "Help me plan [the big project]. Here is my real situation: [deadline / what I already have / what is blocking me]. Break it into [4 to 6] stages, and for each stage give me the very first small step. Then suggest one point where I should stop and decide again before carrying on. If something important is missing, ask me. Do not guess it.",
      "note": "Worked example: 'Help me plan a family get-together in about three months. I have a rough number of guests but no venue, and money is the hard limit. Use five stages, and add a point where I approve before anything gets booked.' Use facts that matter but do not identify anyone. A community event, tidying a room, a repair, a move, or something you want to build all work. It suggests. You approve anything that commits you."
    },
    {
      "kind": "workflowChain",
      "title": "Be the editor",
      "goal": "Turn its plan into a plan you own, and start it today.",
      "correct": [
        "Write down three honest facts: your deadline, what you already have, what is blocking you",
        "Ask it to break the goal into stages, with a first step for each",
        "Cross out one stage you do not actually need",
        "Move one step earlier or later, because you know your life and it does not",
        "Add one point where you or the person affected says yes, before money, booking, publishing, or anything you cannot undo",
        "Circle the single first step, and write down what time today you will do it"
      ],
      "note": "The cutting and moving is the whole point. It produces an ordinary plan for an ordinary version of this job. You are the one who knows the real facts it cannot see."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your plan",
      "cardType": "Project plan",
      "fields": [
        {
          "key": "project",
          "label": "The project",
          "placeholder": "e.g. organise a get-together for 30 people"
        },
        {
          "key": "firstStep",
          "label": "My single first step, today",
          "placeholder": "e.g. message 3 people to find some possible dates"
        },
        {
          "key": "when",
          "label": "What time today I will do it",
          "placeholder": "e.g. after dinner, 7pm"
        },
        {
          "key": "checkpoint",
          "label": "Where I stop and decide again",
          "placeholder": "e.g. once I have a price for the room, check the money before booking"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do you own the plan?",
      "question": "Take a different heavy project you have not touched. Run the same request. Edit it: cut one stage, move one step, add one stopping point. Then say your first step out loud, and why. What proves you own it?",
      "options": [
        {
          "text": "I can say my first step AND why I chose it, without reading its answer again",
          "ok": true,
          "feedback": "That is ownership. The plan is in your head now, not just on the screen, and you know why you are starting there."
        },
        {
          "text": "I cut a stage and picked a first step, but the approval point still comes after the money is gone",
          "ok": false,
          "feedback": "You edited the plan. The stopping point sits after the thing you cannot undo. Move it before the spending or the booking."
        },
        {
          "text": "I reordered the stages to fit my week, but I never asked the other people whether the new timing works",
          "ok": false,
          "feedback": "The timing can suit you and still fail everyone else. Ask them before you lock it in."
        },
        {
          "text": "I can name the first step and my reason, but the reason rests on a price I have not checked",
          "ok": false,
          "feedback": "Your reasoning is clear, and it stands on an unchecked number. Confirm that before you commit to anything."
        }
      ]
    }
  ]
};
