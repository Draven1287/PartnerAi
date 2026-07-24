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
      "scenario": "You need to remember something that matters tomorrow: the steps for a first shift, the chords for a song, the rules for a permit test, or facts for a quiz. An AI gives you a tidy explanation. You read it, nod, and close the tab feeling ready.",
      "prompt": "Which consequence would expose the gap: explaining it without the screen, doing the steps in order, or recognizing the answer only after someone shows it to you? Choose the proof that fits your task."
    },
    {
      "kind": "reveal",
      "title": "You do the knowing; it does the testing",
      "body": "An AI assistant is not a teacher who knows your subject. It learned patterns from huge amounts of human writing and predicts likely language. That makes it useful for generating practice questions and possible feedback — and means it can state a wrong fact confidently or mark a right answer wrong. Learning happens when YOU retrieve, perform, or explain the skill. Use the assistant as a practice partner: it asks, you answer first, and you decide whether its feedback matches a trusted source or demonstration. Before using an outside assistant, remove real names, school or workplace details, account information, private messages, and another person's information. Data entered there leaves LearningAI. A made-up or public topic works for this lesson.",
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
      "note": "Use a narrow public or invented topic first — a game rule, a recipe method, a safety checklist, a song structure, or a course topic — with no personal data. Answer aloud or in writing BEFORE it responds. Choose one feedback claim to check against a manual, official page, instructor material, or a trusted demonstration. Do not use the assistant's second answer as proof of its first."
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
      "question": "On a fresh practical topic, answer three questions before seeing feedback and independently check one load-bearing claim. Which result is the strongest evidence that the learning is yours?",
      "options": [
        {
          "text": "I can explain or perform the corrected point without the screen, and the source or demonstration I checked supports it",
          "ok": true,
          "feedback": "That's the win — if you can teach that one point back from memory, the recall was yours, not the machine's."
        },
        {
          "text": "I can recognize the correction when I reread it, but I cannot produce it without the screen yet",
          "ok": false,
          "feedback": "That's recognizing, not remembering. Close the screen and try to say it from memory — that's the real test."
        },
        {
          "text": "I recalled every answer, but I did not check whether the assistant's answer key was accurate",
          "ok": false,
          "feedback": "It can mark a wrong answer right. Recall it yourself and spot-check anything that sounds off — you stay the judge."
        }
      ]
    }
  ]
};
