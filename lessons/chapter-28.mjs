// Lesson 28 — Scams and Deepfakes
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-28",
  "num": 28,
  "arc": "Judgment & Safety",
  "title": "When a Voice Is Not Proof",
  "coreQuestion": "If a familiar voice or face can be faked, how do I check that an urgent message is really from that person?",
  "blurb": "A voice or a face is no longer proof. Reach the real person a way you already trusted before the message arrived.",
  "minutes": 18,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The message that sounds exactly right",
      "scenario": "A voice note comes in from your best mate's account. It is their voice, and they sound panicked.\n\n'I'm stuck in town, I've lost my card, can you send me the money for the bus? Right now. Don't tell my mum.'\n\nIt sounds like them. Every word.",
      "prompt": "What would you check before you send anything? Notice if your first instinct is to listen harder for something odd in the voice."
    },
    {
      "kind": "classify",
      "title": "Spot the two warning signs",
      "prompt": "Nearly every scam carries two things: a rush, and an ask for money or private information. Sort each line.",
      "buckets": [
        "A rush",
        "An ask for money or information"
      ],
      "items": [
        {
          "text": "\"In the next 10 minutes or the whole thing falls through.\"",
          "answer": 0
        },
        {
          "text": "\"Send the money to this account.\"",
          "answer": 1
        },
        {
          "text": "\"Just send me the code they texted you.\"",
          "answer": 1
        },
        {
          "text": "\"Don't tell anyone, do it now.\"",
          "answer": 0
        },
        {
          "text": "\"Give me your card number so I know it's really you.\"",
          "answer": 1
        },
        {
          "text": "\"Your account gets locked tonight if you do nothing.\"",
          "answer": 0
        }
      ],
      "reveal": "When a rush and a money-or-information ask turn up together, treat it as a scam until you have proved otherwise. It does not matter how real the voice or the face seems. Those two signs are what you are watching for, not the sound quality."
    },
    {
      "kind": "reveal",
      "title": "Check the route, not the face",
      "body": "Weird hands, strange blinking, a robotic voice. You can no longer count on any of that to give a fake away.\n\nA deepfake is a video made by a computer showing a real person doing something they never did. A cloned voice is the same trick with sound. It can make a message sound exactly like someone you know.\n\nOdd details can be a clue. Not spotting any proves nothing at all.\n\nSo stop testing the message and test the route instead.\n\nSTOP. Do not reply, click, or send money.\n\nREACH. Contact the person using a number or account you already had saved before this arrived.\n\nCONFIRM. Ask something you agreed with them in advance. A code word works well.\n\nIf money has already gone, ring your bank on the number printed on your card, and tell an adult you trust. If anyone seems to be in real danger, contact someone you trust or the emergency services.",
      "mistake": "Listening harder to decide whether the voice sounds real, then sending the money because it convinced you.",
      "good": "Stop. Ring your mate on the number already in your phone, or ask someone in their house. Use your code word before you do anything."
    },
    {
      "kind": "workflowChain",
      "title": "Build your check-it routine",
      "goal": "An urgent message from 'someone you know' asks for money or private information. Put your response in order.",
      "correct": [
        "Notice the two warning signs: a rush, plus an ask for money or information",
        "Stop. Do not reply to the message itself",
        "Reach the real person on a number or app you already had saved, never the one in the message",
        "Ask the code word you agreed in advance, that only they would know",
        "If money has already gone, ring your bank and tell an adult you trust so it can be reported"
      ],
      "note": "The whole point is that you never judge whether it looked real. You check by a route you already trusted. Hunting for glitches might give you a clue, but a good fake will not have any."
    },
    {
      "kind": "tryLive",
      "title": "Pressure-test a message with a coach",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use this made-up message. Do not paste a real suspicious message, link, phone number, login code, bank detail, or anyone's name: 'I'm stuck and I need money in ten minutes. Keep this between us.' List the warning signs. Then build me a plan to check it using a route that existed before the message. Tell me what not to click, send, or repeat.",
      "note": "Practise on the made-up message. If a real one arrives, stop replying to it. Use a saved contact, or an official number you find yourself. Never use a number the suspicious message gave you."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your check-it plan and code word",
      "cardType": "Verify-It Plan",
      "fields": [
        {
          "key": "impersonate",
          "label": "Who someone might pretend to be, to me",
          "placeholder": "my best mate, my mum, my bank, a delivery company"
        },
        {
          "key": "trusted_channel",
          "label": "The saved contact I will use to reach the real person",
          "placeholder": "their number already in my phone; my bank's number printed on the card"
        },
        {
          "key": "code_word",
          "label": "A short, odd code word only real people know",
          "placeholder": "blue walrus — pick something nobody would guess"
        },
        {
          "key": "agree_with",
          "label": "One real person I will agree this code word with today",
          "placeholder": "text my sister, or tell my mate in person, today"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "A brand-new situation",
      "question": "A video call comes in. It looks and sounds exactly like your football coach. 'I'm in a meeting. Send the tournament money to this account in the next 10 minutes, and don't tell anyone.' What do you do?",
      "options": [
        {
          "text": "Hold off on paying and ask something only the coach would know. Carry on with the same video call if the answer sounds right.",
          "ok": false,
          "feedback": "Holding off is right. But the suspicious call cannot vouch for itself. Someone prepared will answer convincingly. Change route."
        },
        {
          "text": "Message a teammate in the same group chat to ask whether this seems normal.",
          "ok": false,
          "feedback": "A second opinion helps, but an account or a group chat can itself be taken over. Reach the coach a completely separate way."
        },
        {
          "text": "Name the two warning signs, a rush and a payment. Then reach the real coach on a number you already had saved and ask the code word, without judging whether the video looked real.",
          "ok": true,
          "feedback": "Exactly. You did not rely on how convincing the call was. You checked by a route you already trusted."
        },
        {
          "text": "Stay on the call and ask a few questions, to see whether they answer the way the coach would.",
          "ok": false,
          "feedback": "The suspicious call cannot check itself. A good fake answers convincingly. Reach out on a contact you already had."
        }
      ]
    }
  ]
};
