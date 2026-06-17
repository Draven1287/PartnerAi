// Lesson 16 — Privacy & personal data
// Arc: Judgment & Safety   (authored)
export default {
  "id": "chapter-16",
  "num": 16,
  "arc": "Judgment & Safety",
  "title": "Privacy & personal data",
  "coreQuestion": "Would I be okay if this prompt became public?",
  "blurb": "Some things should never be pasted into a chat box. Learn the line.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The paste you can’t take back",
      "scenario": "You’re about to paste a screenshot into AI to “just ask a quick question.” It happens to include a full name, an address, a grade, and a message thread. Once it’s sent, you don’t control where it goes.",
      "prompt": "What’s your rule for deciding what’s safe to put in an AI chat?"
    },
    {
      "kind": "classify",
      "title": "Safe, redact, or never?",
      "prompt": "Sort what should go into an AI chat, what should be removed first, and what should never go in.",
      "buckets": [
        "Safe to share",
        "Remove it first"
      ],
      "items": [
        {
          "text": "A general homework question with no names",
          "answer": 0
        },
        {
          "text": "A classmate’s full name, address, and grades",
          "answer": 1
        },
        {
          "text": "A made-up example instead of the real person",
          "answer": 0
        },
        {
          "text": "A screenshot showing private messages and faces",
          "answer": 1
        }
      ],
      "reveal": "Strip names, contact info, health, finances, and other people’s data before you paste. Use a stand-in."
    },
    {
      "kind": "reveal",
      "title": "Treat the chat box like a postcard",
      "body": "Assume anything you type into AI could be stored, reviewed, or seen by someone else. Names, grades, health info, finances, addresses, and screenshots of private chats deserve extra caution — especially other people’s data, which isn’t yours to share.",
      "mistake": "Pasting a real screenshot “for context” without checking what’s in it.",
      "good": "Redact first: replace real details with placeholders like [name] or [school]."
    },
    {
      "kind": "promptRepair",
      "title": "Redact a risky prompt",
      "weak": "My friend Jordan Lee at 14 Oak St keeps failing chem (got a 41) — write a message to their mom Ms. Lee about it.",
      "fields": [
        "What to remove",
        "Safe stand-in",
        "The actual ask"
      ],
      "strong": "A friend is struggling in chemistry and a parent wants to help. Write a kind, encouraging message a parent could send their teen about a low test grade — no names or personal details needed."
    },
    {
      "kind": "tryLive",
      "title": "Practice the redaction move",
      "prompt": "I’ll describe a real situation but I’m replacing private details with placeholders like [name] and [school]. Help me with: [your redacted situation].",
      "react": "Notice you got the help you needed without exposing anyone. Paste your redacted prompt — is there anything still identifying in it?"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your privacy redaction checklist",
      "cardType": "Privacy checklist",
      "fields": [
        {
          "key": "names",
          "label": "Names & contact info",
          "placeholder": "replace with [name], [address]"
        },
        {
          "key": "sensitive",
          "label": "Grades / health / money",
          "placeholder": "remove or generalize"
        },
        {
          "key": "others",
          "label": "Other people’s data",
          "placeholder": "not mine to share"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "You need AI’s help with a sensitive situation about a real person. Best move?",
      "options": [
        {
          "text": "Paste the real details so AI “understands fully”",
          "ok": false,
          "feedback": "You can’t un-send it — and it’s someone else’s data."
        },
        {
          "text": "Describe it with placeholders and no identifying details",
          "ok": true,
          "feedback": "Right — you get the help without exposing anyone."
        },
        {
          "text": "Screenshot the whole conversation for context",
          "ok": false,
          "feedback": "Screenshots leak names, faces, and info you didn’t notice."
        }
      ]
    }
  ]
};
