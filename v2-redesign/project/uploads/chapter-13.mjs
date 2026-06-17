// Lesson 13 — Human agency
// Arc: Judgment & Safety   (authored)
export default {
  "id": "chapter-13",
  "num": 13,
  "arc": "Judgment & Safety",
  "title": "Human agency",
  "coreQuestion": "Who’s in charge — me or the AI?",
  "blurb": "Keep the goals, the values, and the final call on your side of the table.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Who decided that?",
      "scenario": "AI suggested which classes to take, what to write, and how to spend your Saturday. Each suggestion was reasonable. But somewhere in there, you stopped choosing and started approving.",
      "prompt": "Where’s the line between AI helping you decide and AI deciding for you?"
    },
    {
      "kind": "classify",
      "title": "Who’s leading?",
      "prompt": "In each situation, decide who actually owns the decision.",
      "buckets": [
        "Human stays in charge",
        "AI is quietly in charge"
      ],
      "items": [
        {
          "text": "AI lists options; you weigh them and pick.",
          "answer": 0
        },
        {
          "text": "You do whatever the top AI suggestion says, every time.",
          "answer": 1
        },
        {
          "text": "AI drafts; you decide what you actually believe.",
          "answer": 0
        },
        {
          "text": "You stop forming opinions because AI “knows better.”",
          "answer": 1
        }
      ],
      "reveal": "Agency isn’t “never use AI.” It’s keeping the goal, the values, and the final decision on your side."
    },
    {
      "kind": "reveal",
      "title": "What stays human",
      "body": "AI can generate, draft, and suggest. But you own the goal (what you’re trying to do), the values (what matters to you), the verification (is it true?), and the final decision. Hand those over and you’re not using a tool — you’re following one.",
      "mistake": "Treating a confident AI suggestion as the authority on what you should want.",
      "good": "Let AI argue with your plan — then you decide what to accept and what to reject."
    },
    {
      "kind": "tryLive",
      "title": "Make AI critique YOUR plan",
      "prompt": "Here’s my plan: [paste a real plan or decision]. Argue against it. List 3 weaknesses and 1 thing I might be missing. Do not tell me what to do — just pressure-test it.",
      "react": "Read its critique. Now YOU decide: which points do you accept, and which do you reject? Write your call. That decision is the part AI can’t do for you."
    },
    {
      "kind": "verify",
      "title": "Catch the handover",
      "claim": "“The AI recommended it, so it’s probably the right choice for me.”",
      "steps": [
        "Whose goal is this serving — mine, or a generic average?",
        "Does it match what I actually value, or just what’s common?",
        "What would I lose by going along with it without deciding?",
        "If I disagreed, would I even notice — or just click accept?"
      ],
      "note": "A recommendation is an input to your decision, not the decision."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your agency check",
      "cardType": "Agency check",
      "fields": [
        {
          "key": "goal",
          "label": "The goal I’m keeping",
          "placeholder": "what I’m really trying to do"
        },
        {
          "key": "decide",
          "label": "What I will not let AI decide",
          "placeholder": "my values / my final call"
        },
        {
          "key": "use",
          "label": "What I’ll let AI do",
          "placeholder": "draft, critique, list options"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the clearest sign you’ve handed over too much?",
      "options": [
        {
          "text": "You use AI for several steps of a task",
          "ok": false,
          "feedback": "Using AI a lot is fine — if you’re still the one deciding."
        },
        {
          "text": "You stop forming your own opinion and just approve whatever it says",
          "ok": true,
          "feedback": "Right — that’s the moment the tool starts steering you."
        },
        {
          "text": "You ask AI to argue against your plan",
          "ok": false,
          "feedback": "That’s the opposite — you’re using it to sharpen your own judgment."
        }
      ]
    }
  ]
};
