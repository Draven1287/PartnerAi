// Lesson 48 — Teach Someone Else
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-48",
  "num": 48,
  "arc": "Becoming a Builder",
  "title": "Teach Someone Else",
  "coreQuestion": "How do I know I can explain an AI idea clearly, correctly, and in my own words?",
  "blurb": "Teach one idea by writing, by a private recording, by a simulation with a made-up learner, or to a willing listener. The proof is the same either way.",
  "minutes": 18,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The explanation you can defend",
      "scenario": "You have learned a lot here.\n\nBut could you explain one idea in under two minutes, with no clever words? And then handle a fair question about it?\n\nYou can prove that on your own. In writing. In a recording nobody else sees. To a made-up learner. Or to a real person, if one happens to be around.",
      "prompt": "Which ONE thing you learned would you most want somebody to understand about AI? Write it or say it in a single sentence, now."
    },
    {
      "kind": "reveal",
      "title": "If you can teach it, you own it",
      "body": "Explaining something out loud shows you whether you actually understand it. There is nowhere to hide.\n\nFour routes count the same. Write a short explanation and answer a hard question you set yourself. Record yourself and keep it on your own device. Explain it to a made-up learner. Or teach a real person who is happy to listen.\n\nWhichever route you take, include four things. One true idea. One thing it cannot do. One example you checked. And one choice that stays with the person listening.\n\nIf you involve a real person, ask first. Make it easy for them to stop. Use a made-up example. And never type their name or their reply into an outside app.\n\nBeing corrected is proof that you were listening. It is not failure.",
      "mistake": "Telling yourself you are still a beginner, so you have nothing to teach. Or teaching a cartoon: 'it just autocompletes' sells it short, and 'it thinks like a person' is wrong.",
      "good": "Pick one true idea and explain it plainly to somebody one step behind you. 'It has read a huge amount of writing and guesses the words that fit next. So it can sound totally sure and still be wrong. Check anything that matters.'"
    },
    {
      "kind": "classify",
      "title": "Is that the honest version?",
      "prompt": "You are working out how to explain AI to a friend. Sort each way of putting it. Does it teach the real thing, or bend it?",
      "buckets": [
        "The honest version",
        "Bent out of shape"
      ],
      "items": [
        {
          "text": "It read an enormous amount of human writing, and guesses what is likely to come next.",
          "answer": 0
        },
        {
          "text": "It is just fancy autocomplete, nothing more.",
          "answer": 1
        },
        {
          "text": "It thinks and reasons the way a person does.",
          "answer": 1
        },
        {
          "text": "It can sound completely sure and still be wrong, so check anything that matters.",
          "answer": 0
        },
        {
          "text": "It is basically magic. Nobody really knows how it works.",
          "answer": 1
        }
      ],
      "reveal": "The honest version is: it guesses the words most likely to come next. That beats the put-down and the hype. When you teach, teach the real thing."
    },
    {
      "kind": "tryLive",
      "title": "Pick your route",
      "prompt": "I will show I understand this by [writing it down / recording myself and keeping it / explaining it to a made-up learner / teaching somebody who is happy to listen]. The one idea is: [idea]. Help me plan a two-minute explanation with four things: plain words, one made-up example, one honest thing it cannot do, and one choice the listener keeps. Then give me one doubting but fair question. I will answer it in my own words and fix my explanation if I need to.",
      "note": "All four routes count the same. No real person, upload, account, or outside app is needed. If you record yourself, keep it private, and delete it afterwards if you would rather. If you pick a listener, ask first, and never record or paste their reply anywhere."
    },
    {
      "kind": "workflowChain",
      "title": "From idea to an explanation that holds",
      "goal": "Teach one AI idea, using whichever route works for you.",
      "correct": [
        "Pick the ONE thing you would most want a friend to know. One idea, not five.",
        "Choose your route: writing, a recording you keep, a made-up learner, or a willing listener.",
        "Explain it in plain words, with one made-up example, one thing it cannot do, and one choice the listener keeps.",
        "Answer one doubting but fair question in your own words.",
        "Fix anything unclear or wrong, then say the whole thing once more.",
        "Save only the idea you cleared up and the correction. Never anybody else's name or private reply."
      ],
      "note": "The proof is identical on every route. A correct explanation, an honest limit, a question answered, and a correction where one was needed. Having people around and feeling confident are not requirements."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your two-minute plan",
      "cardType": "Teaching it back",
      "fields": [
        { "key": "idea", "label": "The one true idea", "placeholder": "One thing the listener should walk away with" },
        { "key": "limit", "label": "The limit I will name", "placeholder": "Where it can be wrong, or needs checking" },
        { "key": "choice", "label": "The choice the listener keeps", "placeholder": "What they decide, check, or refuse to hand over" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Can your explanation survive a question?",
      "question": "Which result really shows you understand it, without needing anybody else to be available?",
      "options": [
        {
          "text": "On any of the routes, I said the idea and its limit, answered a fair question using an example I had checked, and fixed one unclear part. I stored nobody else's details.",
          "ok": true,
          "feedback": "Yes. The route can be private or social. The proof is your correct explanation, your checked example, your answer, and your fix."
        },
        {
          "text": "A made-up learner said my explanation was clear, so I did not bother checking the facts underneath.",
          "ok": false,
          "feedback": "Clear is not the same as correct. That route is fine, but you still have to check the core idea and answer the question yourself."
        },
        {
          "text": "I copied a polished explanation, and never answered a question or changed a word of it.",
          "ok": false,
          "feedback": "Polish is not ownership. Answer one fair question and rewrite the explanation in your own words."
        },
        {
          "text": "I taught a true idea, but I used the listener's own private situation as the example without asking.",
          "ok": false,
          "feedback": "The idea may be right. The method was not. Use a made-up example, and ask before using anybody's life as one."
        }
      ]
    }
  ]
};
