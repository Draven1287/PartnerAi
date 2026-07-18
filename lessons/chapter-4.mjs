// Lesson 4 — You Can't Break It
// Arc: First Contact
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-4",
  "num": 4,
  "arc": "First Contact",
  "title": "You Can't Break It",
  "coreQuestion": "What actually happens when I type the \"wrong\" thing, and can I damage the AI?",
  "blurb": "Type the messiest message you can, watch it cope, and prove the redo is free.",
  "minutes": 7,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The message you're scared to send",
      "scenario": "You've got the chat box open. Your finger hovers over the keys. But you're stuck — what if you type the wrong thing? What if you ask a dumb question, make a typo, and somehow ruin it or get in trouble? So you close the tab and tell yourself you'll figure out the 'right' way to ask later.",
      "prompt": "Before you read on: what do you imagine would actually happen if you sent a half-finished, typo-filled message right now?"
    },
    {
      "kind": "reveal",
      "title": "There's no fragile machine here",
      "body": "An AI assistant is a computer program in a chat box. It learned patterns from huge amounts of human writing, and it predicts a helpful reply to whatever you send. That's the whole machine. So nothing you type can damage it. A clumsy message isn't a problem to fix later — it just leads to a clumsy reply that you can redo right away. Because the assistant keeps the thread of one conversation, a correction lands right where you are; you never have to start over. (And if you ever want a truly clean slate, starting a brand-new chat is always an option.) Heads up: this course is for grown-ups and teens learning a tool. An AI is not a friend, a therapist, or a substitute for a real person — for anything serious, talk to a trusted human or a professional. If you're ever in crisis in the US, call or text 988. Under-18s should not use AI as an emotional companion (a caution shared by Common Sense Media and Stanford researchers).",
      "mistake": "Deleting your message five times trying to word it perfectly before you dare hit send.",
      "good": "Sending the messy version now, reading the reply, and fixing it in one short follow-up."
    },
    {
      "kind": "classify",
      "title": "Break it, or totally fine?",
      "prompt": "You're about to hit send on each of these. Which ones could actually harm the AI or 'ruin it for next time'?",
      "buckets": [
        "Totally fine — try it",
        "Would break the AI"
      ],
      "items": [
        {
          "text": "A message full of typos and no punctuation",
          "answer": 0
        },
        {
          "text": "Cutting yourself off mid-sentence and sending anyway",
          "answer": 0
        },
        {
          "text": "Asking a question you think is 'dumb'",
          "answer": 0
        },
        {
          "text": "Sending 'oops ignore that' right after a message",
          "answer": 0
        },
        {
          "text": "Changing your mind three times in one chat",
          "answer": 0
        }
      ],
      "reveal": "They all go in bucket one. There is no wrong button and no fragile part to damage. It has no feelings to bruise and doesn't hold your mess against you — it just reads your latest message and predicts the next reply. The 'break the AI' bucket stays empty on purpose."
    },
    {
      "kind": "tryLive",
      "title": "Send the mess on purpose",
      "prompt": "ok so i wnt help with [a rough, half-formed idea — leave your typos in] but im not even sure how to say it lol. just take a guess at what i mean and ask me whatever you need to figure it out.",
      "note": "Fill the blank with a fuzzy thought you can't word well yet — you do NOT need the right words, that's the point. Example: 'doing somthing nice for my friend whos been down, idk what.' Keep the typos. Send it exactly as-is, read the reply, and notice it still tried to help."
    },
    {
      "kind": "reveal",
      "title": "Now watch the redo cost nothing",
      "body": "The reply came back and it tried to help — even from a garbled message. Now send one short follow-up to steer it: 'That came out wrong. Here's what I actually meant: …' Watch it roll with the correction instantly, right where you are. You didn't start over. You didn't break anything. You just learned the redo is free. People say AI 'gets upset' or 'remembers your mistakes' — that's a comparison to a person, and it's wrong. What's really happening: it reads your latest message and predicts the next reply. Nothing to bruise, nothing held against you.",
      "mistake": "Abandoning the whole chat because the first reply missed, and starting from scratch somewhere else.",
      "good": "Typing one line — 'that came out wrong, I meant ___' — and letting the reply adjust on the spot."
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a fresh topic",
      "question": "Do it again on a brand-new, different topic of your own. Write one deliberately sloppy message (cut it off mid-thought or leave the typos), send it, then send a short 'that came out wrong, I meant ___' correction. Did the reply adjust without you starting over?",
      "options": [
        {
          "text": "Yes — messy message in, helpful reply back, my one-line fix worked",
          "ok": true,
          "feedback": "That's the whole proof. A redo costs nothing, and you cannot break it. Type freely from here."
        },
        {
          "text": "I re-typed my message perfectly first so it wouldn't get confused",
          "ok": false,
          "feedback": "You skipped the experiment. The point is that the mess is fine — go send a genuinely sloppy one and correct it after."
        },
        {
          "text": "I didn't send it — still worried I'd mess something up",
          "ok": false,
          "feedback": "There's nothing to mess up. Send the sloppy version now; the correction lands right where you are and nothing gets ruined."
        }
      ]
    }
  ]
};
