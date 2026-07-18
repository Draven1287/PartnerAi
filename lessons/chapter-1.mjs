// Lesson 1 — The Machine That Predicts
// Arc: First Contact
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-1",
  "num": 1,
  "arc": "First Contact",
  "title": "The Machine That Predicts",
  "coreQuestion": "What is an AI assistant actually doing when it answers me?",
  "blurb": "Say three sentence-endings out loud, then watch an AI do the same trick — and learn what it's really doing.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Finish these out loud",
      "scenario": "You keep hearing that AI is either a genius mind or a scary magic box. Before we touch any app, try something. Read these three half-sentences and say the ending out loud:\n\n1. \"Twinkle, twinkle, little ______.\"\n2. \"The opposite of hot is ______.\"\n3. \"She opened the umbrella because it started to ______.\"\n\nYou probably said star, cold, rain — fast, without looking anything up. You've just heard those patterns so many times the next word felt obvious.",
      "prompt": "Before you read on: when you filled in 'star,' did you look it up somewhere, or did the word just feel like it came next?"
    },
    {
      "kind": "reveal",
      "title": "What just happened in your head",
      "body": "That easy feeling IS the whole idea. An AI assistant does a giant version of the same thing: it read a staggering amount of human writing and learned which words tend to follow which. So when you give it some words, it predicts the ones most likely to come next, one after another, until it has a full answer.\n\nImportant flag: people say AI has a 'brain,' or that it 'knows' or 'understands.' That is a comparison — a way of picturing it — not what is really happening. What is really happening is pattern-based prediction. In 2026 these assistants can also browse the web, use tools, and remember things across chats — but underneath, they are still predicting likely next words, which is why they can sound completely sure and still be wrong.",
      "mistake": "Thinking 'it's a mind that knows things' — or the opposite, 'it's just dumb autocomplete.' Both miss it.",
      "good": "Hold one plain sentence: it predicts the most likely next words from patterns in human writing. That one idea explains almost everything it does — the brilliant and the wrong — for the rest of this course."
    },
    {
      "kind": "nextWord",
      "title": "Watch prediction pick a word",
      "stem": "She opened the umbrella because it started to ______",
      "options": [
        {
          "word": "rain",
          "p": 0.82
        },
        {
          "word": "pour",
          "p": 0.09
        },
        {
          "word": "drizzle",
          "p": 0.05
        },
        {
          "word": "snow",
          "p": 0.03
        },
        {
          "word": "explode",
          "p": 0.01
        }
      ],
      "note": "The AI isn't looking up a fact. It's ranking which word most likely comes next, based on patterns it read. 'Rain' wins by a mile — but notice it could pick another, and it never truly 'knows' the answer. That's prediction, not knowledge."
    },
    {
      "kind": "classify",
      "title": "Prediction or actual knowledge?",
      "prompt": "Sort each statement by what the assistant is really doing. You can retry without penalty.",
      "buckets": [
        "Pattern-based prediction",
        "Reliable knowledge"
      ],
      "items": [
        {
          "text": "It writes a natural ending to a sentence it has never seen before.",
          "answer": 0
        },
        {
          "text": "It sounds completely certain about a detail.",
          "answer": 0
        },
        {
          "text": "A trustworthy outside source independently confirms the detail.",
          "answer": 1
        }
      ],
      "reveal": "Fluent language is evidence of prediction skill, not proof that a claim is true."
    },
    {
      "kind": "tryLive",
      "title": "Now let an AI do it",
      "prompt": "Finish this sentence in a natural way, then in one short line tell me how you decided what to write: 'The best thing about [a place or thing you like] is ______.'",
      "note": "Open any free AI assistant in your browser — these are free websites, nothing to install, and you can close the tab any time. You can't break anything. Keep your blank light and non-private: a hobby, a food, a place — not anything personal you wouldn't want to type into a website. Watch it build the answer word by word, then read its one-line explanation."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your one-sentence anchor",
      "cardType": "Core Idea",
      "fields": [
        {
          "key": "idea",
          "label": "The one idea, in my own words",
          "placeholder": "AI predicts the most likely next words from patterns in human writing."
        },
        {
          "key": "flag",
          "label": "The comparison I'll stay skeptical of",
          "placeholder": "People say it 'knows' or has a 'brain' — that's a picture, not what's happening."
        },
        {
          "key": "so-what",
          "label": "Why this matters for me",
          "placeholder": "It can sound sure and still be wrong — so I stay in charge."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you've got it on a fresh sentence",
      "question": "Make up a brand-new half-sentence the lesson never showed (e.g. 'My favorite season is winter because ______'). Predict the ending out loud yourself, THEN paste it into the AI and let it finish. Looking at both endings, which sentence is actually true about what happened?",
      "options": [
        {
          "text": "We both predicted likely next words from patterns; the AI didn't know my answer, it guessed what usually comes next.",
          "ok": true,
          "feedback": "That's it — that's the core idea of the whole course. You just did it and named it."
        },
        {
          "text": "The AI looked up my real answer in a database and retrieved the correct ending.",
          "ok": false,
          "feedback": "It didn't retrieve anything — it predicted a likely next word. It never actually knew your answer."
        },
        {
          "text": "The AI understood my sentence the way a person would and thought about the best reply.",
          "ok": false,
          "feedback": "That's the 'it has a mind' comparison. What really happened is pattern-based prediction — no understanding underneath."
        },
        {
          "text": "My prediction and the AI's prediction have nothing in common.",
          "ok": false,
          "feedback": "They have everything in common — you both guessed likely next words from patterns you've absorbed. That's the point."
        }
      ]
    }
  ]
};
