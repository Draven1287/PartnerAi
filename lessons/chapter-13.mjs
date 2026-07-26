// Lesson 13 — Better Follow-Ups
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-13",
  "num": 13,
  "arc": "Talking to AI",
  "title": "Fix It With One Reply",
  "coreQuestion": "When an answer is almost right, how do I fix it with one short reply instead of starting again?",
  "blurb": "Nudge a nearly-right answer with one line. No deleting, no retyping.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer that is almost right",
      "scenario": "You asked for a thank-you message for your aunt. What came back is six stiff sentences. Too long, too formal, nothing like how you talk.\n\nIt is close. It is just not quite it.",
      "prompt": "Before you read on, what is your first instinct? Delete it and write a better question? Or reply and fix the one you have?"
    },
    {
      "kind": "reveal",
      "title": "The second message is the steering wheel",
      "body": "Here is what is really going on. Inside one chat, the AI can see everything said so far. Your question, its answer, and now your reply.\n\nSo a short line like 'shorter, please' arrives as 'redo that last thing, but shorter'.\n\nPeople say the AI remembers. That is a comparison, not the truth. Your earlier messages are simply still sitting in front of it while it guesses the next ones.\n\nStart a brand-new chat and it can see none of that. You would have to build the whole request again from scratch.\n\nThat is why one line is enough to steer.",
      "mistake": "Scrapping a close answer and retyping the whole question, throwing away the part that already worked.",
      "good": "Sending ONE reply that keeps the good parts and changes only what is off."
    },
    {
      "kind": "compare",
      "title": "Retype it, or nudge it",
      "weak": "Delete the answer, then retype everything: 'Write me a warm, friendly thank-you message, four sentences, mentioning the dinner, not too formal, that sounds like me...'",
      "strong": "Just reply: 'That is close, but it is too long and too formal. Keep the rest the same. Cut it to four sentences and make it friendlier.'",
      "why": "The nudge is a fraction of the typing and it keeps everything you already liked. The AI can still see its own answer, so 'keep the rest the same' has something real to hold onto."
    },
    {
      "kind": "classify",
      "title": "One change at a time",
      "prompt": "You want to steer an answer without losing what worked. Sort each reply by whether it changes ONE clear thing or piles on several.",
      "buckets": [
        "One clean nudge",
        "Too much at once"
      ],
      "items": [
        {
          "text": "Make it shorter — about four sentences.",
          "answer": 0
        },
        {
          "text": "Make it warmer.",
          "answer": 0
        },
        {
          "text": "Make it shorter, warmer, add a joke, and change the ending.",
          "answer": 1
        },
        {
          "text": "Drop the last paragraph.",
          "answer": 0
        },
        {
          "text": "Rewrite the whole thing completely differently.",
          "answer": 1
        }
      ],
      "reveal": "Change ONE thing per reply. Then you can see exactly what each nudge did. If you do not like the result, you know which reply to undo. Five changes at once hide which one mattered."
    },
    {
      "kind": "workflowChain",
      "title": "Change one thing and keep the result visible",
      "goal": "Improve a message without losing your voice or changing five things at once.",
      "correct": [
        "Name the one part that is not working",
        "Protect the parts that already fit",
        "Ask for one change you could point at",
        "Compare the new version with what you actually wanted",
        "Rewrite it and approve the final message yourself"
      ],
      "choices": [
        "Protect the parts that already fit",
        "Rewrite it and approve the final message yourself",
        "Name the one part that is not working",
        "Compare the new version with what you actually wanted",
        "Ask for one change you could point at"
      ],
      "note": "If you test a follow-up outside LearningAI, use a made-up draft, or take out names, private messages, and account details first."
    },
    {
      "kind": "tryLive",
      "title": "Send one nudge",
      "prompt": "That is close, but [what is off about it]. Keep the rest the same and just [the one change you want].",
      "note": "Fill the blanks with the single biggest problem and the exact fix. Example: 'That is close, but it is too long and too formal. Keep the rest the same and just cut it to four sentences and make it friendlier.' Watch it adjust the same answer in place. Still off? Nudge again — 'now add a line about the dinner' — without ever retyping the original question. This works on homework help too: 'that explanation lost me at step 3, explain just that step with an example'."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your three go-to nudges",
      "cardType": "Follow-up nudges",
      "fields": [
        {
          "key": "length",
          "label": "My length nudge",
          "placeholder": "shorter — about four sentences"
        },
        {
          "key": "tone",
          "label": "My tone nudge",
          "placeholder": "warmer, or less like a textbook"
        },
        {
          "key": "cut",
          "label": "My trim nudge",
          "placeholder": "drop the last part, keep the rest the same"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you steer it with replies alone?",
      "question": "Take a fresh answer you did not like. A new question, not the thank-you message. Improve it using replies only, with nothing retyped. When it comes good, which is true?",
      "options": [
        {
          "text": "I fixed it with replies alone, and I can name the one nudge that did the work.",
          "ok": true,
          "feedback": "That is the skill. You steered the answer you already had, and you know which nudge mattered."
        },
        {
          "text": "I deleted it and wrote a stronger question from scratch.",
          "ok": false,
          "feedback": "That is starting over. It works, but it throws away the good parts, and it is not the skill here. Try again with replies only."
        },
        {
          "text": "I sent one reply changing five things, and I cannot tell which one fixed it.",
          "ok": false,
          "feedback": "Change one thing per reply. Otherwise you cannot see which nudge worked, or undo the one that did not."
        }
      ]
    }
  ]
};
