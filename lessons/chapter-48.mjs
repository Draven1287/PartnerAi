// Lesson 48 — Teach Someone Else
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-48",
  "num": 48,
  "arc": "Becoming a Builder",
  "title": "Teach Someone Else",
  "coreQuestion": "How do I know I can explain an AI idea clearly, accurately, and in my own words?",
  "blurb": "Teach one idea by writing, private recording, simulation, or an optional willing listener — the evidence standard stays the same.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The explanation you can defend",
      "scenario": "You've learned a lot in this course. But could you explain one idea in under two minutes, with no jargon, then answer a reasonable challenge? You can prove that privately in writing, in a recording only you keep, with a simulated learner, or with a willing person. Another person's availability is never the test.",
      "prompt": "Before you read on: which ONE thing you learned would you most want someone to understand about AI? Write or say it in a single sentence, right now."
    },
    {
      "kind": "reveal",
      "title": "If you can teach it, you own it",
      "body": "Teach-back can reveal whether you understand, and four equivalent routes count: (1) write a short explanation and answer a simulated challenge, (2) make a private voice or video recording that you do not upload, (3) explain to a fictional learner in a built-in simulation, or (4) teach a willing person. In every route, state one accurate idea, one limitation, one checked example, and one choice the learner keeps. If you involve a person, ask first, make stopping easy, use a made-up example, and never enter their identity or response into an outside assistant. Correction is useful evidence, not failure.",
      "mistake": "Telling yourself: 'I'm still a beginner, so I'm not qualified to teach anyone anything yet.' Or teaching a caricature: 'it just autocompletes' (sells short how capable it is) or 'it thinks like a person' (it doesn't).",
      "good": "Pick one true idea and explain it plainly to someone one step behind you: 'AI predicts the most likely next words from patterns in human writing, so it can sound completely sure and still be wrong. Double-check anything that matters.'"
    },
    {
      "kind": "classify",
      "title": "Is that the honest core?",
      "prompt": "You're deciding how to explain AI to a friend. Sort each way of putting it: does it teach the honest mechanism, or does it distort it?",
      "buckets": [
        "Honest core",
        "Distortion"
      ],
      "items": [
        {
          "text": "It learned patterns from tons of human writing and predicts what's likely to come next.",
          "answer": 0
        },
        {
          "text": "It's just fancy autocomplete, nothing more.",
          "answer": 1
        },
        {
          "text": "It thinks and reasons like a person does.",
          "answer": 1
        },
        {
          "text": "It can sound totally sure and still be wrong, so check anything that matters.",
          "answer": 0
        },
        {
          "text": "It's basically magic, no one really knows how it works.",
          "answer": 1
        }
      ],
      "reveal": "The honest core is 'predicts the most likely next words from patterns.' That one framing beats both the put-down ('just autocomplete') and the hype ('it thinks' / 'it's magic'). When you teach, teach the real thing."
    },
    {
      "kind": "tryLive",
      "title": "Choose a teach-back route",
      "prompt": "I will prove my understanding using [private writing / a private recording I keep on my device / a simulated learner / an optional willing listener]. The one AI idea is: [idea]. Help me plan a two-minute explanation with (1) plain words, (2) one invented example, (3) one honest limitation, and (4) one choice the learner keeps. Then give me one skeptical but fair challenge. I will answer it in my own words and correct my explanation if needed.",
      "note": "All four routes meet the same requirement. No live person, upload, account, or outside assistant is required. If you record yourself, keep it private and delete it when you are done if you prefer. If you choose a listener, ask permission and never record or paste their response."
    },
    {
      "kind": "workflowChain",
      "title": "From idea to defensible explanation",
      "goal": "Teach one AI idea through the private, simulated, or optional live route that works for you.",
      "correct": [
        "Pick the ONE thing you'd most want a friend to know (one idea, not five).",
        "Choose an equivalent route: private writing, private recording, simulated learner, or optional willing listener.",
        "Explain it in plain language with one invented example, one limitation, and one choice the learner keeps.",
        "Answer one skeptical but fair challenge in your own words.",
        "Correct anything unclear or inaccurate, then give the explanation one more time.",
        "Save only the idea you clarified and the correction — never another person's identity or private response."
      ],
      "note": "The evidence is the same in every route: an accurate explanation, a limitation, an answered challenge, and a correction when needed. Social access and confidence are not course requirements."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your two-minute teaching plan",
      "cardType": "Teach-back plan",
      "fields": [
        { "key": "idea", "label": "The one accurate idea", "placeholder": "One thing the listener should understand" },
        { "key": "limit", "label": "The limitation I will name", "placeholder": "Where the AI can be wrong or needs checking" },
        { "key": "choice", "label": "The choice the listener keeps", "placeholder": "What they decide, verify, or refuse to share" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Can your explanation survive a question?",
      "question": "Which result is strong evidence of understanding without making another person's participation a requirement?",
      "options": [
        {
          "text": "Using a private written, recorded, simulated, or willing-listener route, I stated the idea and limitation, answered a fair challenge with a checked example, and corrected one unclear part without storing anyone else's identity.",
          "ok": true,
          "feedback": "Yes. The route can be private or social; the evidence is your accurate explanation, checked example, response to challenge, and correction."
        },
        {
          "text": "A simulated learner rated my explanation as clear, so I skipped checking the factual core.",
          "ok": false,
          "feedback": "A clarity rating is not a fact-check. Simulation is a valid route, but you still must verify the core idea and answer the challenge in your own words."
        },
        {
          "text": "I copied a polished explanation without answering a challenge or revising any part myself.",
          "ok": false,
          "feedback": "Polish is not ownership. Answer one fair challenge and revise the explanation in your own words."
        },
        {
          "text": "I taught an accurate idea, but used the person's private situation as the example without asking permission.",
          "ok": false,
          "feedback": "The explanation may be accurate, but the method crossed a privacy and consent boundary. Use an invented example and ask permission first."
        }
      ]
    }
  ]
};
