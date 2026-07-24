// Lesson 17 — AI Is Already in Your Apps
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-17",
  "num": 17,
  "arc": "Trust & Everyday AI",
  "title": "AI Is Already in Your Apps",
  "coreQuestion": "Where might learned systems be shaping what an app shows or suggests, and what evidence should change how much I trust the feature?",
  "blurb": "Notice quiet AI features, inspect what the product actually says they do, and match your checking to the consequence.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The feature did not announce itself",
      "scenario": "A photo app groups similar faces, an inbox offers a reply, and a search page writes a summary. Each may use a different learned system — vision, language, ranking, or generation — and the exact feature can vary by product, version, account, and organization.",
      "prompt": "Before you read on: which matters more for deciding whether to rely on one of these features — whether it has the label 'AI,' or what happens if its output is wrong?"
    },
    {
      "kind": "classify",
      "title": "Notice the evidence, not the buzzword",
      "prompt": "Sort each clue by what it can honestly establish. These are built-in examples, so you do not need a particular phone or app.",
      "buckets": [
        "Evidence about this feature",
        "Only a guess or broad clue"
      ],
      "items": [
        {
          "text": "The product's help page says photo search uses image-recognition models and explains how to correct a match.",
          "answer": 0
        },
        {
          "text": "An assistant says the feature 'probably uses AI somewhere.'",
          "answer": 1
        },
        {
          "text": "A setting names the feature, shows whether it is on, and links to its data controls.",
          "answer": 0
        },
        {
          "text": "The result appeared quickly and looked futuristic.",
          "answer": 1
        },
        {
          "text": "Your school or workplace documentation says the feature is disabled or configured differently on its accounts.",
          "answer": 0
        },
        {
          "text": "A friend uses the same app and assumes every account behaves the same way.",
          "answer": 1
        }
      ],
      "reveal": "A label, animation, or confident guess does not tell you how a specific feature works. Product help, visible controls, and organization policy are stronger evidence. Even then, focus on the decision in front of you: what the feature does, what data it touches, and what a mistake would cost."
    },
    {
      "kind": "reveal",
      "title": "A family of systems, not one hidden brain",
      "body": "AI inside everyday apps is not one recipe copied everywhere. A ranking system orders results, a vision system matches image patterns, a speech system turns sound into text, and a generative system produces new words or images. Some features combine learned models with fixed rules or human review. You do not need to identify every component before acting. You need enough evidence to answer four practical questions: What job is the feature doing? What data can it use? Can I turn it off, correct it, or recover from an error? What changes if it is wrong?",
      "mistake": "Treating 'AI' as a single yes-or-no label, then trusting or rejecting every feature the same way.",
      "good": "Inspect the actual feature and its controls, then increase checking as the consequence rises."
    },
    {
      "kind": "workflowChain",
      "title": "Inspect before you rely",
      "goal": "A calendar app suggests a meeting time, but choosing badly could make you miss an appointment. Put the app-awareness check in order.",
      "correct": [
        "Name the output you may rely on: the suggested meeting time",
        "Look for the feature label, help page, settings, or organization policy instead of asking another AI to guess",
        "Check what information the feature used and whether the suggestion can be corrected or disabled",
        "Compare the suggestion with the original calendar details because a mistake has a real consequence",
        "If it is wrong, correct the event and adjust or turn off the feature before the next use"
      ],
      "choices": [
        "Compare the suggestion with the original calendar details because a mistake has a real consequence",
        "Name the output you may rely on: the suggested meeting time",
        "If it is wrong, correct the event and adjust or turn off the feature before the next use",
        "Check what information the feature used and whether the suggestion can be corrected or disabled",
        "Look for the feature label, help page, settings, or organization policy instead of asking another AI to guess"
      ],
      "note": "For a low-consequence feature, this check can take seconds. For health, money, school, work, safety, or another person's information, slow down and use an authoritative source."
    },
    {
      "kind": "tryLive",
      "title": "Optional: inspect one documented feature",
      "prompt": "Choose one ordinary feature you can safely inspect — or use this built-in example: 'an email app offers a suggested reply.' Find the product's own label, help text, or setting. Record: what job it claims to do, what control you have, one possible false positive, and how you would recover if it were wrong.",
      "note": "You do not need to list your real apps or devices. Do not share account names, device IDs, contacts, messages, photos, school or workplace details, or location history. If documentation is unavailable, write 'not established' rather than asking an assistant to invent an explanation."
    },
    {
      "kind": "toolkitSave",
      "title": "Save an Everyday-AI check",
      "cardType": "Everyday-AI feature check",
      "fields": [
        {
          "key": "feature",
          "label": "Feature and job",
          "placeholder": "e.g. Calendar suggests a meeting time"
        },
        {
          "key": "evidence",
          "label": "What establishes how it works",
          "placeholder": "e.g. product help page, setting, or organization policy"
        },
        {
          "key": "consequence",
          "label": "What a mistake would change",
          "placeholder": "e.g. I could miss the appointment"
        },
        {
          "key": "control",
          "label": "Correction, opt-out, or recovery",
          "placeholder": "e.g. compare with the invitation, correct it, then disable suggestions"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Choose the trustworthy inspection",
      "question": "A writing app silently rewrites a sentence in a message to your teacher. Which response shows the full skill?",
      "options": [
        {
          "text": "I identify the rewrite feature, inspect its setting or help page, reread the changed sentence because the consequence matters, and undo or disable it if it changes my meaning.",
          "ok": true,
          "feedback": "Yes. You used observable evidence, matched checking to the consequence, and kept a correction path."
        },
        {
          "text": "It looks like AI, so I assume it is unsafe and never use the app again.",
          "ok": false,
          "feedback": "The label alone does not settle the decision. Inspect the feature, its controls, and the consequence of a mistake."
        },
        {
          "text": "I ask another AI whether this app uses AI and trust whatever it says.",
          "ok": false,
          "feedback": "That adds another guess. Use the product's documentation, visible controls, and any school or workplace policy."
        },
        {
          "text": "Grammar changes are usually low stakes, so I send it without rereading.",
          "ok": false,
          "feedback": "The consequence depends on this message, not the feature category. A changed meaning sent to a teacher is worth checking."
        }
      ]
    }
  ]
};
