// Lesson 24 — Teachers & classrooms
// Arc: Applying   (authored)
export default {
  "id": "chapter-24",
  "num": 24,
  "arc": "Applying",
  "title": "Teachers & classrooms",
  "coreQuestion": "How can a teacher use AI without weakening student thinking?",
  "blurb": "AI can plan and give feedback — but student agency and privacy come first.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The helpful tool that backfires",
      "scenario": "A teacher uses AI to generate a worksheet and it quietly hands students every answer. Or pastes a class roster with names and grades into a chat. Both felt efficient. Both undercut the actual job: protecting student thinking and privacy.",
      "prompt": "How should a teacher use AI so students still do the learning?"
    },
    {
      "kind": "classify",
      "title": "Protects learning, or undercuts it?",
      "prompt": "Sort each classroom use of AI.",
      "buckets": [
        "Protects learning & privacy",
        "Undercuts it"
      ],
      "items": [
        {
          "text": "AI generates practice questions students must reason through",
          "answer": 0
        },
        {
          "text": "AI worksheet that includes all the answers students can copy",
          "answer": 1
        },
        {
          "text": "Teacher drafts feedback with AI, then personalizes it",
          "answer": 0
        },
        {
          "text": "Pasting students’ names and grades into a public AI chat",
          "answer": 1
        }
      ],
      "reveal": "Good classroom use gives students practice, keeps the teacher in the loop, and never exposes student data."
    },
    {
      "kind": "reveal",
      "title": "Plan and assist — don’t replace the thinking",
      "body": "Educators can use AI to plan lessons, draft feedback, and generate practice. The lines that protect students: activities should make students reason (not copy), the teacher reviews what AI produces, and no real student data goes into the tool.",
      "mistake": "Designing an activity where AI does the cognitive work the student was supposed to do.",
      "good": "Use AI to create practice and first-draft feedback; keep students thinking and data private."
    },
    {
      "kind": "tryLive",
      "title": "Build a learning-protecting activity",
      "prompt": "Create a 15-minute activity for [grade/subject] that uses AI to help students practice without giving them the answers. Then list any misconceptions it might cause and any privacy risks.",
      "react": "Read its activity. Does it make students reason, or just consume? Rewrite one step so the thinking stays with the student."
    },
    {
      "kind": "verify",
      "title": "Catch the answer-giving lesson plan",
      "claim": "An AI-made activity: “Students read the AI explanation and copy the worked example into their notes.”",
      "steps": [
        "Where in this do students actually have to think?",
        "Could a student finish it without understanding anything?",
        "Does any part expose real student names or data?",
        "How would I change one step to require reasoning?"
      ],
      "note": "If a student can complete it on autopilot, it’s a copying exercise, not a learning one."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your classroom AI rule",
      "cardType": "Classroom AI plan",
      "fields": [
        {
          "key": "use",
          "label": "I’ll use AI to…",
          "placeholder": "plan / draft feedback / make practice"
        },
        {
          "key": "protect",
          "label": "Students still must…",
          "placeholder": "reason, not copy"
        },
        {
          "key": "privacy",
          "label": "I’ll never put into AI…",
          "placeholder": "real student names or grades"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which classroom use of AI best protects student thinking?",
      "options": [
        {
          "text": "An AI worksheet with the answers included for efficiency",
          "ok": false,
          "feedback": "That hands students the answer — no thinking required."
        },
        {
          "text": "AI-generated practice questions students must reason through",
          "ok": true,
          "feedback": "Right — students do the work; AI just made the reps."
        },
        {
          "text": "Pasting the class roster in so AI can “personalize”",
          "ok": false,
          "feedback": "That’s a privacy violation, not personalization."
        }
      ]
    }
  ]
};
