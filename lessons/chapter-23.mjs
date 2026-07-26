// Lesson 23 — Show, Don't Tell
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-23",
  "num": 23,
  "arc": "Prompting Craft",
  "title": "Show It, Don't Describe It",
  "coreQuestion": "Why does pasting one example of the style I want beat describing that style in words?",
  "blurb": "Pick one safe example of the style you want and paste it in. Then decide what still needs to sound like you.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The listing that came out wrong",
      "scenario": "You are selling your old skateboard online. You ask an AI for a short, friendly, casual description.\n\nBack comes something stiff. Technically friendly. Technically casual. Nothing like how you actually write.\n\nYou add more words: warm, fun, chatty. It still misses.",
      "prompt": "If you cannot quite put the style you want into words, what could you show it instead?"
    },
    {
      "kind": "reveal",
      "title": "One example beats a paragraph of describing",
      "body": "One real example you can point at teaches it faster than a paragraph trying to describe the same thing.\n\nHere is why, and it is not magic. The AI has read an enormous amount of human writing, and it guesses which words come next. When you paste an example, you hand it a fresh pattern to carry on. It picks up the tone, the rhythm and the shape of your sample, and keeps going in that direction.\n\nPeople sometimes say it 'gets your taste'. That is a comparison, not the truth. What is really happening is simpler. It reads the style of your example and continues it. It does not know you the way a friend does.\n\nGiving exactly one example like this has a name. People call it a one-shot prompt. It is one of the biggest wins a beginner can pick up.",
      "mistake": "Piling on more words — warm, casual, friendly, fun, chatty — trying to pin the style down perfectly.",
      "good": "Pasting one real thing written in the style you actually want, and saying: now make a new one that matches this."
    },
    {
      "kind": "compare",
      "title": "Words only, or one example",
      "weak": "Prompt: 'Write a short, friendly, casual description for my old skateboard.' Result: could be any board on any site — 'This quality skateboard offers great performance and is ideal for riders of all levels.'",
      "strong": "Prompt pastes a real example first — the listing that sold your bike in a day: 'Old bike, still solid. Rode it two years, brakes are new, sold as I outgrew it. Collection only.' — then asks for the skateboard version in that same style. Result: 'Old board, still solid. Rode it a year, wheels are new, selling as I got a bigger one. Collection only.'",
      "why": "The example gave it a real pattern to carry on: short opener, honest detail, one line about why you are selling. Words alone gave it nothing to match."
    },
    {
      "kind": "promptRepair",
      "title": "Turn a description into a show-it prompt",
      "weak": "Write a fun, casual caption for the football team photo in a voice people actually like.",
      "fields": [
        "The example to match",
        "The new thing to make",
        "What to copy (tone, length, shape — not the topic)"
      ],
      "strong": "Here is an example of the style I want: [paste one caption you like]. Now write a caption for the football team photo in that same style. Match the tone, the length and the shape, not the topic."
    },
    {
      "kind": "tryLive",
      "title": "Run the one-example prompt",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use an example you wrote yourself, or a made-up one. Do not paste a friend's private message, anyone's personal details, or a long chunk of somebody else's published writing. Here is my example:\n[a short thing you wrote]\nNow write [the new thing] with a similar tone, length and shape. Do not copy the phrases, and do not pretend to be a real person.",
      "note": "Try the same job twice: once describing the style in words, once pasting the example. Judge the tone, the rhythm and the layout separately. If it copies phrases straight across, fix the prompt: 'Keep the shape, but use completely new wording.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your one-example prompt",
      "cardType": "One-shot style prompt",
      "fields": [
        {
          "key": "example",
          "label": "The example to match",
          "placeholder": "Old bike, still solid. Rode it two years, brakes are new. Collection only."
        },
        {
          "key": "newThing",
          "label": "The new thing to make",
          "placeholder": "a listing for my old skateboard"
        },
        {
          "key": "copyWhat",
          "label": "What to copy",
          "placeholder": "tone, length and shape — not the topic"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a fresh style",
      "question": "New situation. You wrote a two-line caption for one event and you want an original caption for a different event with the same pacing. Which result shows you did this properly?",
      "options": [
        {
          "text": "The new caption has the same pacing and energy, uses new words, fits the new event, and does not pretend to be somebody else.",
          "ok": true,
          "feedback": "Yes. You carried across things you can point at, without copying phrases or borrowing someone's identity."
        },
        {
          "text": "The new caption keeps the opening line and the sign-off word for word, changes the middle, and fits the new event.",
          "ok": false,
          "feedback": "It fits the job, but repeating the memorable phrases is copying, not picking up the pattern. Ask for fresh wording."
        },
        {
          "text": "The new caption sounds playful, but I cannot say which part came from my example.",
          "ok": false,
          "feedback": "It might be usable, but you did not steer it. Name the pacing, the shape, or the tone you meant to carry over."
        }
      ]
    }
  ]
};
