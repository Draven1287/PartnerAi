// Lesson 9 — Pause Before You Allow It
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-9",
  "num": 9,
  "arc": "How It Works",
  "title": "Pause Before You Allow It",
  "coreQuestion": "Before I sign in, upload, download, pay, post, or let AI act for me, what should I check?",
  "blurb": "Safety is not one magic word on a page. Check who is asking, what they get, and whether you can undo it.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The button is not the decision",
      "scenario": "A link opens a slick AI homework helper. It wants you to sign in with your Google account and let it into your school files. It also wants to install a small extra program and start a free trial.\n\nThe page looks professional. There is a little padlock next to the address.\n\nNone of that tells you who runs it, or what happens after you tap Allow.",
      "prompt": "Before you tap anything, name two things that could happen next. What could this get, change, install, charge, send, or keep?"
    },
    {
      "kind": "reveal",
      "title": "Check what happens, not how the page looks",
      "body": "A page can look safe and still be a trap. A scary warning can show up on a service that is completely fine. So do not decide from how it looks.\n\nInstead, stop before anything that hands over your information or lets something into your accounts. Stop before anything that installs a program, signs you up, posts, sends, or would be hard to undo.\n\nOne word first. When an app asks to use your files, your camera, or your account, it is asking for permission. Permission just means you letting it do that. You can usually take it back later in your settings.\n\nSeven things to check:\n1. Who is asking?\n2. Where is this actually going: which app, which website, whose account?\n3. What information does it get to see or keep?\n4. What can it look at, change, or send, and for how long?\n5. Will it install something, start charging you, post something, or message someone?\n6. Can you undo it, cancel it, or take the access back?\n7. Can you close the link and reach the real service a way you already trust?",
      "mistake": "Trusting a page because it looks official, has a padlock, or avoids scary words.",
      "good": "Stop before anything that costs something. Work out what it will do. Then check the service by a route the message did not pick for you."
    },
    {
      "kind": "classify",
      "title": "Reading, or allowing?",
      "prompt": "Sort each one. Reading or looking hands over nothing. Allowing changes your information, your accounts, your device, your money, or what gets sent in your name.",
      "buckets": [
        "Just reading or looking",
        "Stop and think before allowing"
      ],
      "items": [
        {
          "text": "Open the Help page inside an app you reached from your own bookmark.",
          "answer": 0
        },
        {
          "text": "Let an AI add-on read and change everything on every site you visit.",
          "answer": 1
        },
        {
          "text": "Upload a school document with classmates' names and teacher comments in it.",
          "answer": 1
        },
        {
          "text": "Read the price and the renewal terms without starting the trial.",
          "answer": 0
        },
        {
          "text": "Download and open a 'required AI helper' from a message you did not expect.",
          "answer": 1
        },
        {
          "text": "Tap 'Continue with Google' when the app also wants your files, contacts and email.",
          "answer": 1
        },
        {
          "text": "Let AI send the email it just drafted, on its own.",
          "answer": 1
        },
        {
          "text": "Look in your settings to find where connected apps can be switched off.",
          "answer": 0
        }
      ],
      "reveal": "The pause comes before you allow, upload, install, pay, post, or send. Not only when one scary word shows up. Reading a screen is not the same as agreeing to it."
    },
    {
      "kind": "workflowChain",
      "title": "Check it a way the message did not choose",
      "goal": "Deal with an unexpected link saying your AI account will be locked unless you allow something now.",
      "correct": [
        "Stop before signing in, downloading, or allowing anything",
        "Work out who it claims to be, and where the link actually goes",
        "List what it wants: your information, your accounts, a download, a payment",
        "Ask which of those the task really needs, and which you could undo",
        "Close the link and open the real service your own way",
        "Ask the company's real support, or someone you trust, if you are still unsure",
        "If you already allowed something, switch that access off and change your password"
      ],
      "choices": [
        "List what it wants: your information, your accounts, a download, a payment",
        "Ask the company's real support, or someone you trust, if you are still unsure",
        "Stop before signing in, downloading, or allowing anything",
        "If you already allowed something, switch that access off and change your password",
        "Work out who it claims to be, and where the link actually goes",
        "Close the link and open the real service your own way",
        "Ask which of those the task really needs, and which you could undo"
      ],
      "note": "Do not check a suspicious message using its own phone number, reply address, QR code, or help button. Going your own way takes the route out of their hands."
    },
    {
      "kind": "compare",
      "title": "The padlock protects the journey, not who is waiting",
      "weak": "The page has a padlock and looks official, so everything it asks for must be safe.",
      "strong": "The padlock only means nobody can read my details on the way there. It says nothing about who is at the other end. I will check who runs it, look at what it wants, and open my account my own way before allowing anything.",
      "why": "That padlock scrambles your information while it travels. It does not prove the people receiving it deserve it, that a download is safe, or that the access is even needed."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save your pause check",
      "cardType": "Before I allow it",
      "fields": [
        {
          "key": "identity",
          "label": "Who is asking, and where it goes",
          "placeholder": "Which app, site, or account actually receives this?"
        },
        {
          "key": "dataAccess",
          "label": "What it gets to see or keep",
          "placeholder": "Files, contacts, messages, photos?"
        },
        {
          "key": "commitment",
          "label": "What it will install, charge, or send",
          "placeholder": "A program, a renewal, a post, a message?"
        },
        {
          "key": "recovery",
          "label": "How I undo it and reach the real thing",
          "placeholder": "Where do I switch the access off, and what is my own way in?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Pick the safe next move",
      "question": "A convincing message says your AI account closes in ten minutes. Its link wants you to sign in, install a browser add-on, and hand over your files. The page has a padlock. What do you do?",
      "options": [
        {
          "text": "Stop. Do not use the link, sign in, install, or allow anything. Open the service my own way, check the account there, and use its real support. If I already allowed something, switch it off and secure the account.",
          "ok": true,
          "feedback": "Right. You checked who and where, refused access you did not need, broke the rushed route, and kept a way to recover."
        },
        {
          "text": "Carry on, because a padlock and a professional-looking page prove it is genuine.",
          "ok": false,
          "feedback": "The padlock protects your details while they travel. It does not prove who deserves your password or your files."
        },
        {
          "text": "Only stop when a page asks for a card number. Files and downloads are routine.",
          "ok": false,
          "feedback": "Access to your files, downloads, messages and accounts can cost as much as a payment. Pause before all of them."
        },
        {
          "text": "Ask the chatbot on that same page whether the link is safe, then do what it says.",
          "ok": false,
          "feedback": "A request cannot vouch for itself. Close it and go a way you already trust."
        }
      ]
    }
  ]
};
