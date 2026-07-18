// Lesson 37 — Money, Shopping and Travel
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-37",
  "num": 37,
  "arc": "AI for Real Life",
  "title": "Money, Shopping and Travel",
  "coreQuestion": "How do I use AI to weigh a real money, shopping, or travel decision without trusting a price it might have gotten wrong?",
  "blurb": "Let AI lay out your options — then confirm the price yourself on the site that takes your money.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The $89 deal that wasn't",
      "scenario": "You ask AI for the best carry-on suitcase under $120. It comes back fast and confident: \"The Cabin Pro is your best pick — currently $89, on sale.\" That's under budget and sounds perfect. Your thumb hovers over Buy.",
      "prompt": "Before you tap Buy — where did that $89 actually come from, and what's the one thing you'd want to check first?"
    },
    {
      "kind": "reveal",
      "title": "AI gives you leads, not a cash register",
      "body": "AI is excellent at laying out your options and surfacing the questions you'd forget to ask. But it doesn't keep a live cash register. Under the hood it learned patterns from huge amounts of text and predicts what comes next — so a price it hands you is a pattern-based guess, not a scanned tag. A 2026 assistant CAN browse the live web and pull a real page, which helps a lot. But even then it can quote a page that's gone stale, mix up a sale that already ended, or read a number wrong while summarizing. Saying AI 'knows the price' the way a cashier scans a barcode is a comparison — what's really happening is prediction plus, sometimes, a web search that can still miss. So treat every price, deal, or 'in stock' as a lead to confirm, not a fact.",
      "mistake": "You see '$89, on sale,' trust it as the current price, and buy — then get charged $119 because the sale ended last week.",
      "good": "You treat the $89 as a lead, open the store's own product page, and check the real number before you spend a cent."
    },
    {
      "kind": "classify",
      "title": "Verify means: the source that takes your money",
      "prompt": "To verify, YOU open the real source yourself — the store's product page, the airline's booking page, the bank's rate page — and check the number matches there. Which of these count as verifying a price?",
      "buckets": [
        "Real verification",
        "Not enough"
      ],
      "items": [
        {
          "text": "Opening the store's own product page and reading the price at checkout",
          "answer": 0
        },
        {
          "text": "Going to the airline's booking page for your dates and seeing the fare",
          "answer": 0
        },
        {
          "text": "Trusting the price the AI typed in its answer",
          "answer": 1
        },
        {
          "text": "Reading a 'best deals' blog that lists the sale price",
          "answer": 1
        },
        {
          "text": "Looking at a screenshot someone posted of the price",
          "answer": 1
        },
        {
          "text": "Checking the number on the provider's own rate or plan page",
          "answer": 0
        }
      ],
      "reveal": "The source that takes your money is the source you trust. Not a screenshot, not a deals blog, not the AI's word — the actual page where you'd click Buy or Book."
    },
    {
      "kind": "tryLive",
      "title": "Run it on a real decision",
      "prompt": "Help me decide on [the real purchase, trip, or plan]. My budget is [amount, with currency] and what matters most to me is [priority]. Compare [number] options with honest trade-offs for my situation. Then list exactly what I should verify myself before I commit, and name the real website where I'd confirm each one. If you can check current info online, say so and tell me the date of what you found.",
      "note": "Pick something you're actually deciding right now — a purchase, a trip, a plan. Fill the blanks with real values (e.g. 'a carry-on suitcase for weekend flights,' '$120 total,' 'lightweight enough for budget-airline overhead bins,' '3'). Keep it generic: share a budget and a priority, never your card number, account number, or income. When it names a price, don't stop here — go open that real page."
    },
    {
      "kind": "workflowChain",
      "title": "The decide-with-AI flow",
      "goal": "Make one real money, shopping, or travel decision — and catch at least one price or claim before you spend.",
      "correct": [
        "Name the real decision you're facing right now",
        "State your budget and the one thing that matters most to you",
        "Ask AI to compare 2-3 options with honest trade-offs for your situation",
        "Ask 'what would you double-check before spending, and on which real site?'",
        "Open one of those real sources and confirm the key price or claim yourself",
        "Decide"
      ],
      "note": "The verify step is not optional — it's the whole point. AI narrows the field; the real site confirms the number. For anything binding like a loan, insurance policy, or contract, run the final terms past a qualified professional, not the AI."
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually check?",
      "question": "Take a brand-new decision you did NOT use above — say, which of two streaming plans to keep, or the cheapest train home next month. Run the prompt, then open the real source for ONE price or claim and confirm it. What lets you say you passed?",
      "options": [
        {
          "text": "I opened the real site and can finish: 'The price AI gave me was ___; on the real site it was actually ___, so I will / won't trust it.'",
          "ok": true,
          "feedback": "That's the skill. You didn't guess — you opened the source that takes your money and compared it to what AI said. Match or gap, now you know."
        },
        {
          "text": "The AI sounded confident and its price seemed reasonable, so I'm satisfied it's right",
          "ok": false,
          "feedback": "Confidence isn't a price check. A stale or misread number can sound just as sure. Open the actual page and read it yourself."
        },
        {
          "text": "I checked a 'best deals' blog that listed a similar price",
          "ok": false,
          "feedback": "A blog isn't where you pay. Verify on the store's or booking site's own page — the source that would actually charge you."
        },
        {
          "text": "I picked my top option out loud but didn't open any real site",
          "ok": false,
          "feedback": "Naming a favorite is the easy half. Checking the price on the real source is the skill — you have to actually open it."
        }
      ]
    }
  ]
};
