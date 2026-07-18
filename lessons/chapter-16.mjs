// Lesson 16 — Verify Before You Trust
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-16",
  "num": 16,
  "arc": "Trust & Everyday AI",
  "title": "Verify Before You Trust",
  "coreQuestion": "How do I tell whether an AI's source actually backs up its answer?",
  "blurb": "A citation only counts once you open it and confirm it really proves the claim.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A perfect-looking answer",
      "scenario": "You ask an AI a factual question and it replies confidently, with a tidy source: a title, an author, a date, even a working link. It looks airtight. You are about to paste it into a class presentation.",
      "prompt": "Before you read on: what has the AI actually proven by handing you that link or title? Has it shown the source is real AND that the source says the claimed fact?"
    },
    {
      "kind": "reveal",
      "title": "A citation is just decoration until you open it",
      "body": "The one idea: a source only counts once you open it and confirm it actually proves the claim. Here's the mechanism. AI works by predicting the most plausible-sounding next words, one after another, from patterns it learned across huge amounts of human writing. So it can produce a source that LOOKS perfect but is outdated, points somewhere unrelated, or was never real at all — that's called a fabricated citation. In 2026 there's a second, even more common trap: many assistants browse the live web and hand you a real, working link — but a real link still doesn't prove the claim, because the page may not actually say what the AI said it does. The link or title existing proves nothing. The source SAYING the claimed thing is the only test. (Comparison, flagged as a comparison: a citation is like a receipt for a purchase — but a receipt can be forged, so you don't trust it until you confirm the charge yourself. That's the analogy; here's what's really happening — the AI generated text that fits the pattern of 'a good source,' with no built-in guarantee that source is real or that it backs the claim.)",
      "mistake": "It gave me a link (or a title and author), so the answer must be backed up.",
      "good": "I open the source myself and confirm it exists, is a real place, and actually states the fact — before I trust it."
    },
    {
      "kind": "workflowChain",
      "title": "The three checks, in order",
      "goal": "Turn one AI claim-plus-source into a justified verdict",
      "correct": [
        "Ask the AI for the single best source and the exact sentence from it that supports the answer",
        "Open the source yourself — click the link, or search the title and author",
        "Check 1 — Does it exist? Does the link load, or does the title turn up at all?",
        "Check 2 — Is it a real, credible place: a known site, journal, or organization, not an invented one?",
        "Check 3 — Does it actually say the claim? Can you find that exact fact in it?",
        "Reach a one-word verdict: Verified, Doesn't match, or Not found"
      ],
      "note": "A paywall or login wall is not proof it's fake — 'I can't open it' is not the same as 'it doesn't exist.' Try another route to reach it before you judge. If any of the three checks fails, the claim is NOT proven — and you just caught it before trusting it."
    },
    {
      "kind": "tryLive",
      "title": "Ask for the source AND the exact sentence",
      "prompt": "Answer this factual question: [question]. Then give me the single best source for your answer, the exact sentence from that source that supports it, and a link or the title, author, and date. Keep it to [number] source(s). I am going to open it and check that it really says this, so do not invent anything — if you are not sure a real source exists, tell me that instead.",
      "note": "For [question], pick one specific factual thing that should have a real, findable source — e.g. 'How much water should an average adult drink per day, and which health body recommends it?' For [number], start with 'one' (or 'two' if you want a cross-check). Then actually open it and run the three checks."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your verify-a-claim card",
      "cardType": "Verify a claim",
      "fields": [
        {
          "key": "claim",
          "label": "The claim I'm checking",
          "placeholder": "e.g. Adults should drink 8 cups of water a day"
        },
        {
          "key": "source",
          "label": "Source the AI gave (link or title/author/date)",
          "placeholder": "e.g. NHS 'Water, drinks and hydration', 2025"
        },
        {
          "key": "quote",
          "label": "The exact sentence that should prove it",
          "placeholder": "Paste the sentence the AI quoted"
        },
        {
          "key": "verdict",
          "label": "My verdict after opening it",
          "placeholder": "Verified / Doesn't match / Not found — and the sentence that earns it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Earn a verdict on your own fresh claim",
      "question": "Pick a brand-new factual question of your own (not the water example), run the live prompt, and open the source. What counts as succeeding at this skill?",
      "options": [
        {
          "text": "The AI said 'Verified,' so I'm done — a Verified reply is the goal.",
          "ok": false,
          "feedback": "No — the AI's word isn't the check. The win is YOU reaching a justified verdict by opening the source, whatever that verdict turns out to be."
        },
        {
          "text": "I opened the source, ran the three checks, and wrote a one-word verdict — Verified, Doesn't match, or Not found — pointing to the exact sentence that earns it (or noting its absence).",
          "ok": true,
          "feedback": "That's it. Reaching a justified verdict on your own fresh claim is the win — not getting a 'Verified.'"
        },
        {
          "text": "The link loaded and looked professional, so I trusted the claim without reading the page.",
          "ok": false,
          "feedback": "That's the 2026 trap. A real, working link proves the page exists — not that it says the claimed fact. Check 3 is the one that matters."
        },
        {
          "text": "I couldn't open the source because of a paywall, so I marked the claim as fabricated.",
          "ok": false,
          "feedback": "A paywall isn't proof it's fake. 'I can't open it' isn't 'it doesn't exist' — try another route before you judge."
        }
      ]
    }
  ]
};
