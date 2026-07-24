// Lesson 43 — Keeping Your Voice and Being Honest
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-43",
  "num": 43,
  "arc": "Building with AI",
  "title": "Keeping Your Voice and Being Honest",
  "coreQuestion": "When AI helps you write, how do you stay the real author and stay honest about the help?",
  "blurb": "Edit AI-helped writing back into your own voice; you decide when and how to disclose the help honestly.",
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
      "body": "Most real work can mix your effort with a tool. What matters is that the claims, choices, and final words remain accountable. You stay the author with two moves: make the words sound like you, and disclose the help when a reader, rule, customer, collaborator, or audience reasonably needs to know. Before an outside assistant sees a writing sample, remove names, addresses, private messages, confidential work, and another person's information. Data entered there leaves LearningAI; invented samples work. A tool can suggest wording, but you approve every claim and decide what disclosure is honest for the setting.",
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
      "note": "Use three invented or already-public sentences in your style; a private sample is not required. Remove identifying details and confidential material. Try a thank-you note, product listing, community announcement, creative caption, or application paragraph. Then accept or reject each suggested phrase and write an honest disclosure before anything is shared."
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
          "text": "I rewrote the voice and verified the claims, but skipped disclosure even though the published venue asks creators to identify AI assistance.",
          "ok": false,
          "feedback": "The writing and facts may be yours, but the venue's rule makes disclosure part of honest publication. Add an accurate note before sharing."
        },
        {
          "text": "I added a disclosure saying 'AI was used,' but cannot explain whether the help was brainstorming, editing, or a mostly generated draft.",
          "ok": false,
          "feedback": "A vague note can hide the scale of help. Name whether AI brainstormed, edited, or produced most of the draft so the reader can interpret it fairly."
        }
      ]
    }
  ]
};
