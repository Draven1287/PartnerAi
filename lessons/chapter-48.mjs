// Lesson 48 — Teach Someone Else
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-48",
  "num": 48,
  "arc": "Becoming a Builder",
  "title": "Teach Someone Else",
  "coreQuestion": "How do I know I truly understand something about AI?",
  "blurb": "The hardest test of understanding: explain one AI idea to a real person, out loud.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The test you can't fake",
      "scenario": "You've learned a lot in this course. But here's a question: could you explain any of it to your dad, your roommate, or a nervous friend in under two minutes, out loud, with no jargon? Not read it back. Explain it so they get it.",
      "prompt": "Before you read on: which ONE thing you learned would you most want a real friend to know about AI? Say it in a single sentence, right now."
    },
    {
      "kind": "reveal",
      "title": "If you can teach it, you own it",
      "body": "Teaching is the hardest test of understanding you can pass. You don't need to be an expert to do it. You only need to be one step ahead of the person in front of you, and after this course, you are. The thing you're teaching about is a tool that learned patterns from huge amounts of human writing and predicts what words come next. That's the honest core mechanism. Teach THAT, not a put-down and not magic.",
      "mistake": "Telling yourself: 'I'm still a beginner, so I'm not qualified to teach anyone anything yet.' Or teaching a caricature: 'it just autocompletes' (sells short how capable it is) or 'it thinks like a person' (it doesn't).",
      "good": "Pick one true idea and explain it plainly to someone one step behind you: 'AI predicts the most likely next words from patterns in human writing, so it can sound completely sure and still be wrong. Double-check anything that matters.'"
    },
    {
      "kind": "classify",
      "title": "Is that the honest core?",
      "prompt": "You're deciding how to explain AI to a friend. Sort each way of putting it: does it teach the honest mechanism, or does it distort it?",
      "buckets": [
        "Honest core",
        "Distortion"
      ],
      "items": [
        {
          "text": "It learned patterns from tons of human writing and predicts what's likely to come next.",
          "answer": 0
        },
        {
          "text": "It's just fancy autocomplete, nothing more.",
          "answer": 1
        },
        {
          "text": "It thinks and reasons like a person does.",
          "answer": 1
        },
        {
          "text": "It can sound totally sure and still be wrong, so check anything that matters.",
          "answer": 0
        },
        {
          "text": "It's basically magic, no one really knows how it works.",
          "answer": 1
        }
      ],
      "reveal": "The honest core is 'predicts the most likely next words from patterns.' That one framing beats both the put-down ('just autocomplete') and the hype ('it thinks' / 'it's magic'). When you teach, teach the real thing."
    },
    {
      "kind": "tryLive",
      "title": "Boil it down, then rehearse",
      "prompt": "Help me teach [the one thing I learned] to [who I'm teaching, in their words] in under 2 minutes. Give me: (1) a dead-simple explanation in plain words with no jargon, (2) one tiny example they can try themselves right now, and (3) an honest one-line caution if there is one. Then act as [that same person] and ask me the single question they'd most likely throw back, so I can practice my answer before I teach them for real.",
      "note": "Fill the blanks with a real person. Example: [the one thing] = 'AI guesses the next word from patterns, so it can be confident and wrong'; [who I'm teaching] = 'my dad, 64, who thinks AI is either magic or a scam and gets impatient with tech.' Heads up: when the AI plays your 'student,' that's a role-play, a comparison. What's really happening is it's predicting the kind of question a person like that usually asks. Useful for rehearsal, but the REAL human later is the whole point."
    },
    {
      "kind": "workflowChain",
      "title": "From idea to a real person",
      "goal": "Teach one real, live person one AI idea before you close this lesson.",
      "correct": [
        "Pick the ONE thing you'd most want a friend to know (one idea, not five).",
        "Name the actual person you'll teach and how they think about AI.",
        "Use the prompt to boil it down to a 2-minute plain-language explanation with one tiny try-it example.",
        "Rehearse on the AI playing your 'student' and answer the question it throws back.",
        "Teach the real human, out loud, in person, on a call, or by text.",
        "Write down the real question they actually asked you."
      ],
      "note": "The AI 'student' is just a rehearsal partner. Step 5 is the point: a real person, not the AI."
    },
    {
      "kind": "exitCheck",
      "title": "Did a real human engage?",
      "question": "You've taught your idea. How do you know you passed the toughest test in the course?",
      "options": [
        {
          "text": "A real, live person asked me a question I did NOT rehearse an answer for, and I can write that question down.",
          "ok": true,
          "feedback": "Yes. An unrehearsed question from a real human is proof someone actually engaged with your idea. Bonus if they tried your tiny example, or can now repeat the idea in their own words. That's ownership."
        },
        {
          "text": "The AI 'student' asked me a great question and I answered it well.",
          "ok": false,
          "feedback": "That's rehearsal, not the test. The AI predicts the question a person like that usually asks. You still need to teach a real, live human before you close this lesson."
        },
        {
          "text": "I could explain it perfectly in my head without saying it out loud.",
          "ok": false,
          "feedback": "Explaining it in your head is easy to fake. The test is teaching it out loud to a real person and having them engage back."
        },
        {
          "text": "I read my explanation aloud to myself twice.",
          "ok": false,
          "feedback": "Reading it back isn't teaching. You need a real person one step behind you who asks you something you didn't plan for."
        }
      ]
    }
  ]
};
