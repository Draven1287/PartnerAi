// Lesson 22 — Personal productivity
// Arc: Applying   (authored)
export default {
  "id": "chapter-22",
  "num": 22,
  "arc": "Applying",
  "title": "Personal productivity",
  "coreQuestion": "Can AI help me plan without inventing a fake-perfect schedule?",
  "blurb": "Good plans respect your real constraints — energy, time, and the things that go wrong.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The plan that ignores your life",
      "scenario": "You ask AI to plan your week. It hands you a flawless schedule: gym at 5am, four hours of deep study, zero breaks, nothing ever running late. It looks amazing. It will collapse by Tuesday.",
      "prompt": "What does a realistic plan include that the “perfect” one ignores?"
    },
    {
      "kind": "classify",
      "title": "Realistic or fantasy?",
      "prompt": "Sort these plan features by whether they survive a real week.",
      "buckets": [
        "Realistic",
        "Fantasy plan"
      ],
      "items": [
        {
          "text": "Buffer time between tasks for when things run late",
          "answer": 0
        },
        {
          "text": "Every single hour packed with no breaks",
          "answer": 1
        },
        {
          "text": "Hardest work scheduled when your energy is highest",
          "answer": 0
        },
        {
          "text": "Assumes you never get tired or distracted",
          "answer": 1
        }
      ],
      "reveal": "A good plan accounts for energy, buffers, priorities, and the fact that things go wrong."
    },
    {
      "kind": "reveal",
      "title": "Plans need your constraints",
      "body": "AI plans well only when it knows the truth: how much time you really have, when your energy is high or low, what actually matters most, and what you’ll drop when life interferes. Give it those constraints and it’s genuinely useful. Skip them and you get a schedule for a robot.",
      "mistake": "Accepting an optimistic plan that assumes a perfect, interruption-free week.",
      "good": "Tell AI your real constraints and ask for buffers and a backup if you fall behind."
    },
    {
      "kind": "tryLive",
      "title": "Plan with real limits",
      "prompt": "Turn this messy task list into a realistic plan for my week: [list]. I have about [X hours]. My energy is highest in the [morning/evening]. Add buffer time and tell me what to drop first if I fall behind.",
      "react": "Read the plan. Would it survive a bad day? Paste the “what to drop first” part — that’s what makes it realistic."
    },
    {
      "kind": "verify",
      "title": "Catch the unrealistic schedule",
      "claim": "AI’s plan: 6 hours of focused study after a full school day, no breaks, finishing everything by Wednesday.",
      "steps": [
        "Does this assume perfect energy and zero interruptions?",
        "Where are the breaks and the buffer time?",
        "What happens to this plan if one thing runs late?",
        "Is the most important task protected, or just everything crammed in?"
      ],
      "note": "A plan that only works on a perfect day isn’t a plan — it’s a wish."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your planning prompt",
      "cardType": "Planning prompt",
      "fields": [
        {
          "key": "limits",
          "label": "My real constraints",
          "placeholder": "hours, energy, fixed commitments"
        },
        {
          "key": "priority",
          "label": "What matters most",
          "placeholder": "the one thing that can’t slip"
        },
        {
          "key": "backup",
          "label": "If I fall behind, I drop…",
          "placeholder": "…"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What separates a useful AI plan from a useless one?",
      "options": [
        {
          "text": "It fills every hour productively",
          "ok": false,
          "feedback": "A packed plan ignores energy and breaks — it breaks fast."
        },
        {
          "text": "It includes your real constraints, buffers, and a fallback",
          "ok": true,
          "feedback": "Right — realistic beats impressive every time."
        },
        {
          "text": "It looks ambitious and disciplined",
          "ok": false,
          "feedback": "Ambition on paper isn’t the same as a plan you’ll keep."
        }
      ]
    }
  ]
};
