// Lesson 23 — Show, Don't Tell
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-23",
  "num": 23,
  "arc": "Prompting Craft",
  "title": "Show, Don't Tell",
  "coreQuestion": "Why does pasting one example of the style you want beat describing that style in words?",
  "blurb": "Stop describing the style you want. Paste one real sample and say \"more like this.\"",
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
      "prompt": "Here is an example of the style I want:\n[paste one real example - a caption you liked, a sentence, a list shaped the right way]\nNow write [the new thing you need] in that same style. Match the tone, length, and shape, not the topic.",
      "note": "Keep the pasted example short. Try it once with only a word-description of the style, then again with the pasted example - put the two answers side by side. The example-driven one is almost always closer."
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
      "question": "Pick a style you did NOT use above - paste one text a friend sent that you found funny, then ask the AI to write a DIFFERENT message (say, a dinner invite) in that same voice. What tells you you've passed?",
      "options": [
        {
          "text": "The new message clearly matches the example's tone or shape - visibly closer than a words-only description got you.",
          "ok": true,
          "feedback": "Yes. The test is doing the skill: a new item, different topic, same voice as your one example. If it misses, paste a second example and notice whether two beat one."
        },
        {
          "text": "The AI used the exact same words and topic as the friend's text.",
          "ok": false,
          "feedback": "No - you want the same tone and shape on a DIFFERENT topic, not a copy of the original text."
        },
        {
          "text": "You wrote a longer, more detailed word-description of the funny voice.",
          "ok": false,
          "feedback": "That's the move we're replacing. The whole point is to show one example instead of describing it in more words."
        }
      ]
    }
  ]
};
