// Lesson 21 — Roles, Audiences, and Formats
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-21",
  "num": 21,
  "arc": "Prompting Craft",
  "title": "Three Dials You Can Turn",
  "coreQuestion": "How do the hat, the reader, and the shape each move an answer, and why turn one at a time?",
  "blurb": "Three separate dials, not one. Turn each on purpose and watch the answer move.",
  "minutes": 17,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Same question, four answers",
      "scenario": "You ask an AI how to revise for a science test. Then you ask three more times in the same chat.\n\nOnce telling it to answer like a patient teacher. Once saying it is for someone who has never really revised before. Once asking for a numbered checklist.\n\nFour replies. All different.",
      "prompt": "Which of those three changes do you think moves the answer most? And are they even doing different jobs?"
    },
    {
      "kind": "reveal",
      "title": "Three dials, not one",
      "body": "Three things steer an answer, and each one moves a different part.\n\nThe hat. Who you ask it to sound like. 'Answer like a patient teacher.' This mostly changes the tone and what gets stressed.\n\nThe reader. Who the answer is for. 'Written for someone who has never revised before.' This changes how simple or advanced it gets.\n\nThe shape. How it sits on the page. 'As a numbered checklist.' This changes the layout.\n\nWhy any of this works: the AI has read an enormous amount of human writing, and it guesses what fits next. A teacher's words, a note for a beginner, and a numbered list are three different patterns in that writing. Naming one pulls the guess towards it.\n\nWhen we say it 'pretends to be a teacher', that is a comparison. It is not becoming anyone. It is leaning towards the kind of writing a teacher usually produces.\n\nOne thing that never changes. For real questions about health, money, or the law, treat the answer as a starting point. Check with someone qualified before you act.",
      "mistake": "Turning all three dials at once, so you cannot tell which one did the work.",
      "good": "Turning one dial at a time, so you can see exactly what each one moves."
    },
    {
      "kind": "classify",
      "title": "Which dial is this?",
      "prompt": "Each phrase turns one dial. Sort it by what it changes: the hat, the reader, or the shape.",
      "buckets": [
        "The hat",
        "The reader",
        "The shape"
      ],
      "items": [
        {
          "text": "answer like a strict examiner",
          "answer": 0
        },
        {
          "text": "as a numbered checklist",
          "answer": 2
        },
        {
          "text": "reply like a calm older sister",
          "answer": 0
        },
        {
          "text": "as a do and don't list",
          "answer": 2
        },
        {
          "text": "for someone who has never played the game before",
          "answer": 1
        },
        {
          "text": "give it to me as a short table",
          "answer": 2
        },
        {
          "text": "for someone fixing a bike with only the tools in the shed",
          "answer": 1
        }
      ],
      "reveal": "The hat changes the voice and what gets stressed. The reader changes how much it assumes you already know. The shape changes the layout. You can use all three together, but turn one at a time when you want to know what helped."
    },
    {
      "kind": "compare",
      "title": "The reader is its own dial",
      "weak": "How do I revise for a science test?",
      "strong": "How do I revise for a science test? Written for someone who has never really revised before.",
      "why": "The hat and the shape did not move. Only the reader did. Watch the second answer slow down, explain its words, and stop assuming things. That is the reader dial working on its own."
    },
    {
      "kind": "tryLive",
      "title": "Use all three on purpose",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use a harmless or made-up question. Do not paste names, private messages, health details, account details, or anything about another person. Answer like a [hat], written for [reader], as a [shape]: [your question].",
      "note": "Pick something low-stakes: explaining a game rule, comparing two ways to fix something, writing a made-up notice for an event. For real health, money, or legal questions, take the facts to someone qualified before you act."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your three-dial prompt",
      "cardType": "Prompt pattern",
      "fields": [
        {
          "key": "role",
          "label": "The hat (tone)",
          "placeholder": "a patient teacher"
        },
        {
          "key": "audience",
          "label": "The reader (how simple)",
          "placeholder": "someone who has never revised before"
        },
        {
          "key": "format",
          "label": "The shape (on the page)",
          "placeholder": "a numbered checklist"
        },
        {
          "key": "question",
          "label": "Your question",
          "placeholder": "how do I revise for a science test?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Show you can tell them apart",
      "question": "Pick a brand-new question, say how to look after a new pet. Ask it twice, changing only one dial and leaving everything else word for word the same. What shows you have got this?",
      "options": [
        {
          "text": "The two replies are clearly different. I can name the one dial I turned. And I can say what each dial does: the hat moves the tone, the reader moves how simple it is, the shape moves the layout.",
          "ok": true,
          "feedback": "That is it. Turning one dial is what proves which dial did the work, and naming all three shows you can tell them apart."
        },
        {
          "text": "The second reply is longer, so the change clearly worked.",
          "ok": false,
          "feedback": "Longer is not the test. Point at the specific difference your one change caused. You can only trust that if nothing else moved."
        },
        {
          "text": "I changed all three at once and the answer looks completely different.",
          "ok": false,
          "feedback": "Changing all three hides which one did the work. Turn exactly one, so the difference belongs to it."
        }
      ]
    }
  ]
};
