// Lesson 8 — What It Is NOT
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-8",
  "num": 8,
  "arc": "How It Works",
  "title": "What Its Words Do Not Prove",
  "coreQuestion": "When an AI sounds caring, certain, or personal, what can I verify — and what do the words not prove?",
  "blurb": "Warm language can be useful and still feel real. Keep the benefit without mistaking generated style for a relationship or judgment.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A useful sentence can still feel personal",
      "scenario": "A fictional learner tells an assistant, 'I finally finished the project.' It replies, 'I'm proud of you. I knew you could do it.' The line may feel encouraging, but the wording alone cannot prove that the system feels pride, knows the learner, or has stayed beside them over time.",
      "prompt": "Keep the useful part without pretending the words prove a relationship. Rewrite the reply as one honest sentence."
    },
    {
      "kind": "reveal",
      "title": "Judge claims by evidence, not by tone",
      "body": "AI products learn patterns in human communication and can generate language that sounds warm, certain, playful, worried, or loyal. That style may help a person pause, reflect, or feel encouraged. Your reaction is real. The wording is still not evidence that the system feels an emotion, knows you as a person, shares responsibility, or can replace human care.\n\nSeparate two questions: 'Was this response useful to me?' and 'What does the system actually know, feel, or take responsibility for?' You can answer the first from your experience. For the second, test observable capabilities and limits rather than trusting first-person phrases such as 'I think,' 'I care,' or 'I've got your back.'",
      "mistake": "Either treating warm wording as proof of a relationship, or mocking the learner because the wording affected them.",
      "good": "Acknowledge the real effect, translate the system's claim into observable terms, and choose a person when care, accountability, or safety is required."
    },
    {
      "kind": "classify",
      "title": "What kind of claim is this?",
      "prompt": "Sort each statement by how you should evaluate it.",
      "buckets": [
        "Test the observable capability",
        "Do not treat the wording as proof of feeling or relationship",
        "Bring in a responsible person"
      ],
      "items": [
        {
          "text": "'I can turn this paragraph into three bullet points.'",
          "answer": 0
        },
        {
          "text": "'I'm proud of you and I will always be here for you.'",
          "answer": 1
        },
        {
          "text": "'I checked every source and the answer is definitely correct.'",
          "answer": 0
        },
        {
          "text": "'Do not tell anyone, but I can handle this crisis with you.'",
          "answer": 2
        },
        {
          "text": "'I understand exactly how you feel.'",
          "answer": 1
        },
        {
          "text": "'I can draft options, but you should decide which one fits.'",
          "answer": 0
        }
      ],
      "reveal": "Capabilities can be tested: inspect the summary, open the sources, or compare the options. Feeling and relationship claims are not proven by first-person wording. When the situation needs care, duty, consent, or emergency help, involve a real person who can understand the situation and accept responsibility."
    },
    {
      "kind": "workflowChain",
      "title": "Keep the help; keep the boundary",
      "goal": "Respond to a human-sounding AI line without dismissing the learner or handing the system a human role.",
      "correct": [
        "Notice the exact phrase and your reaction to it",
        "Name the useful function, such as encouragement or summarizing",
        "Translate the first-person wording into an observable system action",
        "Check any factual or consequential claim separately",
        "Move care, crisis, consent, or accountability to a responsible person"
      ],
      "choices": [
        "Move care, crisis, consent, or accountability to a responsible person",
        "Translate the first-person wording into an observable system action",
        "Notice the exact phrase and your reaction to it",
        "Check any factual or consequential claim separately",
        "Name the useful function, such as encouragement or summarizing"
      ],
      "note": "This built-in scenario is the required practice. You do not need to share anything personal or provoke an outside assistant into sounding attached to you."
    },
    {
      "kind": "compare",
      "title": "Two translations of the same line",
      "weak": "'I'm proud of you' proves the assistant knows me and has been rooting for me.",
      "strong": "The assistant generated an encouraging response that helped me mark the moment. That effect can be useful; the sentence does not prove the system feels pride, knows me, or shares responsibility for what happens next.",
      "why": "The stronger translation preserves the learner's real reaction while making only claims the wording can support. It turns an emotional performance into a tool you can use without confusing it with human care."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save a boundary translation",
      "cardType": "Human-words translator",
      "fields": [
        {
          "key": "line",
          "label": "The supplied human-sounding line",
          "placeholder": "I'm proud of you. I knew you could do it."
        },
        {
          "key": "function",
          "label": "The useful function",
          "placeholder": "an encouraging response that helps mark progress"
        },
        {
          "key": "boundary",
          "label": "What the wording does not prove",
          "placeholder": "feeling, relationship, factual certainty, or shared responsibility"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Translate without dismissing",
      "question": "An assistant says, 'I know you better than anyone, and I will always protect you.' Which response keeps the useful boundary?",
      "options": [
        {
          "text": "That line may feel reassuring, but it does not prove knowledge, care, or protection. I will test useful outputs and take needs involving trust or safety to a responsible person.",
          "ok": true,
          "feedback": "Yes. You respected the reaction, limited the claim to evidence, and kept human responsibility in the right place."
        },
        {
          "text": "It says it knows me, so this relationship is as reliable as a human one.",
          "ok": false,
          "feedback": "First-person wording is not evidence of a relationship or a promise the system can accept responsibility for."
        },
        {
          "text": "Anyone affected by that sentence is foolish, so the right response is to ignore every useful part.",
          "ok": false,
          "feedback": "The reaction can be real and the response can still be useful. The skill is keeping the benefit while naming the boundary accurately."
        },
        {
          "text": "I should share more private details so it can prove how well it knows me.",
          "ok": false,
          "feedback": "More disclosure does not turn generated language into human care. Share only what the task needs and involve a person when trust or safety matters."
        }
      ]
    }
  ]
};
