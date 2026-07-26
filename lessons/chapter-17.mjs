// Lesson 17 — AI Is Already in Your Apps
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-17",
  "num": 17,
  "arc": "Trust & Everyday AI",
  "title": "AI Is Already in Your Apps",
  "coreQuestion": "Where is AI quietly shaping what an app shows me, and what should change how much I trust it?",
  "blurb": "Spot the quiet AI bits in apps you already use. Read what the app itself says they do. Check harder when a mistake would cost you.",
  "minutes": 17,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Nothing announced itself",
      "scenario": "Your photo app has quietly gathered every picture of your best friend into one folder. Your email offers you a ready-made reply. A search page writes you a paragraph before any of the links.\n\nNone of them said 'this is AI'. Each one is doing a different job, and the same app can behave differently on a school account.",
      "prompt": "Before you rely on one of these, which matters more: whether the word AI appears anywhere, or what happens if it gets it wrong?"
    },
    {
      "kind": "classify",
      "title": "Look at the evidence, not the buzzword",
      "prompt": "Sort each clue by what it can honestly tell you. These are all built in, so you do not need any particular phone.",
      "buckets": [
        "Tells me something real about this feature",
        "Only a guess"
      ],
      "items": [
        {
          "text": "The app's own help page says photo search matches faces, and shows how to fix a wrong match.",
          "answer": 0
        },
        {
          "text": "A chatbot says the feature 'probably uses AI somewhere'.",
          "answer": 1
        },
        {
          "text": "A setting names the feature, shows whether it is on, and says what it is allowed to look at.",
          "answer": 0
        },
        {
          "text": "The answer arrived fast and looked futuristic.",
          "answer": 1
        },
        {
          "text": "Your school says this feature is switched off on school accounts.",
          "answer": 0
        },
        {
          "text": "A friend has the same app and assumes every account works the same.",
          "answer": 1
        }
      ],
      "reveal": "A label, a slick animation, or a confident guess tells you nothing about how one feature works. The app's own help page, the settings you can see, and your school's rules are far stronger. Even then, stay on the choice in front of you. What does the feature do? What can it see? What would a mistake cost?"
    },
    {
      "kind": "reveal",
      "title": "Lots of different jobs, not one hidden brain",
      "body": "AI inside everyday apps is not one recipe copied everywhere. Different parts do different jobs.\n\nOne puts search results in an order. One matches pictures to each other. One turns speech into text. One writes new sentences or makes new images.\n\nPlenty of features mix a guessing part with plain fixed rules, or with a person checking the result.\n\nYou do not have to name every piece before you use something. You need enough to answer four questions.\n\nWhat job is this feature doing?\n\nWhat is it allowed to see?\n\nCan I turn it off, correct it, or undo a mistake?\n\nWhat changes if it gets it wrong?",
      "mistake": "Treating 'AI' as one yes-or-no label, then trusting or refusing every feature the same way.",
      "good": "Looking at the actual feature and its settings, then checking harder as the cost of a mistake goes up."
    },
    {
      "kind": "workflowChain",
      "title": "Look before you lean on it",
      "goal": "A calendar app suggests a time for your study group. Get it wrong and somebody turns up to an empty room. Put the check in order.",
      "correct": [
        "Name the thing you might rely on: the time it suggested",
        "Read the app's own label, help page, settings, or your school's rules, instead of asking another AI to guess",
        "Check what it looked at, and whether you can correct the suggestion or switch it off",
        "Compare the suggestion with the real calendar entry, because getting it wrong costs somebody an afternoon",
        "If it is wrong, fix the entry, then change or switch off the feature before next time"
      ],
      "choices": [
        "Compare the suggestion with the real calendar entry, because getting it wrong costs somebody an afternoon",
        "Name the thing you might rely on: the time it suggested",
        "If it is wrong, fix the entry, then change or switch off the feature before next time",
        "Check what it looked at, and whether you can correct the suggestion or switch it off",
        "Read the app's own label, help page, settings, or your school's rules, instead of asking another AI to guess"
      ],
      "note": "If a mistake costs nothing, this takes seconds. For health, money, school, work, safety, or somebody else's private information, slow down and check a source that actually knows."
    },
    {
      "kind": "tryLive",
      "title": "Optional: look up one real feature",
      "prompt": "Pick one ordinary feature you can safely look into. Or use this one: 'an email app offers a ready-made reply.' Find the app's own label, help text, or setting. Write down four things: what job it says it does, what control you have, one way it could be wrong, and how you would fix it if it were.",
      "note": "You do not need to list your real apps or devices. Do not share account names, contacts, messages, photos, school details, or where you have been. If the app explains nothing, write 'not stated' rather than asking a chatbot to invent an explanation."
    },
    {
      "kind": "toolkitSave",
      "title": "Save an everyday-AI check",
      "cardType": "Everyday-AI feature check",
      "fields": [
        {
          "key": "feature",
          "label": "The feature and its job",
          "placeholder": "Calendar suggests a time for the study group"
        },
        {
          "key": "evidence",
          "label": "What tells me how it works",
          "placeholder": "The help page, a setting, or a school rule"
        },
        {
          "key": "consequence",
          "label": "What a mistake would cost",
          "placeholder": "Somebody turns up to an empty room"
        },
        {
          "key": "control",
          "label": "How I fix it or switch it off",
          "placeholder": "Compare with the invite, fix it, then turn suggestions off"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Pick the check that actually holds up",
      "question": "A writing app quietly rewrites a sentence in a message to your teacher. Which response shows the whole skill?",
      "options": [
        {
          "text": "I find the rewrite setting and read what it says it does. Then I reread the changed sentence, because this message matters, and undo it if the meaning shifted.",
          "ok": true,
          "feedback": "Yes. You used what you could actually see, checked harder because it mattered, and kept a way to undo it."
        },
        {
          "text": "It looks like AI, so I decide it is unsafe and never open the app again.",
          "ok": false,
          "feedback": "The label alone does not settle it. Look at the feature, its settings, and what a mistake would cost."
        },
        {
          "text": "I ask a different chatbot whether this app uses AI, and believe whatever it says.",
          "ok": false,
          "feedback": "That is one more guess. Use the app's own help page, the settings you can see, and any school rule."
        },
        {
          "text": "Grammar changes are usually harmless, so I send it without rereading.",
          "ok": false,
          "feedback": "The cost depends on this message, not on the type of feature. A changed meaning going to a teacher is worth ten seconds."
        }
      ]
    }
  ]
};
