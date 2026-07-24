// Lesson 6 — How It Creates
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-6",
  "num": 6,
  "arc": "How It Works",
  "title": "How It Creates",
  "coreQuestion": "When an AI product writes, draws, or speaks, what is it generating — and what can I actually know about where the result came from?",
  "blurb": "Text, image, and audio systems create in different ways. Learn to separate generation from retrieval and check consent and provenance before you share.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Generated, retrieved, or both?",
      "scenario": "You ask an assistant for a poster of a glass city under two moons. It returns a polished image. The result looks original, but the product could have generated it, retrieved an existing image, combined tools, or used a workflow you cannot see.",
      "prompt": "Before you read on: what evidence would you need before claiming the image was generated rather than found? Name one thing the image itself cannot prove."
    },
    {
      "kind": "reveal",
      "title": "Different media, different systems",
      "body": "Generative AI is a family of systems that produces new content from learned patterns. A text model commonly predicts units of text called tokens. Many image systems begin with noise or an internal representation and repeatedly adjust it toward patterns connected to the prompt. Speech systems can turn text into acoustic patterns, while a separate speech-recognition system may turn your voice into text.\n\nA single assistant may quietly route your request among several models, search tools, files, or other services. So 'one next-piece engine does everything' is a useful first analogy, not a complete technical description. The finished result also cannot prove its own history: a novel-looking image might be generated, retrieved, edited, or assembled by a hybrid tool. Check the product's source labels, content credentials, links, or activity record when origin matters.",
      "mistake": "Assuming that a surprising result proves the assistant generated every part of it from scratch.",
      "good": "Ask what system or tool produced the result, what source information is available, and what still needs human checking."
    },
    {
      "kind": "classify",
      "title": "What does the evidence support?",
      "prompt": "Sort each result by the strongest conclusion the evidence supports. Do not guess from appearance alone.",
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
      "reveal": "Appearance is not provenance. A creation record or content credential can support a generation claim; a source link can support retrieval; missing evidence means the honest answer is 'origin unclear.' Even provenance tools can be incomplete, so consequential uses still need verification."
    },
    {
      "kind": "workflowChain",
      "title": "Create without taking someone else's identity",
      "goal": "Plan a poster concept while respecting consent, authorship, and the audience's right to know what they are seeing.",
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
      "note": "You do not need an image generator to complete this lesson. The plan and provenance decisions you make here are the required evidence. If you use an outside tool, do not upload a real person's photo, private material, or work you lack permission to use."
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
      "title": "Make the claim the evidence supports",
      "question": "An assistant returns a convincing image for a made-up subject, but gives no source, tool label, or content credential. What is the most accurate conclusion?",
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
