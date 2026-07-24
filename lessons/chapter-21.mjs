// Lesson 21 — Roles, Audiences, and Formats
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-21",
  "num": 21,
  "arc": "Prompting Craft",
  "title": "Roles, Audiences, and Formats",
  "coreQuestion": "How do role, audience, and format each steer an AI's answer differently, and why should I turn one dial at a time?",
  "blurb": "Three separate dials, not one — turn each on purpose and watch the answer move.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Same question, four answers",
      "scenario": "You ask an AI 'how do I parallel park?' Then you ask it three more times in the same chat — once telling it to answer as a patient driving instructor, once for someone who has never driven, once as a numbered checklist. All four replies come back looking different.",
      "prompt": "Before you read on: which of those three changes do you think reshapes the answer the most — the role, the audience, or the format? And do they even do different things?"
    },
    {
      "kind": "reveal",
      "title": "Three dials, not one",
      "body": "Role, audience, and format are three separate dials, and each reshapes a different part of the answer. Role = the hat you ask it to wear ('answer as a patient driving instructor') — this mostly shifts the tone and what gets stressed. Audience = who the answer is for ('written for someone who has never driven') — this shifts how simple or advanced it gets. Format = the shape on the page ('as a numbered checklist') — this shifts the layout. Here's the quick why: AI learned patterns from huge amounts of human writing and predicts what fits next. An instructor's words, a note for a beginner, and a numbered list are three different patterns in that text, so naming one steers the prediction toward it. (When we say it 'pretends to be a role,' that's a comparison for convenience — it isn't really becoming anyone; it's leaning toward the kind of text that role usually produces.) One safety note that never changes: for real health, money, or legal questions, treat the AI's answer as a starting point and check with a qualified person before you act on it.",
      "mistake": "Adding a role, an audience, and a format all at once — then you can't tell which change did the work.",
      "good": "Turn one dial at a time so you can see exactly what each one moves."
    },
    {
      "kind": "classify",
      "title": "Which dial is this?",
      "prompt": "Each phrase turns one dial. Sort it by what it changes: role, audience, or format.",
      "buckets": [
        "Role",
        "Audience",
        "Format"
      ],
      "items": [
        {
          "text": "answer as a strict examiner",
          "answer": 0
        },
        {
          "text": "as a numbered checklist",
          "answer": 2
        },
        {
          "text": "reply as a calm HR person",
          "answer": 0
        },
        {
          "text": "in the form of a do / don't list",
          "answer": 2
        },
        {
          "text": "for a first-time renter who does not know the vocabulary",
          "answer": 1
        },
        {
          "text": "give it to me as a short table",
          "answer": 2
        },
        {
          "text": "for someone repairing a bike with basic tools",
          "answer": 1
        }
      ],
      "reveal": "Role changes voice and emphasis. Audience changes assumed knowledge and examples. Format changes the shape on the page. You can combine them, but test one change at a time when you want to know what helped."
    },
    {
      "kind": "compare",
      "title": "Audience is its own dial",
      "weak": "How do I parallel park?",
      "strong": "How do I parallel park? Written for someone who has never driven.",
      "why": "The role and format stayed the same — only the audience changed. Watch how the second answer slows down, defines terms, and skips assumptions. That simpler, more careful pitch is the audience dial doing its work, separate from tone (role) and layout (format)."
    },
    {
      "kind": "tryLive",
      "title": "Combine all three on purpose",
      "prompt": "This optional step uses an external assistant, so anything entered leaves LearningAI. Use a harmless or invented question; do not paste names, private messages, health details, account information, or another person's data. Answer as a [role], written for [audience], in the form of a [format]: [your question].",
      "note": "Try a public, low-stakes task such as explaining a game rule, comparing repair steps, or writing an invented event notice. For real health, money, or legal questions, take the facts to a qualified person before acting."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your three-dial prompt",
      "cardType": "Prompt pattern",
      "fields": [
        {
          "key": "role",
          "label": "Role (tone / emphasis)",
          "placeholder": "a patient driving instructor"
        },
        {
          "key": "audience",
          "label": "Audience (how simple or advanced)",
          "placeholder": "someone who has never driven"
        },
        {
          "key": "format",
          "label": "Format (shape on the page)",
          "placeholder": "a numbered checklist"
        },
        {
          "key": "question",
          "label": "Your question",
          "placeholder": "how do I parallel park?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you can tell the dials apart",
      "question": "Pick a brand-new question (say, 'how do I plant tomatoes?'). Ask it twice, changing ONLY ONE dial between the tries and leaving everything else identical. What proves you've got this?",
      "options": [
        {
          "text": "The two replies are clearly different, I can name the single dial I turned, and I can say in one line what each of the three dials changes — role (tone/emphasis), audience (how simple or advanced), format (the shape on the page).",
          "ok": true,
          "feedback": "That's it. Isolating one dial is what proves you know which one did the work — and naming all three shows you can tell them apart."
        },
        {
          "text": "The second reply is longer than the first, so the change clearly worked.",
          "ok": false,
          "feedback": "Longer isn't the test. You need to point to the specific difference the one dial caused — and you can only trust that if you changed nothing else."
        },
        {
          "text": "I changed the role, audience, and format all at once and the answer looks totally different.",
          "ok": false,
          "feedback": "Changing all three hides which one did the work. Turn exactly one dial so the difference is traceable to that dial."
        }
      ]
    }
  ]
};
