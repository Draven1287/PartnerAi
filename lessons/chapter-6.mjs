// Lesson 6 — How It Creates
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-6",
  "num": 6,
  "arc": "How It Works",
  "title": "Where Did This Come From?",
  "coreQuestion": "When AI makes a picture, some writing, or a voice, how can I tell where it really came from?",
  "blurb": "Learn why you cannot tell how something was made just by looking at it, and what to check instead.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It looks real. That tells you nothing.",
      "scenario": "You ask an app for a poster of a glass city under two moons. Seconds later, there it is. It looks incredible.\n\nBut you cannot tell how the app got it. It might have made the picture itself. It might have found one someone else drew. It might have mixed both together.",
      "prompt": "If a friend asked \"did the AI actually make that?\", what could you honestly say right now?"
    },
    {
      "kind": "reveal",
      "title": "Made or found, and why you cannot see the difference",
      "body": "There are two different things an app can do, and they look identical on screen.\n\nMade means the AI built something new, piece by piece, from patterns it learned. Nobody drew that exact picture before.\n\nFound means the app went and got something that already existed, that a real person made.\n\nHere is the problem. A finished picture cannot tell you which one happened. Looking closer does not help. Neither does it looking impressive.\n\nThe only way to know is if the app tells you. Some apps show a link to where something came from, or a small label saying the AI made this. That label is your evidence. The picture itself never is.\n\nIf there is no label and no link, the honest answer is \"I do not know where this came from\". That is a real answer, and it is the right one.",
      "mistake": "Assuming that a surprising result proves the assistant generated every part of it from scratch.",
      "good": "Ask what system or tool produced the result, what source information is available, and what still needs human checking."
    },
    {
      "kind": "classify",
      "title": "What can you honestly say?",
      "prompt": "For each one, pick the strongest thing you are allowed to claim. Do not judge by how good it looks.",
      "buckets": [
        "Generation is documented",
        "Retrieval is documented",
        "Origin is still unclear"
      ],
      "items": [
        {
          "text": "The product's activity record says 'image generated' and provides content credentials for this result.",
          "answer": 0
        },
        {
          "text": "The assistant gives a direct source link to a museum photograph and says it retrieved that exact image.",
          "answer": 1
        },
        {
          "text": "A strange picture appears with no source, tool label, or creation record.",
          "answer": 2
        },
        {
          "text": "A quoted paragraph includes a working link to the original article and matches it word for word.",
          "answer": 1
        },
        {
          "text": "A voice clip sounds like a real person, but there is no label explaining whether it was recorded, cloned, or synthesized.",
          "answer": 2
        }
      ],
      "reveal": "Looking good is not evidence. A label or a link tells you where something came from. No label means \"I do not know\" — and saying that is not a failure."
    },
    {
      "kind": "workflowChain",
      "title": "Make something without taking someone else's",
      "goal": "Plan a poster of your own, without using a real person's face or someone else's artwork.",
      "correct": [
        "Choose an invented subject or material you have permission to use",
        "Describe visual qualities instead of copying a living artist or real person's identity",
        "Decide the audience, purpose, and limits",
        "Keep the prompt, tool label, and available provenance with the result",
        "Inspect for harmful similarity, false claims, and private details",
        "Label generated or substantially edited media when that context matters"
      ],
      "choices": [
        "Inspect for harmful similarity, false claims, and private details",
        "Choose an invented subject or material you have permission to use",
        "Label generated or substantially edited media when that context matters",
        "Keep the prompt, tool label, and available provenance with the result",
        "Describe visual qualities instead of copying a living artist or real person's identity",
        "Decide the audience, purpose, and limits"
      ],
      "note": "You do not need an image app to finish this lesson. Your plan is the work. If you do use one, do not upload a real person's photo or someone else's drawing."
    },
    {
      "kind": "compare",
      "title": "A no-generator practice path",
      "weak": "Make a poster in the style of a living artist. It probably counts as original because my subject is new.",
      "strong": "Plan a poster about night travel using deep blue, high contrast, wide empty space, and hand-cut geometric shapes. Use an invented subject, keep a record of the tool and prompt, check for close resemblance, and label generated media when sharing could confuse it with evidence.",
      "why": "The stronger plan describes qualities you can direct without borrowing a person's identity. It also keeps provenance, consent, and audience context in the workflow. You can analyze and improve this plan entirely inside LearningAI."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save your creation-and-origin card",
      "cardType": "Creation and provenance plan",
      "fields": [
        {
          "key": "subject",
          "label": "Invented subject or permitted material",
          "placeholder": "a glass city under two moons"
        },
        {
          "key": "qualities",
          "label": "Visual or audio qualities — not a person's identity",
          "placeholder": "deep blue, quiet, geometric, wide empty space"
        },
        {
          "key": "origin",
          "label": "How I will record or check origin",
          "placeholder": "keep the prompt and tool label; look for sources or content credentials"
        },
        {
          "key": "share",
          "label": "Consent, similarity, and labeling check",
          "placeholder": "use permitted material, inspect resemblance, label generated media when needed"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Say only what you can back up",
      "question": "An app gives you a convincing picture of something imaginary. There is no label and no link. What is the most honest thing you can say?",
      "options": [
        {
          "text": "The origin is unclear. I can describe the result, but I need provenance or source evidence before claiming it was generated or found.",
          "ok": true,
          "feedback": "Right. Novelty and appearance do not prove origin. You kept the claim inside the available evidence."
        },
        {
          "text": "It must be fully generated because the subject probably did not exist before.",
          "ok": false,
          "feedback": "A novel subject is not proof. The product could retrieve, edit, compose, or route through several tools. Check provenance instead of guessing."
        },
        {
          "text": "It must be a retrieved photograph because AI cannot make images or voices.",
          "ok": false,
          "feedback": "AI systems can generate images and synthesize audio. The problem is not whether generation exists; it is that this result has not shown its origin."
        },
        {
          "text": "If it looks good, the origin and consent questions no longer matter.",
          "ok": false,
          "feedback": "Quality does not answer who or what was used, whether permission existed, or how an audience may interpret the result."
        }
      ]
    }
  ]
};
