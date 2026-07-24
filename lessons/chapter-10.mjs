// Lesson 10 — Talking and Showing
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-10",
  "num": 10,
  "arc": "How It Works",
  "title": "Choose the Right Input",
  "coreQuestion": "When should I type, talk, or show something — and how do I limit what the system receives?",
  "blurb": "Text, voice, and images can open different routes to the same task. Choose the least exposure, expect conversion errors, and keep an equal no-camera, no-microphone path.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Three routes into one task",
      "scenario": "You want an assistant to clean up a handwritten recipe. You could type the words, read them aloud, or show a carefully cropped photo. Each route may work, but each exposes different information and can introduce different errors.",
      "prompt": "Which route would you choose, and what would you check before sending anything? There is no single right doorway — explain your tradeoff."
    },
    {
      "kind": "reveal",
      "title": "Multimodal means more than one kind of input",
      "body": "Many assistants can accept text, voice, images, or files. The product may use different systems for each route: speech recognition can turn audio into text; optical character recognition can extract writing from an image; a vision model can interpret visual patterns; another model can produce the reply. The assistant does not literally hear or see as a person does.\n\nEach conversion can fail. Speech recognition can miss an accent, name, or noisy word. OCR can confuse letters and numbers. A vision system can overlook a detail outside the crop or confidently misread a blurry object. Choose the route that gives the task enough information with the least exposure, then compare the system's reading with the original. Camera and microphone access are permissions, not requirements. You can always use the supplied examples in this lesson instead.",
      "mistake": "Assuming voice or image input is automatically more accurate, or granting broad camera and microphone access because the feature is convenient.",
      "good": "Choose a suitable input, limit what it contains, inspect the conversion, and use a text or built-in route when a device feature is unavailable or unwanted."
    },
    {
      "kind": "classify",
      "title": "Which route fits with the least exposure?",
      "prompt": "Choose the simplest suitable route. Text is enough when the task can be described without sending a recording or image.",
      "buckets": [
        "Text is enough",
        "Talk may be easiest",
        "Show a cropped image may be easiest"
      ],
      "items": [
        {
          "text": "Ask for three dinner ideas using eggs and rice; you can type those two ingredients.",
          "answer": 0
        },
        {
          "text": "Capture a quick reminder while your hands are busy, after checking microphone permission.",
          "answer": 1
        },
        {
          "text": "Transcribe one handwritten recipe card after cropping out the family name on the back.",
          "answer": 2
        },
        {
          "text": "Rewrite this supplied sentence: 'Meeting moved two thurday at tree.'",
          "answer": 0
        },
        {
          "text": "Describe the visible controls on an unfamiliar appliance using a close crop with no room or location details.",
          "answer": 2
        },
        {
          "text": "Brainstorm a title for a project without sharing any file, photo, or recording.",
          "answer": 0
        }
      ],
      "reveal": "Multimodal does not mean 'send more.' Text often exposes the least. Voice can reduce typing effort, and a close crop can preserve details that are hard to transcribe. The best route is the one that fits the learner and gives the system only what the task needs."
    },
    {
      "kind": "workflowChain",
      "title": "Use voice or images without opening everything",
      "goal": "Get help transcribing a recipe while keeping device access, private details, and errors under control.",
      "correct": [
        "Decide whether typing or the supplied example can complete the task",
        "If using a device feature, review the camera or microphone permission before allowing it",
        "Crop the image or shorten the recording to only what the task needs",
        "Remove names, faces, locations, notifications, and unrelated background details",
        "Ask the system to mark words it cannot read instead of guessing",
        "Compare the transcription with the original and correct errors",
        "Revoke the permission afterward if you do not want continuing access"
      ],
      "choices": [
        "Ask the system to mark words it cannot read instead of guessing",
        "Remove names, faces, locations, notifications, and unrelated background details",
        "Revoke the permission afterward if you do not want continuing access",
        "Crop the image or shorten the recording to only what the task needs",
        "Compare the transcription with the original and correct errors",
        "If using a device feature, review the camera or microphone permission before allowing it",
        "Decide whether typing or the supplied example can complete the task"
      ],
      "note": "The built-in route is fully equivalent: use the fictional transcription in the next step. No camera, microphone, upload, outside assistant, or device permission is required."
    },
    {
      "kind": "compare",
      "title": "Built-in practice: catch the conversion error",
      "weak": "Supplied transcription: 'Bake at four hundred degrees for fifth teen minutes. Add one cup floor.' Accept it because the system sounded confident.",
      "strong": "Compare with the supplied original: 'Bake at 400 degrees for 15 minutes. Add one cup flour.' Mark 'fifth teen' and 'floor' as conversion errors, correct them, and keep the original for reference.",
      "why": "This is the same judgment skill used with voice, OCR, or a vision system: inspect what the system extracted before trusting the reply built on top of it. You practiced it without granting any device access."
    },
    {
      "kind": "reveal",
      "title": "Optional device practice",
      "body": "If you choose to test voice or image input in an outside assistant, use a harmless sentence or an invented, non-private object. Check whether the app asks for one-time access or ongoing access, send only what the task needs, and inspect the transcript or image description before continuing. On a school or work device, follow its policy. Skipping outside practice does not reduce completion; the built-in classification, permission sequence, and conversion check are the required evidence.",
      "mistake": "Believing the lesson requires a particular device, account, camera, microphone, or outside product.",
      "good": "Choose the route that works for your body, device, privacy needs, and task — then verify the conversion."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save your input-choice habit",
      "cardType": "Input route check",
      "fields": [
        {
          "key": "route",
          "label": "The least-exposure route",
          "placeholder": "text, voice, cropped image, or the built-in example"
        },
        {
          "key": "permission",
          "label": "Permission and privacy check",
          "placeholder": "one-time microphone access; no names or background details"
        },
        {
          "key": "conversion",
          "label": "How I will check the conversion",
          "placeholder": "compare the transcript, extracted text, or image description with the original"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Choose a route and keep control",
      "question": "You need help transcribing a short note, but you do not have camera access and do not want to enable the microphone. What demonstrates the lesson's skill?",
      "options": [
        {
          "text": "Use text or the supplied built-in example, identify and correct the conversion errors, and explain what I would crop, permit, and verify if I later chose voice or image input.",
          "ok": true,
          "feedback": "Exactly. The skill is choosing and checking an input route, not proving that you own or permit a particular device feature."
        },
        {
          "text": "I cannot complete the lesson until I buy a device with a camera and microphone.",
          "ok": false,
          "feedback": "Camera and microphone access are optional. Text and the supplied built-in conversion example teach the same control decisions."
        },
        {
          "text": "Grant every permission now so future tasks will be faster.",
          "ok": false,
          "feedback": "Convenience is not a reason for unlimited access. Review the permission, allow only what the task needs, and revoke it when appropriate."
        },
        {
          "text": "Trust the extracted words because multimodal systems can see and hear like people.",
          "ok": false,
          "feedback": "Speech, OCR, and vision systems convert inputs and can make confident errors. Compare the conversion with the original."
        }
      ]
    }
  ]
};
