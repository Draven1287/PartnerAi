// Lesson 7 — Confidently Wrong
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-7",
  "num": 7,
  "arc": "How It Works",
  "title": "Sure-Sounding and Still Wrong",
  "coreQuestion": "Why can AI sound totally certain and still be wrong, and what should I do about it?",
  "blurb": "A made-up detail sounds exactly as sure as a true one. You cannot feel the difference. You have to check.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The smooth wrong answer",
      "scenario": "You ask an AI about your own town. Back come dates, names and numbers. Smooth, exact, completely sure of itself.\n\nOne of those facts is invented. Nothing in the wording gives it away. It reads exactly like the true parts.",
      "prompt": "Honest guess before you read on: if the AI were making something up, would it sound less sure?"
    },
    {
      "kind": "reveal",
      "title": "Meet the word: hallucination",
      "body": "When an AI states something false as if it were a fact, people call that a hallucination.\n\nIt is not lying. Lying needs someone who means to trick you, and there is nobody in there.\n\nHere is what is really going on. The AI writes by guessing which words fit next, over and over, from patterns in a huge amount of human writing. Its target is to sound right. Whether something is true is a different question, and it has no way to check.\n\nIt also has no 'I do not know' light inside. So when it reaches a gap in what it learned, it fills that gap smoothly with whatever fits.\n\nSome apps can now search the web while they answer. That helps. It does not fix this. They still make things up. So you still check.",
      "mistake": "Believing an answer because it sounded sure and gave exact numbers.",
      "good": "Treating a confident tone as worth nothing. A made-up detail arrives just as smooth, so you check instead of going by feel."
    },
    {
      "kind": "classify",
      "title": "Where would you spot the slip?",
      "prompt": "You want to catch a made-up fact on purpose. Sort each topic by whether you could check the answer straight away.",
      "buckets": [
        "Easy to catch a slip",
        "Hard to catch a slip"
      ],
      "items": [
        {
          "text": "The history of the town you grew up in",
          "answer": 0
        },
        {
          "text": "A meal you have cooked dozens of times",
          "answer": 0
        },
        {
          "text": "Your favourite band, and the exact dates their albums came out",
          "answer": 0
        },
        {
          "text": "A huge topic you barely know, like the history of France",
          "answer": 1
        },
        {
          "text": "The sport you play, and its exact rules and records",
          "answer": 0
        },
        {
          "text": "A basic definition anyone could look up in a second",
          "answer": 1
        }
      ],
      "reveal": "Narrow, personal topics are where the AI is most tempted to invent, and where you spot it instantly, because you already know. Big general topics are harder: either you cannot tell, or it is easy to get right."
    },
    {
      "kind": "workflowChain",
      "title": "Set up a fair, safe test",
      "goal": "Test a claim you can check, without giving away anyone's private details.",
      "correct": [
        "Pick a public topic you know well, where being wrong costs nothing",
        "Take out names and private details the test does not need",
        "Ask for exact facts, not a vague summary",
        "Mark the one detail that most needs checking",
        "Pick somewhere else to check it"
      ],
      "choices": [
        "Pick somewhere else to check it",
        "Ask for exact facts, not a vague summary",
        "Take out names and private details the test does not need",
        "Mark the one detail that most needs checking",
        "Pick a public topic you know well, where being wrong costs nothing"
      ],
      "note": "If you carry on in an outside app, your words leave LearningAI. Use public facts or a made-up topic. Never a private story, someone else's details, or an account number."
    },
    {
      "kind": "tryLive",
      "title": "Catch one yourself",
      "prompt": "Tell me everything you know about [something you know really well], with exact dates, names and numbers. Be detailed.",
      "note": "Fill the blank with something small where you are the expert. 'The town of Marshall where I grew up, its history and anyone famous from there' — not 'small towns'. Keep it to public facts, or facts about yourself. No private details about other people. Read the answer slowly. Hunt for the one thing that is off: a wrong date, a muddled name, something close but not right. When you find it, notice how sure that wrong sentence sounded. That confidence was worth nothing. That is the lesson, proved by you."
    },
    {
      "kind": "verify",
      "title": "The real move: check one detail",
      "claim": "An answer about a topic you know well contains a suspiciously exact fact, such as 'the town was founded in 1847'.",
      "steps": [
        "Point at the ONE detail most likely to be wrong, and say out loud why you doubt it.",
        "Check that single detail somewhere else: your own memory, a search, or a person who would know.",
        "Say whether it held up. It is fine if the AI was right. The skill is checking, not catching it out."
      ],
      "note": "This is not about trapping the AI. It is about building the habit of checking before you repeat it, quote it, or hand it in."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your sure-but-wrong card",
      "cardType": "Trust check",
      "fields": [
        {
          "key": "topic",
          "label": "A topic I know inside out",
          "placeholder": "the town where I grew up"
        },
        {
          "key": "suspect",
          "label": "The detail I would doubt first",
          "placeholder": "an exact date, or a name I have never heard"
        },
        {
          "key": "checkWith",
          "label": "Where I would check it",
          "placeholder": "my own memory, a quick search, someone who would know"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Show the skill",
      "question": "Try a brand-new topic you know well. A meal you have made for years. A place you have lived. A film you have seen ten times. The answer comes back confident and detailed. What shows you have got this?",
      "options": [
        {
          "text": "Point at the one detail I doubt most, say why, check it somewhere else, and say whether it held up.",
          "ok": true,
          "feedback": "That is it. Naming a suspect detail and actually checking it is the skill, even when the AI turns out right."
        },
        {
          "text": "Skim it, and take it as correct because it sounded sure and exact.",
          "ok": false,
          "feedback": "That is the trap. A made-up detail sounds as sure as a true one. Confidence proves nothing."
        },
        {
          "text": "Assume the whole answer is made up and throw all of it away.",
          "ok": false,
          "feedback": "Too far the other way. The skill is picking one suspect detail and checking that one thing."
        },
        {
          "text": "Ask the AI 'are you sure?' and believe it if it says yes.",
          "ok": false,
          "feedback": "It has no 'I do not know' light. It will often repeat a made-up fact just as smoothly. Check elsewhere."
        }
      ]
    }
  ]
};
