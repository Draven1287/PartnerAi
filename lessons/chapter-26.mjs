// Lesson 26 — Catching Hallucinations
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-26",
  "num": 26,
  "arc": "Judgment & Safety",
  "title": "Three Pages Can All Be Wrong",
  "coreQuestion": "When sources disagree, or all repeat the same near-truth, how do I work out what the evidence really supports?",
  "blurb": "Split the answer into separate facts, find where each one came from, compare the dates, and settle what actually holds.",
  "minutes": 11,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Three pages say it. One page settles it.",
      "scenario": "An AI tells you a new free bus pass for young people starts on 1 September. It shows you three pages that agree.\n\nTwo of them are blogs. Both copied the same old announcement.\n\nThe bus company's own rules page was updated last month. It says 1 October.\n\nCounting pages gives you September. Looking at who owns the rule gives you October.",
      "prompt": "When several pages agree because they all copied one another, how many sources have you really got? And which one should decide a rule like this?"
    },
    {
      "kind": "reveal",
      "title": "An answer can be almost right",
      "body": "You already know that confident-sounding details need checking. This is the harder version.\n\nAn answer can get the subject right and the date wrong. It can quote a real page but leave out the bit that changes the meaning. It can show you three links that are all copies of one old page.\n\nSo break the answer into separate facts. Then ask four things about each one.\n\nDoes this source say this exact fact, or just talk about the topic?\n\nWhere did the fact first come from?\n\nAre these sources really separate, or did one copy the other?\n\nIs this the newest version, or has it been replaced?\n\nFor a rule, go to whoever actually makes the rule, and use their current page. For a quote, find the recording or the full transcript, not a page of quotes. For a study, read the study and see what it actually measured.\n\nIf the best sources genuinely disagree, say so. Do not force it into an answer.",
      "mistake": "Counting three copies of one page as three separate confirmations, or accepting a page because it is about the same topic.",
      "good": "Ask which exact fact each source backs, and where it started. Then ask whether the sources are really separate, and whether something newer has replaced it."
    },
    {
      "kind": "classify",
      "title": "Split the sentence up",
      "prompt": "The answer says: 'Riverbend's Youth Pass becomes free for everyone under 19 on 1 September.' Riverbend is made up. Sort each part: is it a fact you could go and check, or is it just an opinion?",
      "buckets": [
        "A fact I can check",
        "Just an opinion"
      ],
      "items": [
        {
          "text": "Riverbend has something called the Youth Pass.",
          "answer": 0
        },
        {
          "text": "The pass costs nothing.",
          "answer": 0
        },
        {
          "text": "Anyone under 19 can get one.",
          "answer": 0
        },
        {
          "text": "The change starts on 1 September.",
          "answer": 0
        },
        {
          "text": "This is exciting news for the town.",
          "answer": 1
        },
        {
          "text": "The scheme is clearly a big step forward.",
          "answer": 1
        }
      ],
      "reveal": "One sentence held four separate facts. One of them can be true while another is out of date or invented. Check the part that changes your decision first. Here that is who qualifies and when it starts. Do not stamp the whole sentence true or false."
    },
    {
      "kind": "verify",
      "title": "Sort out a disagreement",
      "claim": "A made-up set of sources. A is the bus company's announcement from 2 March: 'planned for 1 September.' B is a local blog from 4 March, repeating 1 September and linking straight to A. C is the bus company's current rules page, updated 20 August: 'starts 1 October, for riders aged 13 to 18.' What does this evidence actually support?",
      "steps": [
        "Split the answer into four facts: the scheme, the price, who qualifies, and the start date.",
        "Follow B back to where it came from. It is a copy of A, not a second opinion.",
        "Compare the dates. A was a plan back in March. C is the same company's current rule, updated in August.",
        "Read C's exact words. It says 1 October and ages 13 to 18, not 'everyone under 19'.",
        "Write the careful verdict: September has been replaced, fewer people qualify than claimed, and nothing here settles the price."
      ],
      "note": "These sources are made up so you can practise without opening a browser. In real life, open the pages yourself. If nothing supports one part of the answer, mark that part unsettled. Do not let the parts that checked out lend it confidence."
    },
    {
      "kind": "tryLive",
      "title": "Optional: try it on a real public claim",
      "prompt": "Pick a harmless public claim with a date, a number, a quote, or a rule in it. Find the earliest source you can, one source that looks independent, and the current source from whoever owns the rule. Write down which pages copied another, which exact words back each separate fact, and whether anything newer has replaced the old version.",
      "note": "This optional step leaves LearningAI. Do not use private individuals, school records, account information, medical details, or anyone else's data. The made-up Riverbend example finishes the lesson on its own."
    },
    {
      "kind": "toolkitSave",
      "title": "Save the disagreement check",
      "cardType": "Conflicting-evidence check",
      "fields": [
        {
          "key": "claims",
          "label": "The separate facts",
          "placeholder": "The date, the number, the quote, who qualifies, who said it"
        },
        {
          "key": "provenance",
          "label": "Where it came from",
          "placeholder": "Which page is the original? Which ones copied it?"
        },
        {
          "key": "authority",
          "label": "Who owns it, and how old is it",
          "placeholder": "Who actually makes this rule, and is this their current page?"
        },
        {
          "key": "verdict",
          "label": "My careful verdict",
          "placeholder": "backed up / replaced / contradicted / unsettled — fact by fact"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Use the same check somewhere new",
      "question": "An AI says a study proves a revision app raises every student's grades. Three news stories say the same thing, all based on one university press release. The actual paper says only that grades and app use went up together, in one small group of volunteers. What is the strongest response?",
      "options": [
        {
          "text": "Split it up: did the app cause the change, who was in the study, and what was measured. Notice all three stories came from one press release. Read the paper itself, and claim only what it found — two things went up together in one small volunteer group.",
          "ok": true,
          "feedback": "Yes. You checked whether the sources were really separate, then kept your conclusion inside what the study actually looked at."
        },
        {
          "text": "Believe the claim about every student, because three separate news stories confirmed it.",
          "ok": false,
          "feedback": "Three retellings of one press release are one source. And two things going up together in a small group does not prove one caused the other."
        },
        {
          "text": "Throw the whole study out, since it did not prove the headline.",
          "ok": false,
          "feedback": "An overblown headline does not make the work worthless. Say the smaller thing the evidence does support, and where it stops."
        },
        {
          "text": "Ask the AI how confident it is, and use that number instead of reading the paper.",
          "ok": false,
          "feedback": "A number it made up about itself is not evidence. Look at how the study was done, who was in it, and what it claimed."
        }
      ]
    }
  ]
};
