// Lesson 28 — Scams and Deepfakes
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-28",
  "num": 28,
  "arc": "Judgment & Safety",
  "title": "Scams and Deepfakes",
  "coreQuestion": "If a familiar voice or face can be faked, how do you confirm an urgent message is really from the person it claims to be?",
  "blurb": "A voice or face is no longer proof. Verify through a separate channel you already trust.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The call that sounds exactly right",
      "scenario": "Your phone rings. It's your grandson's number — his voice, panicked: \"Grandma, it's me, I'm in trouble and need $500 fast. Please don't tell Mom, just send it.\" It sounds like him. Every word.",
      "prompt": "Before you read on: what would you check to decide if this is really him? Notice if your instinct is to listen harder for something 'off' in the voice."
    },
    {
      "kind": "classify",
      "title": "Spot the two red flags",
      "prompt": "Almost every scam carries two signals: URGENCY (act now, no time to think) and a REQUEST for money or private information. Sort each line into what it is.",
      "buckets": [
        "Urgency",
        "Money / info request"
      ],
      "items": [
        {
          "text": "\"In the next 10 minutes or the deal falls through.\"",
          "answer": 0
        },
        {
          "text": "\"Wire $2,000 to this account.\"",
          "answer": 1
        },
        {
          "text": "\"Just send me the login code they texted you.\"",
          "answer": 1
        },
        {
          "text": "\"Don't tell anyone, do it right now.\"",
          "answer": 0
        },
        {
          "text": "\"Give me your card number to confirm your identity.\"",
          "answer": 1
        },
        {
          "text": "\"Your account will be frozen if you don't act tonight.\"",
          "answer": 0
        }
      ],
      "reveal": "When you see urgency AND a money-or-info ask together, treat it as a scam until proven otherwise — no matter how real the voice or face seems. Those two flags, not the sound quality, are your signal."
    },
    {
      "kind": "reveal",
      "title": "Verify the channel, not the face",
      "body": "You can no longer rely on strange hands, odd blinking, or a robotic voice to expose a fake. A deepfake can show a real person doing something that never happened. A voice clone can make a call sound like someone you know. Visual clues may help, but their absence proves nothing.\n\nMove the test away from the media and onto the channel:\n\nSTOP — do not reply, click, or send money.\nREACH — contact the person using a number or account you already trusted before the message arrived.\nCONFIRM — ask something independently agreed, such as a family code word.\n\nIf money moved, contact the bank's official fraud line and your local fraud-reporting authority. If the message creates an immediate safety concern, contact a trusted person or local emergency services.",
      "mistake": "Listening harder to decide if the voice 'sounds real,' then sending the money because it convinced you.",
      "good": "Hang up. Call your grandson on the number already saved in your phone — or ask his mother directly — and ask your code word before you do anything."
    },
    {
      "kind": "workflowChain",
      "title": "Build your verify-it routine",
      "goal": "An urgent message from 'someone you know' asks for money or private info. Put your response in order.",
      "correct": [
        "Notice the two red flags: urgency + a money-or-info request",
        "Stop — hang up or don't reply to the message itself",
        "Reach the real person on a number or app you already have saved (never the one in the suspicious message)",
        "Ask your agreed code word only the real person would know",
        "If money already moved, call your bank's fraud line and report it to the police or local fraud authority"
      ],
      "note": "The whole point: you never judge whether it 'looked real.' You confirm through a channel you already trust. Looking for glitches can be a clue, but it is not a reliable verification method; convincing synthetic voices and faces may contain no obvious flaw."
    },
    {
      "kind": "tryLive",
      "title": "Pressure-test a message with a coach",
      "prompt": "This optional step uses an external assistant, so anything entered leaves LearningAI. Use this invented message; do not paste a real suspicious message, link, phone number, login code, bank detail, or person's name: 'I'm stuck and need $500 in ten minutes. Keep this secret.' List the warning signs, then build a verification plan using a separate contact route that existed before the message. Tell me what not to click, send, or reveal.",
      "note": "Practice on the invented text. If a real message arrives, stop interacting with it. Use a saved contact or an official number you find independently; never use contact details supplied by the suspicious message."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your verify-it plan and code word",
      "cardType": "Verify-It Plan",
      "fields": [
        {
          "key": "impersonate",
          "label": "Who a scammer might pretend to be, to me",
          "placeholder": "e.g. my grandson, my bank, my boss, a delivery service"
        },
        {
          "key": "trusted_channel",
          "label": "The saved contact I'll use to reach the real person",
          "placeholder": "e.g. my grandson's number saved in my phone; my bank's number printed on my card"
        },
        {
          "key": "code_word",
          "label": "A short, odd code word only real people know",
          "placeholder": "e.g. \"blue walrus\" — pick something unguessable"
        },
        {
          "key": "agree_with",
          "label": "One real person I'll agree this code word with TODAY",
          "placeholder": "e.g. text my daughter or tell a neighbor in person, today"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "A brand-new scenario",
      "question": "You get a video call. It looks and sounds exactly like your boss: \"I'm in a meeting — wire $2,000 to this account in the next 10 minutes, and don't message anyone.\" What's your move?",
      "options": [
        {
          "text": "Pause the payment, ask a question only the boss is likely to know, and continue on the same video call if the answer sounds right.",
          "ok": false,
          "feedback": "Pausing is right, but the suspicious channel cannot verify itself. A prepared scammer or model may answer convincingly. Switch channels."
        },
        {
          "text": "Message a coworker through the same meeting chat to ask whether the request seems normal.",
          "ok": false,
          "feedback": "A second opinion helps, but an account or meeting may be compromised. Reach the boss or finance team through a known, separate route."
        },
        {
          "text": "Name the two red flags (urgency + payment), then reach the real boss on a number or app you already have saved and ask your code word — without judging whether the video looked real.",
          "ok": true,
          "feedback": "Exactly. You did not rely on the call seeming convincing. You verified through a channel you already trusted."
        },
        {
          "text": "Reply to the video call to ask a few questions and see if 'they' answer like your boss would.",
          "ok": false,
          "feedback": "The suspicious channel can't verify itself — a good clone will answer convincingly. Reach out on an independent contact you already have."
        }
      ]
    }
  ]
};
