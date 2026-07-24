// Lesson 14 — The One Privacy Rule
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-14",
  "num": 14,
  "arc": "Talking to AI",
  "title": "The One Privacy Rule",
  "coreQuestion": "What's the one question to ask before you send a prompt, and what should you take out first?",
  "blurb": "Before you hit send, ask: \"Would I be okay if this were public?\" — then scrub what you wouldn't.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The postcard, not the diary",
      "scenario": "You want help disputing a wrong charge, so you start typing a full card number, a store employee's name, and a home address. It feels like a private chat window—just you and the AI. But those details would leave LearningAI and reach another company's system even though the writing task does not need them.",
      "prompt": "Before you read on: which parts of that message would you NOT want a stranger to read? Name them."
    },
    {
      "kind": "classify",
      "title": "Never-share triage",
      "prompt": "Sort each item: is it SAFE to type into an AI, or on the NEVER-SHARE list? (Never-share = passwords/logins, full ID/financial/account numbers, or another person's full name plus their private details.)",
      "buckets": [
        "Safe to send",
        "Never share"
      ],
      "items": [
        {
          "text": "\"I got a charge for about $300 I don't recognize.\"",
          "answer": 0
        },
        {
          "text": "My card number: 4012-8888-1881-0014",
          "answer": 1
        },
        {
          "text": "\"Help me write a polite email to my bank.\"",
          "answer": 0
        },
        {
          "text": "My login password (even though the email said it's urgent)",
          "answer": 1
        },
        {
          "text": "\"My coworker Dan Reyes, 14 Oak St, is behind on his medical bills.\"",
          "answer": 1
        },
        {
          "text": "\"A relative is having a tough time and I want to help.\"",
          "answer": 0
        }
      ],
      "reveal": "The abstract amount and request are enough. The account number, password, location, and another person's identifying details are unnecessary—and no urgent message changes that boundary."
    },
    {
      "kind": "reveal",
      "title": "The one public test",
      "body": "The misconception: 'It's a private chat window, so anything I type stays between me and the AI.' Not quite. Your prompt is transmitted to the service, but what happens after that varies by product, account type, settings, and current policy. It may be retained for a period, reviewed by authorized people for limited purposes, used to improve systems when eligible, or returned through a memory feature — but no single claim is true for every service. Check the controls and policy for the product you are actually using. The safest rule still works across those differences: before you send a prompt, ask 'Would I be okay if this were exposed beyond this moment?' and remove anything you would not. For a younger learner, details such as a home address and school name can reveal where you spend time, so replace both with general descriptions. An AI is a tool, not a friend, therapist, or trusted person; for anything serious, involve a real person or qualified professional you trust.",
      "mistake": "Pasting your real request with the card number, password, and a coworker's full name and address still in it, because the window 'feels' private.",
      "good": "You decide what leaves your device: run the public test first, then remove or blur every password, full number, and other person's private detail before you hit send."
    },
    {
      "kind": "promptRepair",
      "title": "Blur it before you send",
      "weak": "Help me write a polite email disputing a wrong charge on [full card number] for $312 to [real person's name], who lives at [home address].",
      "fields": [
        "My card",
        "The amount",
        "The store"
      ],
      "strong": "Help me write a polite email disputing a wrong charge on [my card] for [the amount] to [the store]."
    },
    {
      "kind": "workflowChain",
      "title": "Run the privacy scan yourself",
      "goal": "Turn an invented request into a version that is safe to send without relying on another assistant to catch the risk.",
      "correct": [
        "Circle every real name, precise location, school or workplace identifier, account detail, password, private message, image, and fact about another person",
        "Delete anything the task does not need",
        "Replace necessary context with broad stand-ins such as [a relative], [the amount], or [my card]",
        "Read the new version as if it appeared in public and check what it could reveal or help someone infer",
        "If exposure could still cause harm or embarrassment, do not send it; ask a trusted person or qualified professional through an appropriate private channel"
      ],
      "note": "This built-in scan completes the activity. An outside assistant is not required and should never be trusted as the final privacy judge."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your public test",
      "cardType": "Privacy boundary",
      "fields": [
        { "key": "remove", "label": "Details I remove before sending", "placeholder": "Names, passwords, locations, full numbers, private messages" },
        { "key": "replacement", "label": "Safe replacements I can use", "placeholder": "[a relative], [the amount], [my card]" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Scrub a brand-new prompt",
      "question": "Take a different, brand-new prompt you haven't scrubbed. Which final version means you've got the skill?",
      "options": [
        {
          "text": "A version where a stranger could read it and learn nothing they could use against you or anyone else — every private part named, categorized, and replaced with a blurred stand-in.",
          "ok": true,
          "feedback": "Exactly. That's the whole skill: name each private part, know which category it's in (password/login, full number, or another person's private info), blur it, and confirm a stranger would learn nothing usable."
        },
        {
          "text": "A version where you left the real details in because the chat feels private and it's faster.",
          "ok": false,
          "feedback": "The window only feels private. Your prompt leaves your device, while storage, review, reuse, and memory depend on the service and its current settings and policy — scrub first."
        },
        {
          "text": "A version where you removed your own card number but kept a coworker's full name and home address.",
          "ok": false,
          "feedback": "Other people's private info counts too — a full name plus their address, health, money, or secrets is not yours to hand over."
        }
      ]
    }
  ]
};
