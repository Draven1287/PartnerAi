// Lesson 16 — Verify Before You Trust
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-16",
  "num": 16,
  "arc": "Trust & Everyday AI",
  "title": "Check It Before You Trust It",
  "coreQuestion": "How do I tell whether the source an AI gives me really backs up what it said?",
  "blurb": "A link proves nothing until you open it and find the fact sitting there on the page.",
  "minutes": 20,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer that looks airtight",
      "scenario": "You ask an AI app a question for your class presentation. The answer comes back sounding certain.\n\nUnderneath it lists where the fact came from. A title, a writer, a date, even a link that opens.\n\nIt looks solid. Your slide is nearly done.",
      "prompt": "What has the AI actually proved by handing you that link? That the page is real? That the page says the thing it claimed?"
    },
    {
      "kind": "reveal",
      "title": "A source is decoration until you open it",
      "body": "A source is simply where a fact came from. A website, a book, a report by people who study that thing.\n\nHere is the problem. The AI guesses words that fit the shape of a good answer. A tidy source name fits that shape perfectly. So it can hand you one that is out of date, is about something else, or was never real at all.\n\nThere is a second trap, and it catches more people. Plenty of apps really do search the web. They give you a genuine link that genuinely opens. That still proves nothing on its own. The page may simply not say what the AI said it says.\n\nThe link opening is not the test. The page saying the thing is the test.\n\nThink of a receipt. Anyone can print one. You only believe it once you see the money actually gone from the account. That is a comparison, not the real thing. What is really happening is plainer: the AI wrote something shaped like a good source, and nothing checked it.",
      "mistake": "It gave me a link and an author, so the answer must be backed up.",
      "good": "I open it myself, see that it is real, and find the fact on the page before I trust it."
    },
    {
      "kind": "workflowChain",
      "title": "Three checks, in this order",
      "goal": "Turn one AI claim plus its source into a verdict you can defend",
      "correct": [
        "Ask the AI for its single best source, and the exact sentence in it that backs the answer",
        "Open it yourself — click the link, or search the title and the writer's name",
        "Check 1 — Is it there? Does the link open, or does the title turn up at all?",
        "Check 2 — Is it a real place: a known site, a proper study, a real organisation?",
        "Check 3 — Does it actually say it? Can you find that exact fact on the page?",
        "Give it one word: Checked, Does not match, or Not found"
      ],
      "note": "A page that wants you to pay or log in is not proof it is fake. 'I cannot open it' is not the same as 'it does not exist.' Try another way in before you judge. If any of the three checks fails, the claim is not proven, and you just caught it in time."
    },
    {
      "kind": "verify",
      "title": "Judge a source trail",
      "claim": "A local swimming pool lets anyone under 16 swim on their own after 6 p.m.",
      "steps": [
        "Write down exactly what is being allowed, and who it affects",
        "Go to the pool's own current rules, not to another AI answer",
        "Check the place, the age rule, the date, and any exceptions",
        "Write down one word: Checked, Does not match, or Not found",
        "If it is still unclear, do not act until the pool or a responsible adult confirms it"
      ],
      "note": "This trail is enough to practise on. It uses no real names, no real address, and nobody's actual timetable."
    },
    {
      "kind": "reveal",
      "title": "If you go outside, keep the question clean",
      "body": "If you carry on in an outside app, your words leave LearningAI. Pick a public claim that does not matter much.\n\nDo not share a real person's name, age, timetable, health detail, account number, or private message.\n\nThe source you open is what earns the verdict. Not the chatbot.",
      "mistake": "Adding personal details to make a public fact easier to look up.",
      "good": "Asking about the public claim only, then going and reading the source yourself."
    },
    {
      "kind": "tryLive",
      "title": "Ask for the source AND the exact sentence",
      "prompt": "Answer this question: [question]. Then give me the single best source for it, the exact sentence from that source that backs it up, and a link, or the title, writer and date. Keep it to [number] source(s). I am going to open it and check that it really says this, so do not invent anything. If you are not sure a real source exists, say so instead.",
      "note": "For [question], pick one specific fact that should have a real, findable source. Something like: how much water should an adult drink in a day, and who says so? For [number], start with one. Use two if you want a second opinion. Then actually open it and run the three checks."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your check-a-claim card",
      "cardType": "Verify a claim",
      "fields": [
        {
          "key": "claim",
          "label": "The claim I am checking",
          "placeholder": "Adults should drink 8 cups of water a day"
        },
        {
          "key": "source",
          "label": "The source it gave me",
          "placeholder": "A link, or a title, writer and date"
        },
        {
          "key": "quote",
          "label": "The sentence that should prove it",
          "placeholder": "Paste the sentence the AI quoted"
        },
        {
          "key": "verdict",
          "label": "My verdict after opening it",
          "placeholder": "Checked / Does not match / Not found — and the sentence that earns it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Earn a verdict on a claim of your own",
      "question": "Pick a brand-new question of your own, not the water one. Run the prompt and open the source. What counts as doing this well?",
      "options": [
        {
          "text": "The AI wrote 'verified', so I am done. Getting that word back is the goal.",
          "ok": false,
          "feedback": "The AI's own word is not the check. The win is you reaching a verdict by opening the source, whatever that verdict turns out to be."
        },
        {
          "text": "I opened the source and ran the three checks. Then I wrote one word: Checked, Does not match, or Not found. I can point at the exact sentence that earns it, or at the fact it is missing.",
          "ok": true,
          "feedback": "That is it. Reaching a verdict you can defend on a fresh claim is the win, not collecting a tick."
        },
        {
          "text": "The link opened and the page looked professional, so I trusted the claim without reading it.",
          "ok": false,
          "feedback": "That is the modern trap. A working link proves the page exists. Check 3 is the one that matters."
        },
        {
          "text": "The page wanted me to pay, so I marked the claim as made up.",
          "ok": false,
          "feedback": "A paywall is not proof of anything. 'I cannot open it' is not 'it does not exist.' Try another way in first."
        }
      ]
    }
  ]
};
