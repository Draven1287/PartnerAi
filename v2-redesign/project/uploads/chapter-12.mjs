// Lesson 12 — Getting AI to teach you
// Arc: Conversation & Prompting   (authored)
export default {
  "id": "chapter-12",
  "num": 12,
  "arc": "Conversation & Prompting",
  "title": "Getting AI to teach you",
  "coreQuestion": "How do I use AI to understand something instead of just getting the answer?",
  "blurb": "Turn AI from an answer machine into a tutor that makes you do the thinking.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Answer, or understanding?",
      "scenario": "It’s 10pm. You don’t get the math. You could paste the problem and copy whatever AI says — and learn nothing for the test. Or you could get AI to actually teach you. Same tool, opposite outcome.",
      "prompt": "What’s the difference between a prompt that cheats for you and one that coaches you?"
    },
    {
      "kind": "classify",
      "title": "Cheating, lazy, or learning?",
      "prompt": "Sort these prompts by what they really do to your learning.",
      "buckets": [
        "Coaches my thinking",
        "Replaces my thinking"
      ],
      "items": [
        {
          "text": "“Give me a hint, not the answer, then quiz me on it.”",
          "answer": 0
        },
        {
          "text": "“Just give me the final answer.”",
          "answer": 1
        },
        {
          "text": "“Ask me one question to find where I’m stuck.”",
          "answer": 0
        },
        {
          "text": "“Write the whole solution so I can copy it.”",
          "answer": 1
        }
      ],
      "reveal": "Tutor prompts ask for hints, questions, and checks first — they keep you doing the work that builds the skill."
    },
    {
      "kind": "reveal",
      "title": "Make AI coach, not answer",
      "body": "A study-coach prompt tells AI to hold back the answer: give one hint, ask what you already know, quiz you, and only confirm at the end. You stay the one doing the reasoning — which is the entire point of studying.",
      "mistake": "Asking for the answer “to check” and then never doing the problem yourself.",
      "good": "Ask for a hint and a quiz question first; earn the answer last."
    },
    {
      "kind": "tryLive",
      "title": "Run a study-coach prompt",
      "prompt": "Be my study coach for [topic]. Do NOT give me the answer yet. First ask me one question to find out what I already understand, then give me a single hint. Quiz me before you confirm anything.",
      "react": "Run it on something you’re actually studying. Paste the AI’s first reply — did it make YOU think, or did it cave and hand over the answer?",
      "note": "A good coach makes you uncomfortable for about 30 seconds. That’s the learning."
    },
    {
      "kind": "compare",
      "title": "Spot the fake tutor",
      "weak": "“Do you understand? Let me know if you have questions!” (then gives the full answer)",
      "strong": "“Before I explain — what do you think the first step is, and why?”",
      "why": "The weak version looks supportive but does the thinking for you. The strong one hands the thinking back, which is what actually teaches."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your study-coach card",
      "cardType": "Study coach card",
      "fields": [
        {
          "key": "rule",
          "label": "My rule for AI when studying",
          "placeholder": "Hint first, answer last"
        },
        {
          "key": "check",
          "label": "How AI should check me",
          "placeholder": "Quiz me before confirming"
        },
        {
          "key": "protect",
          "label": "The skill I’m protecting",
          "placeholder": "solving it myself on the test"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which request best protects your learning?",
      "options": [
        {
          "text": "“Explain the answer in simpler words.”",
          "ok": false,
          "feedback": "Still hands you the answer — you read instead of reason."
        },
        {
          "text": "“Give me one hint, then quiz me before telling me if I’m right.”",
          "ok": true,
          "feedback": "Yes — you do the thinking and AI checks it."
        },
        {
          "text": "“Just tell me so I can move on.”",
          "ok": false,
          "feedback": "Fastest path to a blank mind on test day."
        }
      ]
    }
  ]
};
