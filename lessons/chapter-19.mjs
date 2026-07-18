// Lesson 19 — Context and Memory
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-19",
  "num": 19,
  "arc": "Trust & Everyday AI",
  "title": "Context and Memory",
  "coreQuestion": "When my AI \"remembers\" something, which of the three different kinds of memory is actually at work — and where do I view and clear it?",
  "blurb": "Three different things get called \"memory.\" Learn to tell them apart on your own tool.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Does it remember you?",
      "scenario": "You tell your AI early in a chat that your houseplant is named Gerald. Ten messages later it recalls Gerald perfectly. A friend says, 'See, it's learning everything about you forever.' You open a brand-new chat the next day and ask about Gerald — and it has no idea who Gerald is.",
      "prompt": "Before you read on: how can it remember Gerald ten messages later, but forget him in a fresh chat the next day? Is that the same 'memory' or two different things?"
    },
    {
      "kind": "reveal",
      "title": "Three different things called 'memory'",
      "body": "Under the hood, AI predicts the most likely next words from patterns in human writing. It has no diary of you. But three separate mechanisms all get sloppily called 'memory,' and they are NOT the same. (1) The context window: everything in the CURRENT chat. Large, but finite — that's how it recalled Gerald ten messages later. (2) Persistent memory: facts many tools now save ACROSS separate chats. You can open Settings and view or clear these. (3) Training: how the model was built long ago — this happened before you ever showed up, and your live chat does NOT retrain it. Two opposite myths die here. Myth one: 'It forgets everything the second I close the tab.' Often false now — many 2026 tools remember you across chats. Myth two: 'It's secretly learning from everything I type, right now, forever.' Also false — live typing is not training. One caution: a fresh chat saying 'no, I don't recall' does NOT prove your tool lacks memory. It may simply not have judged a trivial houseplant name worth saving. The Settings / Memory screen is the only definitive source of truth.",
      "mistake": "Concluding 'my AI has no memory across chats' just because a fresh chat forgot one small fact.",
      "good": "Open the tool's Settings → Memory / Personalization screen and read what is actually saved there. That screen is the real answer."
    },
    {
      "kind": "classify",
      "title": "Which kind of memory is this?",
      "prompt": "Sort each behavior into the mechanism actually responsible.",
      "buckets": [
        "Context window (this chat only)",
        "Persistent memory or Training (across chats / built-in)"
      ],
      "items": [
        {
          "text": "It recalls the plant name Gerald you mentioned 10 messages ago in THIS chat.",
          "answer": 0
        },
        {
          "text": "In a brand-new chat, it greets you by name because you saved that in Settings.",
          "answer": 1
        },
        {
          "text": "It knows general facts about the world it was built with, long before you arrived.",
          "answer": 1
        },
        {
          "text": "It summarizes a document you pasted higher up in the SAME conversation.",
          "answer": 0
        },
        {
          "text": "You clear the 'Memory' list in Settings and it stops bringing up your old projects.",
          "answer": 1
        },
        {
          "text": "It loses track of an early detail once a very long single chat runs past its limit.",
          "answer": 0
        }
      ],
      "reveal": "Anything tied to THIS conversation is the context window (finite, resets when the chat ends). Anything that survives into a new chat is either persistent memory (view/clear it in Settings) or training (baked in before you arrived). Your live typing never retrains the model."
    },
    {
      "kind": "tryLive",
      "title": "Run the recall test yourself",
      "prompt": "Earlier in this chat I told you that my houseplant is named Gerald. Without me repeating it, tell it back to me now. Then explain, in plain words, the difference between three things: what you can remember inside this single conversation, what you might save and reuse across separate chats with me, and what you do not learn from me at all because it was set during your training.",
      "note": "First, actually plant the fact: send 'My houseplant is named Gerald,' chat about anything else for a few messages, THEN paste this. Keep the planted fact harmless — never a password, address, or account number. After it answers, open your tool's Settings and look for 'Memory' or 'Personalization' to see what, if anything, is really saved across chats."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your monthly privacy move",
      "cardType": "Memory privacy check",
      "fields": [
        {
          "key": "tool",
          "label": "My AI tool",
          "placeholder": "e.g. the assistant I use most days"
        },
        {
          "key": "screen",
          "label": "Where its memory settings live",
          "placeholder": "e.g. Settings → Personalization → Memory"
        },
        {
          "key": "keeps",
          "label": "Does it keep facts across chats?",
          "placeholder": "yes / no — based on the Settings screen, not a fresh-chat reply"
        },
        {
          "key": "rule",
          "label": "My paste rule",
          "placeholder": "Never paste passwords, full account numbers, or others' private details — anything typed can be stored"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Label your real tool",
      "question": "You run the full test on a NEW fact ('my favorite tea is peppermint'): you plant it and it recalls it in one chat, then a fresh chat says it doesn't remember. What correctly settles whether your tool keeps things across chats?",
      "options": [
        {
          "text": "The fresh chat said no, so my tool has no cross-chat memory. Done.",
          "ok": false,
          "feedback": "A 'no' can just mean the tool didn't judge a trivial fact worth saving. The fresh-chat reply is not proof."
        },
        {
          "text": "Open my tool's Settings → Memory / Personalization and read what's actually saved there — that screen is the source of truth.",
          "ok": true,
          "feedback": "Exactly. The Settings/Memory screen is definitive. That's also where you clear what you don't want kept — a good monthly habit, since anything you type can be stored or reviewed."
        },
        {
          "text": "It recalled the tea in the first chat, so it must be retraining on everything I type.",
          "ok": false,
          "feedback": "That was the context window at work within one chat — not training. Your live typing never retrains the model."
        }
      ]
    }
  ]
};
