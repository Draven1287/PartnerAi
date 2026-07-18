// Lesson 34 — Study with AI: Be Quizzed, Not Told
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-34",
  "num": 34,
  "arc": "AI & Being Human",
  "title": "Study with AI: Be Quizzed, Not Told",
  "coreQuestion": "How do I use AI to actually learn a topic instead of letting it do the knowing for me?",
  "blurb": "Turn AI into a quizmaster that tests your recall and finds your gaps.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The test is Friday",
      "scenario": "You have a quiz Friday on the causes of World War I. You open an AI assistant and type: 'Explain the causes of World War I.' It writes three tidy paragraphs. You read them, nod, and close the tab feeling ready.",
      "prompt": "Before you read on: come Friday, will you be able to recall those causes from memory? Or did you just watch the AI know them for you?"
    },
    {
      "kind": "reveal",
      "title": "You do the knowing; it does the testing",
      "body": "An AI assistant is not a teacher who knows your subject. It learned patterns from huge amounts of human writing and predicts the most likely next words. That is the real mechanism. It makes AI brilliant at generating questions and spotting where you stumble — and it means it can state a wrong fact with total confidence, or even mark a right answer wrong. Learning happens when YOU do the recall. So use it as a quizmaster: it asks, you answer in your own words, it marks you and names your gaps — it never hands you answers up front. And it is not always right, so you stay the judge.",
      "mistake": "Ask it to explain the topic, read the clean summary, and mistake recognizing the answer for being able to recall it.",
      "good": "Ask it to quiz you one question at a time and wait; answer from memory first; let it mark you and reveal what you missed."
    },
    {
      "kind": "compare",
      "title": "Lecture me vs. quiz me",
      "weak": "\"Teach me the causes of World War I so I'm ready for my quiz.\"",
      "strong": "\"Be my study quizmaster for the causes of World War I. Ask me one question at a time, wait for my answer, then tell me only what I got wrong. Don't reveal answers before I try.\"",
      "why": "The first makes the AI do the recall — you just read. The second makes YOU do the recall and turns the AI into a tester that finds your gaps. That is how good tutoring actually works, and it's the difference between recognizing and remembering."
    },
    {
      "kind": "classify",
      "title": "Studying or cheating yourself?",
      "prompt": "Sort each move by whether it helps YOU learn or robs you of the learning.",
      "buckets": [
        "Real studying",
        "Cheating yourself"
      ],
      "items": [
        {
          "text": "Answer each quiz question in your own words before the AI says anything",
          "answer": 0
        },
        {
          "text": "Copy the AI's paragraph answer straight onto your worksheet",
          "answer": 1
        },
        {
          "text": "Let it re-test only the parts you got wrong",
          "answer": 0
        },
        {
          "text": "Ask it for the answer key so you can 'check' before you try",
          "answer": 1
        },
        {
          "text": "Spot-check a fact it stated that sounded off to you",
          "answer": 0
        }
      ],
      "reveal": "Being quizzed is exactly how good tutoring works. Copying its answers cheats you out of the learning. And because it can invent a 'fact' or mark you wrongly, spot-checking the odd-sounding claim is part of studying, not paranoia."
    },
    {
      "kind": "tryLive",
      "title": "Run your own quizmaster",
      "prompt": "Be my study quizmaster for [specific topic], at the level of [the test, class, or skill]. Ask me one question at a time and wait for my answer before saying anything. After each answer, tell me if I'm right, explain only what I got wrong, and don't reveal the answer before I try. After [number] questions, list the gaps you noticed so I know what to restudy. Do not write my answers for me.",
      "note": "Pick something you genuinely have to learn this week. Keep [specific topic] narrow — 'the causes of World War I,' not 'history' — so the questions stay sharp. Answer each one out loud or in writing BEFORE it responds. Try to get at least three wrong honestly (don't peek) so you can watch it find your gaps. Think of it like a flashcard partner who reads you a card and waits — but underneath it's predicting plausible questions and feedback, so when an answer sounds strange, check it instead of trusting it. AI is a study tool, not a teacher who knows your subject — you stay the judge."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your quizmaster card",
      "cardType": "Study quizmaster prompt",
      "fields": [
        {
          "key": "topic",
          "label": "Specific topic",
          "placeholder": "the causes of World War I"
        },
        {
          "key": "level",
          "label": "The test, class, or skill",
          "placeholder": "a 10th-grade history quiz this Friday"
        },
        {
          "key": "count",
          "label": "Questions before it lists my gaps",
          "placeholder": "5"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove the recall was yours",
      "question": "Run a SECOND round on a DIFFERENT topic you actually need. Answer at least three questions in your own words before peeking. Then, without looking at the screen, name one specific thing you got wrong earlier and explain why the right answer is right. Which outcome shows you actually learned it?",
      "options": [
        {
          "text": "I can say the corrected point aloud from memory and explain why it's right",
          "ok": true,
          "feedback": "That's the win — if you can teach that one point back from memory, the recall was yours, not the machine's."
        },
        {
          "text": "I re-read the AI's feedback on screen and it made sense",
          "ok": false,
          "feedback": "That's recognizing, not remembering. Close the screen and try to say it from memory — that's the real test."
        },
        {
          "text": "The AI told me I got everything right, so I'm done",
          "ok": false,
          "feedback": "It can mark a wrong answer right. Recall it yourself and spot-check anything that sounds off — you stay the judge."
        }
      ]
    }
  ]
};
