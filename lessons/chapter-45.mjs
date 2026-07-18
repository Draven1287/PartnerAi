// Lesson 45 — Designing and Making
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-45",
  "num": 45,
  "arc": "Building with AI",
  "title": "Designing and Making",
  "coreQuestion": "How do I build a tiny tool with AI from a real need of my own and actually understand what I made?",
  "blurb": "Start from a real annoyance, make the smallest thing that fixes it, and understand every part.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The impressive block of code",
      "scenario": "You ask AI to build you something, and it hands back 80 lines that run perfectly on the first try. It looks impressive. But you can't read a single line of it. A week later it breaks, and you have no idea which part went wrong or how to fix it.",
      "prompt": "Before you read on: if you can run something but can't explain what it does, do you actually own it — or does it own you?"
    },
    {
      "kind": "reveal",
      "title": "\"It runs\" is the start, not the finish",
      "body": "AI predicts the most likely code from the patterns in the millions of programs and explanations people have written, so it can produce a lot fast. That's a superpower — but a big, mysterious block you can't read is fragile. A small thing you understand is something you can fix, trust, and reuse. If you can't read it, you also can't tell if it's quietly doing something you never asked for. So build the SMALLEST version that meets one real need, then make AI explain it line by line until you understand it. Quick terms: a 'script' is just a short list of written instructions a computer follows in order; 'runnable' means you can actually make it go and see a result. Safety habit: never paste passwords, account numbers, or other sensitive details into the prompt — describe the need without them.",
      "mistake": "Ask for impressive code and run whatever it gives you, no matter how much you understand.",
      "good": "Ask for the smallest useful version, then have AI walk you through every part until you can explain it yourself."
    },
    {
      "kind": "classify",
      "title": "Which annoyance fits a tiny tool?",
      "prompt": "A tiny tool works best for a small, repeating, concrete task. Sort each real annoyance: is it a good fit for a tiny tool, or too big/vague for one?",
      "buckets": [
        "Good fit for a tiny tool",
        "Too big or vague"
      ],
      "items": [
        {
          "text": "Every week I add up my spending by hand and it takes ages",
          "answer": 0
        },
        {
          "text": "My assignment files are a mess and I want them renamed and sorted",
          "answer": 0
        },
        {
          "text": "I want a one-page web page with my name, a photo, and a button",
          "answer": 0
        },
        {
          "text": "I want to fix my whole life and be more productive",
          "answer": 1
        },
        {
          "text": "Build me an app that does everything my company needs",
          "answer": 1
        },
        {
          "text": "A little scorekeeper that counts points for a game night",
          "answer": 0
        }
      ],
      "reveal": "The good fits are small, repeating, and concrete — you can picture exactly what 'done' looks like. Vague or huge goals have no smallest version, so shrink them first: name one specific, recurring annoyance you could describe in a single sentence."
    },
    {
      "kind": "tryLive",
      "title": "Build the smallest version",
      "prompt": "I have a recurring annoyance: [the real need, in your own words — e.g. \"every week I add up my spending by hand and it takes ages\"]. I want the smallest useful tool for it, made as [format — e.g. \"a spreadsheet formula,\" \"a one-page web page,\" or \"a short script I can paste somewhere\"]. Build the simplest version that works — no extra features. After the code, explain each part in plain words a total beginner understands, then point to one line I could safely change and tell me what changing it would do. Keep it beginner-friendly and tell me exactly how to run it.",
      "note": "Fill both blanks with something real, not a clever idea. Do NOT include passwords, account numbers, or other sensitive personal details — describe the need without them. Then actually run what it gives you."
    },
    {
      "kind": "workflowChain",
      "title": "The make-and-understand loop",
      "goal": "Turn a real annoyance into a tiny tool you actually understand and can keep.",
      "correct": [
        "Name one small, recurring annoyance in a single sentence",
        "Shrink it to the smallest useful version and pick the simplest format",
        "Ask AI to build the simplest version that works — no extra features",
        "Run it and confirm it actually does the thing",
        "Have AI explain each part in plain words until you understand it",
        "Change one line yourself, predict what will happen, then run it to check"
      ],
      "note": "The last step is the whole point. Understanding the change — not just watching it run — is what turns AI's code into something you own."
    },
    {
      "kind": "exitCheck",
      "title": "Prove you understand it",
      "question": "Take a NEW annoyance (different from the one above), get a small working version, then do this. What proves you actually understand what you built?",
      "options": [
        {
          "text": "It ran with no errors, so I understand it",
          "ok": false,
          "feedback": "'It runs' is the start, not the finish. Running proves the code works, not that you know what it does — a mysterious block you can't read will break in ways you can't repair."
        },
        {
          "text": "I can explain what at least two parts do, and when I change one line I correctly predict the result — or work out why I was wrong",
          "ok": true,
          "feedback": "Exactly. Explaining the parts and predicting your own change (then checking) is what turns AI's code into something you can fix, trust, and reuse. Understanding the change, not just running it, is what counts."
        },
        {
          "text": "AI told me the code was beginner-friendly, so it must be",
          "ok": false,
          "feedback": "AI's reassurance isn't understanding — yours is. The test is whether YOU can explain the parts and predict a change, not whether AI says it's simple."
        },
        {
          "text": "I asked AI to add more impressive features to show it off",
          "ok": false,
          "feedback": "More features make it bigger and harder to understand, not better. The goal is the smallest thing you fully grasp — flashy-but-mysterious is fragile."
        }
      ]
    }
  ]
};
