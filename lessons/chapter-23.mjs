// Lesson 23 — Show, Don't Tell
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-23",
  "num": 23,
  "arc": "Prompting Craft",
  "title": "Show, Don't Tell",
  "coreQuestion": "Why does pasting one example of the style you want beat describing that style in words?",
  "blurb": "Choose a safe sample that represents the style you want, then compare the result and decide what still needs your voice.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The blurb that came out wrong",
      "scenario": "You ask an AI: 'Write a short, warm, casual product blurb for my candle.' It hands you something stiff and generic - technically warm and casual, but not the voice in your head. You add more adjectives. It still misses.",
      "prompt": "Before you read on: if you can't quite put the style you want into words, what could you show the AI instead?"
    },
    {
      "kind": "reveal",
      "title": "One example beats a paragraph of description",
      "body": "One real example you can point to teaches the AI faster than a paragraph trying to describe the same thing in words. Here's the real mechanism, not magic: from Lesson 1, the AI learned patterns from huge amounts of human writing and predicts what words come next. When you paste an example, you hand it a fresh pattern to continue - it pulls on the tone, rhythm, and shape of your sample to predict what should come next. People sometimes say the AI is 'understanding your taste.' That's a comparison, not what's happening. What's really happening is pattern-continuation: it reads the style of your example and continues it - it does not know you the way a friend would. Giving exactly one example like this has a name: a one-shot prompt. It's one of the highest-leverage moves a beginner can learn.",
      "mistake": "Piling on more adjectives - 'warm, casual, friendly, cozy, inviting' - trying to pin the style down in perfect words.",
      "good": "Pasting one real sample written in the style you actually want and saying: 'Now make a new thing that matches this.'"
    },
    {
      "kind": "compare",
      "title": "Words-only vs. one example",
      "weak": "Prompt: 'Write a short, warm, casual product blurb for my beeswax lip balm.' Result: generic, could describe any product - 'Treat your lips to our all-natural beeswax lip balm for lasting moisture and care.'",
      "strong": "Prompt pastes a real sample first - 'Cozy nights, sorted. Our lavender soy candle burns clean for 40 hours - light it, exhale, repeat.' - then asks for the lip balm blurb in that same style. Result matches the rhythm and shape: 'Chapped lips, sorted. Our beeswax balm soothes for hours - swipe it, smile, repeat.'",
      "why": "The example handed the AI a concrete pattern to continue - short punchy opener, a benefit, a three-beat closer - so it predicted words that fit that shape. Words-only gave it nothing specific to match."
    },
    {
      "kind": "promptRepair",
      "title": "Turn a description into a show-don't-tell prompt",
      "weak": "Write a fun, casual Instagram caption for my new mug in a voice people actually like.",
      "fields": [
        "Example to match",
        "New thing to make",
        "What to copy (tone, length, shape - not topic)"
      ],
      "strong": "Here is an example of the style I want: [paste one caption whose vibe you love]. Now write a caption for my new mug in that same style. Match the tone, length, and shape - not the topic."
    },
    {
      "kind": "tryLive",
      "title": "Run the one-shot prompt",
      "prompt": "This optional step uses an external assistant, so anything entered leaves LearningAI. Use an example you wrote yourself or an invented sample. Do not paste a friend's private message, personal data, or a long copyrighted passage. Here is my safe example:\n[short self-written sample]\nNow write [the new thing] with a similar tone, length, and shape without copying phrases or pretending to be a real person.",
      "note": "Compare a words-only request with the safe-example request. Judge tone, rhythm, and structure separately. If it copies phrases, repair the prompt: 'Keep the structure, but use completely new wording.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your example-driven prompt",
      "cardType": "One-shot style prompt",
      "fields": [
        {
          "key": "example",
          "label": "Example to match",
          "placeholder": "Cozy nights, sorted. Our lavender soy candle burns clean for 40 hours - light it, exhale, repeat."
        },
        {
          "key": "newThing",
          "label": "New thing to make",
          "placeholder": "a blurb for my handmade beeswax lip balm"
        },
        {
          "key": "copyWhat",
          "label": "What to copy",
          "placeholder": "tone, length, and shape - not the topic"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a fresh style",
      "question": "Fresh scenario: you wrote a two-line playful event caption and want an original caption for a different event with the same pacing. Which result shows responsible style transfer?",
      "options": [
        {
          "text": "The new caption has similar pacing and energy, uses new wording, fits the new event, and does not pretend to be another person.",
          "ok": true,
          "feedback": "Yes. You transferred observable features without copying phrases or impersonating someone."
        },
        {
          "text": "The new caption keeps the opener and closing phrase exactly, but changes the middle and fits the new event.",
          "ok": false,
          "feedback": "It fits the new task, but repeating signature phrases is copying rather than learning the broader pattern. Ask for fresh wording."
        },
        {
          "text": "The new caption sounds generally playful, but you cannot name which feature came from the example.",
          "ok": false,
          "feedback": "The output may be usable, but it does not show controlled transfer. Name the pacing, structure, or tone you meant to carry over."
        }
      ]
    }
  ]
};
