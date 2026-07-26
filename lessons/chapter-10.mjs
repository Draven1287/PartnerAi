// Lesson 10 — Talking and Showing
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-10",
  "num": 10,
  "arc": "How It Works",
  "title": "Type It, Say It, or Show It",
  "coreQuestion": "When should I type, talk, or show a photo — and how do I give away as little as possible?",
  "blurb": "Three ways into one task. Pick the one that shows least, expect mistakes, and never need a camera to finish.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Three ways into one task",
      "scenario": "You want help turning your gran's handwritten recipe into something you can actually read.\n\nYou could type the words out. You could read them aloud. You could take a photo, cropped tight on the card.\n\nAll three might work. Each one hands over something different. Each one can go wrong in a different way.",
      "prompt": "Which would you pick, and what would you check before sending it? There is no single right door. Explain the trade-off."
    },
    {
      "kind": "reveal",
      "title": "Typing, talking, and showing",
      "body": "Many AI apps take typing, speech, photos, or files. Behind the screen, different parts handle each one.\n\nOne part turns sound into words. One part pulls the writing out of a photo. One part looks at a picture and describes what it seems to show. Then the AI writes a reply from that. People call an app that takes several ways in multimodal. It only means more than one door.\n\nThe app does not hear or see the way you do. Every one of those steps can slip. Speech gets accents and names wrong. Writing pulled out of a photo mixes up letters and numbers. A picture reader can miss something just outside the crop, or confidently misread a blurry object.\n\nSo pick the door that gives the task enough and shows the least. Then compare what it read with what was really there.\n\nLetting an app use your camera or microphone is a permission: you allowing it, and you can take it back. It is never required. You can finish this lesson using the examples here.",
      "mistake": "Assuming a photo or your voice is automatically more accurate, or handing over the camera and microphone because it is quicker.",
      "good": "Pick a door, keep it narrow, check what it read, and use typing when a camera is not available or not wanted."
    },
    {
      "kind": "classify",
      "title": "Which door shows the least?",
      "prompt": "Pick the simplest door that still works. Typing is enough whenever you can describe the task in words.",
      "buckets": [
        "Typing is enough",
        "Talking may be easiest",
        "A cropped photo may be easiest"
      ],
      "items": [
        {
          "text": "Ask for three dinner ideas using eggs and rice. You can type two words.",
          "answer": 0
        },
        {
          "text": "Catch a reminder while your hands are covered in flour, after checking the microphone.",
          "answer": 1
        },
        {
          "text": "Copy out one handwritten recipe card, cropped so the family name on the back is out of shot.",
          "answer": 2
        },
        {
          "text": "Rewrite this line: 'Meeting moved two thurday at tree.'",
          "answer": 0
        },
        {
          "text": "Describe the buttons on a machine you do not know, cropped close, with none of the room in shot.",
          "answer": 2
        },
        {
          "text": "Think up a title for a project, with no file, photo, or recording at all.",
          "answer": 0
        }
      ],
      "reveal": "More doors does not mean send more. Typing usually shows the least. Talking saves effort. A tight crop keeps detail that is slow to type. The best door gives the app only what the task needs."
    },
    {
      "kind": "workflowChain",
      "title": "Use your voice or camera without opening everything",
      "goal": "Get help copying out a recipe while keeping your camera, your private details, and the mistakes under control.",
      "correct": [
        "Decide whether typing, or the example here, already does the job",
        "If you use the camera or microphone, look at what you are allowing first",
        "Crop the photo, or trim the recording, down to just the task",
        "Take out names, faces, places, notifications, and anything else in the background",
        "Ask it to mark words it cannot read, instead of guessing them",
        "Compare what it read with the original, and fix the mistakes",
        "Switch the camera or microphone access back off if you do not want it left on"
      ],
      "choices": [
        "Ask it to mark words it cannot read, instead of guessing them",
        "Take out names, faces, places, notifications, and anything else in the background",
        "Switch the camera or microphone access back off if you do not want it left on",
        "Crop the photo, or trim the recording, down to just the task",
        "Compare what it read with the original, and fix the mistakes",
        "If you use the camera or microphone, look at what you are allowing first",
        "Decide whether typing, or the example here, already does the job"
      ],
      "note": "The built-in route counts exactly the same. Use the made-up copy in the next step. No camera, microphone, upload, outside app, or access is needed."
    },
    {
      "kind": "compare",
      "title": "Practise here: catch the misread word",
      "weak": "What it read: 'Bake at four hundred degrees for fifth teen minutes. Add one cup floor.' Accept it, because it sounded sure.",
      "strong": "Compare it with the card: 'Bake at 400 degrees for 15 minutes. Add one cup flour.' Mark 'fifth teen' and 'floor' as misreadings, fix them, and keep the card to check against.",
      "why": "That is the same judgement you use with speech, photos, or files. Check what the app pulled out before you trust the answer built on top of it. You just did it without giving away anything."
    },
    {
      "kind": "reveal",
      "title": "If you want to try it on your own device",
      "body": "If you do test speech or photos in an outside app, use a harmless sentence or a made-up object.\n\nLook at whether it wants access once or forever. Send only what the task needs. Read what it heard or saw before you go on.\n\nOn a school device, follow the school's rules. On a shared device, remember the next person.\n\nSkipping this leaves nothing unfinished. The sorting, the ordering, and the misread-word check above are what count.",
      "mistake": "Thinking the lesson needs a certain phone, account, camera, microphone, or app.",
      "good": "Pick the door that suits your body, your device, your privacy, and the task. Then check what it read."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save your door-choosing habit",
      "cardType": "Choosing a door",
      "fields": [
        {
          "key": "route",
          "label": "The door that shows least",
          "placeholder": "typing, talking, a cropped photo, or the example here"
        },
        {
          "key": "permission",
          "label": "What I allowed, and what I kept out",
          "placeholder": "microphone once only; no names, nothing in the background"
        },
        {
          "key": "conversion",
          "label": "How I check what it read",
          "placeholder": "compare its version with the original, word by word"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Pick a door and keep control",
      "question": "You need help copying out a short note. You have no camera and you do not want the microphone on. What shows the skill?",
      "options": [
        {
          "text": "Type it, or use the example here, then find and fix the misread words. If I ever did use a photo or my voice, I could say what I would crop, allow, and check.",
          "ok": true,
          "feedback": "Exactly. The skill is choosing a door and checking what came out. Not proving you own a particular device."
        },
        {
          "text": "I cannot finish this lesson until I get a phone with a camera and microphone.",
          "ok": false,
          "feedback": "Camera and microphone are optional. Typing and the example here teach the same choices."
        },
        {
          "text": "Allow everything now, so later tasks are quicker.",
          "ok": false,
          "feedback": "Being quicker is not a reason to hand over everything. Allow what the task needs, then switch it off."
        },
        {
          "text": "Trust the words it pulled out, because these apps see and hear like people do.",
          "ok": false,
          "feedback": "They convert what you send, and they make confident mistakes. Compare it with the original."
        }
      ]
    }
  ]
};
