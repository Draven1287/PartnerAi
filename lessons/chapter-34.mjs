// Lesson 34 — Study with AI: Be Quizzed, Not Told
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-34",
  "num": 34,
  "arc": "AI & Being Human",
  "title": "Study with AI: Be Quizzed, Not Told",
  "coreQuestion": "How do I use AI to actually learn something, instead of letting it do the knowing for me?",
  "blurb": "Turn it into a quizmaster. It asks, you answer first, and your gaps show up while there is still time.",
  "minutes": 16,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The test is Friday",
      "scenario": "You need to remember something that matters tomorrow. The steps for a first shift. The chords for a song. The rules for a test.\n\nAn AI gives you a tidy explanation. You read it. It all makes sense.\n\nYou close the tab feeling ready.",
      "prompt": "What would show the gap? Explaining it with the screen shut. Doing the steps in order. Or spotting the right answer once somebody shows it to you. Pick the proof that fits your task."
    },
    {
      "kind": "reveal",
      "title": "You do the knowing. It does the testing.",
      "body": "The thing answering you is not a teacher who knows your subject. It has read an enormous amount of writing, and it guesses which words fit next.\n\nThat makes it good at inventing practice questions. It also means it can state a wrong fact with total confidence, or mark a right answer wrong.\n\nHere is the part people skip. Learning happens when you pull the answer out of your own head. Reading a clean explanation feels like learning and mostly is not.\n\nSo make it the one asking. It asks. You answer first, from memory. Then it tells you what you missed, and you decide whether that matches a source you trust.\n\nOne safety note. If you use an outside AI app, take out real names, your school or workplace, account details, private messages, and anything about another person. What you type there leaves LearningAI. A made-up or public topic is enough for this lesson.",
      "mistake": "Asking it to explain the topic, reading the tidy summary, and mistaking 'I recognise this' for 'I can say this'.",
      "good": "Asking it to quiz you one question at a time. Answering from memory first. Letting it show you only what you missed."
    },
    {
      "kind": "compare",
      "title": "Teach me, or test me",
      "weak": "\"Teach me the causes of World War I so I am ready for my test.\"",
      "strong": "\"Be my quizmaster for the causes of World War I. Ask me one question at a time. Wait for my answer. Then tell me only what I got wrong. Do not give answers away before I try.\"",
      "why": "The first one does the remembering for you. You just read. The second makes you do the remembering, and turns it into a tester that finds your holes. That is how a good tutor works. It is also the difference between recognising something and knowing it."
    },
    {
      "kind": "classify",
      "title": "Studying, or cheating yourself?",
      "prompt": "Sort each move. Does it help you learn, or does it take the learning away from you?",
      "buckets": [
        "Real studying",
        "Cheating yourself"
      ],
      "items": [
        {
          "text": "Answer each question in your own words before it says anything",
          "answer": 0
        },
        {
          "text": "Copy its paragraph straight onto your worksheet",
          "answer": 1
        },
        {
          "text": "Let it test you again on only the parts you got wrong",
          "answer": 0
        },
        {
          "text": "Ask for the answers first, so you can 'check' before you try",
          "answer": 1
        },
        {
          "text": "Look up a fact it stated that sounded a bit off to you",
          "answer": 0
        }
      ],
      "reveal": "Being asked questions is exactly how good tutoring works. Copying its answers is the swap this whole course is about: it hands over the part that was meant to teach you. And since it can invent a fact or mark you wrongly, checking the odd-sounding claim is part of studying."
    },
    {
      "kind": "tryLive",
      "title": "Run your own quizmaster",
      "prompt": "Be my quizmaster for [topic], at the level of [the test, class, or skill]. Ask me one question at a time and wait for my answer before saying anything. After each answer, tell me if I am right, explain only what I got wrong, and do not give the answer away before I try. After [number] questions, list the gaps you noticed so I know what to go back over. Do not write my answers for me.",
      "note": "Start with a narrow public or made-up topic. A game rule, a recipe, a safety checklist, a song, a class topic. No private details about you or anyone else. Answer out loud or in writing BEFORE it replies. Then pick one thing it told you and check it against a manual, an official page, your teacher, or somebody who can show you. Do not use its second answer as proof of its first."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your quizmaster card",
      "cardType": "Quizmaster request",
      "fields": [
        {
          "key": "topic",
          "label": "The exact topic",
          "placeholder": "the causes of World War I"
        },
        {
          "key": "level",
          "label": "The test, class, or skill",
          "placeholder": "a history test this Friday"
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
      "title": "Prove the remembering was yours",
      "question": "On a new topic, you answer three questions before seeing any feedback. You also check one important claim yourself. Which result is the strongest sign the learning is yours?",
      "options": [
        {
          "text": "I can explain or do the corrected point with the screen shut, and what I checked backs it up",
          "ok": true,
          "feedback": "That is the win. If you can teach that one point back from memory, the remembering was yours."
        },
        {
          "text": "I recognise the correction when I read it again, but I cannot say it without the screen yet",
          "ok": false,
          "feedback": "That is recognising, not remembering. Shut the screen and try to say it. That is the real test."
        },
        {
          "text": "I got every answer right, but I never checked whether its marking was accurate",
          "ok": false,
          "feedback": "It can mark a wrong answer right. Recall it yourself, and check anything that sounds off. You stay the judge."
        }
      ]
    }
  ]
};
