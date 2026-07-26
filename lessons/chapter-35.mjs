// Lesson 35 — Writing and Research: Voice + Verify
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-35",
  "num": 35,
  "arc": "AI & Being Human",
  "title": "Your Words, and Facts You Checked",
  "coreQuestion": "When AI helps me write something, which parts of the job are still mine?",
  "blurb": "It can hand you a smooth paragraph and a smart-looking source in seconds. The words and the facts are still yours.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A perfect paragraph with a perfect source",
      "scenario": "You ask for a short post about growing tomatoes. Back comes a smooth paragraph.\n\nIt ends like this. 'Research from the Cornell Home Gardening Institute (Whitfield, 2019) shows tomatoes sprout best in soil at 21 to 27 degrees.'\n\nIt looks finished. It has an author, a year, and a famous-sounding place.",
      "prompt": "Which parts of that are actually done? The words, the fact, both, or neither?"
    },
    {
      "kind": "reveal",
      "title": "You are still the writer",
      "body": "The thing writing that paragraph guesses words that fit. So it can produce a source that looks completely real and simply is not.\n\nSome apps really can search the web. That helps. But a real link still does not prove the sentence. The page has to actually say the thing you want to say.\n\nTwo jobs stay yours.\n\nThe first is the words. Treat the draft as raw material, not a finished piece. Rewrite it until the choices sound like you.\n\nThe second is the facts. Open the source. Find the line that backs your claim. Then write down what you found: it holds up, it says the opposite, or you could not find it.\n\nOne safety note before you paste anything into an outside AI app. Take out real names, addresses, private messages, and account details. What you type there leaves LearningAI. Two made-up sentences are enough to practise with.\n\nAnd checking a source only answers one question: does this page say this? It does not tell you the advice is safe. For health, money, law, or safety, ask a professional or an official page before you act.",
      "mistake": "Reading the smooth draft and the tidy source, deciding both jobs are finished, and posting it.",
      "good": "Treating the draft as a first pass. Rewrite the words that are not yours. Then open the source and find the exact line."
    },
    {
      "kind": "classify",
      "title": "Is this fact settled yet?",
      "prompt": "It hands you each of these. Sort them. Is the fact settled, or have you simply not checked it?",
      "buckets": [
        "Settled",
        "Not checked yet"
      ],
      "items": [
        {
          "text": "A source with a real-sounding author and year, which you have not opened.",
          "answer": 1
        },
        {
          "text": "A link you clicked. The article is real, and one sentence in it backs your claim.",
          "answer": 0
        },
        {
          "text": "'This is well known' with no source named at all.",
          "answer": 1
        },
        {
          "text": "A real page by the right author, which never actually states the claim.",
          "answer": 1
        },
        {
          "text": "A page you opened yourself. The publisher checks out and so does the exact line.",
          "answer": 0
        }
      ],
      "reveal": "A fact is settled only after you open the source and see three things. It exists. It is by whoever it claims. It says the exact thing. Anything less is unchecked, however convincing the source looks."
    },
    {
      "kind": "tryLive",
      "title": "Draft in your voice, then ask for one real source",
      "prompt": "Here is how I actually write. Study it: [paste 2 to 4 sentences you wrote]. Now help me write [the piece]. It has to include this fact: [the fact]. Keep my voice, the same level of formality and my kind of words. After the draft, give me the single best source for that fact: who published it, the exact sentence that backs the claim, and a link. List anything you are not sure is real, so I can check it myself.",
      "note": "The writing sample matters, but you can make it up. Take out names, contact details, places, and anything private before pasting into an outside app. Try something like: 'Hey, quick one. I keep meaning to ask about Saturday but life has been wild. Tell me what works and I will sort it.' Then pick something low-stakes, like a four-sentence post for a gardening group, and check its fact on a page you open yourself."
    },
    {
      "kind": "workflowChain",
      "title": "The two jobs, in order",
      "goal": "Turn the draft into a finished piece that sounds like you and rests on a fact you checked.",
      "correct": [
        "Read the draft and circle every word or phrase you would never say.",
        "Rewrite each circled phrase in your own words so the voice is yours.",
        "Actually open the source it gave you.",
        "Run three checks. Does the page exist? Is it by who it says? Does it say the exact thing?",
        "If any check fails, cut the fact, or swap in one you checked yourself.",
        "If the fact touches health, money or law, confirm it with a professional or an official page before acting."
      ],
      "note": "Words first, then facts. Skip the first and you sound like nobody. Skip the second and you sound right while being wrong."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your two-job checklist",
      "cardType": "Words and source checklist",
      "fields": [
        {
          "key": "voiceSample",
          "label": "My writing sample",
          "placeholder": "2 to 4 sentences you actually wrote"
        },
        {
          "key": "rewrites",
          "label": "Phrases I rewrote",
          "placeholder": "at least 2 phrases I put into my own words"
        },
        {
          "key": "verdict",
          "label": "What I found at the source",
          "placeholder": "it holds up / it does not match / I could not find it"
        },
        {
          "key": "line",
          "label": "The exact line, or the fact there is none",
          "placeholder": "the sentence in the source that settles it"
        },
        {
          "key": "proCheck",
          "label": "Who to ask for health, money or law",
          "placeholder": "doctor, pharmacist, lawyer, official page, or 'not needed'"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do both jobs on something new",
      "question": "Take a new piece of writing of your own that needs a fact. You draft it with AI, then finish it yourself. Which of these means you did both jobs?",
      "options": [
        {
          "text": "I can point to two phrases I put into my own words. I can say what I found at the source, and quote the line that settles it. If it touches health, money or law, I can name who I would ask.",
          "ok": true,
          "feedback": "That is both jobs on a new example. The words became yours, and the fact was settled at the source."
        },
        {
          "text": "It gave me a clean draft and a source with an author and a link, so the writing is done and the fact holds.",
          "ok": false,
          "feedback": "That is the exact trap. A source you did not open proves nothing, and a general draft is not your voice. Both jobs are still waiting."
        },
        {
          "text": "I rewrote a few phrases so it sounds like me. The fact came from the AI, so it is probably fine.",
          "ok": false,
          "feedback": "You did the words and skipped the facts. It guesses words that fit. Open the source and find the exact line."
        },
        {
          "text": "I opened the source. It is real and by the right author. I did not check whether it says my claim.",
          "ok": false,
          "feedback": "Real and by the right author is not enough. A genuine page can still never say your sentence. That third check is the one that catches invented sources."
        }
      ]
    }
  ]
};
