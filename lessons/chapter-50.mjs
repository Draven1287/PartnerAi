// Lesson 50 — Your Toolkit and Where to Go Next
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-50",
  "num": 50,
  "arc": "Becoming a Builder",
  "title": "Your Toolkit and Where to Go Next",
  "coreQuestion": "How do I get everything I learned onto one page, and prove it works on a job I have never seen?",
  "blurb": "Turn fifty lessons into one page you can open and use. Then finish.",
  "minutes": 20,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The week after the last lesson",
      "scenario": "It is a week from now. You open a fresh chat to write something real.\n\nEverything you practised here is scattered across fifty lessons. Your rule. The requests that worked. Your order of doing things. Your limits.\n\nYou half remember three of them. So you type blind, like before.",
      "prompt": "If everything you learned lived on ONE page you could open right now, what four things would be on it?"
    },
    {
      "kind": "reveal",
      "title": "A kit, not a pile of tricks",
      "body": "What you built is a way of working, not a bag of tricks. Keep it on one page.\n\nSix things belong there.\n\nYour rule, in one sentence. The requests you reuse. Your order of doing things. What you never hand over, and what an app may never touch. Where a person has to say yes. And how you record what you checked, and when you say AI helped.\n\nBefore an outside app sees that page, take out names, private examples, account details, confidential material, and anything about somebody else. What you type there leaves LearningAI. Test on made-up material first.\n\nIt can prepare and draft. You approve anything that gets sent, posted, paid for, deleted, or used to judge a person.\n\nCheck claims against sources you open yourself. Say that AI helped when the reader, customer, teacher or rule would want to know. Health, money, law and safety end with a professional who is answerable. In a crisis, reach a person or your local emergency service, not a chat app.",
      "mistake": "Closing the course and trusting your memory to hold fifty lessons' worth of moves.",
      "good": "Getting your pieces onto one saved page, then running it on something real the same day."
    },
    {
      "kind": "classify",
      "title": "Which piece is this?",
      "prompt": "Sort each line. Is it a line you hold, or a move you make? You are taking stock before you build the page.",
      "buckets": [
        "A line I hold",
        "A move I make"
      ],
      "items": [
        {
          "text": "I read and decide on anything before it goes out with my name on it.",
          "answer": 0
        },
        {
          "text": "Goal, background, limits, and what the answer should look like, for any draft.",
          "answer": 1
        },
        {
          "text": "Never paste anybody's private details into a chat.",
          "answer": 0
        },
        {
          "text": "Draft rough, ask it to pick the draft apart, rewrite in my words, check the facts, final read.",
          "answer": 1
        },
        {
          "text": "For health or money, it helps me prepare, but a real professional decides.",
          "answer": 0
        },
        {
          "text": "'Explain it back to me, then test me' when I am learning something.",
          "answer": 1
        }
      ],
      "reveal": "The lines are what keep you in charge. The moves are what get the work done. A real page has both. Lines without moves is a list of worries. Moves without lines is how people get burned."
    },
    {
      "kind": "tryLive",
      "title": "Build the page, then get tested on it",
      "prompt": "Help me organise my one-page kit. My rule: [rule]. Requests I reuse: [requests]. My order of doing things: [steps]. What I never hand over, and what an app may never touch: [limits]. Where a person has to say yes: [stops]. How I record what I checked, and when I say AI helped: [record]. Do not add anything it may touch, and do not add private examples. Then give me one made-up job in [a broad area] that needs at least three of those pieces. Do not solve it. Ask me to name what could go wrong, what it may touch, who approves, what proof I keep, and who I would tell before I start.",
      "note": "Use your own words, with anything identifying or confidential taken out. Broad areas: a community event, a repair, a game, something creative, a household plan, a job at work, or studying. Test with made-up material. It can tidy the page and set you a challenge. Your decisions and your written proof are what count."
    },
    {
      "kind": "toolkitSave",
      "title": "Save it somewhere you will actually find it",
      "cardType": "My one-page kit",
      "fields": [
        {
          "key": "rule",
          "label": "My rule, in one sentence",
          "placeholder": "I read and decide on anything before it goes out with my name on it."
        },
        {
          "key": "prompts",
          "label": "The requests I reuse",
          "placeholder": "Goal, background, limits and format for drafts. 'Explain it back, then test me' for learning. 'List what you assumed, the evidence, and one thing I should check' for decisions."
        },
        {
          "key": "workflow",
          "label": "My order of doing things",
          "placeholder": "1) draft rough 2) it picks the draft apart 3) I rewrite in my words 4) check the facts 5) final read."
        },
        {
          "key": "boundaries",
          "label": "My lines",
          "placeholder": "Never paste private details. Never send anything I have not read. Health and money: a real professional decides."
        },
        {
          "key": "home",
          "label": "Where I saved it",
          "placeholder": "A pinned note. A document called 'My AI kit'. A starred chat."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "The last check",
      "question": "You ran the made-up job using your own page. Which result means you actually passed, rather than answered a quiz?",
      "options": [
        {
          "text": "I finished a job I had never seen using at least three pieces. I can show what it was allowed to touch, where a person said yes, one fact I checked myself, and what I would tell people in the real version.",
          "ok": true,
          "feedback": "That is the end of the course. You did not recall a fact. You did the skill on something new, with your own kit. Now pick where to go next: work, school, creative, everyday life, or building things. Take one step in it."
        },
        {
          "text": "I tried three requests and the answers came out consistent, but I never said what it may touch or who approves anything.",
          "ok": false,
          "feedback": "Consistent answers do not show safe working. Add the least it needs, a named person who approves, and a record of what happened."
        },
        {
          "text": "I asked it to check my own page, and accepted its report because it had links and sounded confident.",
          "ok": false,
          "feedback": "It can suggest checks. Its confidence and its links are not the proof. Open the sources and test the controls yourself."
        },
        {
          "text": "I did the job and checked one claim, but next time I would let it post the result on its own.",
          "ok": false,
          "feedback": "The checking was strong. Posting on its own removes the place where you say yes. Keep a person's stop before anything leaves."
        }
      ]
    }
  ]
};
