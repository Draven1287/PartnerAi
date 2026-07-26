// Lesson 14 — The One Privacy Rule
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-14",
  "num": 14,
  "arc": "Talking to AI",
  "title": "The One Privacy Rule",
  "coreQuestion": "What is the one question to ask before you send, and what should you take out first?",
  "blurb": "Before you send, ask: would I be fine if this were public? Then scrub whatever you would not.",
  "minutes": 17,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A postcard, not a diary",
      "scenario": "You want help sorting out a charge nobody in your family recognises. You start typing the full card number, the name of the shop worker, and your home address.\n\nIt feels private. Just you and a chat box.\n\nBut those details leave LearningAI and land in another company's system. And the writing job did not need a single one of them.",
      "prompt": "Before you read on: which parts of that message would you not want a stranger to read? Name them."
    },
    {
      "kind": "classify",
      "title": "Safe, or never share?",
      "prompt": "Sort each one. Safe to type into an AI, or on the never-share list? Never-share means passwords and logins, full ID or bank or account numbers, or another person's full name plus their private business.",
      "buckets": [
        "Safe to send",
        "Never share"
      ],
      "items": [
        {
          "text": "'There is a charge for about $300 that nobody recognises.'",
          "answer": 0
        },
        {
          "text": "My card number: 4012-8888-1881-0014",
          "answer": 1
        },
        {
          "text": "'Help me write a polite email to the bank.'",
          "answer": 0
        },
        {
          "text": "My password (even though the message said it was urgent)",
          "answer": 1
        },
        {
          "text": "'My neighbour Dan Reyes, 14 Oak St, is behind on his medical bills.'",
          "answer": 1
        },
        {
          "text": "'Someone in my family is having a hard time and I want to help.'",
          "answer": 0
        }
      ],
      "reveal": "The rough amount and the request are enough on their own. The account number, the password, the address, and another person's details were never needed. No urgent-sounding message changes that."
    },
    {
      "kind": "reveal",
      "title": "The one public test",
      "body": "The mistake: 'It is a private chat box, so what I type stays between me and the AI.'\n\nNot quite. What you type goes to the company running it. What happens after that depends on the app, your account, your settings, and their current rules. It might be kept for a while. People there may be allowed to read some of it. It may be used to improve the system. It may come back later through a memory feature. None of those is true of every app, so check the settings and the rules of the one you actually use.\n\nOne rule survives all of that. Before you send, ask: would I be fine if this turned up somewhere public? Then take out anything you would not.\n\nSome details do more damage than they look. Your home address and school name together tell a stranger where to find you most days. Swap both for something general.\n\nAn AI is a tool. It is not a friend, a counsellor, or someone who can be responsible for you. For anything serious, bring in a real person or a professional you trust.",
      "mistake": "Pasting your real message with the card number, the password, and a neighbour's address still in it. All because the box feels private.",
      "good": "You decide what leaves your device. Run the public test, then take out every password, full number, and other person's private detail before you send."
    },
    {
      "kind": "promptRepair",
      "title": "Blur it before you send",
      "weak": "Help me write a polite email about a wrong charge of $312 on [full card number] to [a real person's name], who lives at [home address].",
      "fields": [
        "my card",
        "the amount",
        "the shop"
      ],
      "strong": "Help me write a polite email about a wrong charge on [my card] for [the amount] to [the shop]."
    },
    {
      "kind": "workflowChain",
      "title": "Run the privacy scan yourself",
      "goal": "Turn a made-up message into one that is safe to send, without relying on another AI to spot the risk.",
      "correct": [
        "Circle every real name, exact place, school, workplace, account detail, password, private message, photo, and fact about another person",
        "Delete anything the job does not need",
        "Swap what is left for stand-ins like [a relative], [the amount], or [my card]",
        "Read it back as if it were public, and ask what a stranger could work out",
        "If it could still cause harm or embarrassment, do not send it. Ask a trusted person or a professional instead"
      ],
      "note": "This scan on its own finishes the activity. No outside app is needed, and none of them should ever be your final judge of what is private."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your public test",
      "cardType": "Privacy boundary",
      "fields": [
        { "key": "remove", "label": "What I take out before sending", "placeholder": "Names, passwords, places, full numbers, private messages" },
        { "key": "replacement", "label": "Stand-ins I can use instead", "placeholder": "[a relative], [the amount], [my card]" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Scrub a brand-new message",
      "question": "Take a different message you have not scrubbed yet. Which final version means you have the skill?",
      "options": [
        {
          "text": "One a stranger could read and learn nothing they could use against me or anyone else. Every private part named, sorted, and swapped for a stand-in.",
          "ok": true,
          "feedback": "Exactly. Name each private part, know which kind it is, blur it, and check that a stranger would learn nothing usable."
        },
        {
          "text": "One where I left the real details in, because the chat feels private and it is faster.",
          "ok": false,
          "feedback": "It only feels private. Your words leave your device, and what happens next depends on the app and its settings. Scrub first."
        },
        {
          "text": "One where I took out my own card number but kept a neighbour's full name and home address.",
          "ok": false,
          "feedback": "Other people's details count too. A full name plus their address, health, money, or secrets is not yours to hand over."
        }
      ]
    }
  ]
};
