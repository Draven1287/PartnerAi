// Lesson 45 — Designing and Making
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-45",
  "num": 45,
  "arc": "Building with AI",
  "title": "Designing and Making",
  "coreQuestion": "How do I design a tiny tool with AI, test it properly, and still understand what I made?",
  "blurb": "Start with one small annoyance. Test the case where it breaks. Keep a way back to what worked.",
  "minutes": 15,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The impressive thing you cannot undo",
      "scenario": "You ask for a shortcut, and back comes something that looks finished. Maybe some code. Maybe a spreadsheet formula.\n\nYou cannot explain what it does. You have not tried feeding it anything strange. You do not know how to get back to the version that worked.\n\nPointing it at your real files would turn a bit of learning into a gamble.",
      "prompt": "What would you need to understand, test, and be able to undo before this thing was allowed near anything real?"
    },
    {
      "kind": "reveal",
      "title": "'It runs' is the start, not the finish",
      "body": "You do not have to run any code to do this lesson.\n\nPick the safest route that works on whatever you already own. Sketch the screens on paper. Write it as a checklist. Lay out an empty spreadsheet. Describe one page in words.\n\nThose are real work, not the easy option. A rough first version on paper tells you more than code you cannot read.\n\nIf you do want code, only use a throwaway space in your browser that cannot touch your files. Nothing installed. No passwords. No accounts. No real documents.\n\nThen, whichever route you took: save a copy that works before every change. Try one ordinary made-up example. Try one deliberately awkward one. And write down how you get back to the good copy before you run anything.\n\nFor this lesson, never let it into your folders, contacts, payments, messages, or anything that can post or delete.",
      "mistake": "Pasting code or formulas into something real first, and planning to work out the risks afterwards.",
      "good": "Making the smallest version you can, guessing where it will break, testing it with made-up examples, and proving you can get back."
    },
    {
      "kind": "classify",
      "title": "Which annoyance fits a tiny tool?",
      "prompt": "A tiny tool suits a small job that keeps coming back and has a clear finish. Sort each annoyance. Good fit, or too big and vague?",
      "buckets": [
        "Good fit for a tiny tool",
        "Too big or too vague"
      ],
      "items": [
        {
          "text": "Every week I add up my spending by hand and it takes ages",
          "answer": 0
        },
        {
          "text": "I want a suggested naming plan for six made-up file names, without touching a real folder",
          "answer": 0
        },
        {
          "text": "I want a paper sketch of one page with a made-up name, a box for a picture, and a button",
          "answer": 0
        },
        {
          "text": "I want to sort my whole life out and get more done",
          "answer": 1
        },
        {
          "text": "Build me an app that does everything my company needs",
          "answer": 1
        },
        {
          "text": "A little scoreboard that counts points on games night",
          "answer": 0
        }
      ],
      "reveal": "The good fits are small, repeating and specific. You can picture exactly what finished looks like. Huge or vague goals have no smallest version, so shrink them first. Name one annoyance you could describe in a single sentence."
    },
    {
      "kind": "tryLive",
      "title": "Design the smallest safe version",
      "prompt": "The small annoyance that keeps coming back is: [describe it, without pasting any real data]. Help me make the smallest useful version. First offer me three routes. A, a checklist or a paper sketch. B, an empty spreadsheet or a layout with no code. C, code only if I already have a throwaway browser space. I choose route [A, B or C]. For my route, give me four things. What goes in, what comes out, and three steps or fewer. One ordinary made-up test and one awkward one. A clear way to tell whether it passed. And the exact step that gets me back to the good copy. Do not ask me to install anything, sign in, hand over any access, or use real files. Stop after the plan so I can explain each part before anything gets made.",
      "note": "Routes A and B finish this activity completely, on a phone or on paper. Route C is optional, and must stay inside a throwaway browser space with no downloads and no access to your things. If you have no safe space, do not run code. Hand in the tested design and your way back instead."
    },
    {
      "kind": "workflowChain",
      "title": "Make it, then prove you understand it",
      "goal": "Turn an annoyance that keeps coming back into a small version you understand, can test, and can undo.",
      "correct": [
        "Name one small annoyance that keeps coming back, without typing in anything real or private",
        "Pick the safest route: paper or checklist, empty spreadsheet or no-code layout, or an optional throwaway browser space",
        "Before building, write what goes in, what comes out, how you will know it passed, what it may touch, and how you get back",
        "Save a copy that works, then test one ordinary made-up example and one awkward one",
        "Explain each part, and compare what happened with what you expected",
        "Change one thing you can undo, test again, and go back if it fails"
      ],
      "note": "It is ready for learning when you can explain it, test it, and put it back. Running generated code on something real is not required, and it proves nothing about whether you understand it."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your tiny-tool test",
      "cardType": "Make it, understand it",
      "fields": [
        { "key": "purpose", "label": "The one small job", "placeholder": "A job that keeps coming back and has a clear finish" },
        { "key": "proof", "label": "How I know I understand it", "placeholder": "I can explain it, test an awkward example, and guess what one change will do" },
        { "key": "rollback", "label": "How I get back to the good version", "placeholder": "The saved copy, the reset step, or the paper draft I can go back to" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you understand it",
      "question": "For a NEW annoyance, what is the strongest sign that you actually understand the thing you designed?",
      "options": [
        {
          "text": "It ran without any errors, so I understand it",
          "ok": false,
          "feedback": "Running is the start, not the finish. It proves the thing works today. A block you cannot read will break in ways you cannot fix."
        },
        {
          "text": "I can explain the parts. I can show an ordinary test and an awkward one. I can say what one change will do, and get back to the good copy if it fails",
          "ok": true,
          "feedback": "Exactly. Explaining it, testing it, changing it safely, and getting back. Paper, spreadsheet, no-code or a throwaway browser space can all meet that."
        },
        {
          "text": "It said this was beginner-friendly. So I ran it on my real files, with no way back",
          "ok": false,
          "feedback": "Being told it is simple is not the same as understanding it. The test is whether you can explain the parts and say what a change will do."
        },
        {
          "text": "I added more features first. I never decided how to tell whether the smallest version worked",
          "ok": false,
          "feedback": "More features make it bigger and harder to understand, not better. Aim for the smallest thing you genuinely grasp."
        }
      ]
    }
  ]
};
