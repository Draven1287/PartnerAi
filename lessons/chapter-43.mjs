// Lesson 43 — Keeping Your Voice and Being Honest
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-43",
  "num": 43,
  "arc": "Building with AI",
  "title": "Keeping Your Voice and Being Honest",
  "coreQuestion": "When AI helps me write, how do I stay the real writer and stay honest about the help?",
  "blurb": "Edit it back into your own words. Then decide who needs to know that AI helped.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The line that is not yours",
      "scenario": "You ask an app to tidy up a thank-you note to a teacher.\n\nBack comes this. 'I am profoundly grateful for the invaluable investment you have made in my growth.'\n\nIt reads well. You would never say 'profoundly' out loud in your life.",
      "prompt": "If you sent that as it is, whose words did your teacher actually get? Would you be comfortable saying you wrote it?"
    },
    {
      "kind": "reveal",
      "title": "Two moves, one habit",
      "body": "Most real work mixes your effort with some kind of tool. That is normal. What matters is that somebody stands behind the claims, the choices and the final words.\n\nYou stay the writer with two moves.\n\nFirst, make the words sound like you. Read it out loud. Anything you would never say, rewrite.\n\nSecond, say that AI helped, when the person reading it would want to know. A teacher, a customer, a rule, an audience.\n\nBefore an outside app sees a sample of your writing, take out names, addresses, private messages, confidential work, and anything about somebody else. What you type there leaves LearningAI. Made-up samples work fine.\n\nIt can suggest wording. You approve every claim, and you decide what honesty looks like here.",
      "mistake": "Pasting the smooth draft, sending it, and either claiming you wrote it alone or never mentioning the help.",
      "good": "Reading it out loud, rewriting every line that is not yours, then deciding whether this particular reader needs one line saying AI helped."
    },
    {
      "kind": "classify",
      "title": "Which situation are you in?",
      "prompt": "Whether to say so depends on the situation. Sort each one. Rough rule: say so when somebody is relying on who wrote it or on it being right. For tidying up your own writing, usually nobody needs a note.",
      "buckets": [
        "Say that AI helped",
        "Usually no note needed"
      ],
      "items": [
        {
          "text": "A school essay where AI is allowed, but you must say how you used it",
          "answer": 0
        },
        {
          "text": "A report for a customer, where the numbers and who wrote them matter",
          "answer": 0
        },
        {
          "text": "Something creative you are posting publicly that AI helped shape",
          "answer": 0
        },
        {
          "text": "Turning your own scrappy notes into a tidy list, for yourself",
          "answer": 1
        },
        {
          "text": "A quick personal draft you are going to rewrite completely anyway",
          "answer": 1
        }
      ],
      "reveal": "When the rule is unclear, do not guess. Ask the teacher or your manager BEFORE you submit. Guessing is the actual risk here. And never claim you did it all alone if AI shaped it."
    },
    {
      "kind": "tryLive",
      "title": "Teach it your voice, then ask it to be straight with you",
      "prompt": "Here is how I actually write. Study it: [paste 3 or 4 sentences you wrote]. Now help me improve [the new piece], keeping my voice. Same level of formality, my kind of words, nothing fancier than I would say. Then do two things. One, list every phrase you added that does not sound like me. Two, tell me honestly what kind of help this was: ideas, editing, or mostly written by you. I need that so I can describe it accurately.",
      "note": "Use three made-up or already-public sentences in your style. You do not need a private sample. Take out anything identifying or confidential. Try a thank-you note, an item for sale, a club announcement, a caption, or an application. Then accept or reject each phrase it suggested, and write your honest one-liner before anything gets shared."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your rule",
      "cardType": "My rule for saying AI helped",
      "fields": [
        {
          "key": "setting",
          "label": "The situation",
          "placeholder": "School, work, or something creative"
        },
        {
          "key": "rule",
          "label": "My one-line note",
          "placeholder": "e.g. I used AI to check my grammar. The ideas and the final words are mine."
        },
        {
          "key": "whenNone",
          "label": "When no note is needed",
          "placeholder": "e.g. rough personal drafts I rewrite completely"
        },
        {
          "key": "whenUnsure",
          "label": "If it is unclear, I will",
          "placeholder": "Ask the teacher or my manager before I hand it in"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do both moves on something new",
      "question": "Take a piece you have not touched yet. A short post, a club email, a card. What must be true when you finish?",
      "options": [
        {
          "text": "I can point to at least two lines I rewrote in my own words. And I have written my one-line rule for this exact situation and used it, either by adding the note or by saying in one sentence why none is needed.",
          "ok": true,
          "feedback": "Yes. If somebody put your version next to the raw one and could tell which is you, and you can say in a sentence how you would describe the help, both moves are done."
        },
        {
          "text": "I rewrote it in my voice and checked the facts, but skipped the note, even though the site asks people to say when AI helped.",
          "ok": false,
          "feedback": "The words and facts may be yours. The site has a rule, and following it is part of being honest. Add an accurate note before posting."
        },
        {
          "text": "I wrote 'AI was used', but I cannot say whether that meant ideas, editing, or most of the draft.",
          "ok": false,
          "feedback": "A vague note hides how much help it was. Say which one it was, so the reader can judge it fairly."
        }
      ]
    }
  ]
};
