// Lesson 36 — Everyday Wins: Finish the Small Stuff
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-36",
  "num": 36,
  "arc": "AI for Real Life",
  "title": "Everyday Wins: Finish the Small Stuff",
  "coreQuestion": "How do I use AI to finish the small everyday messages and plans I keep putting off?",
  "blurb": "Turn an AI draft into something that sounds like you, then actually send it.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The message you keep avoiding",
      "scenario": "You told your friend Sam you'd hang out Saturday, but work blew up and now you need to cancel. The text has sat unwritten for three days. It's not hard. You just keep not doing it.",
      "prompt": "Before you read on: is a task like this too small to bother asking an AI for help with? Or is 'small and dreaded' exactly where it helps most?"
    },
    {
      "kind": "reveal",
      "title": "A draft is a starting point, not the final word",
      "body": "When an AI writes you a message, it isn't deciding what to say the way a person weighing their words does. It learned patterns from huge amounts of human writing and predicts wording that fits the facts and tone you gave it. That's the real mechanism (not 'just autocomplete' — it's next-word prediction shaped by everything it read). It's why the draft comes back fast and smooth, and also why it sounds a little generic, like it could've been written for anyone. So the draft is a head start, not the finished thing. You make it yours before it goes out. One ground rule: keep the facts you type in light — who it's to and the scheduling details, not private things you'd rather not share.",
      "mistake": "Saving AI only for big, impressive tasks and copy-pasting whatever draft it gives you, generic voice and all.",
      "good": "Aiming it at the tiny thing you've been dreading — the awkward cancellation, the reply you owe — then changing at least one line so it sounds like you before you send it."
    },
    {
      "kind": "classify",
      "title": "What actually belongs in the box?",
      "prompt": "Sort each thing by whether it's the kind of small, real task AI is great for helping you finish — or something to keep out of the chat.",
      "buckets": [
        "Good everyday task to draft",
        "Keep it out"
      ],
      "items": [
        {
          "text": "A text canceling Saturday's plans with a friend",
          "answer": 0
        },
        {
          "text": "An email to a professor about a missed class",
          "answer": 0
        },
        {
          "text": "Your friend's home address and full schedule, typed in 'so it's accurate'",
          "answer": 1
        },
        {
          "text": "A friendly note to a neighbor about a fence-repair date",
          "answer": 0
        },
        {
          "text": "A private medical detail you'd rather not share, pasted in for context",
          "answer": 1
        }
      ],
      "reveal": "The everyday messages are exactly the sweet spot. But keep the facts light: who it's to and the scheduling details are enough. Sensitive personal info doesn't need to go in the chat to get a good draft."
    },
    {
      "kind": "tryLive",
      "title": "Draft one real thing now",
      "prompt": "Help me write [a real message I need to send]. Here's the situation: [the facts — who it's to and what's true]. Make it sound [the tone] and keep it short. Then I'll tweak it to sound like me.",
      "note": "Use an ACTUAL task you owe someone today, not a pretend one. Worked example: 'Help me write a text canceling Saturday's plans. Here's the situation: it's to my friend Sam; something came up at work; I still want to see them, so I'd like to reschedule for next week. Make it sound warm and a little apologetic, so Sam doesn't think I'm blowing them off, and keep it short. Then I'll tweak it to sound like me.'"
    },
    {
      "kind": "workflowChain",
      "title": "The five-step move",
      "goal": "Get a small real message drafted, make it sound like you, and actually send it.",
      "correct": [
        "Name the one small thing that's been nagging you",
        "Tell the AI the facts and the tone you want",
        "Read the draft it writes",
        "Rewrite at least one line in words you'd really say out loud",
        "Actually send the message or set the plan in motion"
      ],
      "note": "The last two steps are the whole point. The AI gives you a smooth-but-generic start; your one rewritten line is what makes it sound human and yours — and it only counts once it's genuinely sent."
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually do it?",
      "question": "On a NEW example you haven't drafted yet, you wrote the prompt, filled in your own true details, got a draft, and changed a line. When have you truly passed this lesson?",
      "options": [
        {
          "text": "The message is genuinely sent or the plan is set in motion, AND you can point to the exact line you rewrote and say why it now sounds like you.",
          "ok": true,
          "feedback": "Yes. The win is in the doing: a real thing sent, plus one line that's unmistakably in your voice."
        },
        {
          "text": "The AI produced a polished draft that reads well, so you're done.",
          "ok": false,
          "feedback": "Not yet — a smooth draft is just the head start. It has to actually go out, and one line has to sound like you."
        },
        {
          "text": "You can explain how next-word prediction works.",
          "ok": false,
          "feedback": "Good to understand, but this lesson is about DOING the skill — finishing and sending a real message, not reciting the mechanism."
        },
        {
          "text": "You copied the draft exactly as written and sent it.",
          "ok": false,
          "feedback": "Sending counts, but pasting it verbatim skips the point: change at least one line so it sounds like you, not anyone."
        }
      ]
    }
  ]
};
