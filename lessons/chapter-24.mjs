// Lesson 24 — Get It to Teach You
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-24",
  "num": 24,
  "arc": "Prompting Craft",
  "title": "Get It to Teach You",
  "coreQuestion": "How do I use AI to actually learn something, instead of getting an answer I forget by tomorrow?",
  "blurb": "Turn a wall of answer into a lesson in small steps, then prove it stuck by saying it back.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You had the answer an hour ago",
      "scenario": "You asked an AI to explain how interest works when someone borrows money. It gave you a neat, correct paragraph. You nodded and closed the tab.\n\nAn hour later a friend asks you the same thing. You open your mouth and nothing comes out.\n\nYou had the answer. It never made it into your head.",
      "prompt": "If you cannot explain it an hour later, did you learn it? Or did you just watch it go past?"
    },
    {
      "kind": "classify",
      "title": "Answer dump, or learning?",
      "prompt": "Two things look identical on screen and land completely differently. An answer dump is the whole finished result handed to you in one block. Learning is when the idea ends up in your head, so you can say it back later. Sort each moment.",
      "buckets": [
        "Answer dump",
        "Learning"
      ],
      "items": [
        {
          "text": "AI writes three tidy paragraphs. You copy them and move on.",
          "answer": 0
        },
        {
          "text": "AI teaches one small step, then stops to check you followed it.",
          "answer": 1
        },
        {
          "text": "You read a perfect explanation and cannot repeat it an hour later.",
          "answer": 0
        },
        {
          "text": "You say the whole idea back in your own words, without looking.",
          "answer": 1
        },
        {
          "text": "You got the right answer fast, so you assume you learned it.",
          "answer": 0
        }
      ],
      "reveal": "Fast and correct is not the same as understood. Having the answer and understanding the answer are two different things. Only one of them is still there tomorrow."
    },
    {
      "kind": "reveal",
      "title": "Make it teach you, then check you",
      "body": "Remember what it is doing. It has read an enormous amount of human writing, and it guesses the words that usually come next.\n\nIt has seen countless explanations. So it can walk you through an idea one small step at a time. It can also spot when your version sounds off.\n\nIt is natural to call that having a tutor. That comparison is useful. Here is what is really going on, though. It is not a person. It does not know you and it does not care whether you pass. It guesses helpful-sounding words, which means it can say something wrong with total confidence.\n\nThat is exactly why you say it back. You are not trusting it to pour knowledge into you. You are using it to find the bits that are still fuzzy in your own head. You stay the judge of whether the explanation is right.\n\nThis is also where the line sits. 'Do my homework for me' hands over the part that was meant to teach you. 'I am stuck on question 4, walk me through it' keeps the learning and still gets you moving.",
      "mistake": "Ask for the answer, read it, feel finished. Then confuse 'I saw a good explanation' with 'I understand this'.",
      "good": "Ask it to teach in small steps and stop after each one. Then say the whole thing back in your own words and let it flag the part you got wrong."
    },
    {
      "kind": "tryLive",
      "title": "Run the teaching loop",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Pick a public, low-stakes topic. Do not paste private schoolwork, names, grades, account details, or anything about another person. I want to understand [topic], not just get an answer. Teach me one small step, then stop and wait for my reply. Carry on only after I have had a go. At the end, ask me to explain it back, point out one gap, and tell me how to check the important fact somewhere outside this chat.",
      "note": "Good topics: a setting on your phone, a rule in a card game, how gears work on a bike, why bread rises, how interest works using made-up numbers. Explain it back without scrolling up. A correction from AI is not automatically true. If the fact matters, check it against instructions, a calculator, or a source that actually knows."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your teach-me prompt",
      "cardType": "Teach-Me Loop",
      "fields": [
        {
          "key": "topic",
          "label": "What I want to actually understand",
          "placeholder": "how interest grows on borrowed money, month by month"
        },
        {
          "key": "level",
          "label": "Where I am starting from",
          "placeholder": "total beginner — I know what borrowing is, nothing about interest"
        },
        {
          "key": "checkStep",
          "label": "The check that makes it stick",
          "placeholder": "stop after each step, then say the whole thing back from memory"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a brand-new topic",
      "question": "Pick something you have not touched today. A setting on your phone, a rule in a card game, why bread rises. Run the teaching loop, then look away from the screen and say the finished idea back in your own words. What tells you it worked?",
      "options": [
        {
          "text": "I said it back correctly from memory, either first go or after fixing the one bit it flagged.",
          "ok": true,
          "feedback": "That is the win. Saying it back without looking means the idea is in your head, not just on your screen."
        },
        {
          "text": "The explanation on screen looked complete and correct, so I am done.",
          "ok": false,
          "feedback": "A perfect explanation on screen is still a dump. You pass when you can say it back without peeking."
        },
        {
          "text": "I could not say it back without scrolling up to reread it.",
          "ok": false,
          "feedback": "That was a dump, not learning. Run the loop again. Saying it back is the part that makes it stick."
        },
        {
          "text": "I got the answer really fast, so I definitely learned it.",
          "ok": false,
          "feedback": "Fast and correct is not the same as understood. Test it by explaining it tomorrow, from memory."
        }
      ]
    }
  ]
};
