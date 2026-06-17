// Lesson 14 — Verification & sources
// Arc: Judgment & Safety   (authored)
export default {
  "id": "chapter-14",
  "num": 14,
  "arc": "Judgment & Safety",
  "title": "Verification & sources",
  "coreQuestion": "The answer has sources — do they actually prove the claim?",
  "blurb": "Real, relevant, reliable, and connected to the claim. Decoration doesn’t count.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Confident. With citations. And wrong.",
      "scenario": "AI gives you a clean answer with three official-looking sources. It feels done. But one source is made up, one is real but says the opposite, and one is real and relevant. From the outside, all three look identical.",
      "prompt": "How do you tell a source that proves the claim from one that’s just decoration?"
    },
    {
      "kind": "verify",
      "title": "Run the source check",
      "claim": "“Studies show teens who use AI score 40% higher — see [Journal of Learning, 2024].”",
      "steps": [
        "Real? Does the source actually exist when I search for it?",
        "Relevant? Is it about this exact claim, or something nearby?",
        "Reliable? Who made it, and do they have a reason to mislead?",
        "Connected? Does it actually say the number, or did AI invent the link?"
      ],
      "note": "A citation is only useful if it survives all four checks. “Looks official” is not one of them."
    },
    {
      "kind": "reveal",
      "title": "Confidence is not evidence",
      "body": "AI produces fluent, confident text whether or not the facts behind it are real. Citations can be hallucinated, mismatched, or technically real but unrelated. The fix isn’t to trust harder — it’s to check one source outside the model before you rely on it.",
      "mistake": "Accepting a claim because the formatting looks authoritative.",
      "good": "Open one source yourself and confirm it actually says what AI claims."
    },
    {
      "kind": "tryLive",
      "title": "Ask for verifiable claims",
      "prompt": "Give me 3 facts about [topic]. For each one, tell me exactly what kind of source would prove it and how confident you are. Flag anything you’re not sure about.",
      "react": "Pick the claim AI was least confident about and actually look it up. Paste what you found — did it hold up?"
    },
    {
      "kind": "classify",
      "title": "Which sources count?",
      "prompt": "Sort these “sources” by whether they’d actually support a claim.",
      "buckets": [
        "Could support the claim",
        "Decoration / doesn’t support it"
      ],
      "items": [
        {
          "text": "A peer-reviewed study that directly measures the thing claimed",
          "answer": 0
        },
        {
          "text": "A real journal name with a year, but no article that actually exists",
          "answer": 1
        },
        {
          "text": "A government dataset on exactly this topic",
          "answer": 0
        },
        {
          "text": "A real article — about a different question than the one being answered",
          "answer": 1
        }
      ],
      "reveal": "Real + relevant + reliable + connected. Drop any one and the citation is just decoration."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your source quality rubric",
      "cardType": "Source rubric",
      "fields": [
        {
          "key": "real",
          "label": "Real?",
          "placeholder": "Does it exist when I search?"
        },
        {
          "key": "relevant",
          "label": "Relevant & connected?",
          "placeholder": "Does it address THIS claim?"
        },
        {
          "key": "reliable",
          "label": "Reliable?",
          "placeholder": "Who made it / any bias?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "AI cites a real, respected journal. Are you done?",
      "options": [
        {
          "text": "Yes — a respected journal is enough",
          "ok": false,
          "feedback": "The journal can be real while the specific article or claim isn’t."
        },
        {
          "text": "No — check that the article exists and actually says the claim",
          "ok": true,
          "feedback": "Right — real name ≠ real article ≠ supports the claim."
        },
        {
          "text": "Yes, as long as it sounds confident",
          "ok": false,
          "feedback": "Confidence is the thing we’re specifically not trusting here."
        }
      ]
    }
  ]
};
