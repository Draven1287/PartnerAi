// Lesson 42 — Delegate the Work, Keep the Judgment
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-42",
  "num": 42,
  "arc": "Building with AI",
  "title": "Hand Over the Work, Keep the Calls",
  "coreQuestion": "Which parts of a real job can I hand over, and which parts have to stay mine?",
  "blurb": "Hand over the typing and the first draft. Keep the calls only you should be making.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Writing up what everyone did",
      "scenario": "A group project needs a fair write-up of what three people contributed.\n\nThat job is really four jobs. Gathering what actually happened. Finding good words. Deciding what is true and fair about each person. Getting it into the right format.\n\nYou open a chat app to speed it up.",
      "prompt": "Which of those four would you be uneasy handing over completely? And why that one?"
    },
    {
      "kind": "reveal",
      "title": "Hand over the work. Keep the calls.",
      "body": "Someone good at this does not hand over as much as possible. They protect the parts that land on people.\n\nAI can draft, sort and format. It cannot know what actually happened in your group. It cannot ask anyone if that is okay. It cannot weigh a friendship. And it carries nothing if it goes wrong.\n\nSo keep a part yourself when any of these is true. It has to be true. It carries what you believe. It affects somebody. Somebody else has to agree to it. It goes out with your name on it.\n\nHand over the rest, but only work you can undo, and only if you are going to read it before it goes anywhere.\n\nBefore an outside app sees anything, take out names, contact details, private messages, anything about how somebody is performing, and anything belonging to another person. What you type there leaves LearningAI.",
      "mistake": "Typing 'write the reviews for my three teammates' and pasting the answer straight in.",
      "good": "Letting it find warm wording from YOUR notes, while you decide what is true and fair about each person. And keeping private details about named people on your side of the line."
    },
    {
      "kind": "classify",
      "title": "Run the keep test",
      "prompt": "Sort each part. Hand over means typing, drafting, formatting, sorting, and you still read it. Keep means it has to be true about real people, it carries what you believe, or your name is on it.",
      "buckets": [
        "Hand it over",
        "Keep it myself"
      ],
      "items": [
        {
          "text": "Find warm wording from the notes I paste in",
          "answer": 0
        },
        {
          "text": "Decide what each person actually did well this year",
          "answer": 1
        },
        {
          "text": "Put the finished text into the right format",
          "answer": 0
        },
        {
          "text": "Judge whether the tone is fair and even across all three",
          "answer": 1
        },
        {
          "text": "Cut a long project document down to three bullet points",
          "answer": 0
        },
        {
          "text": "Decide which private details about a named person go in",
          "answer": 1
        }
      ],
      "reveal": "The hand-over parts are labour. Drafting, formatting, shortening. You still read them before they go. The keep parts all pass the same test: they must be true about real people, or your name is on the call. It cannot check what your teammates did, even with the whole web open. So what happened, and what is fair, stay yours."
    },
    {
      "kind": "tryLive",
      "title": "Get the map of parts",
      "prompt": "Here is a job I need to do: [your job]. Break it into its separate parts. For each part, say whether I should hand it to you or do it myself. Flag any part where my own judgement, my values, or what I know about real people matters, and explain why in one line. Do not do the job yet. Just give me the map.",
      "note": "Use a real or made-up job with several parts. Planning a meal, an event, a games night, a handover at work, a repair, an application, a group project. Give it nothing that identifies anyone. Then hand it one part you could undo, keep one part yourself, and write down who has to approve before anything is sent, posted, booked, marked, or paid for."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your keep test",
      "cardType": "Hand over or do it myself",
      "fields": [
        {
          "key": "task",
          "label": "A job I will do this week",
          "placeholder": "e.g. plan my sister's birthday dinner"
        },
        {
          "key": "delegate",
          "label": "One part I will hand over",
          "placeholder": "e.g. draft the invitation and list some places"
        },
        {
          "key": "keep",
          "label": "One part I will keep",
          "placeholder": "e.g. deciding who gets invited"
        },
        {
          "key": "why",
          "label": "One word for why that part is mine",
          "placeholder": "true? values? people? my name?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a new job",
      "question": "New job. Choosing a course, a job, a volunteering role, or something expensive, and writing the application. Which split keeps a person responsible?",
      "options": [
        {
          "text": "Hand over: tidy up and format my rough draft. Keep: the choice, every claim about me, and the final yes before it is sent.",
          "ok": true,
          "feedback": "That is it. You handed over the labour and kept the parts that must be true and carry your name."
        },
        {
          "text": "Hand over: compare the options and rank which suits me. Keep: rewriting the winner in my own words, and sending it.",
          "ok": false,
          "feedback": "The wording is yours, but you gave away the choice. Keep what counts as a good fit, and let it organise or format instead."
        },
        {
          "text": "Hand over: write the claims about me from my notes. Keep: the formatting, because the form has my name on it.",
          "ok": false,
          "feedback": "Formatting is undoable labour. The claims about you need your evidence and your yes. It can help with wording after you decide what is true."
        }
      ]
    }
  ]
};
