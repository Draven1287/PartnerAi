// Lesson 3 — The Machine That Predicts
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-3",
  "num": 3,
  "arc": "First Contact",
  "title": "Change One Clue, Change the Answer",
  "coreQuestion": "Why do the words around your question change the answer, and why can a likely answer still be wrong?",
  "blurb": "Change one clue, watch the answer move, and see why a good guess is not proof.",
  "minutes": 13,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "One message, three different endings",
      "scenario": "You start typing: 'I cannot make it tonight because…' Your phone offers to finish it for you.\n\nIn the team group chat it offers 'I have a match'. In the family chat it offers 'I feel sick'. In the game chat it offers 'the update is still downloading'.\n\nThe start was the same every time. The words around it changed. So the guess changed.",
      "prompt": "You are in a chat about a cancelled birthday party. Which ending would your phone offer, and what made you pick it?"
    },
    {
      "kind": "classify",
      "title": "Which chat does each ending fit?",
      "prompt": "Sort each ending by the chat it fits best. More than one could work. Pick the strongest clue.",
      "buckets": ["Cooking dinner", "Fixing a bike", "Texting a friend"],
      "items": [
        { "text": "…the pan is already smoking.", "answer": 0 },
        { "text": "…the new brake cable arrives on Friday.", "answer": 1 },
        { "text": "…I need a bit of time before we talk.", "answer": 2 },
        { "text": "…the sauce needs ten more minutes.", "answer": 0 },
        { "text": "…my dad said he would pay for the part.", "answer": 1 },
        { "text": "…I do not want this to turn into another argument.", "answer": 2 }
      ],
      "reveal": "The AI leans on the words around your question. Change the clues and a different ending fits. That makes the ending more likely. It does not make it true."
    },
    {
      "kind": "reveal",
      "title": "It builds the answer one word at a time",
      "body": "The part that writes the answer is a guesser. People call it a model.\n\nIt has read an enormous amount of writing. Given your words so far, it picks the word that fits best. Then it does that again. And again. That is how a whole answer gets built.\n\nPeople call this predicting. It only means guessing what comes next.\n\nSo the answer arrives one piece at a time. It was never sitting there finished, waiting for you.\n\nEverything around your question is a clue: the earlier messages, the chat you are in, the details you added. People call all those clues together the context.\n\nMore clues make the guess fit better. Fitting better is not the same as being right. A homework answer can read beautifully and still be wrong.\n\nThis lesson works entirely inside LearningAI. If you do try an outside app, use a made-up example and keep private details out.",
      "mistake": "Thinking a smooth paragraph means the AI understands the world the way you do.",
      "good": "Use clues to shape the guess, then check the facts yourself before you rely on them."
    },
    {
      "kind": "workflowChain",
      "title": "Run a clue experiment",
      "goal": "Test how one changed clue moves the answer, using nothing private.",
      "correct": [
        "Pick a made-up half-finished sentence",
        "Add clues that make one ending fit",
        "Change one clue and nothing else",
        "Say how you think the ending will move",
        "Compare the two endings, and treat neither as proof"
      ],
      "choices": [
        "Say how you think the ending will move",
        "Compare the two endings, and treat neither as proof",
        "Pick a made-up half-finished sentence",
        "Change one clue and nothing else",
        "Add clues that make one ending fit"
      ],
      "note": "A fair test changes one clue, not five. The evidence is that the ending moved."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep your clue test",
      "cardType": "Clue test",
      "fields": [
        { "key": "start", "label": "Half-finished sentence", "placeholder": "Use a made-up one, nothing private" },
        { "key": "contextA", "label": "Clues A, and the ending they fit", "placeholder": "What made that ending fit?" },
        { "key": "contextB", "label": "Clues B, and the new ending", "placeholder": "Which single clue moved it?" },
        { "key": "limit", "label": "What this does not prove", "placeholder": "Likely still does not mean…" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Try it on something new",
      "question": "A chatbot finishes 'The shop is shut because…' one way after you add 'holiday notice', and another way after you add 'broken freezer'. What is the safest thing to conclude?",
      "options": [
        { "text": "The new clue changed which ending fitted. Either ending still needs checking before anyone acts on it.", "ok": true, "feedback": "Yes. Clues change what is likely. Only evidence tells you what is true." },
        { "text": "The second answer is probably true, because it used the newer clue and sounded more exact.", "ok": false, "feedback": "Exact wording is easy to guess. The clue shaped the sentence. It did not check the shop." },
        { "text": "The AI remembered what really happened at that shop and picked the matching ending.", "ok": false, "feedback": "Nothing here shows it knows that shop. It wrote what fitted the clues you gave it." },
        { "text": "Both answers are useless, because a guessed sentence can never help with a real task.", "ok": false, "feedback": "Guessed sentences can be useful. Your job is knowing when a guess needs checking." }
      ]
    }
  ]
};
