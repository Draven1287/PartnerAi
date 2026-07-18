// Lesson 43 — Keeping Your Voice and Being Honest
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-43",
  "num": 43,
  "arc": "Building with AI",
  "title": "Keeping Your Voice and Being Honest",
  "coreQuestion": "When AI helps you write, how do you stay the real author and stay honest about the help?",
  "blurb": "Edit AI-helped writing back into your own voice, then write your own rule for disclosing the help.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The line that isn't yours",
      "scenario": "You ask an assistant to polish a thank-you note to a teacher. It hands back something smooth: 'I am profoundly grateful for the invaluable investment you have made in my growth.' It reads well. It also sounds nothing like you — you'd never say 'profoundly' or 'invaluable investment' out loud.",
      "prompt": "Before you read on: if you sent that note as-is, whose words did the teacher actually get — and would you feel okay saying you wrote it?"
    },
    {
      "kind": "reveal",
      "title": "Two moves, one habit",
      "body": "Most real work is a mix of you and the tool — that's normal, not cheating. The misconception is 'either AI did it or I did it.' You stay the real author with two moves: (1) make the words sound like YOU, and (2) be honest about the help when it matters. Here's the mechanism to keep in mind: an AI assistant predicts the most likely next words from patterns across huge amounts of human writing, so left alone it drifts toward a generic, average-sounding voice — not yours. In 2026 these assistants can browse the web, use tools, and remember across chats, but they still average toward that generic sound and still make things up. So your job isn't to pretend the AI never touched it. It's to pull the words back to your voice and to say plainly what kind of help you got.",
      "mistake": "Paste the AI's smooth draft, send it, and either claim you wrote it solo or never mention the help at all.",
      "good": "Read it aloud, rewrite every line that doesn't sound like you, then decide — for this exact setting — whether you need a one-line note saying AI helped."
    },
    {
      "kind": "classify",
      "title": "Which setting are you in?",
      "prompt": "Disclosure depends on the setting. Sort each situation into where it belongs. Rule of thumb: disclose when accuracy or authorship matters to someone relying on it; for routine drafting of your own text, a note usually isn't needed.",
      "buckets": [
        "Add a disclosure note",
        "A note usually isn't needed"
      ],
      "items": [
        {
          "text": "A school essay, where the assignment allows AI but asks you to note how you used it",
          "answer": 0
        },
        {
          "text": "A client report where the numbers and authorship matter to whoever reads it",
          "answer": 0
        },
        {
          "text": "A creative post you're sharing publicly that AI helped shape",
          "answer": 0
        },
        {
          "text": "Reformatting your own rough notes into a cleaner list for yourself",
          "answer": 1
        },
        {
          "text": "A quick personal draft you'll rewrite entirely in your own words anyway",
          "answer": 1
        }
      ],
      "reveal": "When the assignment or policy is unclear, don't guess — ask the teacher or your manager BEFORE you submit. Guessing is the real risk. And never claim 100% solo if AI shaped it."
    },
    {
      "kind": "tryLive",
      "title": "Teach it your voice, then ask it to be honest",
      "prompt": "Here's how I naturally write — study my voice: [paste 3-4 real sentences you actually wrote before]. Now help me improve [the new piece], keeping my voice: same formality, my kind of words, nothing fancier than I'd say. Then do two things: (1) list every phrase you added that doesn't sound like me, and (2) tell me honestly what kind of help this was (brainstorm / edit / mostly-AI draft) so I can describe it accurately if I disclose it.",
      "note": "The pasted sentences are load-bearing — without a real sample the AI defaults to its own generic voice. Pick a sample that's yours alone; don't paste private details or anyone else's personal information. Example new piece: 'a thank-you message to a teacher who wrote me a recommendation letter.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your disclosure rule",
      "cardType": "Disclosure Rule",
      "fields": [
        {
          "key": "setting",
          "label": "Setting",
          "placeholder": "School, work, or creative"
        },
        {
          "key": "rule",
          "label": "My one-line rule",
          "placeholder": "e.g. I used AI to check grammar; the ideas and final words are mine."
        },
        {
          "key": "whenNone",
          "label": "When no note is needed",
          "placeholder": "e.g. rough personal drafts I fully rewrite"
        },
        {
          "key": "whenUnsure",
          "label": "If unclear, I will",
          "placeholder": "Ask the teacher / manager before I submit"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do both moves on a brand-new piece",
      "question": "Take a piece you have NOT touched yet (a short post, a club email, a card). To have really done this lesson, what must be true when you finish?",
      "options": [
        {
          "text": "I can point to at least two lines I rewrote into my own words, AND I've written my one disclosure rule for this exact setting and applied it (added the note, or said in one sentence why none is needed).",
          "ok": true,
          "feedback": "Yes. If someone saw your version next to the AI's raw version and could tell which is the real you — and you can say in one sentence how you'd disclose the help — you've done both moves."
        },
        {
          "text": "I accepted the AI's polished draft because it read better than anything I could write.",
          "ok": false,
          "feedback": "Then the words aren't yours yet. Read it aloud and rewrite every line that makes you think 'I'd never say that.'"
        },
        {
          "text": "I rewrote it in my voice but decided disclosure is always optional, so I skipped that part.",
          "ok": false,
          "feedback": "Half done. When accuracy or authorship matters to a reader, disclose — and if a school or work policy is unclear, ask before submitting rather than guessing."
        }
      ]
    }
  ]
};
