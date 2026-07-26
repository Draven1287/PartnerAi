// Lesson 37 — Money, Shopping and Travel
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-37",
  "num": 37,
  "arc": "AI for Real Life",
  "title": "Money, Shopping and Travel",
  "coreQuestion": "How do I use AI to weigh up spending real money, without trusting a price it may have got wrong?",
  "blurb": "Let it lay out your choices. Then check the price yourself, on the page that takes your money.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The $89 deal that was not",
      "scenario": "You ask for the best cabin bag under $120.\n\nIt picks one at $89. But that one cannot be returned. The tougher bag costs $18 more.\n\nYour thumb is over the Buy button.",
      "prompt": "Decide your rule before you look again. Cheapest real total. Easiest to return. Toughest. Or not buying yet. Which one wins, and which claim could change your mind?"
    },
    {
      "kind": "reveal",
      "title": "It gives you leads, not a till",
      "body": "It is genuinely good at laying out your choices. It raises the questions you would forget to ask.\n\nBut it is not standing in the shop. It has read an enormous amount of writing, and it guesses which words come next. So a price it types is a good guess, not a scanned label.\n\nSome apps really can look at live web pages now. That helps a lot. Even then it can quote a page that is out of date. Or use a sale that ended last week. Or copy a number across wrong.\n\nSo people say it 'knows the price' the way a checkout knows a barcode. It does not. It guesses, and sometimes searches, and a search can still miss.\n\nTreat every price, deal and 'in stock' as a lead you go and check.",
      "mistake": "You see '$89, on sale', treat it as today's price, and buy. Then $119 comes off your card, because the sale ended last week.",
      "good": "You treat the $89 as a lead. You open the shop's own page for that bag and read the real number before spending anything."
    },
    {
      "kind": "classify",
      "title": "Checking means the page that takes your money",
      "prompt": "Checking means you open the real page yourself. The shop's own page. The airline's booking page. The bank's own rates page. Which of these count as checking a price?",
      "buckets": [
        "That is a real check",
        "Not enough"
      ],
      "items": [
        {
          "text": "Opening the shop's own page for that item and reading the price at checkout",
          "answer": 0
        },
        {
          "text": "Going to the airline's booking page for your dates and seeing the fare",
          "answer": 0
        },
        {
          "text": "Trusting the number the AI typed in its answer",
          "answer": 1
        },
        {
          "text": "Reading a 'best deals' blog that lists the sale price",
          "answer": 1
        },
        {
          "text": "Looking at a photo of the price somebody posted",
          "answer": 1
        },
        {
          "text": "Checking the number on the company's own prices page",
          "answer": 0
        }
      ],
      "reveal": "Trust the page that takes your money. Not a screenshot. Not a deals blog. Not the AI. The actual page where you would tap Buy."
    },
    {
      "kind": "tryLive",
      "title": "Run it on a real decision",
      "prompt": "Help me decide on [the thing I want to buy, book, or sign up for]. I can spend [amount and currency]. What matters most to me is [the thing you care about]. Compare [number] choices, with the honest downsides of each for my situation. Then list exactly what I should check myself before I commit, and name the real website where I would check each one. If you can look things up online, say so, and tell me the date on what you found.",
      "note": "A made-up or small decision works fine. Stay general. A rounded budget and what you care about is enough. Never your card number, account number, exact income, booking code, home address, or travel dates. What you type into an outside app leaves LearningAI. When it names a price or a rule, open the company's real page yourself before spending."
    },
    {
      "kind": "workflowChain",
      "title": "The order that catches the mistake",
      "goal": "Make one real decision about money, shopping or travel, and catch at least one wrong price or claim before you spend.",
      "correct": [
        "Name the decision you are actually facing right now",
        "Say what you can spend, and the one thing that matters most",
        "Ask it to compare two or three choices, with the honest downsides of each",
        "Ask what it would double-check before spending, and on which real website",
        "Open one of those real pages and confirm the key price or claim yourself",
        "Decide"
      ],
      "note": "The checking step is the whole point, not a bonus. It narrows the field. The real page confirms the number. For anything you sign, like a loan, insurance or a contract, take the final terms to a qualified person, not to a chat app."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your check",
      "cardType": "Compare, then check",
      "fields": [
        { "key": "tradeoff", "label": "What I am willing to give up", "placeholder": "Money, time, quality, risk, or being able to change my mind" },
        { "key": "source", "label": "Where I check the deciding claim", "placeholder": "The real seller, company, timetable, or rules page" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually check?",
      "question": "Take a new decision you have not used yet. Which of two subscriptions to keep, say, or the cheapest train home next month. Ask for the comparison, then open the real page for ONE price or claim. What lets you say you passed?",
      "options": [
        {
          "text": "I opened the real page and can finish this sentence. 'It told me the price was ___. On the real page it was ___, so I will or will not trust it.'",
          "ok": true,
          "feedback": "That is the skill. You did not guess. You opened the page that takes your money and compared. Match or gap, now you know."
        },
        {
          "text": "I checked the price on the shop's page, but not delivery, return fees, or whether it suits what I actually need",
          "ok": false,
          "feedback": "The sticker price is settled. The real total and the thing you care about are still open, and either could flip the decision."
        },
        {
          "text": "I opened the company's page and confirmed the total, but the page was for different dates and a different version",
          "ok": false,
          "feedback": "Right page, wrong item. Match the exact thing, the exact dates and the exact terms before you call a number checked."
        },
        {
          "text": "I confirmed both prices on their real pages, then took the cheaper one without thinking about its weaker returns policy",
          "ok": false,
          "feedback": "Both prices are checked. Your rule is not finished. Decide whether losing the right to return it is worth the saving."
        }
      ]
    }
  ]
};
