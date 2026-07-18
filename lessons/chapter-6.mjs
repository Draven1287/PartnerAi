// Lesson 6 — How It Creates
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-6",
  "num": 6,
  "arc": "How It Works",
  "title": "How It Creates",
  "coreQuestion": "How can one AI tool write, draw, and speak — and what is it actually doing when it \"makes\" a picture?",
  "blurb": "The same next-piece engine that finishes sentences can also build a brand-new image or voice — piece by piece.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "More than a chatbox",
      "scenario": "You ask your assistant for a picture of a cat wearing a tiny astronaut helmet, floating over a bowl of cereal. A few seconds later, there it is — an image nobody has ever made before. You didn't search for it. The AI built it.",
      "prompt": "Before you read on: where do you think that picture came from — did the AI find it somewhere online, or make it from scratch? What makes you think so?"
    },
    {
      "kind": "reveal",
      "title": "Same engine, new kind of piece",
      "body": "In earlier lessons you saw the core idea: AI learned patterns from huge amounts of human-made data, then predicts what comes next. That engine doesn't only finish sentences. It can also predict each piece of a picture, or each piece of a sound — which is why one tool can write, draw, and speak. This is generative AI: software that CREATES new content instead of looking it up. You'll hear people say 'the AI imagines your picture.' That's a comparison, not the truth — flag it as an analogy. What's really happening: it learned visual patterns from enormous numbers of images and predicts a whole new picture, piece by piece, until it matches your words. No imagining, no searching a photo library. (2026 note: assistants can also browse the web and use other tools to get a job done — but a generated image is built, not found.)",
      "mistake": "Assuming 'text in, text out' is all AI does — treating it as only a chatbot you type to and read back.",
      "good": "Seeing text, images, and voice as three kinds of the SAME predict-the-next-piece engine, all of which you can try today."
    },
    {
      "kind": "classify",
      "title": "Made or found?",
      "prompt": "For each result, decide: did the AI CREATE it piece by piece, or FIND it that already existed?",
      "buckets": [
        "AI created it",
        "AI found it"
      ],
      "items": [
        {
          "text": "A watercolor of a cat in an astronaut helmet floating over cereal",
          "answer": 0
        },
        {
          "text": "A teapot shaped like a hedgehog, rendered as a pencil sketch",
          "answer": 0
        },
        {
          "text": "A photo of the actual Eiffel Tower pulled from a news article on the web",
          "answer": 1
        },
        {
          "text": "A calm friendly voice reading a sentence you just typed",
          "answer": 0
        },
        {
          "text": "A Wikipedia paragraph the assistant looked up and quoted to you",
          "answer": 1
        }
      ],
      "reveal": "Created things didn't exist until you asked — the AI predicted them piece by piece. Found things already existed somewhere and were retrieved. Generative AI does the first kind; browsing and search do the second."
    },
    {
      "kind": "tryLive",
      "title": "Make something new",
      "prompt": "Create an image of [subject], in a [style] style, with [one detail]. Make it something that probably doesn't already exist.",
      "note": "Fill the blanks with a MADE-UP subject — never a real person, and don't upload someone's photo. Example: 'a cat wearing a tiny astronaut helmet, in a watercolor painting style, floating above a bowl of cereal.' Look near the message box for an image or 'create image' button; if you don't see one, just type the request as a sentence — most 2026 assistants make the image right in the chat. Prefer sound? Try: 'Read this sentence aloud in a calm, friendly voice: Good morning — today is going to be a good day.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your image recipe",
      "cardType": "Image prompt recipe",
      "fields": [
        {
          "key": "subject",
          "label": "Subject (made-up, not a real person)",
          "placeholder": "a teapot shaped like a hedgehog"
        },
        {
          "key": "style",
          "label": "Style",
          "placeholder": "watercolor, cartoon, photo-realistic, pencil sketch"
        },
        {
          "key": "detail",
          "label": "One detail that makes it yours",
          "placeholder": "sitting on a stack of old books"
        },
        {
          "key": "novelty",
          "label": "Novelty line",
          "placeholder": "Make it something that probably doesn't already exist."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do it on a fresh subject",
      "question": "Generate a picture (or a spoken clip) on a BRAND-NEW subject you haven't used yet. Which one-sentence reason best shows you understand what just happened?",
      "options": [
        {
          "text": "This is a good sign the AI created it, because a made-up subject like this almost certainly doesn't exist online — so it had to build the picture piece by piece to match my words.",
          "ok": true,
          "feedback": "Right. A novel subject can't be 'found,' so a matching result is evidence the AI predicted a whole new image, not retrieved one."
        },
        {
          "text": "The AI clearly searched an image library and found the closest match to my description.",
          "ok": false,
          "feedback": "Not for a generated image. It learned visual patterns and predicts a new picture piece by piece — it isn't browsing a photo library."
        },
        {
          "text": "It proves the AI can truly imagine, like a person daydreaming a scene.",
          "ok": false,
          "feedback": "'Imagine' is an analogy, not the mechanism. There's no imagining — just next-piece prediction from learned patterns until it matches your words."
        }
      ]
    }
  ]
};
