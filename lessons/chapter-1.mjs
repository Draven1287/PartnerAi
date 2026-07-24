// Lesson 1 — Use AI Safely Once
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-1",
  "num": 1,
  "arc": "First Contact",
  "title": "Use AI Safely Once",
  "coreQuestion": "How can I use an AI assistant without handing over my privacy, voice, or final decision?",
  "blurb": "Make several realistic choices, see what the system is actually doing, and leave with one control rule you can use immediately.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "AI is already inside ordinary decisions",
      "scenario": "A group chat says school is closed tomorrow. The screenshot looks official, but nobody links the source. Someone asks you to repost it. An AI assistant could rewrite the announcement, explain the screenshot, or confidently tell you it is real—but none of those actions proves the claim. Before learning how a model works, you need a way to keep control of what happens next.\n\nThis lesson is not graded. Use made-up examples. Do not enter a real name, school, address, password, private message, health detail, or another person's information.",
      "prompt": "What would matter most before you shared the announcement: speed, confidence, or evidence that tomorrow's closure is current? Hold your answer; you will test it next."
    },
    {
      "kind": "classify",
      "title": "Choose the kind of control each moment needs",
      "prompt": "These are not trivia questions. They are small decisions people make while using AI. Sort each next move by the control it protects; retry any choice without penalty.",
      "buckets": [
        "Use AI for options",
        "Check outside AI",
        "Keep people private"
      ],
      "items": [
        {
          "text": "Ask for three possible titles, then choose and rewrite one in your own voice.",
          "answer": 0
        },
        {
          "text": "Confirm tonight's opening hours on the venue's official page before your friend travels.",
          "answer": 1
        },
        {
          "text": "Describe an argument without names or screenshots before asking for calmer reply ideas.",
          "answer": 2
        },
        {
          "text": "Compare several possible plans, then let the people involved make the final choice.",
          "answer": 0
        },
        {
          "text": "Verify a specific number with a current independent source before acting on it.",
          "answer": 1
        },
        {
          "text": "Replace a real location and personal details with an invented example before typing.",
          "answer": 2
        }
      ],
      "reveal": "You just used three different controls: AI can generate options, outside evidence checks consequential facts, and redaction protects the people inside the prompt."
    },
    {
      "kind": "reveal",
      "title": "The output is only one part of the system",
      "body": "When you type into an AI product, five parts are involved: you bring a goal; the app receives your request; a model predicts a response from patterns and context; optional tools may add search, files, memory, or calculations; and then you decide whether to edit, reject, verify, or act. The model does not receive the consequence if the answer is wrong. You and the people affected do.\n\nThat is why safety comes before technical detail. A fluent answer can be useful material, but it is not permission to share private information or proof that a current claim is true. The machine produces an output. Human judgment turns—or refuses to turn—that output into action.",
      "mistake": "Treating the chatbot as one all-knowing object, then assuming its polished answer has already completed the checking and deciding for you.",
      "good": "Name the job you are giving AI, remove information it does not need, and keep the final check and decision with a person."
    },
    {
      "kind": "compare",
      "title": "Context changes the prediction",
      "weak": "Tell them I can't come.",
      "strong": "Write three short ways to tell a close friend I cannot come tonight. Keep the tone warm, do not invent a reason, and leave the final wording for me to choose.",
      "why": "The model predicts from the words and context it receives. Clear audience, limits, and purpose change the likely output. Better context improves fit; it still does not make an invented claim true or make the final choice for you."
    },
    {
      "kind": "workflowChain",
      "title": "Put control in the right order",
      "goal": "Use AI to help plan a group meetup without exposing private information or treating a likely answer as a verified plan.",
      "correct": [
        "Remove private details",
        "State the goal and limits",
        "Ask for several options",
        "Check current facts independently",
        "Let the people involved decide"
      ],
      "choices": [
        "Ask for several options",
        "Check current facts independently",
        "Let the people involved decide",
        "Remove private details",
        "State the goal and limits"
      ],
      "note": "The order matters. Protect people before typing, define the real task, use prediction for options, verify the current details that change the plan, and keep the consequence with the humans involved."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep your first control card",
      "cardType": "Control rule",
      "fields": [
        {
          "key": "use",
          "label": "I am comfortable using AI for...",
          "placeholder": "e.g. options, drafts, explanations"
        },
        {
          "key": "protect",
          "label": "Before I type, I will protect...",
          "placeholder": "e.g. names, private messages, locations"
        },
        {
          "key": "check",
          "label": "Before I act, I will check...",
          "placeholder": "e.g. the current fact that changes the decision"
        },
        {
          "key": "decide",
          "label": "The final decision belongs to...",
          "placeholder": "me and the people affected"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Make the whole decision",
      "question": "A friend sends you a private group-chat screenshot and asks AI to plan a meetup from it. The answer suggests a venue with exact prices and opening hours. Which complete next move keeps the tool useful without giving it control?",
      "options": [
        {
          "text": "Paste the screenshot because exact personal context will make the plan more accurate, then follow the most confident answer.",
          "ok": false,
          "feedback": "More private context is not automatically safer or necessary, and confidence is not evidence that current venue details are correct."
        },
        {
          "text": "Remove names and private details, state the group's real constraints, use AI for options, verify current venue facts, and let the group decide.",
          "ok": true,
          "feedback": "That combines privacy, useful context, independent verification, and human decision-making. AI helps without owning the consequence."
        },
        {
          "text": "Ask the same AI to cite itself and promise the prices are current before sending the plan to everyone.",
          "ok": false,
          "feedback": "A stronger promise from the same system is still not independent evidence. Check the venue's current information outside the chatbot."
        },
        {
          "text": "Never use AI for planning because any mistake means the tool is useless.",
          "ok": false,
          "feedback": "That avoids the risk by losing the benefit. The stronger skill is deciding what AI can help with and what a person must protect, check, and decide."
        }
      ]
    }
  ]
};
