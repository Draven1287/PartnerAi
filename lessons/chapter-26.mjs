// Lesson 26 — Catching Hallucinations
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-26",
  "num": 26,
  "arc": "Judgment & Safety",
  "title": "Catching Hallucinations",
  "coreQuestion": "When sources conflict or repeat the same near-truth, how do I decompose the claim and decide what the evidence actually supports?",
  "blurb": "Move beyond spotting one suspicious fact: separate the claim, trace its provenance, compare dates, and resolve conflicting evidence.",
  "minutes": 11,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Three pages repeat it. One source settles it.",
      "scenario": "An AI says a new youth transit rule begins September 1 and cites three pages. Two are blogs that copied an old announcement. The transit authority's current rule page says October 1. Counting links would favor September; tracing authority and date favors October.",
      "prompt": "Before you read on: when several pages agree because they copied one another, what makes evidence independent — and which source should control a current rule?"
    },
    {
      "kind": "reveal",
      "title": "A fluent answer can be almost right",
      "body": "Earlier you learned that confident specifics need checking. Now raise the difficulty: a claim can mix a correct subject with the wrong date, quote a real page out of context, or cite several copies of one stale source. Break the answer into atomic claims, then inspect direct support, provenance, independence, and time. For a current rule, prefer the responsible authority's current page over a copied summary. For a quotation, prefer the original recording or transcript over a quote collection. For a research finding, inspect the study itself and what it actually measured. If the best sources genuinely conflict, report the conflict instead of forcing certainty.",
      "mistake": "Treating three repeated links as three independent confirmations, or accepting a page because it discusses the same topic.",
      "good": "Ask which exact claim each source supports, where the information originated, whether the sources are independent, and whether a newer authoritative source supersedes an older one."
    },
    {
      "kind": "classify",
      "title": "Decompose the near-truth",
      "prompt": "The answer says: 'Riverbend's fictional Youth Pass becomes free for everyone under 19 on September 1.' Sort each part into a separate claim that needs evidence or into wording that adds no checkable claim.",
      "buckets": [
        "Atomic claim to verify",
        "No new checkable claim"
      ],
      "items": [
        {
          "text": "Riverbend has a program called the Youth Pass.",
          "answer": 0
        },
        {
          "text": "The pass costs zero.",
          "answer": 0
        },
        {
          "text": "Every rider younger than 19 is eligible.",
          "answer": 0
        },
        {
          "text": "The change begins September 1.",
          "answer": 0
        },
        {
          "text": "This is exciting news for the community.",
          "answer": 1
        },
        {
          "text": "The program is clearly a major step forward.",
          "answer": 1
        }
      ],
      "reveal": "A single sentence can contain four factual claims. One may be true while another is stale or invented. Verify the part that changes the decision first — here, eligibility and the start date — instead of giving the whole sentence one true-or-false label."
    },
    {
      "kind": "verify",
      "title": "Resolve a controlled source conflict",
      "claim": "Fictional evidence packet: Source A is a transit-authority announcement dated March 2 saying 'planned for September 1.' Source B is a community blog dated March 4 repeating September 1 and linking to A. Source C is the transit authority's current rule page, updated August 20, saying 'effective October 1 for riders ages 13–18.' What does the evidence support?",
      "steps": [
        "Split the answer into program, price, eligibility, and start-date claims.",
        "Trace Source B to its origin and mark it as a copy of Source A, not an independent confirmation.",
        "Compare publication status and dates: A is an earlier plan; C is the responsible authority's newer current rule.",
        "Check the exact language: C supports October 1 and ages 13–18, not 'everyone under 19.'",
        "Write the bounded verdict: the September date is superseded; eligibility is narrower than claimed; any price claim remains unresolved unless a source states it."
      ],
      "note": "This packet is fictional so everyone can practice without a browser. In real work, open the underlying pages yourself. If no source supports one part of the answer, mark that part unresolved instead of borrowing confidence from the supported parts."
    },
    {
      "kind": "tryLive",
      "title": "Optional: run the conflict check on a public claim",
      "prompt": "Choose a harmless public claim with a date, number, quote, attribution, or current rule. Find the earliest source you can, one apparently independent source, and the current authoritative source. Record which pages copy another, which exact words support each atomic claim, and whether later evidence supersedes earlier evidence.",
      "note": "This optional step leaves LearningAI. Do not use private people, school records, account information, medical details, or another person's data. The built-in Riverbend packet completes the lesson without outside tools."
    },
    {
      "kind": "toolkitSave",
      "title": "Save the conflict-check routine",
      "cardType": "Conflicting-evidence check",
      "fields": [
        {
          "key": "claims",
          "label": "Atomic claims",
          "placeholder": "Separate the date, number, quote, eligibility, source, or attribution"
        },
        {
          "key": "provenance",
          "label": "Origin and independence",
          "placeholder": "Which source is original? Which pages copy it?"
        },
        {
          "key": "authority",
          "label": "Authority and time",
          "placeholder": "Which source owns the rule or evidence, and is it current?"
        },
        {
          "key": "verdict",
          "label": "Bounded verdict",
          "placeholder": "confirmed / superseded / contradicted / unresolved — claim by claim"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Transfer the conflict check",
      "question": "An AI says a study proves that a study app raises every student's grades. Three news stories repeat the university press release, while the original paper reports only a correlation in one small volunteer group. What is the strongest response?",
      "options": [
        {
          "text": "Separate the causal, population, and outcome claims; trace the stories to their shared press release; inspect the paper's methods and exact language; and limit the conclusion to the observed correlation in that volunteer group.",
          "ok": true,
          "feedback": "Yes. You tested independence and direct support, then kept the conclusion inside the study's actual design and population."
        },
        {
          "text": "Accept the universal causal claim because three news stories independently confirmed it.",
          "ok": false,
          "feedback": "Stories repeating one press release are not independent evidence, and correlation in a volunteer sample does not prove universal causation."
        },
        {
          "text": "Reject the entire study because it did not prove the strongest version of the headline.",
          "ok": false,
          "feedback": "Overstatement does not make every observation worthless. State the narrower result the evidence supports and its limits."
        },
        {
          "text": "Ask the AI for a confidence score and use that instead of opening the paper.",
          "ok": false,
          "feedback": "A generated score is not independent evidence. Inspect the original method, sample, and claims."
        }
      ]
    }
  ]
};
