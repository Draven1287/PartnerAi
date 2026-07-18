// Lesson 10 — Talking and Showing
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-10",
  "num": 10,
  "arc": "How It Works",
  "title": "Talking and Showing",
  "coreQuestion": "Besides typing, how else can I get help from an AI assistant?",
  "blurb": "Type isn't the only way in — speak to the assistant and show it a photo.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Three doorways, not one",
      "scenario": "You're holding a jar of pasta sauce and squinting at the tiny label. You want to know how much sugar is in one serving. Typing out the whole question feels slow, and copying the label text by hand is worse.",
      "prompt": "Before you read on: besides typing, what are two other ways you could get the assistant to answer this?"
    },
    {
      "kind": "reveal",
      "title": "Modern assistants are multimodal",
      "body": "You don't only type to an AI assistant. You can also speak to it and show it a picture or a file. New term, defined before we use it: multimodal just means 'more than one mode of input' — text, your voice, photos, files. That's all it means. A flag on language, because it shapes how much you trust the answer: we say the assistant 'hears' you and 'sees' your photo. That's a comparison, not the real thing. What's really happening: your voice gets turned into words and your photo gets turned into patterns the assistant can read, and then it predicts a helpful reply from all of that. It has no ears and no eyes. So a blurry photo or a muffled voice can make it guess wrong with full confidence — same as a typo in a typed question, just easier to miss.",
      "mistake": "Thinking the assistant is a typing-only box, so you retype everything by hand — even a label you could just photograph.",
      "good": "You choose the doorway that fits: tap the mic to ask out loud, or tap the photo button to show it what's in front of you — then judge the answer before acting on it."
    },
    {
      "kind": "classify",
      "title": "Which doorway fits?",
      "prompt": "For each task, which doorway is the easiest way in — talking or showing?",
      "buckets": [
        "Talk (mic)",
        "Show (photo)"
      ],
      "items": [
        {
          "text": "You're cooking and want a quick dinner idea from eggs and rice, hands full.",
          "answer": 0
        },
        {
          "text": "A medicine box has small print and you want to know what it's for.",
          "answer": 1
        },
        {
          "text": "You want a song like one you can name out loud.",
          "answer": 0
        },
        {
          "text": "A handwritten recipe card you'd like typed out cleanly.",
          "answer": 1
        },
        {
          "text": "A math problem on paper and you want the steps.",
          "answer": 1
        }
      ],
      "reveal": "Talking wins when your hands are busy or the thing you want is just a spoken question. Showing wins when the answer lives in something real in front of you — a label, a note, a screen, a box — that would be slow or error-prone to retype."
    },
    {
      "kind": "tryLive",
      "title": "Show it a photo",
      "prompt": "I'm showing you a photo of [what's in the picture — e.g. a jar of pasta sauce, label facing the camera]. In plain words, tell me [the one thing you want to know — e.g. how much sugar is in one serving, and whether it has garlic]. If the photo is too blurry or you're not sure, say so instead of guessing.",
      "note": "Attach the photo first, then say or type this. Privacy: if you photograph a bill, letter, or card, cover or crop out account numbers and anything you wouldn't want to share before you send it. For the voice task you don't need a script — just tap the mic and ask one short real question out loud, like 'What's a quick dinner I can make with eggs and rice?'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your two-doorway habit",
      "cardType": "Multimodal go-to",
      "fields": [
        {
          "key": "voiceMoment",
          "label": "When I'll talk instead of type",
          "placeholder": "e.g. hands full while cooking, or a quick question on the go"
        },
        {
          "key": "photoMoment",
          "label": "When I'll show a photo",
          "placeholder": "e.g. a small-print label, a handwritten note, a bill line item"
        },
        {
          "key": "checkStep",
          "label": "How I'll double-check a risky answer",
          "placeholder": "e.g. reread the label myself; confirm anything health-related with my pharmacist or doctor"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do both doorways for real",
      "question": "Pick a NEW example right now — a different object, label, or note, and a different spoken question. Get one useful reply by talking and one by showing a photo. What proves you've actually done it?",
      "options": [
        {
          "text": "I can point to the answer that came from my voice and the one that came from my photo, and say one sentence about whether each got it right and how I'd check if I wasn't sure.",
          "ok": true,
          "feedback": "That's it — you used two ways in that aren't typing, and you stayed in charge of trusting the result. For anything health-related, still confirm with a pharmacist or doctor."
        },
        {
          "text": "I read this lesson and I understand that assistants are multimodal.",
          "ok": false,
          "feedback": "Understanding isn't the skill here — doing it is. Actually tap the mic for one question and the photo button for one picture, then judge each answer."
        },
        {
          "text": "I typed both questions instead, since typing is more reliable.",
          "ok": false,
          "feedback": "That skips the whole point. Talking and showing are the two doorways to practice — a photo of a label often beats retyping it by hand."
        }
      ]
    }
  ]
};
