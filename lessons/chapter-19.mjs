// Lesson 19 — Context and Memory
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-19",
  "num": 19,
  "arc": "Trust & Everyday AI",
  "title": "Context and Memory",
  "coreQuestion": "When an AI seems to remember, what is active context, chat history, saved memory, retained service data, or training use — and what evidence can I actually inspect?",
  "blurb": "Separate five things that products often blur together so a visible Memory screen never becomes a false privacy promise.",
  "minutes": 11,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Remembered here does not mean erased elsewhere",
      "scenario": "You give an assistant the harmless invented fact 'my houseplant is named Gerald.' It recalls Gerald later in the same chat. A new chat forgets. The old chat still appears in History, while a Memory screen shows nothing saved.",
      "prompt": "Before you read on: what has this test proved — and what questions about storage, review, deletion, or future training are still unanswered?"
    },
    {
      "kind": "reveal",
      "title": "Five different data paths",
      "body": "Products use similar words for different systems. (1) Active context is information supplied to the model for the current response, often from earlier messages in the same chat. (2) Chat history or service logs are records the provider may retain; whether you can see a chat does not reveal every operational or safety log. (3) Saved or persistent memory is selected information a product may reuse across chats for personalization. (4) Retention and human review describe how long service data may remain, who may access it under policy, and what deletion does or does not cover. (5) Training or improvement use is whether eligible data may later help build or evaluate future systems. None of these is proven by a fresh-chat test alone. A Memory screen can show a personalization control; it cannot by itself establish every log, backup, administrator rule, legal hold, review process, or training choice.",
      "mistake": "Treating 'it forgot in a new chat' or 'Memory is empty' as proof that no service data exists anywhere.",
      "good": "Check the user-facing controls, current provider policy, and — for school or work accounts — the organization's rules. Then share only what you can afford to have retained."
    },
    {
      "kind": "classify",
      "title": "Name the data path",
      "prompt": "Sort each example by the mechanism it most directly describes. Real products label and combine these differently; the point is to keep the questions separate.",
      "buckets": [
        "Active context",
        "History or service logs",
        "Saved memory",
        "Retention or human review",
        "Training or improvement use"
      ],
      "items": [
        {
          "text": "The assistant uses a detail from ten messages earlier to answer now.",
          "answer": 0
        },
        {
          "text": "Yesterday's conversation still appears in the product's chat list.",
          "answer": 1
        },
        {
          "text": "A personalization control stores your preferred response format for future chats.",
          "answer": 2
        },
        {
          "text": "A policy explains how long deleted chats may remain in backups or safety systems and when authorized reviewers may access them.",
          "answer": 3
        },
        {
          "text": "A data control says whether eligible conversations may be used to improve future models.",
          "answer": 4
        },
        {
          "text": "A school account's administrator sets a different retention rule from a personal account.",
          "answer": 3
        }
      ],
      "reveal": "The categories answer different questions: what the model can use now, what records exist, what personalization returns later, how service data is retained or reviewed, and whether eligible data may improve future systems. One control may affect several paths, but never assume it answers all five."
    },
    {
      "kind": "workflowChain",
      "title": "Make a claim the evidence can support",
      "goal": "You want to know what happens to a harmless chat after you delete it. Put the investigation in order.",
      "correct": [
        "Name the exact question: visible history, saved memory, retention, human review, or training use",
        "Inspect the relevant product control and record exactly what it says — no broader",
        "Read the current provider policy for retention, deletion, review, and improvement use",
        "If it is a school or work account, check the organization's administrator or data policy too",
        "State what is established, what remains unknown, and choose a paste rule that is safe under the uncertainty"
      ],
      "choices": [
        "Read the current provider policy for retention, deletion, review, and improvement use",
        "State what is established, what remains unknown, and choose a paste rule that is safe under the uncertainty",
        "Name the exact question: visible history, saved memory, retention, human review, or training use",
        "If it is a school or work account, check the organization's administrator or data policy too",
        "Inspect the relevant product control and record exactly what it says — no broader"
      ],
      "note": "If no memory control exists, that establishes only that you cannot manage saved personalization there. It does not prove that no chat record, service log, retention period, review process, or training rule exists."
    },
    {
      "kind": "tryLive",
      "title": "Optional: view, clear, and confirm safely",
      "prompt": "Use only the invented fact 'my houseplant is named Gerald.' Test whether it remains in the current chat. Then inspect — without changing anything you need — where this product shows chat history, saved memory or personalization, data-use controls, and links to its policy. Write one sentence for what each screen establishes and one thing it does not establish.",
      "note": "This optional step leaves LearningAI. Do not enter a real name, address, password, account number, private message, health detail, school or workplace secret, or another person's information. You may instead use the five built-in examples above."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a memory-and-retention check",
      "cardType": "Data-path check",
      "fields": [
        {
          "key": "question",
          "label": "Which data path am I asking about?",
          "placeholder": "context / history or logs / saved memory / retention or review / training use"
        },
        {
          "key": "control",
          "label": "What the visible control actually establishes",
          "placeholder": "e.g. saved personalization is off; this does not describe every retained log"
        },
        {
          "key": "policy",
          "label": "Provider or organization policy to check",
          "placeholder": "e.g. retention, deletion, authorized review, and model-improvement terms"
        },
        {
          "key": "rule",
          "label": "My safe paste rule",
          "placeholder": "If retention would cause harm, I do not enter it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Transfer the data-path check",
      "question": "A school account hides chat history after 30 days and has no visible Memory switch. What can you responsibly conclude about the learner's data?",
      "options": [
        {
          "text": "Only the visible-history behavior and absence of that control are established. I still need the provider and school policies to understand logs, retention, authorized review, deletion, and model-improvement use.",
          "ok": true,
          "feedback": "Exactly. You matched the claim to the evidence and kept visible history, controls, service records, and policy-defined uses separate."
        },
        {
          "text": "Every copy is automatically deleted after 30 days because the history is no longer visible.",
          "ok": false,
          "feedback": "A visibility limit does not by itself prove deletion from service logs, backups, or other policy-defined systems."
        },
        {
          "text": "The missing Memory switch proves the account cannot retain any information in any form.",
          "ok": false,
          "feedback": "A missing personalization control does not establish what records, retention, review, or organization rules exist."
        },
        {
          "text": "The policy is all that matters, so I do not need to inspect the actual account controls.",
          "ok": false,
          "feedback": "You need both: policy describes the service rules, while controls show choices or saved items for this account."
        }
      ]
    }
  ]
};
