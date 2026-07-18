// Lesson 9 — The Scary Words Explained
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-9",
  "num": 9,
  "arc": "How It Works",
  "title": "The Scary Words Explained",
  "coreQuestion": "Which words on an AI screen are just routine, and which few actually mean \"slow down\" or \"leave\"?",
  "blurb": "Sign in, Free trial, Upgrade — most of it is harmless. Learn the two words that mean pause and the one phrase that means go.",
  "minutes": 6,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Same screen, different reactions",
      "scenario": "You open an AI assistant for the first time. You see buttons and words everywhere: Sign in, Start free trial, Get Plus, New chat, Settings. Your stomach tightens. It feels like one wrong click will hack you or charge your card.",
      "prompt": "Before you read on: of the words you see on a normal AI screen, how many do you think actually mean danger? Guess a number, then see if you're right."
    },
    {
      "kind": "classify",
      "title": "Routine to see, or slow down?",
      "prompt": "Sort each word by what it really means. 'Routine — keep going' is for words that are normal and harmless to SEE (even money words). 'Slow down' is only for the moment you'd actually TYPE a secret.",
      "buckets": [
        "Routine — keep going",
        "Slow down"
      ],
      "items": [
        {
          "text": "Sign in / Log in",
          "answer": 0
        },
        {
          "text": "Free trial",
          "answer": 0
        },
        {
          "text": "Get Plus / Upgrade",
          "answer": 0
        },
        {
          "text": "Enter your password",
          "answer": 1
        },
        {
          "text": "Payment / card number",
          "answer": 1
        },
        {
          "text": "New chat",
          "answer": 0
        }
      ],
      "reveal": "Almost everything is routine to SEE — even money words like Free trial and Upgrade. You only ever slow down at the exact moment you'd type a secret: a password or a payment number. Everything else, you keep going."
    },
    {
      "kind": "reveal",
      "title": "What the words really mean",
      "body": "Sign in just lets the site remember you next time. (That's a comparison — like a library card. What's really happening: the site keeps a record tied to your account so it can load your past chats. You usually don't even have to sign in to try it.) Free trial means the paid version free for a while, then it may start charging unless you cancel — so read the small print and note the end date, but seeing it is normal. Get Plus / Upgrade is just an invitation to pay; you can ignore it. The only two words that mean pause are 'password' and 'payment' — fine on the right page, but always your cue to check you're on the real site before you type. And one phrase means leave: 'Not secure.' It usually appears in the browser address bar at the top, not the page itself. On a real AI site you normally won't see it at all. If you do, stop — you may be on a fake page. Close it and reopen your assistant fresh.",
      "mistake": "Seeing 'Free trial' or 'Get Plus' and panicking that you're about to be hacked or charged, so you close a perfectly safe page.",
      "good": "You decide whether to continue: read money words calmly, and only pause at the actual moment you'd type a password or payment number — checking the web address at the top is the real site before you type."
    },
    {
      "kind": "tryLive",
      "title": "Ask the AI about a word that worried you",
      "prompt": "I'm new to AI and I saw the words [the words that worried you] on this website. In plain, simple terms, what do they mean, do they cost money, and is it safe for me to keep using this?",
      "note": "Fill the bracket with whatever you actually saw, word-for-word. Example: 'Start your free trial' — a good reply explains it's the paid version free for a limited time that may charge you later, so it's safe to read but a money word to watch. To be safe, type the assistant's address yourself instead of clicking a link someone sent you."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your screen-word rule card",
      "cardType": "Screen-Word Decoder",
      "fields": [
        {
          "key": "routine",
          "label": "Routine — keep going",
          "placeholder": "Sign in, Free trial, Get Plus, New chat, Settings, History — normal to SEE"
        },
        {
          "key": "slowdown",
          "label": "Slow down (only when typing)",
          "placeholder": "Password, Payment / card number — check the web address is the real site first"
        },
        {
          "key": "leave",
          "label": "Leave the page",
          "placeholder": "'Not secure' in the address bar — close it and reopen your assistant fresh"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Label a brand-new word",
      "question": "Find a word or button you haven't discussed yet — try 'History,' 'Upgrade,' or 'Settings.' Which label is correct, and can you name the one phrase that means leave?",
      "options": [
        {
          "text": "'Upgrade' is 'routine — keep going' (it's just an invitation to pay, safe to see) — and the leave-phrase is 'not secure.'",
          "ok": true,
          "feedback": "Exactly. Money words are routine to SEE; you only slow down when you'd actually type a password or payment. And 'not secure' in the address bar means leave."
        },
        {
          "text": "'Upgrade' is 'slow down' because it mentions paying.",
          "ok": false,
          "feedback": "Not quite — seeing a money word is routine. You only slow down at the moment you'd type a secret (password or payment), not just because 'pay' appears on screen."
        },
        {
          "text": "Every official-looking word means I'm about to be hacked or charged.",
          "ok": false,
          "feedback": "That's the myth this lesson fixes. Most words are ordinary. Only 'password' and 'payment' mean pause, and only 'not secure' means leave."
        }
      ]
    }
  ]
};
