// Lesson 40 — The Draft-and-Critique Loop
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-40",
  "num": 40,
  "arc": "AI for Real Life",
  "title": "Draft, Pick It Apart, Do It Again",
  "coreQuestion": "How do I get genuinely better work out of AI, by going round the loop instead of asking once?",
  "blurb": "Good work comes from going round again. Draft it, have it picked apart, fix it yourself, repeat.",
  "minutes": 18,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The rough first go",
      "scenario": "You need three sentences inviting people to something. A games night, a litter pick, a club.\n\nYour first go is clear but dull. Nobody would come because of it.\n\nSending it now takes ten seconds. Fixing it might actually fill the room.",
      "prompt": "Before you change a single word, pick three tests it has to pass. Clear? Honest? Sounds like you? Useful? Gets a reply? And how would you know it improved?"
    },
    {
      "kind": "reveal",
      "title": "The quality is in the loop, not the first draft",
      "body": "Good work comes from going round. Draft it. Hold it against your tests. Fix it. Test it again.\n\nWhen AI 'picks apart' your draft, it is guessing sensible-sounding comments from the tests you gave it. It does not know what is genuinely good. It has no idea how your friends will react.\n\nSo some of its comments will be sharp and useful. Some will flatten your voice or miss the point entirely.\n\nYou set the tests. You decide which comments are right. You are allowed to say no, as long as you can say why.\n\nIf you use an outside app, take out real names, addresses, private messages, unpublished school or work material, and anything about another person. What you type there leaves LearningAI. A made-up draft is fine.",
      "mistake": "Binning the first draft the moment it is not great, and asking for a total rewrite instead.",
      "good": "Keeping the draft. Writing down what good actually means here. Then going round the loop twice."
    },
    {
      "kind": "workflowChain",
      "title": "Go round twice",
      "goal": "Turn a rough draft into something clearly better, measured against tests you wrote yourself.",
      "correct": [
        "Write something short and imperfect yourself. Do not polish it",
        "Write down 3 tests for what good means here, each one you can actually check",
        "Ask it to pick your draft apart against those three tests. Not to rewrite it",
        "You fix it yourself, then paste the new version back",
        "Ask it to pick the new version apart too. That is round two",
        "Put your first draft next to your last one and see how far it climbed"
      ],
      "note": "You do the rewriting, not the app. It guesses where your words miss your tests. The judgement and the writing stay yours. That is the same line as 'walk me through question 4' rather than 'do it for me'."
    },
    {
      "kind": "tryLive",
      "title": "Ask it to pick your draft apart",
      "prompt": "Here is my draft of [what it is]: [paste your draft]. Do NOT rewrite it. Pick it apart against three tests I am setting: 1) [test one], 2) [test two], 3) [test three]. For each test, tell me one thing that works and the single most important fix. Keep it short. I will fix it myself and paste the new version back for a second round.",
      "note": "Make each test something you can actually check. For example: the time and the thing to do are clear in one read. It uses words I would say out loud. It promises nothing I cannot deliver. Use a made-up invitation, listing, instruction card, or note, with names and details taken out. After each round, accept one suggestion, reject one and say why, and make the change yourself."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your three tests",
      "cardType": "Draft and pick apart",
      "fields": [
        {
          "key": "thing",
          "label": "What I am writing",
          "placeholder": "3 sentences inviting people to my robotics club"
        },
        {
          "key": "c1",
          "label": "Test 1, something I can check",
          "placeholder": "clear on a single read"
        },
        {
          "key": "c2",
          "label": "Test 2, something I can check",
          "placeholder": "sounds like a real person, not a leaflet"
        },
        {
          "key": "c3",
          "label": "Test 3, something I can check",
          "placeholder": "makes somebody actually want to turn up"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you have the loop",
      "question": "Pick something new you did not use above. Write 3 tests, go round twice, then say which test drove each change. Which of these means you have it?",
      "options": [
        {
          "text": "For every change between my first draft and my last, I can point to the exact test it was serving.",
          "ok": true,
          "feedback": "That is it. If you can name the test behind each change on a fresh piece, you own the loop, not one lucky answer."
        },
        {
          "text": "The second version is smoother and shorter, but it dropped a detail people actually need.",
          "ok": false,
          "feedback": "Smoother is not the test. Better means better against the tests you wrote, and you should be able to name which one each change served."
        },
        {
          "text": "I passed two tests, then changed the third one halfway through without writing down why.",
          "ok": false,
          "feedback": "Changing a test can be the right call. Write down the reason and hold the earlier draft against the new test too. Otherwise you cannot see what improved."
        }
      ]
    }
  ]
};
