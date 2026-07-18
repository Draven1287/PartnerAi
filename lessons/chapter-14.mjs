// Lesson 14 — The one privacy rule
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-14",
  "num": 14,
  "arc": "Talking to AI",
  "title": "The one privacy rule",
  "coreQuestion": "What's the one question to ask before you send a prompt, and what should you take out first?",
  "blurb": "Before you hit send, ask: \"Would I be okay if this were public?\" — then scrub what you wouldn't.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The postcard, not the diary",
      "scenario": "You want help disputing a wrong charge, so you type: \"Help me dispute a charge on Visa 4012-8888-1881-0014 for $312 to Dan Reyes, who lives at 14 Oak St.\" It feels like a private chat window — just you and the AI. But your message can be stored on the company's servers, read by people who run the service, used to improve future versions, and — if memory is on — remembered and reused in your later chats.",
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
      "reveal": "A name or a rough amount is usually fine. The long number, the password, and another person's full name plus their private details are not yours to hand over — and no 'urgent' message ever changes that."
    },
    {
      "kind": "reveal",
      "title": "The one public test",
      "body": "The misconception: 'It's a private chat window, so anything I type stays between me and the AI.' Not quite. Your words leave your device and live on a company's servers, where you no longer fully control them. Picturing it as 'writing on a postcard, not whispering a secret' is a comparison — that is the analogy, not the mechanism. What is really happening: the text is transmitted, stored, and can be seen or reused by the company, and remembered across chats if memory is on. The rule that covers all of it: before you send a prompt, ask one question — 'Would I be okay if this were public?' — and take out anything you would not. Note on people, not just data: an AI is a tool, not a friend, therapist, or trusted person — do not treat the box as a safe place to dump secrets, and for anything serious defer to a real professional you trust.",
      "mistake": "Pasting your real request with the card number, password, and a coworker's full name and address still in it, because the window 'feels' private.",
      "good": "You decide what leaves your device: run the public test first, then remove or blur every password, full number, and other person's private detail before you hit send."
    },
    {
      "kind": "promptRepair",
      "title": "Blur it before you send",
      "weak": "Help me write a polite email disputing a wrong charge on Visa 4012-8888-1881-0014 for $312 to Dan Reyes, who lives at 14 Oak St.",
      "fields": [
        "My card",
        "The amount",
        "The store"
      ],
      "strong": "Help me write a polite email disputing a wrong charge on [my card] for [the amount] to [the store]."
    },
    {
      "kind": "tryLive",
      "title": "Ask the AI to double-check you",
      "prompt": "I want help with this, and I've taken out my private details on purpose: [your scrubbed request]. Before we start, scan it and tell me if anything still in here is something I shouldn't share with an AI — and if so, how to ask without it.",
      "note": "Fill [your scrubbed request] with your real ask — but with every password, full number, and other person's private detail already removed or blurred (like [my card], [a relative], [the amount]). The AI becomes a second pair of eyes for anything you missed. Teens: also blur your home address and school name, and never paste a friend's secrets or photos. Seniors: never share a password or PIN, especially if a message claims it's urgent — if you're unsure, ask a person you trust to look first."
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
          "feedback": "The window only feels private. Your words live on the company's servers and can be stored, seen, or reused — scrub first."
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
