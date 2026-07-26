// Lesson 29 — What Is Real Online Now
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-29",
  "num": 29,
  "arc": "Judgment & Safety",
  "title": "What Is Real Online Now",
  "coreQuestion": "How do I decide what to believe online when anything could have been made by a computer?",
  "blurb": "Stop trusting how real something looks. Ask who put it out, and whether anyone separate says the same thing.",
  "minutes": 18,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The perfect clip",
      "scenario": "You scroll past a clip of a famous politician saying something shocking. The light is right. The voice is right. Thousands of people are already sharing it, furious.\n\nIt feels completely real.\n\nThe next day it turns out none of it happened. A computer made the whole thing.",
      "prompt": "If the clip looked and sounded perfect, what could you have checked to catch it? Something that has nothing to do with how real it looked."
    },
    {
      "kind": "reveal",
      "title": "Looking real stopped being proof",
      "body": "There are now apps that make pictures, voices and video from scratch. They learned from huge collections of real photos, recordings and film. What they produce looks and sounds convincing.\n\nSo a sharp photo can be made up. A familiar voice can be made up. So can a news-style clip or a glowing five-star review. Or it is a real clip with the important part cut off.\n\nHow it looks is very weak proof.\n\nWhen a claim actually matters, ask three things. Who first put it out? What did they show to back it? Does anyone separate report the same thing?",
      "mistake": "Believing a post because the details are perfect and it feels genuine. Treating 'looks real' as proof.",
      "good": "Treating anything as possibly computer-made. Then checking who put it out, and finding a second, separate source before you believe it."
    },
    {
      "kind": "classify",
      "title": "Which clue actually helps?",
      "prompt": "Sort each one. Is it real proof, or a weak clue that settles nothing?",
      "buckets": [
        "Real proof",
        "Weak clue — proves nothing"
      ],
      "items": [
        {
          "text": "A named news organisation that has to answer for its mistakes published it",
          "answer": 0
        },
        {
          "text": "The picture is sharp, well lit, and looks completely convincing",
          "answer": 1
        },
        {
          "text": "A second, unconnected source reports the same thing",
          "answer": 0
        },
        {
          "text": "There is no 'Made with AI' label on it",
          "answer": 1
        },
        {
          "text": "It is built to make you furious and share it fast",
          "answer": 1
        },
        {
          "text": "An anonymous account made last month, with 12 followers, posted it",
          "answer": 1
        }
      ],
      "reveal": "Labels and watermarks feel like a safety net. That is a comparison, not the truth. Labels get added inconsistently, watermarks get cropped off, and plenty of computer-made media never had either. No label proves nothing. A label is one weak clue. Only two things count as real proof. Someone with a name who has to answer for it. And a separate source saying the same thing. 'It looks real' and 'it made me furious' are reasons to slow down, not reasons to believe."
    },
    {
      "kind": "workflowChain",
      "title": "The three questions",
      "goal": "Run the check on something you saw online, in order.",
      "correct": [
        "Who put it out? Someone with a name who has to answer for it, or an anonymous account nobody can find?",
        "Does a second, unconnected source say the same thing? If only one place says it, it is unconfirmed, not true.",
        "Is it built to make you furious or move fast? Anything designed to spike your feelings is designed to skip your thinking.",
        "Give it one word — trust it, do not trust it, or unconfirmed — and say exactly why."
      ],
      "note": "Your reason has to be about who put it out and whether anyone else backs it. 'An anonymous account, and nothing else says it' is a real reason. 'It looked real' and 'there is no AI label' are not."
    },
    {
      "kind": "tryLive",
      "title": "Run it on your own example",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use a public post, or describe it without usernames, private messages, faces of ordinary people, or where it was taken. Help me weigh up this claim: [describe it plainly]. Separate three things: (1) who published it and whether they have to answer for it, (2) what a second, unconnected source says, and (3) what is still unconfirmed. Do not judge it by how it looks or by whether it has an AI label.",
      "note": "Pick a public headline, an advert, or a widely shared claim. Not a post from a private group chat. Open the original and the second source yourself. If it asks for money, private information, or urgent action, stop and check the sender by a route you already trust."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your trust check",
      "cardType": "Trust check",
      "fields": [
        {
          "key": "content",
          "label": "What I saw",
          "placeholder": "a shocking 'breaking news' clip in a group chat"
        },
        {
          "key": "source",
          "label": "Who put it out, and can they be held to it?",
          "placeholder": "anonymous account, made last month, 12 followers"
        },
        {
          "key": "confirm",
          "label": "Does anyone unconnected say it too?",
          "placeholder": "no news site or fact-check page mentions it"
        },
        {
          "key": "verdict",
          "label": "Verdict and reason",
          "placeholder": "Unconfirmed — one anonymous account, nothing else backs it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Give the verdict",
      "question": "A friend forwards you a photo you have never looked at before. You give your verdict. Which answer shows you have the skill?",
      "options": [
        {
          "text": "\"Do not trust it yet. Unconfirmed. It came from an account nobody can trace, and nothing unconnected backs it up.\"",
          "ok": true,
          "feedback": "Yes. Your reason is about who put it out and whether anyone else confirms it, and you gave a clear verdict."
        },
        {
          "text": "\"Probably real. A news site I know reposted it, though I have not found the original report.\"",
          "ok": false,
          "feedback": "A known site helps. But a repost can still be wrong, or have the important context cut off. Hold the verdict until you open the original."
        },
        {
          "text": "\"Unconfirmed, but fine to pass on as long as I write 'might be true' on it.\"",
          "ok": false,
          "feedback": "A warning label does not undo the spread. If a claim that matters is unconfirmed, do not pass it on yet."
        },
        {
          "text": "\"Two accounts posted it, so that is two separate sources.\"",
          "ok": false,
          "feedback": "Two accounts may be copying the same original. Separate means their own reporting or their own evidence, not a repeat."
        }
      ]
    }
  ]
};
