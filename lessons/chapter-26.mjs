// Lesson 26 — Catching Hallucinations
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-26",
  "num": 26,
  "arc": "Judgment & Safety",
  "title": "Catching Hallucinations",
  "coreQuestion": "How do you catch a made-up fact when the AI sounds completely sure?",
  "blurb": "Pull the most checkable specific out of an answer and confirm it against a source you open yourself.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Two facts, both fake",
      "scenario": "Here is one sentence from an AI: \"The Eiffel Tower was completed in 1887, standing 312 metres tall.\" It reads clean and sure — a year, a height, no hedging. But the tower was finished in 1889, at 300 metres. Two confident specifics, both invented, and nothing in the wording warned you.",
      "prompt": "Before you read on: if the fake sentence sounds exactly as certain as a true one, what could you actually check to tell them apart?"
    },
    {
      "kind": "reveal",
      "title": "Confidence is not a fact-check",
      "body": "A hallucination is an AI invention stated as fact. Here is why you can't feel it coming: the AI predicts the most likely next words from patterns in human writing, and an invented number comes out just as fluent and specific as a true one. So the flat, certain tone tells you nothing — real facts sound exactly that certain too. And asking \"how sure are you?\" doesn't help either: a self-rated score like \"I'm 95% sure\" is produced by the same word-prediction that produced the answer, so it can be confidently wrong. In 2026 an assistant may browse the live web for you — but that is not a librarian handing you a verified page. It can still wrap a fabricated number or a fake citation around a real-looking link. The only thing that settles it is an outside source you open yourself.",
      "mistake": "Asking the AI how confident it is, or trusting an answer because it sounds sure and specific.",
      "good": "Pick the one most checkable specific and confirm it in a source you open outside the chat."
    },
    {
      "kind": "classify",
      "title": "Where inventions cluster",
      "prompt": "Inventions cluster around specifics you can look up. For each detail, decide: is this the kind of thing worth verifying outside the chat, or is it soft framing that isn't checkable?",
      "buckets": [
        "Checkable specific",
        "Soft / not checkable"
      ],
      "items": [
        {
          "text": "\"The library opened in 1894.\"",
          "answer": 0
        },
        {
          "text": "\"...per Galena: A History by J. Smith (2003).\"",
          "answer": 0
        },
        {
          "text": "\"Many people find the topic fascinating.\"",
          "answer": 1
        },
        {
          "text": "\"Marie Curie said, 'Nothing in life is to be feared.'\"",
          "answer": 0
        },
        {
          "text": "\"It's generally considered a good idea.\"",
          "answer": 1
        },
        {
          "text": "\"The study found a 47% increase.\"",
          "answer": 0
        }
      ],
      "reveal": "Numbers, dates, quotes with an attributed speaker, and cited sources (author + year) are where fabrication hides — and where you can catch it. Vague framing isn't checkable, and isn't the point; go straight for the specific."
    },
    {
      "kind": "tryLive",
      "title": "Bait a specific, then go check it",
      "prompt": "Give me the year the public library in Galena, Illinois opened, and include a book or article that states it, with author and year. I'm going to verify that specific in an outside source myself, so make it exact.",
      "note": "Ask something narrow enough that inventing a detail is tempting — a statistic, a quote and who said it, or a book/study with an author and year. Then leave the chat: open a search engine, the official site, or the actual source, and look for that exact specific. Does the number match? Does that person exist and say that? Does the cited book actually exist? In one real run the AI said \"1894, per Galena: A History by J. Smith (2003)\" — the building actually opened in 1888 and no such book exists. Verdict: busted on the year, busted on the citation."
    },
    {
      "kind": "verify",
      "title": "Reach a verdict",
      "claim": "\"The Galena, Illinois public library opened in 1894, per Galena: A History by J. Smith (2003).\"",
      "steps": [
        "Circle the single most checkable specific — here, start with the opening year.",
        "Leave the chat and open one outside source: the library's own site, a search engine, or a library catalog.",
        "Look for that exact year, and separately search whether the cited book and author actually exist.",
        "Write your verdict: confirmed, busted, or can't-find — and treat can't-find as not-yet-trusted, not as true.",
        "Cite the exact line (or its absence) that settled it — never 'the AI seemed sure.'"
      ],
      "note": "Confirmed, busted, and can't-find are all valid landing spots. Can't-find means you keep it out of your report, slide, or bibliography until a real source turns up. You verified the specific outside the AI — you never asked it how sure it was."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your fact-check routine",
      "cardType": "Hallucination check",
      "fields": [
        {
          "key": "specific",
          "label": "Most checkable specific",
          "placeholder": "The number, date, quote+speaker, or source (author, year) I'll verify"
        },
        {
          "key": "source",
          "label": "Outside source I'll open",
          "placeholder": "Official site, search engine, catalog, or the actual source — not the AI"
        },
        {
          "key": "verdict",
          "label": "Verdict rule",
          "placeholder": "Confirmed / busted / can't-find; treat can't-find as not-yet-trusted"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you can catch one",
      "question": "On a brand-new AI answer about a different topic, you want to make sure a specific is real. What actually settles it?",
      "options": [
        {
          "text": "Point to the single most checkable specific, open one outside source yourself, and deliver a verdict citing the exact line (or its absence) that settles it.",
          "ok": true,
          "feedback": "Yes. You picked the checkable specific, said why, opened a real source outside the chat, and reached confirmed / busted / can't-find on evidence — without asking the AI how sure it was."
        },
        {
          "text": "Ask the AI to rate its confidence and trust it if it says 95% or higher.",
          "ok": false,
          "feedback": "No — that score is generated by the same word-prediction that produced the answer. It can be confidently wrong. Confidence is not a fact-check."
        },
        {
          "text": "Re-read the answer; if the wording is specific and certain, treat it as verified.",
          "ok": false,
          "feedback": "No — an invented fact reads just as specific and certain as a true one. Tone tells you nothing; only an outside source can settle it."
        },
        {
          "text": "Ask the AI to double-check itself and confirm the specific.",
          "ok": false,
          "feedback": "No — the AI can re-generate the same fabrication just as fluently. The check has to happen in a source you open yourself, outside the chat."
        }
      ]
    }
  ]
};
