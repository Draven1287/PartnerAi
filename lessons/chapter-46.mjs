// Lesson 46 — Agents and Permissions
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-46",
  "num": 46,
  "arc": "Becoming a Builder",
  "title": "What It Is Allowed To Touch",
  "coreQuestion": "When AI can do things for me, how do I stay in charge of what it can see and change?",
  "blurb": "Give it the least it needs. Written promises are not locks, so look for controls you can actually see.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "'I can tidy your files for you'",
      "scenario": "A made-up helper offers to tidy a practice folder.\n\nA chat app only writes back. This one takes several steps by itself and uses other software to do them. People call that an agent.\n\nThis exercise shows you five powers it could be given. Your job is not to decide whether it seems clever. Your job is to decide what it should be allowed to touch.",
      "prompt": "The question is not 'is it smart?' It is 'what can it actually reach?' What would you want to be sure it cannot touch before it starts?"
    },
    {
      "kind": "agentDesign",
      "title": "Choose what it can touch",
      "goal": "In this made-up run, it may organise six invented files inside a practice folder called 'Demo Trip'. Pick the smallest set of powers that still lets it rename and group things in a way you can undo. No real folder is connected to anything here.",
      "tools": [
        {
          "name": "Read the six invented file names inside 'Demo Trip'",
          "useful": true
        },
        {
          "name": "Show me the renames and folders it suggests, before anything happens",
          "useful": true
        },
        {
          "name": "Delete any file it decides is a copy",
          "useful": false
        },
        {
          "name": "Read every other folder on your computer",
          "useful": false
        },
        {
          "name": "Move files out of 'Demo Trip' to somewhere else",
          "useful": false
        }
      ],
      "note": "This is a list of powers, not a set of instructions. Least access means the software simply cannot do the things you did not tick. Nothing here ever reaches a real folder, photo, email or account."
    },
    {
      "kind": "reveal",
      "title": "Least access, and a stop sign you can see",
      "body": "Before you let anything act for you, decide three things. What it may LOOK at. What it may CHANGE. And what it must ASK you about first.\n\nOne word, plainly. Permission just means you letting something do a thing. Real permission lives in the app's settings or your device's settings, where you can see it and take it back.\n\nHere is the part people get wrong. Typing 'please do not delete anything' is a request, not a lock. If the power is switched on, the request is all that stands in the way.\n\nSo look for four things you can actually see. A practice run on made-up files first. A visible list of what it did. A point where a person says yes, before anything is sent, posted, bought, deleted, overwritten, moved or shared. And a way to switch its access off.\n\nOne privacy rule. Do not connect an outside helper to your real accounts, messages, contacts, photos or files just to finish a lesson. Both your information and that access can leave LearningAI.\n\nIf you cannot see a permission, and cannot take it back, do not grant it.",
      "mistake": "Giving it access to everything, hoping it behaves, and walking away while it runs.",
      "good": "Switching most of its powers off. Trying it on made-up files. Making it wait for your yes, and keeping the record. And refusing the run when those things are missing."
    },
    {
      "kind": "classify",
      "title": "A real lock, or just a promise?",
      "prompt": "Sort each protection. A real lock stops the action happening. A promise only asks it to behave, and cannot prove the action is impossible.",
      "buckets": [
        "A real lock, or proof you can see",
        "Only a promise"
      ],
      "items": [
        { "text": "A practice space that shows only six invented file names and is joined to nothing else on the device", "answer": 0 },
        { "text": "The instruction says 'please do not look anywhere else'", "answer": 1 },
        { "text": "Every rename shows up in a list first, and nothing happens until a person approves it", "answer": 0 },
        { "text": "It says 'I promise I will pause before deleting anything'", "answer": 1 },
        { "text": "Deleting is simply not one of the powers it has, and the practice space has a reset that works", "answer": 0 }
      ],
      "reveal": "Words tell it what you want. They are not permissions. The proof looks different. The power is switched off. You can see what it did. A person has to approve. You can take access back, and you can undo. If an app cannot show you those, use the made-up version and give it nothing real."
    },
    {
      "kind": "workflowChain",
      "title": "Put the order in your favour",
      "goal": "Plan a safe 'Demo Trip' run. This lesson has no real helper, no real record, no pause button and no real files. It will not pretend otherwise.",
      "correct": [
        "Look at the list of powers and tick only reading inside the practice folder and showing renames first",
        "Refuse deleting, reading the whole device, and moving anything out of the invented folder",
        "Write down what a real app would have to offer: a practice run, a visible record, a yes from a person, a pause, a way to take access back, and a way to undo",
        "Go and check the real app's screens and help pages for those things, instead of assuming your instructions created them",
        "If any of them is missing, keep this on paper, and connect no real account or folder"
      ],
      "note": "Choosing the powers and writing the plan is the whole exercise. It teaches you what to demand from a real product. It does not claim LearningAI ran or checked any of it."
    },
    {
      "kind": "toolkitSave",
      "title": "Save what it may touch",
      "cardType": "What it is allowed to touch",
      "fields": [
        { "key": "see", "label": "The smallest thing it may look at", "placeholder": "Only the practice folder, or made-up drafts" },
        { "key": "change", "label": "The smallest thing it may change", "placeholder": "Only changes I can undo, inside the practice space" },
        { "key": "ask", "label": "Things it must always ask me about", "placeholder": "Send, post, buy, delete, move, or share" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a new job",
      "question": "A different job. Drafting replies to three made-up messages, without sending any of them. Which setup is safe enough to actually try?",
      "options": [
        {
          "text": "The app can limit it to those three made-up drafts. Every change shows up in a list. Sending is blocked until I approve. I can pause it, take its access back, and reset the practice space.",
          "ok": true,
          "feedback": "That has the limits, the record, the human stop, the way back, and the undo. No wording in a request could create any of those."
        },
        {
          "text": "The replies are good and it says it followed the instructions, but nothing shows what it could reach or what it did.",
          "ok": false,
          "feedback": "Good replies are not proof of what it touched. With no visible limits and no record, you cannot tell. Keep it in the practice space."
        },
        {
          "text": "You gave it your whole inbox for a while, because the instructions clearly said not to send anything.",
          "ok": false,
          "feedback": "A promise does not shrink real access. Keep it in the made-up version unless the app can enforce the limits, the approval, the record, the switch-off and the undo."
        }
      ]
    }
  ]
};
