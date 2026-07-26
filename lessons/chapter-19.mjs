// Lesson 19 — Context and Memory
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-19",
  "num": 19,
  "arc": "Trust & Everyday AI",
  "title": "When It Seems to Remember",
  "coreQuestion": "When an AI seems to remember me, what is actually going on, and what can I really check?",
  "blurb": "Five different things all get called memory. Telling them apart stops an empty Memory screen from feeling like a promise.",
  "minutes": 18,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Forgotten here does not mean gone",
      "scenario": "You tell a chatbot one made-up thing: your houseplant is called Gerald.\n\nLater in the same chat it mentions Gerald. You open a new chat and it has no idea who Gerald is. The old chat is still sitting in your list. The Memory screen is empty.",
      "prompt": "What has that little test actually proved? And what have you learned nothing about yet?"
    },
    {
      "kind": "reveal",
      "title": "Five different things, one word",
      "body": "Apps use the word memory for five different things. Keeping them apart is the whole skill.\n\n1. Still in this chat. Everything you typed in this conversation is sitting in front of it while it writes. That is why it can use something from ten messages ago.\n\n2. Your chat list. The company keeps a copy of the conversation. Seeing an old chat does not mean you are seeing every record they kept.\n\n3. Remembered on purpose. Some apps save a few facts about you and bring them back in new chats.\n\n4. Kept behind the scenes. How long copies stay, who at the company is allowed to look at them, and what the delete button actually removes.\n\n5. Used to build the next one. Whether your chats may later help train the next version.\n\nA new chat forgetting Gerald proves one of those. An empty Memory screen proves one setting is off. Neither one tells you about copies, staff, school rules, or training.",
      "mistake": "Reading 'it forgot in a new chat' or 'Memory is empty' as proof that nothing is stored anywhere.",
      "good": "Check the settings you can see, the company's current rules, and for a school account, the school's rules. Then only type things you could live with being kept."
    },
    {
      "kind": "classify",
      "title": "Which one is it?",
      "prompt": "Sort each example into the thing it really describes. Real apps mix these up and label them differently, so the point is to keep the five questions separate in your head.",
      "buckets": [
        "Still in this chat",
        "Kept in your chat list",
        "Remembered on purpose",
        "Kept behind the scenes",
        "Used to build the next one"
      ],
      "items": [
        {
          "text": "It uses a detail from ten messages ago to answer you now.",
          "answer": 0
        },
        {
          "text": "Yesterday's conversation is still there when you open the app.",
          "answer": 1
        },
        {
          "text": "A setting saves how you like answers laid out, and uses it in future chats.",
          "answer": 2
        },
        {
          "text": "The rules explain how long deleted chats stay in copies, and when staff are allowed to read them.",
          "answer": 3
        },
        {
          "text": "A switch decides whether your conversations may help train the next version.",
          "answer": 4
        },
        {
          "text": "A school sets a different time limit on how long chats are stored than a personal account has.",
          "answer": 3
        }
      ],
      "reveal": "Each one answers a different question. What it can see right now. What copies exist. What comes back in a new chat. How long things stay and who may read them. Whether any of it trains the next version. One switch might touch several of these. Never assume it settles all five."
    },
    {
      "kind": "workflowChain",
      "title": "Only claim what you can show",
      "goal": "You want to know what really happens to a harmless chat after you delete it. Put the digging in order.",
      "correct": [
        "Say exactly which of the five you are asking about",
        "Open the setting that covers it and write down only what it actually says",
        "Read the company's current rules on keeping, deleting, staff access, and training",
        "On a school or work account, check that place's own rules as well",
        "Write down what you now know, what you still do not, and set a rule for what you will never type in"
      ],
      "choices": [
        "Read the company's current rules on keeping, deleting, staff access, and training",
        "Write down what you now know, what you still do not, and set a rule for what you will never type in",
        "Say exactly which of the five you are asking about",
        "On a school or work account, check that place's own rules as well",
        "Open the setting that covers it and write down only what it actually says"
      ],
      "note": "If there is no memory setting at all, that tells you one thing: there is nowhere to manage saved facts. It does not prove there is no chat record, no copy, no time limit, no staff access, and no training rule."
    },
    {
      "kind": "tryLive",
      "title": "Optional: look, clear, and confirm safely",
      "prompt": "Use only the made-up fact that your houseplant is called Gerald. Check whether it sticks inside one chat. Then look at where this app shows your chat list, any saved facts about you, any switch about training, and a link to its rules. For each screen, write one sentence on what it proves and one on what it does not.",
      "note": "This optional step leaves LearningAI. Do not enter a real name, address, password, account number, private message, health detail, school secret, or anything about another person. You can do the whole lesson on the six built-in examples instead."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a what-is-kept check",
      "cardType": "Data-path check",
      "fields": [
        {
          "key": "question",
          "label": "Which of the five am I asking about?",
          "placeholder": "this chat / chat list / saved facts / kept behind the scenes / training"
        },
        {
          "key": "control",
          "label": "What the setting actually proves",
          "placeholder": "Saved facts are off. That says nothing about copies."
        },
        {
          "key": "policy",
          "label": "Whose rules I still need to read",
          "placeholder": "The company's rules, and my school's rules"
        },
        {
          "key": "rule",
          "label": "My rule for what I type in",
          "placeholder": "If it being kept would hurt, I do not type it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Use the same check somewhere new",
      "question": "A school account hides your chats after 30 days and has no memory switch at all. What can you honestly say about your data?",
      "options": [
        {
          "text": "Only that the chats stop showing after 30 days and there is no saved-facts switch. I still need the company's rules and the school's rules to know about copies, time limits, staff access, deleting, and training.",
          "ok": true,
          "feedback": "Exactly. You matched what you claimed to what you could actually see, and kept the five questions apart."
        },
        {
          "text": "Every copy is wiped after 30 days, because I cannot see the chats any more.",
          "ok": false,
          "feedback": "Not being able to see something is not the same as it being gone. Copies and records can outlive what shows on your screen."
        },
        {
          "text": "There is no memory switch, so the account cannot be keeping anything at all.",
          "ok": false,
          "feedback": "A missing switch tells you about one setting. It says nothing about records, time limits, staff access, or school rules."
        },
        {
          "text": "The written rules are all that matter, so there is no need to look at the account settings.",
          "ok": false,
          "feedback": "You need both. The rules describe the service. The settings show what is switched on for this account."
        }
      ]
    }
  ]
};
