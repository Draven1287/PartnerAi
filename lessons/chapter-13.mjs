// Lesson 13 — Better Follow-Ups
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-13",
  "num": 13,
  "arc": "Talking to AI",
  "title": "Better Follow-Ups",
  "coreQuestion": "When an answer is almost right, how do I fix it with one steering reply instead of starting over?",
  "blurb": "Nudge a so-so answer with one short reply — no deleting, no retyping.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer that's almost right",
      "scenario": "You asked for a thank-you note. You got one back — but it's six stiff sentences, too long and too formal for what you wanted. It's close. It's just not quite it.",
      "prompt": "Before you read on: what's your first instinct — delete it and write a better first prompt, or reply and fix the one you have?"
    },
    {
      "kind": "reveal",
      "title": "The second message is the control",
      "body": "Here's the real mechanism. AI learned patterns from huge amounts of human writing and predicts what words come next. Within one chat, it can see everything said so far — your question, its answer, and your reply. So a short follow-up like 'shorter, please' lands as 'redo that last thing, but shorter.' People say the AI 'remembers' — that's a comparison. What's really happening is your earlier messages are still sitting in front of it as it predicts the next ones. A brand-new chat can't see any of that, so you'd have to rebuild the whole request from scratch. That's why one line is enough to steer.",
      "mistake": "Scrapping a close answer and retyping the whole question — throwing away the part that was already good.",
      "good": "Sending ONE steering reply that keeps the good parts and changes just what's off."
    },
    {
      "kind": "compare",
      "title": "Rewrite vs. nudge",
      "weak": "Delete the answer, then retype the whole thing: 'Write me a warm, friendly thank-you note, four sentences, mentioning the dinner, not too formal, that sounds like me...'",
      "strong": "Just reply: 'That's close, but it's a bit too long and too formal. Keep the rest the same and just cut it to four sentences and make it sound friendlier.'",
      "why": "The nudge is a fraction of the typing and it keeps everything you already liked. The AI still sees the original answer, so 'keep the rest the same' has something concrete to hold onto."
    },
    {
      "kind": "classify",
      "title": "One change at a time",
      "prompt": "You want to steer an answer without losing what worked. Sort each follow-up into whether it changes ONE clear thing or piles on several at once.",
      "buckets": [
        "One clean nudge",
        "Too many at once"
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
          "text": "Rewrite the whole thing to be totally different.",
          "answer": 1
        }
      ],
      "reveal": "Change ONE thing per reply. Then you can see exactly what each nudge did — and if you don't like the result, you know which reply to undo. Piling on five changes at once hides which one actually mattered."
    },
    {
      "kind": "workflowChain",
      "title": "Steer one variable and keep the consequence visible",
      "goal": "Improve a message draft without losing your voice or changing five things at once.",
      "correct": [
        "Name the one part that is not working",
        "Protect the parts that already fit",
        "Request one observable change",
        "Compare the revision with the original goal",
        "Rewrite and approve the final message yourself"
      ],
      "choices": [
        "Protect the parts that already fit",
        "Rewrite and approve the final message yourself",
        "Name the one part that is not working",
        "Compare the revision with the original goal",
        "Request one observable change"
      ],
      "note": "If you test a follow-up outside LearningAI, use an invented draft or remove names, private messages, account details, and identifying information first."
    },
    {
      "kind": "tryLive",
      "title": "Send one nudge",
      "prompt": "That's close, but [what's off about it]. Keep the rest the same and just [the one change you want].",
      "note": "Fill the blanks with the single biggest problem and the specific fix. Example: 'That's close, but it's a bit too long and too formal. Keep the rest the same and just cut it to four sentences and make it sound friendlier.' Watch it adjust the same answer in place. If it's still off, nudge again — 'now add a line about the dinner' — never retyping the original request."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your three go-to nudges",
      "cardType": "Follow-up nudges",
      "fields": [
        {
          "key": "length",
          "label": "Length nudge",
          "placeholder": "e.g. 'shorter — about four sentences'"
        },
        {
          "key": "tone",
          "label": "Tone nudge",
          "placeholder": "e.g. 'warmer' or 'less like a textbook'"
        },
        {
          "key": "cut",
          "label": "Trim nudge",
          "placeholder": "e.g. 'drop the last part' or 'keep the rest the same'"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you steer it with follow-ups alone?",
      "question": "Take a FRESH answer you didn't love — a new question, not the thank-you note. Improve it using only follow-up replies, zero retyped prompts. When you land a better result, which is true?",
      "options": [
        {
          "text": "I fixed it with follow-up replies alone and can name the single nudge that did the work ('the shorter one fixed it').",
          "ok": true,
          "feedback": "That's the skill. You steered the answer you already had and you know which nudge mattered."
        },
        {
          "text": "I deleted it and wrote a stronger first prompt from scratch.",
          "ok": false,
          "feedback": "That's starting over — it works, but it throws away the good parts and it's not the skill here. Try again using only replies."
        },
        {
          "text": "I sent one reply changing five things at once and can't tell which fixed it.",
          "ok": false,
          "feedback": "Change one thing per reply. Otherwise you can't see which nudge did the work — or undo the one that didn't."
        }
      ]
    }
  ]
};
