// Lesson 3 — Your First Conversation
// Arc: First Contact
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-3",
  "num": 3,
  "arc": "First Contact",
  "title": "Your First Conversation",
  "coreQuestion": "How do I actually start talking to an AI — and what really happens when I do?",
  "blurb": "Type one message, press send, read the reply. That's the whole thing.",
  "minutes": 7,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The blinking cursor",
      "scenario": "You open the AI everyone keeps mentioning. There's a wide empty box at the bottom of the screen with faint grey words like \"Ask anything.\" Your hands hover over the keyboard. What if you pick the wrong one? What if it charges you? What if you break something?",
      "prompt": "Before you read on: what's the single scariest thing you imagine could go wrong when you type your first message? Hold that thought — by the end of this lesson you'll have already done it."
    },
    {
      "kind": "reveal",
      "title": "Three promises so you can relax",
      "body": "Here's the truth about your first hello. FREE: you can try a popular assistant for nothing, and you often don't even need an account to start. YOUR SESSION ISN'T WATCHED: no person is reading over your shoulder in real time — it's a computer program, not a room of people. (Honest note: the company may store your messages and some use chats to improve the program, so don't paste passwords or private numbers. For a first hello you're completely fine.) NOT A PERSON: this is the pattern-predictor from earlier lessons. It learned patterns from huge amounts of human writing and predicts what words come next. When we say \"like texting a fast helper,\" that's a COMPARISON — what's really happening is a program predicting the next words. It is not a friend, a human, or someone who knows you. You cannot break it, and you can close it any time.",
      "mistake": "Shopping around, comparing five assistants, reading reviews, and never actually typing anything — staying stuck at the edge of the pool.",
      "good": "Pick ONE assistant whose name you've heard of. That's enough. Open it in your web browser (you install nothing), find the box at the bottom, and type."
    },
    {
      "kind": "workflowChain",
      "title": "From cold start to first reply",
      "goal": "Get one message sent to an AI and read what comes back — no account drama, no installs.",
      "correct": [
        "Open your web browser (on a phone, the round icon you tap to visit websites; on a computer, where you type web addresses)",
        "Go to the website of ONE assistant whose name you've heard of",
        "Let the page load — you do not install anything",
        "Look at the very bottom for the wide empty box with faint grey words like \"Message\" or \"Ask anything\"",
        "Tap or click inside that box and type your message",
        "Press Enter/Return, or tap the little arrow (↑ or ▸) on a phone",
        "Watch the words come back and read the reply"
      ],
      "note": "There's no wrong order to \"discover\" here — this is the path. If a step feels unfamiliar, it's the newness, not you. Everyone's first send feels like this."
    },
    {
      "kind": "tryLive",
      "title": "Send this exact message",
      "prompt": "I'm brand new to AI and this is my first message. In one or two simple sentences, tell me what you can help me with. Then ask me one easy question about [something true about me].",
      "note": "Swap [something true about me] for one ordinary detail — \"what I'm cooking tonight\" or \"the walk I take in the mornings\" — and delete the square brackets before you send. Fully written out it looks like: \"...ask me one easy question about what I'm cooking tonight.\" Keep it light: no passwords, addresses, or private numbers."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your go-to first line",
      "cardType": "starter-message",
      "fields": [
        {
          "key": "assistant",
          "label": "The assistant I opened",
          "placeholder": "e.g. the one my friend uses"
        },
        {
          "key": "detail",
          "label": "The true detail I dropped in",
          "placeholder": "e.g. what I'm cooking tonight"
        },
        {
          "key": "opener",
          "label": "My reusable opener",
          "placeholder": "I'm new here — in one sentence, what can you help me with?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Have your first real conversation",
      "question": "The scripted message got a reply. Now: type a BRAND-NEW message in your own words — anything you're curious about, NOT copied from this lesson — press send, and read the answer. Which of these means you've actually had your first conversation?",
      "options": [
        {
          "text": "I wrote my own message, sent it, and a fresh answer came back",
          "ok": true,
          "feedback": "That's it. A message you wrote yourself went in, and a new answer came out — you've had your first conversation. The scary part is now behind you."
        },
        {
          "text": "I re-sent the exact prompt from the lesson again",
          "ok": false,
          "feedback": "Close, but the point is words of your OWN. Type something you're genuinely curious about, in your own words, and send that."
        },
        {
          "text": "I read about how to send a message but haven't typed anything yet",
          "ok": false,
          "feedback": "Reading isn't sending. Open the box, type one true curiosity of yours, and press Enter. You can't break it."
        },
        {
          "text": "I decided to wait until I've compared more assistants first",
          "ok": false,
          "feedback": "You don't need the perfect one — any one you've heard of works. Pick it, type a real question, send. Start now."
        }
      ]
    }
  ]
};
