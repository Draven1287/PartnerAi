/* Learning AI V2 — lesson data. AUTO-GENERATED from lessons/chapter-N.mjs. */
(function(){
  var L = [];
  L.push({
  "id": "chapter-1",
  "num": 1,
  "arc": "Orientation",
  "title": "Why AI matters — and why you stay in charge",
  "coreQuestion": "When should I use AI, and what do I keep deciding myself?",
  "blurb": "Start from your choices, not the hype. Set one rule you can keep.",
  "minutes": 8,
  "resources": [
    {
      "label": "Elements of AI — free intro course",
      "url": "https://www.elementsofai.com/"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You see this every week",
      "scenario": "One friend uses AI and their grades go up. Another says AI is dangerous and refuses to touch it. A third uses it for literally everything. They are all talking at once.",
      "prompt": "Before reading on: in one sentence, what would YOUR rule be?"
    },
    {
      "kind": "classify",
      "title": "Sort these uses",
      "prompt": "Which of these keep you learning, and which quietly replace your thinking?",
      "buckets": [
        "Keeps me thinking",
        "Replaces my thinking"
      ],
      "items": [
        {
          "text": "Ask AI to explain a concept, then re-explain it back in your own words",
          "answer": 0
        },
        {
          "text": "Paste the homework question and copy the answer",
          "answer": 1
        },
        {
          "text": "Ask for 3 angles on an essay, then pick and argue one yourself",
          "answer": 0
        },
        {
          "text": "Let AI write the whole essay and submit it",
          "answer": 1
        }
      ],
      "reveal": "The line is not \"AI or no AI.\" It is \"did I still do the thinking that matters?\""
    },
    {
      "kind": "reveal",
      "title": "Agency is the real skill",
      "body": "AI is useful when a human keeps the goal, the method, and the verification. Speed is not the same as understanding.",
      "mistake": "Trusting a fluent answer because it sounds confident.",
      "good": "Use AI to improve your reasoning, and skip it when it tempts you to stop thinking."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "I am deciding when AI helps me without replacing my thinking. Give me 5 useful use cases and 5 risky shortcuts for a high-school student. For each risky shortcut, add one question I should ask myself before using it.",
      "note": "Run this in any free AI tool, then keep the 5 risky ones near your desk."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your agency rule",
      "cardType": "Agency rule",
      "fields": [
        {
          "key": "help",
          "label": "I want AI to help me…",
          "placeholder": "draft, explain, brainstorm…"
        },
        {
          "key": "never",
          "label": "I will not let AI decide…",
          "placeholder": "what I actually believe"
        },
        {
          "key": "check",
          "label": "Before I trust it, I will check…",
          "placeholder": "one source / my own attempt"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which is the strongest reason to keep a human in charge?",
      "options": [
        {
          "text": "AI is always wrong",
          "ok": false,
          "feedback": "Too strong — AI is often useful. The issue is unverified trust."
        },
        {
          "text": "A fluent answer can still be wrong or low-value",
          "ok": true,
          "feedback": "Exactly. Confidence is not proof."
        },
        {
          "text": "Using AI is against the rules",
          "ok": false,
          "feedback": "Not the point — many uses are fine when you stay in charge."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-2",
  "num": 2,
  "arc": "Orientation",
  "title": "Your first useful AI conversation",
  "coreQuestion": "How do I frame a request so the answer is useful and checkable?",
  "blurb": "A good conversation is a loop, not one-shot magic.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Ten minutes, something hard",
      "scenario": "You are stuck on photosynthesis with a quiz tomorrow. You want help, but you do not want to just copy and understand nothing.",
      "prompt": "What is the first thing you would type?"
    },
    {
      "kind": "compare",
      "title": "Two ways to ask",
      "weak": "Help me study for biology.",
      "strong": "You are my tutor. I am studying photosynthesis for a quiz. Ask me one question first, give one hint, then explain simply. Make me try one example before you give the full answer.",
      "why": "The strong version sets a role, context, structure, and a required learner check — so the AI coaches instead of dumping an answer."
    },
    {
      "kind": "promptRepair",
      "title": "Repair a weak prompt",
      "weak": "explain the water cycle",
      "fields": [
        "Goal",
        "Context",
        "Constraints",
        "Format"
      ],
      "strong": "Goal: understand the water cycle well enough to teach it. Context: I am in 9th grade and confused about condensation vs. evaporation. Constraints: simple words, no jargon without a definition. Format: 4 short steps, then 2 quiz questions for me."
    },
    {
      "kind": "reveal",
      "title": "Make a loop, not a dump",
      "body": "A useful request includes role, context, what help you want, and what the AI should NOT do for you.",
      "mistake": "Accepting a full answer immediately, without your own attempt.",
      "good": "Ask for a short output first, then a follow-up after you try."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Act like a peer tutor for [your topic]. Ask what I already understand, give one hint, then wait for my attempt. Only after I try, give your fuller explanation.",
      "note": "Swap in a topic you actually have due this week."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a tutor prompt",
      "cardType": "Tutor prompt",
      "fields": [
        {
          "key": "subject",
          "label": "Subject",
          "placeholder": "Biology — photosynthesis"
        },
        {
          "key": "level",
          "label": "My current level",
          "placeholder": "shaky on the basics"
        },
        {
          "key": "check",
          "label": "A check I will do first",
          "placeholder": "try one example before the answer"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What made the strong prompt better?",
      "options": [
        {
          "text": "It was longer",
          "ok": false,
          "feedback": "Length alone is not it — vague long prompts still fail."
        },
        {
          "text": "It gave role, context, and a required check",
          "ok": true,
          "feedback": "Yes — structure creates a coaching loop."
        },
        {
          "text": "It used bigger words",
          "ok": false,
          "feedback": "No — it asked for simpler words, in fact."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-3",
  "num": 3,
  "arc": "Orientation",
  "title": "What AI actually is",
  "coreQuestion": "What is AI really doing, under the confident tone?",
  "blurb": "A pattern system, not a human mind. That frame keeps your options open.",
  "minutes": 8,
  "resources": [
    {
      "label": "Common Sense Media — AI basics",
      "url": "https://www.commonsensemedia.org/ai"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "\"It understands everything\"",
      "scenario": "A classmate insists the AI \"just knows\" the answer because it sounds so sure.",
      "prompt": "Do you buy it? Why or why not?"
    },
    {
      "kind": "classify",
      "title": "Which frame holds up?",
      "prompt": "Tag each statement as a useful frame or a misconception.",
      "buckets": [
        "Useful frame",
        "Misconception"
      ],
      "items": [
        {
          "text": "AI is trained software that generates patterns from data",
          "answer": 0
        },
        {
          "text": "AI thinks like a human and is almost always right",
          "answer": 1
        },
        {
          "text": "AI is a perfect, live library lookup",
          "answer": 1
        },
        {
          "text": "AI is great for fast drafts I then verify",
          "answer": 0
        }
      ],
      "reveal": "Patterns are powerful but not infallible. A polished paragraph can still be invented."
    },
    {
      "kind": "reveal",
      "title": "Generate first, verify always",
      "body": "AI is strong at generating language patterns fast. That gives you drafts and ideas quickly.",
      "mistake": "Confusing fluency with truth.",
      "good": "Use AI for options, then test each against your own understanding and a source."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Explain what AI is to a 14-year-old in 3 plain lines, without saying it is \"smart like a person.\" Then give me 2 trap questions I can use to check whether a definition is too naive.",
      "note": "Use the trap questions on a friend — or on yourself."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a myth-vs-reality card",
      "cardType": "Myth vs reality",
      "fields": [
        {
          "key": "myth",
          "label": "Myth",
          "placeholder": "AI just knows the answer"
        },
        {
          "key": "reality",
          "label": "Reality",
          "placeholder": "AI generates likely patterns"
        },
        {
          "key": "verify",
          "label": "So I will verify…",
          "placeholder": "any fact I would repeat out loud"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Best one-line definition?",
      "options": [
        {
          "text": "Software that recognizes and generates patterns from data",
          "ok": true,
          "feedback": "Practical and honest."
        },
        {
          "text": "A mind that understands like a person",
          "ok": false,
          "feedback": "Overstated — leads to trust mistakes."
        },
        {
          "text": "A search engine that is always right",
          "ok": false,
          "feedback": "No — it generates, and can invent."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-4",
  "num": 4,
  "arc": "Orientation",
  "title": "What an LLM is, without the magic",
  "coreQuestion": "Why is it so fluent, and why can it still be confidently wrong?",
  "blurb": "Tokens, context, and likely next words become your control points.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Fluent, and still wrong",
      "scenario": "Your model writes a smooth paragraph but skips one requirement you clearly stated.",
      "prompt": "What do you think happened inside?"
    },
    {
      "kind": "nextWord",
      "title": "Predict the next word",
      "stem": "The capital of France is",
      "options": [
        {
          "word": "Paris",
          "p": 0.94
        },
        {
          "word": "a",
          "p": 0.03
        },
        {
          "word": "beautiful",
          "p": 0.02
        },
        {
          "word": "banana",
          "p": 0.01
        }
      ],
      "note": "An LLM picks likely next tokens from context. Fluency comes from \"what usually follows,\" not from looking anything up."
    },
    {
      "kind": "reveal",
      "title": "Context is the steering wheel",
      "body": "An LLM predicts likely next tokens given your context and its training. If a key constraint is missing or buried, output drifts — confidently.",
      "mistake": "Assuming it \"remembers\" everything like a person.",
      "good": "State constraints explicitly, set an output format, and ask for a self-check."
    },
    {
      "kind": "compare",
      "title": "Where it goes wrong",
      "weak": "Write about the French Revolution. (then later) Also keep it under 100 words.",
      "strong": "In under 100 words, write about the French Revolution for a 9th grader. End by listing the 2 facts I should double-check.",
      "why": "Front-loading the constraint and asking for a verification list fights the \"drift\" you just saw."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Give me one 2-minute exercise that teaches a friend the difference between fluency and truth, using a single AI answer as the example.",
      "note": "Bonus: run the exercise and see if they get fooled."
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Why can an LLM be fluent but wrong?",
      "options": [
        {
          "text": "It predicts likely text, which is not the same as verified fact",
          "ok": true,
          "feedback": "Right — likelihood ≠ truth."
        },
        {
          "text": "It is broken",
          "ok": false,
          "feedback": "No — this is normal behavior to design around."
        },
        {
          "text": "It is lying on purpose",
          "ok": false,
          "feedback": "No intent — it has no notion of truth unless you add tools/checks."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-5",
  "num": 5,
  "arc": "Orientation",
  "title": "Prompt repair: goal, context, constraints, format",
  "coreQuestion": "How do I turn a weak ask into a useful instruction?",
  "blurb": "The difference between asking and prompting — a repeatable repair.",
  "minutes": 10,
  "resources": [
    {
      "label": "Stanford CRAFT — AI literacy resources",
      "url": "https://craft.stanford.edu/"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Boring answer again",
      "scenario": "Same question, but the answer comes back generic and useless. The question was not the problem — the prompt was.",
      "prompt": "What is one thing you would add to fix it?"
    },
    {
      "kind": "promptRepair",
      "title": "Repair it live",
      "weak": "give me a study summary",
      "fields": [
        "Goal",
        "Context",
        "Constraints",
        "Format"
      ],
      "strong": "Goal: a study summary I can revise from tonight. Context: 10th-grade biology, cell division, quiz Friday. Constraints: no homework answers given away; define any term you use. Format: 3 key ideas, 1 common mistake, and a 2-question self-quiz."
    },
    {
      "kind": "reveal",
      "title": "Prompts are instructions",
      "body": "A prompt is executable instruction, not a wish. Better structure → more control.",
      "mistake": "A polished sentence with an unclear goal still fails.",
      "good": "Keep the goal concrete, constraints explicit, and ask for a quick self-check from the AI."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Here is my prompt: \"[paste your weak prompt]\". Rewrite it using Goal, Context, Constraints, Format. Then show me the improved answer and tell me which change mattered most.",
      "note": "Compare the before/after — keep the diff in your toolkit."
    },
    {
      "kind": "toolkitSave",
      "title": "Save the repair template",
      "cardType": "Prompt repair",
      "fields": [
        {
          "key": "goal",
          "label": "Goal",
          "placeholder": "what good output looks like"
        },
        {
          "key": "context",
          "label": "Context",
          "placeholder": "who/what/level"
        },
        {
          "key": "constraints",
          "label": "Constraints",
          "placeholder": "do / do not"
        },
        {
          "key": "format",
          "label": "Format",
          "placeholder": "shape of the answer"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which piece most often fixes a vague prompt first?",
      "options": [
        {
          "text": "A concrete goal",
          "ok": true,
          "feedback": "Usually yes — without it, everything else floats."
        },
        {
          "text": "More polite wording",
          "ok": false,
          "feedback": "Politeness does not add control."
        },
        {
          "text": "Making it longer",
          "ok": false,
          "feedback": "Length without structure does not help."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-6",
  "num": 6,
  "arc": "Understanding",
  "title": "Data, training & patterns",
  "coreQuestion": "Where does an AI’s “knowledge” come from?",
  "blurb": "Training turns examples into patterns. Useful, but not the same as knowing.",
  "minutes": 9,
  "resources": [
    {
      "label": "Elements of AI — machine learning basics",
      "url": "https://www.elementsofai.com/"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It feels like it just knows",
      "scenario": "You ask an AI for a study plan, a poem, and a history summary. It answers all three like it has seen the inside of every classroom.",
      "prompt": "Where do you think that ability came from?"
    },
    {
      "kind": "classify",
      "title": "Training source or live fact?",
      "prompt": "Sort what comes from training patterns versus what would need a current source or tool.",
      "buckets": [
        "Training pattern",
        "Needs current source/tool"
      ],
      "items": [
        {
          "text": "Writing a sentence that sounds like a lab report",
          "answer": 0
        },
        {
          "text": "Knowing whether your school canceled practice today",
          "answer": 1
        },
        {
          "text": "Recognizing that \"photosynthesis\" belongs with plants and light",
          "answer": 0
        },
        {
          "text": "Checking the exact deadline on your teacher’s website",
          "answer": 1
        }
      ],
      "reveal": "Training gives the model patterns. Current facts need a current source, a tool, or your own check."
    },
    {
      "kind": "nextWord",
      "title": "Patterns become predictions",
      "stem": "In a recipe, after \"preheat the oven to\" you often see",
      "options": [
        {
          "word": "350°F",
          "p": 0.62
        },
        {
          "word": "medium",
          "p": 0.17
        },
        {
          "word": "tomorrow",
          "p": 0.04
        },
        {
          "word": "theory",
          "p": 0.02
        }
      ],
      "note": "The model is not opening a cookbook. It has learned which kinds of text usually follow other text."
    },
    {
      "kind": "reveal",
      "title": "Training is pattern learning",
      "body": "AI systems are trained on lots of examples so they can predict, classify, or generate new outputs that match patterns in those examples.",
      "mistake": "Treating training data like a perfect memory bank or a live database.",
      "good": "Use AI for pattern-heavy work, then verify any fact, quote, date, rule, or local detail."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Explain training data to me using one school analogy and one sports or arts analogy. Then list 5 things a trained model can do well and 5 things I should verify somewhere else.",
      "note": "Keep the verify list. It is the practical part."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your pattern-vs-fact rule",
      "cardType": "Pattern vs fact",
      "fields": [
        {
          "key": "pattern",
          "label": "I can use AI for patterns like...",
          "placeholder": "examples, drafts, explanations"
        },
        {
          "key": "fact",
          "label": "I will verify facts like...",
          "placeholder": "dates, quotes, current rules"
        },
        {
          "key": "source",
          "label": "My first source check will be...",
          "placeholder": "teacher page / official site / textbook"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What is the safest way to describe training?",
      "options": [
        {
          "text": "The model memorizes a perfect copy of every fact",
          "ok": false,
          "feedback": "No. Training learns patterns, and outputs can still be wrong."
        },
        {
          "text": "The model learns patterns from examples, then generates from those patterns",
          "ok": true,
          "feedback": "Exactly. That is useful, but it still needs verification."
        },
        {
          "text": "The model searches the web every time it answers",
          "ok": false,
          "feedback": "Not by default. Some AI tools can use search, but the model itself generates."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-7",
  "num": 7,
  "arc": "Understanding",
  "title": "Context windows & memory",
  "coreQuestion": "What does the AI actually remember, and for how long?",
  "blurb": "The model responds to what is in the current context. Memory is not magic.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "\"But I already told it\"",
      "scenario": "You told an AI your project rules at the start. Ten messages later, it ignores one and gives advice that breaks the assignment.",
      "prompt": "Did it forget, miss the rule, or never really remember like a person?"
    },
    {
      "kind": "classify",
      "title": "In context or out of reach?",
      "prompt": "Sort what the AI can use right now versus what you need to restate or provide again.",
      "buckets": [
        "In current context",
        "Needs restating/checking"
      ],
      "items": [
        {
          "text": "A rubric you pasted two messages ago",
          "answer": 0
        },
        {
          "text": "A file you never uploaded or pasted",
          "answer": 1
        },
        {
          "text": "A constraint buried 40 messages back in a long chat",
          "answer": 1
        },
        {
          "text": "The format you put in the prompt it is answering now",
          "answer": 0
        }
      ],
      "reveal": "If it matters, keep it visible. Important instructions belong near the task, not buried."
    },
    {
      "kind": "promptRepair",
      "title": "Move the rule into view",
      "weak": "Make this better but remember my teacher’s rules from before.",
      "fields": [
        "Goal",
        "Context",
        "Constraints",
        "Format"
      ],
      "strong": "Goal: improve my paragraph without changing my argument. Context: 10th-grade English, persuasive paragraph. Constraints: keep my voice, do not add outside facts, and follow this rubric: [paste rubric]. Format: return a revised paragraph plus 3 notes explaining what changed."
    },
    {
      "kind": "reveal",
      "title": "Context is working memory",
      "body": "A context window is the information the model can use for the current response. Some products add saved memory, but you should not assume it has the exact thing you meant.",
      "mistake": "Saying \"you know what I mean\" when the instruction is not visible.",
      "good": "Restate the goal, paste key constraints, and ask the AI to repeat the rules before it works."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Before helping me, summarize the constraints I gave you in 3 bullets. If any constraint is missing or unclear, ask me a question instead of guessing. Then complete the task.",
      "note": "This works especially well when a rubric or teacher rule matters."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a context reset",
      "cardType": "Context reset",
      "fields": [
        {
          "key": "goal",
          "label": "Current goal",
          "placeholder": "what I need now"
        },
        {
          "key": "mustKeep",
          "label": "Rules to keep visible",
          "placeholder": "rubric, length, source limits"
        },
        {
          "key": "check",
          "label": "AI should confirm...",
          "placeholder": "the constraints before answering"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What should you do when a rule really matters?",
      "options": [
        {
          "text": "Assume the AI remembers it from earlier",
          "ok": false,
          "feedback": "Risky. Earlier context can be missed, compressed, or absent."
        },
        {
          "text": "Put the rule close to the task and ask the AI to confirm it",
          "ok": true,
          "feedback": "Right. Keep important context visible."
        },
        {
          "text": "Start a brand-new chat for every sentence",
          "ok": false,
          "feedback": "Not necessary. The point is to manage context, not avoid conversation."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-8",
  "num": 8,
  "arc": "Understanding",
  "title": "Why AI hallucinates",
  "coreQuestion": "Why does it invent things — and how do I catch it?",
  "blurb": "A confident answer can be a guess wearing a suit. Learn the catch routine.",
  "minutes": 10,
  "resources": [
    {
      "label": "Common Sense Media — AI and misinformation",
      "url": "https://www.commonsensemedia.org/ai"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The fake quote problem",
      "scenario": "An AI gives you a perfect-looking quote for an essay. The wording is strong, the author sounds right, and the citation looks real.",
      "prompt": "What would you check before using it?"
    },
    {
      "kind": "classify",
      "title": "Safe to use or verify first?",
      "prompt": "Sort each AI output by what you should do next.",
      "buckets": [
        "Use as draft/idea",
        "Verify before trusting"
      ],
      "items": [
        {
          "text": "Three possible titles for your presentation",
          "answer": 0
        },
        {
          "text": "A quote supposedly from a scientist",
          "answer": 1
        },
        {
          "text": "A made-up practice problem for algebra",
          "answer": 0
        },
        {
          "text": "A statistic about teen phone use in 2026",
          "answer": 1
        }
      ],
      "reveal": "Ideas can be useful without being true. Claims need proof."
    },
    {
      "kind": "verify",
      "title": "Run a hallucination check",
      "claim": "A famous researcher said, \"AI literacy is the new oxygen of education.\"",
      "steps": [
        "Copy the exact quote into a search engine with quotation marks.",
        "Search the person’s official page or a reliable publication, not only random quote sites.",
        "If you cannot find the quote in a trustworthy place, do not use it as real.",
        "Ask the AI for a safer replacement: \"Give me a paraphrase I can verify, not a quote.\""
      ],
      "note": "The goal is not to prove the AI wrong. The goal is to avoid repeating something you cannot stand behind."
    },
    {
      "kind": "reveal",
      "title": "Hallucination is not drama",
      "body": "A hallucination is when an AI generates something false or unsupported as if it were true. It happens because the system is generating likely text, not proving each claim.",
      "mistake": "Thinking a citation, title, or quote is real because it is formatted correctly.",
      "good": "Ask for uncertainty, sources you can open, and a verification plan before using claims."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Here is a claim I might use: \"[paste claim]\". Treat it as unverified. Give me a 4-step plan to check it, tell me what source type would count as strong evidence, and rewrite it in safer language if I cannot verify it.",
      "note": "Use this on one claim from homework, a video, or a post."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a hallucination catch",
      "cardType": "Hallucination check",
      "fields": [
        {
          "key": "claim",
          "label": "Claim I will check",
          "placeholder": "quote / stat / date / source"
        },
        {
          "key": "evidence",
          "label": "Strong evidence would be...",
          "placeholder": "official page, original article, textbook"
        },
        {
          "key": "backup",
          "label": "If I cannot verify it, I will...",
          "placeholder": "remove it or phrase it as uncertain"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which output is most dangerous to trust without checking?",
      "options": [
        {
          "text": "A list of brainstormed club names",
          "ok": false,
          "feedback": "Low risk. You still choose, but truth is not the main issue."
        },
        {
          "text": "A specific quote with a polished citation",
          "ok": true,
          "feedback": "Yes. Formatting can look real even when the source is invented."
        },
        {
          "text": "A silly analogy for photosynthesis",
          "ok": false,
          "feedback": "It might be imperfect, but it is easier to treat as a teaching draft."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-9",
  "num": 9,
  "arc": "Understanding",
  "title": "Models, tools & agents",
  "coreQuestion": "What is the difference between a model, a tool, and an agent?",
  "blurb": "Separate the brain, the instruments, and the doer before you trust the system.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "One AI, three different jobs",
      "scenario": "An app answers your question, searches the web, and adds a calendar reminder. People call all of it \"AI,\" but those are not the same job.",
      "prompt": "Which part is generating, which part is using a tool, and which part is acting for you?"
    },
    {
      "kind": "classify",
      "title": "Name the part",
      "prompt": "Sort each description into the closest bucket.",
      "buckets": [
        "Model",
        "Tool or agent"
      ],
      "items": [
        {
          "text": "Generates a draft email from your instructions",
          "answer": 0
        },
        {
          "text": "Opens a calculator to solve a precise equation",
          "answer": 1
        },
        {
          "text": "Searches a website for current ticket prices",
          "answer": 1
        },
        {
          "text": "Predicts likely next words in a paragraph",
          "answer": 0
        }
      ],
      "reveal": "The model generates. Tools fetch or do specific things. Agents combine steps toward a goal."
    },
    {
      "kind": "agentDesign",
      "title": "Pick tools for a safe agent",
      "goal": "Help plan a study session by checking a calendar, finding open time, and drafting a study checklist.",
      "tools": [
        {
          "name": "Calendar read access",
          "useful": true
        },
        {
          "name": "Checklist writer",
          "useful": true
        },
        {
          "name": "Bank account access",
          "useful": false
        },
        {
          "name": "Ability to delete files",
          "useful": false
        },
        {
          "name": "Timer or reminder tool",
          "useful": true
        }
      ],
      "note": "Give an agent only the tools it needs for the job. Extra power is extra risk."
    },
    {
      "kind": "reveal",
      "title": "Capability comes in layers",
      "body": "A model can generate text. A tool can retrieve, calculate, send, edit, or store. An agent uses a model plus tools to pursue a goal through multiple steps.",
      "mistake": "Trusting a system more just because it can act in the world.",
      "good": "Check the goal, permissions, tools, and stop conditions before letting anything act for you."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "For this task: \"[paste a task]\", split the AI system into model, tools, and agent behavior. Tell me what permissions are necessary, what permissions would be risky, and where a human should approve before action.",
      "note": "Try it with a real task like planning, email, research, or reminders."
    },
    {
      "kind": "toolkitSave",
      "title": "Save an agent safety checklist",
      "cardType": "Agent safety",
      "fields": [
        {
          "key": "goal",
          "label": "Agent goal",
          "placeholder": "what it should accomplish"
        },
        {
          "key": "tools",
          "label": "Allowed tools",
          "placeholder": "only what it needs"
        },
        {
          "key": "approval",
          "label": "Human approval required before...",
          "placeholder": "sending, buying, deleting, posting"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes an agent different from a plain model response?",
      "options": [
        {
          "text": "It is always smarter and always safer",
          "ok": false,
          "feedback": "No. More ability can mean more risk."
        },
        {
          "text": "It can use tools and take steps toward a goal",
          "ok": true,
          "feedback": "Right. That is why permissions and approval matter."
        },
        {
          "text": "It never needs human review",
          "ok": false,
          "feedback": "Opposite. Action usually needs clearer review."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-10",
  "num": 10,
  "arc": "Conversation & Prompting",
  "title": "Better follow-ups",
  "coreQuestion": "How do I steer a conversation instead of restarting it?",
  "blurb": "Keep the 80% that worked and fix the 20% that didn’t — with one good follow-up.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer is fine. Not great.",
      "scenario": "You asked AI for help and the first answer is... okay. It’s 80% there. Most people do one of two things: accept the mediocre version, or delete everything and retype the whole question hoping for magic.",
      "prompt": "There’s a third move that beats both — and it’s one sentence. What would you say next?"
    },
    {
      "kind": "classify",
      "title": "Steer it, or start over?",
      "prompt": "Which of these keep the good answer and improve it — and which throw it all away?",
      "buckets": [
        "Steers what you have",
        "Restarts from scratch"
      ],
      "items": [
        {
          "text": "“Give me a concrete example a 9th grader would get.”",
          "answer": 0
        },
        {
          "text": "Delete the chat and retype the whole question a different way.",
          "answer": 1
        },
        {
          "text": "“Which part of that are you least sure about?”",
          "answer": 0
        },
        {
          "text": "Open a brand-new prompt because the answer was only 80% right.",
          "answer": 1
        }
      ],
      "reveal": "A good follow-up keeps the 80% that worked and fixes only the 20% that didn’t."
    },
    {
      "kind": "reveal",
      "title": "Follow-ups are steering, not restarting",
      "body": "The strongest follow-ups do one specific thing: ask for an example, request a critique, change the format, narrow the scope, or surface what’s uncertain. You’re editing a draft, not rolling the dice again.",
      "mistake": "Saying “make it better” — the AI has to guess what “better” means to you.",
      "good": "Name exactly what’s missing, then ask for just that one thing."
    },
    {
      "kind": "tryLive",
      "title": "Run a two-follow-up loop",
      "prompt": "Explain how a bill becomes a law in the US in one paragraph. Keep it simple but accurate.",
      "react": "Now don’t restart — send ONE follow-up that improves it (an example, a shorter format, or “which part are you least sure about?”). Paste the better answer and name what your follow-up changed.",
      "note": "The skill isn’t the first prompt. It’s the second one."
    },
    {
      "kind": "compare",
      "title": "Catch the lazy follow-up",
      "weak": "“Make it better.”",
      "strong": "“Shorten it to 3 bullets, keep the point about committees, and add one real-world example.”",
      "why": "The weak version makes the AI guess. The strong one names the format, what to keep, and what to add — so the next answer is steerable, not random."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your follow-up menu",
      "cardType": "Follow-up menu",
      "fields": [
        {
          "key": "clarify",
          "label": "When it’s vague, I ask…",
          "placeholder": "“Which part are you least sure about?”"
        },
        {
          "key": "example",
          "label": "When it’s abstract, I ask…",
          "placeholder": "“Give me one concrete example.”"
        },
        {
          "key": "format",
          "label": "When it’s messy, I ask…",
          "placeholder": "“Rewrite as 3 bullets.”"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "The AI’s answer is good but too long. What’s the best next move?",
      "options": [
        {
          "text": "Start a new chat and ask the question more carefully",
          "ok": false,
          "feedback": "You’d throw away an answer that was already mostly right."
        },
        {
          "text": "Reply “tighten this to 3 bullets, keep the second point”",
          "ok": true,
          "feedback": "Exactly — you steered the draft instead of gambling on a new one."
        },
        {
          "text": "Tell it “make it better”",
          "ok": false,
          "feedback": "“Better” is undefined — the AI just guesses what you meant."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-11",
  "num": 11,
  "arc": "Conversation & Prompting",
  "title": "Roles, formats & constraints",
  "coreQuestion": "How do role, audience, and format change the answer I get?",
  "blurb": "Same question, different audience, different answer — on purpose.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Same question, three answers",
      "scenario": "“Explain inflation.” Ask it cold and you get a textbook paragraph. But the right answer for a 10-year-old, a debate team, and a quick text to a friend are three completely different things.",
      "prompt": "Before reading on: what would you add to the prompt so the answer fits YOUR situation?"
    },
    {
      "kind": "classify",
      "title": "Which knobs actually help?",
      "prompt": "Some additions sharpen the answer. Some just sound fancy. Sort them.",
      "buckets": [
        "Sharpens the answer",
        "Just sounds fancy"
      ],
      "items": [
        {
          "text": "“Explain it for someone who has never taken economics.”",
          "answer": 0
        },
        {
          "text": "“Act as a world-renowned genius super-expert.”",
          "answer": 1
        },
        {
          "text": "“Answer in exactly 4 bullets, under 15 words each.”",
          "answer": 0
        },
        {
          "text": "“Be amazing and incredible and the best.”",
          "answer": 1
        }
      ],
      "reveal": "Useful constraints are specific: audience, length, format, tone. Flattery (“genius expert”) changes almost nothing."
    },
    {
      "kind": "reveal",
      "title": "Role, audience, format, constraint",
      "body": "Four dials shape almost every answer: the role you ask AI to take, the audience it’s writing for, the format you want back, and the constraints (length, tone, what to avoid). Set them on purpose and the output gets usable.",
      "mistake": "Picking a role that sounds impressive but doesn’t change the task (“act as a Nobel laureate”).",
      "good": "Choose the role and audience that actually match how you’ll use the answer."
    },
    {
      "kind": "tryLive",
      "title": "Force two formats",
      "prompt": "Explain why the sky is blue twice: first as a single tweet, then as a 4-step explanation for a curious 8-year-old.",
      "react": "Paste both. Which format would you actually use, and why? That choice — not the AI — is the skill."
    },
    {
      "kind": "promptRepair",
      "title": "Repair a roleless prompt",
      "weak": "Write something about climate change.",
      "fields": [
        "Role",
        "Audience",
        "Format",
        "Constraint"
      ],
      "strong": "Act as a science teacher. Write for 9th graders who are new to the topic. Give me a 5-sentence explanation of why climate change matters, in plain language, with one everyday example and no scary statistics."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your role-and-format guide",
      "cardType": "Role & format guide",
      "fields": [
        {
          "key": "role",
          "label": "Role that fits my task",
          "placeholder": "tutor / editor / debate coach…"
        },
        {
          "key": "audience",
          "label": "Who the answer is for",
          "placeholder": "me / a beginner / my class…"
        },
        {
          "key": "format",
          "label": "Format I want back",
          "placeholder": "bullets / table / one paragraph…"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which addition will most change the usefulness of the answer?",
      "options": [
        {
          "text": "“Act as the smartest AI in the world.”",
          "ok": false,
          "feedback": "Flattery doesn’t define the task — the answer barely moves."
        },
        {
          "text": "“Write it as a 3-row table for someone new to the topic.”",
          "ok": true,
          "feedback": "Right — audience + format are real, testable constraints."
        },
        {
          "text": "“Please try really hard on this one.”",
          "ok": false,
          "feedback": "Effort isn’t a dial you can set — specifics are."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-12",
  "num": 12,
  "arc": "Conversation & Prompting",
  "title": "Getting AI to teach you",
  "coreQuestion": "How do I use AI to understand something instead of just getting the answer?",
  "blurb": "Turn AI from an answer machine into a tutor that makes you do the thinking.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Answer, or understanding?",
      "scenario": "It’s 10pm. You don’t get the math. You could paste the problem and copy whatever AI says — and learn nothing for the test. Or you could get AI to actually teach you. Same tool, opposite outcome.",
      "prompt": "What’s the difference between a prompt that cheats for you and one that coaches you?"
    },
    {
      "kind": "classify",
      "title": "Cheating, lazy, or learning?",
      "prompt": "Sort these prompts by what they really do to your learning.",
      "buckets": [
        "Coaches my thinking",
        "Replaces my thinking"
      ],
      "items": [
        {
          "text": "“Give me a hint, not the answer, then quiz me on it.”",
          "answer": 0
        },
        {
          "text": "“Just give me the final answer.”",
          "answer": 1
        },
        {
          "text": "“Ask me one question to find where I’m stuck.”",
          "answer": 0
        },
        {
          "text": "“Write the whole solution so I can copy it.”",
          "answer": 1
        }
      ],
      "reveal": "Tutor prompts ask for hints, questions, and checks first — they keep you doing the work that builds the skill."
    },
    {
      "kind": "reveal",
      "title": "Make AI coach, not answer",
      "body": "A study-coach prompt tells AI to hold back the answer: give one hint, ask what you already know, quiz you, and only confirm at the end. You stay the one doing the reasoning — which is the entire point of studying.",
      "mistake": "Asking for the answer “to check” and then never doing the problem yourself.",
      "good": "Ask for a hint and a quiz question first; earn the answer last."
    },
    {
      "kind": "tryLive",
      "title": "Run a study-coach prompt",
      "prompt": "Be my study coach for [topic]. Do NOT give me the answer yet. First ask me one question to find out what I already understand, then give me a single hint. Quiz me before you confirm anything.",
      "react": "Run it on something you’re actually studying. Paste the AI’s first reply — did it make YOU think, or did it cave and hand over the answer?",
      "note": "A good coach makes you uncomfortable for about 30 seconds. That’s the learning."
    },
    {
      "kind": "compare",
      "title": "Spot the fake tutor",
      "weak": "“Do you understand? Let me know if you have questions!” (then gives the full answer)",
      "strong": "“Before I explain — what do you think the first step is, and why?”",
      "why": "The weak version looks supportive but does the thinking for you. The strong one hands the thinking back, which is what actually teaches."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your study-coach card",
      "cardType": "Study coach card",
      "fields": [
        {
          "key": "rule",
          "label": "My rule for AI when studying",
          "placeholder": "Hint first, answer last"
        },
        {
          "key": "check",
          "label": "How AI should check me",
          "placeholder": "Quiz me before confirming"
        },
        {
          "key": "protect",
          "label": "The skill I’m protecting",
          "placeholder": "solving it myself on the test"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which request best protects your learning?",
      "options": [
        {
          "text": "“Explain the answer in simpler words.”",
          "ok": false,
          "feedback": "Still hands you the answer — you read instead of reason."
        },
        {
          "text": "“Give me one hint, then quiz me before telling me if I’m right.”",
          "ok": true,
          "feedback": "Yes — you do the thinking and AI checks it."
        },
        {
          "text": "“Just tell me so I can move on.”",
          "ok": false,
          "feedback": "Fastest path to a blank mind on test day."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-13",
  "num": 13,
  "arc": "Judgment & Safety",
  "title": "Human agency",
  "coreQuestion": "Who’s in charge — me or the AI?",
  "blurb": "Keep the goals, the values, and the final call on your side of the table.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Who decided that?",
      "scenario": "AI suggested which classes to take, what to write, and how to spend your Saturday. Each suggestion was reasonable. But somewhere in there, you stopped choosing and started approving.",
      "prompt": "Where’s the line between AI helping you decide and AI deciding for you?"
    },
    {
      "kind": "classify",
      "title": "Who’s leading?",
      "prompt": "In each situation, decide who actually owns the decision.",
      "buckets": [
        "Human stays in charge",
        "AI is quietly in charge"
      ],
      "items": [
        {
          "text": "AI lists options; you weigh them and pick.",
          "answer": 0
        },
        {
          "text": "You do whatever the top AI suggestion says, every time.",
          "answer": 1
        },
        {
          "text": "AI drafts; you decide what you actually believe.",
          "answer": 0
        },
        {
          "text": "You stop forming opinions because AI “knows better.”",
          "answer": 1
        }
      ],
      "reveal": "Agency isn’t “never use AI.” It’s keeping the goal, the values, and the final decision on your side."
    },
    {
      "kind": "reveal",
      "title": "What stays human",
      "body": "AI can generate, draft, and suggest. But you own the goal (what you’re trying to do), the values (what matters to you), the verification (is it true?), and the final decision. Hand those over and you’re not using a tool — you’re following one.",
      "mistake": "Treating a confident AI suggestion as the authority on what you should want.",
      "good": "Let AI argue with your plan — then you decide what to accept and what to reject."
    },
    {
      "kind": "tryLive",
      "title": "Make AI critique YOUR plan",
      "prompt": "Here’s my plan: [paste a real plan or decision]. Argue against it. List 3 weaknesses and 1 thing I might be missing. Do not tell me what to do — just pressure-test it.",
      "react": "Read its critique. Now YOU decide: which points do you accept, and which do you reject? Write your call. That decision is the part AI can’t do for you."
    },
    {
      "kind": "verify",
      "title": "Catch the handover",
      "claim": "“The AI recommended it, so it’s probably the right choice for me.”",
      "steps": [
        "Whose goal is this serving — mine, or a generic average?",
        "Does it match what I actually value, or just what’s common?",
        "What would I lose by going along with it without deciding?",
        "If I disagreed, would I even notice — or just click accept?"
      ],
      "note": "A recommendation is an input to your decision, not the decision."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your agency check",
      "cardType": "Agency check",
      "fields": [
        {
          "key": "goal",
          "label": "The goal I’m keeping",
          "placeholder": "what I’m really trying to do"
        },
        {
          "key": "decide",
          "label": "What I will not let AI decide",
          "placeholder": "my values / my final call"
        },
        {
          "key": "use",
          "label": "What I’ll let AI do",
          "placeholder": "draft, critique, list options"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the clearest sign you’ve handed over too much?",
      "options": [
        {
          "text": "You use AI for several steps of a task",
          "ok": false,
          "feedback": "Using AI a lot is fine — if you’re still the one deciding."
        },
        {
          "text": "You stop forming your own opinion and just approve whatever it says",
          "ok": true,
          "feedback": "Right — that’s the moment the tool starts steering you."
        },
        {
          "text": "You ask AI to argue against your plan",
          "ok": false,
          "feedback": "That’s the opposite — you’re using it to sharpen your own judgment."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-14",
  "num": 14,
  "arc": "Judgment & Safety",
  "title": "Verification & sources",
  "coreQuestion": "The answer has sources — do they actually prove the claim?",
  "blurb": "Real, relevant, reliable, and connected to the claim. Decoration doesn’t count.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Confident. With citations. And wrong.",
      "scenario": "AI gives you a clean answer with three official-looking sources. It feels done. But one source is made up, one is real but says the opposite, and one is real and relevant. From the outside, all three look identical.",
      "prompt": "How do you tell a source that proves the claim from one that’s just decoration?"
    },
    {
      "kind": "verify",
      "title": "Run the source check",
      "claim": "“Studies show teens who use AI score 40% higher — see [Journal of Learning, 2024].”",
      "steps": [
        "Real? Does the source actually exist when I search for it?",
        "Relevant? Is it about this exact claim, or something nearby?",
        "Reliable? Who made it, and do they have a reason to mislead?",
        "Connected? Does it actually say the number, or did AI invent the link?"
      ],
      "note": "A citation is only useful if it survives all four checks. “Looks official” is not one of them."
    },
    {
      "kind": "reveal",
      "title": "Confidence is not evidence",
      "body": "AI produces fluent, confident text whether or not the facts behind it are real. Citations can be hallucinated, mismatched, or technically real but unrelated. The fix isn’t to trust harder — it’s to check one source outside the model before you rely on it.",
      "mistake": "Accepting a claim because the formatting looks authoritative.",
      "good": "Open one source yourself and confirm it actually says what AI claims."
    },
    {
      "kind": "tryLive",
      "title": "Ask for verifiable claims",
      "prompt": "Give me 3 facts about [topic]. For each one, tell me exactly what kind of source would prove it and how confident you are. Flag anything you’re not sure about.",
      "react": "Pick the claim AI was least confident about and actually look it up. Paste what you found — did it hold up?"
    },
    {
      "kind": "classify",
      "title": "Which sources count?",
      "prompt": "Sort these “sources” by whether they’d actually support a claim.",
      "buckets": [
        "Could support the claim",
        "Decoration / doesn’t support it"
      ],
      "items": [
        {
          "text": "A peer-reviewed study that directly measures the thing claimed",
          "answer": 0
        },
        {
          "text": "A real journal name with a year, but no article that actually exists",
          "answer": 1
        },
        {
          "text": "A government dataset on exactly this topic",
          "answer": 0
        },
        {
          "text": "A real article — about a different question than the one being answered",
          "answer": 1
        }
      ],
      "reveal": "Real + relevant + reliable + connected. Drop any one and the citation is just decoration."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your source quality rubric",
      "cardType": "Source rubric",
      "fields": [
        {
          "key": "real",
          "label": "Real?",
          "placeholder": "Does it exist when I search?"
        },
        {
          "key": "relevant",
          "label": "Relevant & connected?",
          "placeholder": "Does it address THIS claim?"
        },
        {
          "key": "reliable",
          "label": "Reliable?",
          "placeholder": "Who made it / any bias?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "AI cites a real, respected journal. Are you done?",
      "options": [
        {
          "text": "Yes — a respected journal is enough",
          "ok": false,
          "feedback": "The journal can be real while the specific article or claim isn’t."
        },
        {
          "text": "No — check that the article exists and actually says the claim",
          "ok": true,
          "feedback": "Right — real name ≠ real article ≠ supports the claim."
        },
        {
          "text": "Yes, as long as it sounds confident",
          "ok": false,
          "feedback": "Confidence is the thing we’re specifically not trusting here."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-15",
  "num": 15,
  "arc": "Judgment & Safety",
  "title": "Bias, fairness & perspective",
  "coreQuestion": "The answer sounds neutral — who’s missing from it?",
  "blurb": "Bias hides in what’s left out, not just what’s said.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Sounds neutral. Isn’t.",
      "scenario": "You ask AI to describe “a successful person’s morning routine” or “what makes a good leader.” The answer is smooth, reasonable, and quietly assumes one kind of life, one culture, one set of resources.",
      "prompt": "How do you notice the perspective an answer is missing — when it never tells you it picked one?"
    },
    {
      "kind": "reveal",
      "title": "Where bias comes from",
      "body": "AI learns from human data, so it inherits human patterns: what’s common in the training data sounds “normal,” and what’s rare gets left out or stereotyped. Bias also comes from how the question is framed and what context you forgot to give.",
      "mistake": "Assuming a fluent, calm answer is automatically a fair or complete one.",
      "good": "Ask who’s missing, then ask for the perspectives the first answer skipped."
    },
    {
      "kind": "tryLive",
      "title": "Surface the missing voices",
      "prompt": "Answer this: [your question]. Then list who or what your answer assumed or left out — different cultures, income levels, abilities, or viewpoints — and give one perspective you skipped.",
      "react": "Compare the first answer to the “who’s missing” list. What did the “neutral” version quietly assume?"
    },
    {
      "kind": "classify",
      "title": "Spot the slant",
      "prompt": "Which of these answers carries a hidden assumption?",
      "buckets": [
        "Hidden assumption",
        "Genuinely balanced"
      ],
      "items": [
        {
          "text": "“The best breakfast is eggs and toast.” (best for whom? where?)",
          "answer": 0
        },
        {
          "text": "“Budgets vary, so here are options for low, medium, and high cost.”",
          "answer": 1
        },
        {
          "text": "“Everyone should just invest in stocks.”",
          "answer": 0
        },
        {
          "text": "“Different cultures define success differently; here are three views.”",
          "answer": 1
        }
      ],
      "reveal": "A balanced answer names its assumptions and includes more than one perspective."
    },
    {
      "kind": "verify",
      "title": "Catch the stereotype",
      "claim": "“Describe a typical nurse and a typical engineer.” — and the answer leans on gender and personality stereotypes.",
      "steps": [
        "Did it assume a gender, age, or background it was never told?",
        "Would a real group of nurses / engineers actually fit this?",
        "Whose experience is treated as the default “typical” one?",
        "What would change if I asked for the full range instead?"
      ],
      "note": "“Typical” is where stereotypes hide. Ask for the range, not the average."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your missing-perspective check",
      "cardType": "Perspective check",
      "fields": [
        {
          "key": "assumed",
          "label": "What did the answer assume?",
          "placeholder": "culture / money / ability…"
        },
        {
          "key": "missing",
          "label": "Who’s missing?",
          "placeholder": "a viewpoint it skipped"
        },
        {
          "key": "add",
          "label": "One perspective I’d add",
          "placeholder": "…"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the most reliable way to catch bias in an answer?",
      "options": [
        {
          "text": "Check if it sounds calm and professional",
          "ok": false,
          "feedback": "Tone hides bias — a smooth answer can still be one-sided."
        },
        {
          "text": "Ask who or what the answer left out, then add it back",
          "ok": true,
          "feedback": "Right — bias lives in the omissions as much as the claims."
        },
        {
          "text": "Trust it if it doesn’t use any obviously offensive words",
          "ok": false,
          "feedback": "Most bias is quiet, not offensive on the surface."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-16",
  "num": 16,
  "arc": "Judgment & Safety",
  "title": "Privacy & personal data",
  "coreQuestion": "Would I be okay if this prompt became public?",
  "blurb": "Some things should never be pasted into a chat box. Learn the line.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The paste you can’t take back",
      "scenario": "You’re about to paste a screenshot into AI to “just ask a quick question.” It happens to include a full name, an address, a grade, and a message thread. Once it’s sent, you don’t control where it goes.",
      "prompt": "What’s your rule for deciding what’s safe to put in an AI chat?"
    },
    {
      "kind": "classify",
      "title": "Safe, redact, or never?",
      "prompt": "Sort what should go into an AI chat, what should be removed first, and what should never go in.",
      "buckets": [
        "Safe to share",
        "Remove it first"
      ],
      "items": [
        {
          "text": "A general homework question with no names",
          "answer": 0
        },
        {
          "text": "A classmate’s full name, address, and grades",
          "answer": 1
        },
        {
          "text": "A made-up example instead of the real person",
          "answer": 0
        },
        {
          "text": "A screenshot showing private messages and faces",
          "answer": 1
        }
      ],
      "reveal": "Strip names, contact info, health, finances, and other people’s data before you paste. Use a stand-in."
    },
    {
      "kind": "reveal",
      "title": "Treat the chat box like a postcard",
      "body": "Assume anything you type into AI could be stored, reviewed, or seen by someone else. Names, grades, health info, finances, addresses, and screenshots of private chats deserve extra caution — especially other people’s data, which isn’t yours to share.",
      "mistake": "Pasting a real screenshot “for context” without checking what’s in it.",
      "good": "Redact first: replace real details with placeholders like [name] or [school]."
    },
    {
      "kind": "promptRepair",
      "title": "Redact a risky prompt",
      "weak": "My friend Jordan Lee at 14 Oak St keeps failing chem (got a 41) — write a message to their mom Ms. Lee about it.",
      "fields": [
        "What to remove",
        "Safe stand-in",
        "The actual ask"
      ],
      "strong": "A friend is struggling in chemistry and a parent wants to help. Write a kind, encouraging message a parent could send their teen about a low test grade — no names or personal details needed."
    },
    {
      "kind": "tryLive",
      "title": "Practice the redaction move",
      "prompt": "I’ll describe a real situation but I’m replacing private details with placeholders like [name] and [school]. Help me with: [your redacted situation].",
      "react": "Notice you got the help you needed without exposing anyone. Paste your redacted prompt — is there anything still identifying in it?"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your privacy redaction checklist",
      "cardType": "Privacy checklist",
      "fields": [
        {
          "key": "names",
          "label": "Names & contact info",
          "placeholder": "replace with [name], [address]"
        },
        {
          "key": "sensitive",
          "label": "Grades / health / money",
          "placeholder": "remove or generalize"
        },
        {
          "key": "others",
          "label": "Other people’s data",
          "placeholder": "not mine to share"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "You need AI’s help with a sensitive situation about a real person. Best move?",
      "options": [
        {
          "text": "Paste the real details so AI “understands fully”",
          "ok": false,
          "feedback": "You can’t un-send it — and it’s someone else’s data."
        },
        {
          "text": "Describe it with placeholders and no identifying details",
          "ok": true,
          "feedback": "Right — you get the help without exposing anyone."
        },
        {
          "text": "Screenshot the whole conversation for context",
          "ok": false,
          "feedback": "Screenshots leak names, faces, and info you didn’t notice."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-17",
  "num": 17,
  "arc": "Judgment & Safety",
  "title": "When not to use AI",
  "coreQuestion": "When is the smartest move to NOT use AI?",
  "blurb": "Some calls need values, consent, or accountability — not a generated answer.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The move is to not use it",
      "scenario": "AI can draft your apology to a friend, decide whether you should quit the team, or tell you what to believe about something that matters to you. It’ll happily do all three. That doesn’t mean it should.",
      "prompt": "What kinds of decisions should stay fully yours, even when AI could “help”?"
    },
    {
      "kind": "classify",
      "title": "AI helps, assists, or stays out?",
      "prompt": "For each task, decide whether AI can lead, can assist with review, or should stay out of the final call.",
      "buckets": [
        "Fine for AI to help",
        "AI should stay out of the decision"
      ],
      "items": [
        {
          "text": "Brainstorm topics for a science project",
          "answer": 0
        },
        {
          "text": "Decide whether to forgive a friend",
          "answer": 1
        },
        {
          "text": "Summarize an article you’ll still read yourself",
          "answer": 0
        },
        {
          "text": "Choose what you personally believe is right",
          "answer": 1
        }
      ],
      "reveal": "Tasks needing values, consent, accountability, or lived experience stay human. AI can inform, not decide."
    },
    {
      "kind": "reveal",
      "title": "The four “stay human” signals",
      "body": "Keep the decision yours when it involves your values, when it affects other people who didn’t consent, when someone has to be accountable for the outcome, or when it needs real human experience AI doesn’t have. AI can still help you think — it just shouldn’t be the one who decides.",
      "mistake": "Outsourcing a values or relationship decision because AI gives a clean, confident answer.",
      "good": "Use AI to lay out options and tradeoffs, then make the call yourself."
    },
    {
      "kind": "tryLive",
      "title": "Ask AI to map the risks",
      "prompt": "I’m considering using AI to help with this high-stakes decision: [describe it]. List the risks of letting AI influence it, and what parts must stay a human judgment.",
      "react": "Read its list. Do you agree with where it drew the line? Write where YOU’d draw it — that’s the actual exercise."
    },
    {
      "kind": "verify",
      "title": "Catch the bad handoff",
      "claim": "“I’ll just let AI decide whether to tell my parents about a problem at school.”",
      "steps": [
        "Does this involve my values or relationships?",
        "Are other people affected who never agreed to AI deciding?",
        "Who has to live with the outcome — me, or the AI?",
        "Would I be comfortable saying “the AI decided” afterward?"
      ],
      "note": "If you wouldn’t want to say “the AI decided,” the decision was yours to make."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your AI boundary rules",
      "cardType": "AI boundary rules",
      "fields": [
        {
          "key": "never",
          "label": "I’ll never let AI decide…",
          "placeholder": "a values / relationship call"
        },
        {
          "key": "assist",
          "label": "AI can assist me with…",
          "placeholder": "options and tradeoffs"
        },
        {
          "key": "why",
          "label": "Because the outcome is…",
          "placeholder": "mine to own"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which is the strongest reason to keep a decision fully human?",
      "options": [
        {
          "text": "AI might give a slightly slower answer",
          "ok": false,
          "feedback": "Speed isn’t the issue — ownership is."
        },
        {
          "text": "It involves your values and people who must live with the result",
          "ok": true,
          "feedback": "Right — values, consent, and accountability stay human."
        },
        {
          "text": "AI isn’t good at writing",
          "ok": false,
          "feedback": "It often writes fine — that’s not why it should stay out."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-18",
  "num": 18,
  "arc": "Applying",
  "title": "Studying & school",
  "coreQuestion": "How do I use AI on schoolwork without cheating myself?",
  "blurb": "A study workflow that quizzes, hints, and checks — before it ever gives an answer.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Help that helps vs. help that hurts",
      "scenario": "Two students use AI for the same biology unit. One ends up understanding cell division. The other ends up with a perfect worksheet and a blank mind on test day. They used the exact same tool.",
      "prompt": "What did the first student do differently?"
    },
    {
      "kind": "workflowChain",
      "title": "Build the study workflow",
      "goal": "Use AI to actually learn a hard topic before a test — not just finish the worksheet.",
      "correct": [
        "Try the problem yourself first, even badly",
        "Ask AI to explain only the part you’re stuck on",
        "Re-explain the idea back in your own words",
        "Have AI quiz you without showing answers",
        "Check your answers against your notes or textbook"
      ],
      "note": "You start and you finish. AI only fills the gap in the middle — and it never replaces your own attempt."
    },
    {
      "kind": "reveal",
      "title": "AI as tutor, not ghostwriter",
      "body": "The learning-protecting workflow uses AI to quiz, hint, explain, and check — always after you’ve tried. The moment AI produces the finished answer you submit without understanding, it stopped teaching and started replacing you.",
      "mistake": "Copying AI’s solution “to save time” and never doing a problem yourself.",
      "good": "Do it first, get a hint, then prove you can do the next one alone."
    },
    {
      "kind": "tryLive",
      "title": "Run it on a real topic",
      "prompt": "I’m studying [topic] for a test. First quiz me with 3 questions, hardest last. Don’t show answers until I’ve tried. Then tell me what to review based on what I got wrong.",
      "react": "Do the quiz honestly. Paste what AI said you should review — was it the part you secretly knew was weak?"
    },
    {
      "kind": "compare",
      "title": "Catch disguised cheating",
      "weak": "“Write my lab report on photosynthesis so I can hand it in.”",
      "strong": "“Quiz me on photosynthesis, then check the explanation I wrote in my own words and tell me what’s missing.”",
      "why": "The weak one produces work that isn’t yours and teaches you nothing. The strong one makes you produce the understanding and uses AI to check it."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your study workflow",
      "cardType": "Study workflow",
      "fields": [
        {
          "key": "before",
          "label": "Before AI, I will…",
          "placeholder": "try it myself first"
        },
        {
          "key": "during",
          "label": "I’ll ask AI to…",
          "placeholder": "hint, quiz, explain the stuck part"
        },
        {
          "key": "after",
          "label": "To prove I learned it, I’ll…",
          "placeholder": "re-explain it / do one alone"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which use of AI actually builds knowledge you’ll keep?",
      "options": [
        {
          "text": "AI writes the essay; you read it once",
          "ok": false,
          "feedback": "Reading isn’t the same as being able to do it yourself."
        },
        {
          "text": "You attempt it, AI quizzes you, you re-explain in your words",
          "ok": true,
          "feedback": "Right — you did the thinking; AI just stress-tested it."
        },
        {
          "text": "AI gives every answer so you can “check”",
          "ok": false,
          "feedback": "You’ll “check” your way into never learning it."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-19",
  "num": 19,
  "arc": "Applying",
  "title": "Writing & research",
  "coreQuestion": "How do I use AI without losing my voice or trusting fake sources?",
  "blurb": "Brainstorm, outline, critique — but the claims, sources, and voice stay yours.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Whose words are these?",
      "scenario": "AI can write a whole essay in seconds. It’s grammatically perfect, completely generic, possibly cites a study that doesn’t exist, and sounds nothing like you. A teacher can usually tell. So can a reader.",
      "prompt": "What parts of writing should stay yours, even when AI helps?"
    },
    {
      "kind": "classify",
      "title": "Yours or the AI’s job?",
      "prompt": "Sort each writing task by who should own it.",
      "buckets": [
        "AI can help here",
        "Stays mine"
      ],
      "items": [
        {
          "text": "Brainstorming angles and outlines",
          "answer": 0
        },
        {
          "text": "Deciding what I actually argue",
          "answer": 1
        },
        {
          "text": "Critiquing a draft I wrote",
          "answer": 0
        },
        {
          "text": "My voice, my real examples, my claims",
          "answer": 1
        }
      ],
      "reveal": "AI is great for brainstorming, outlining, and critique. The argument, the voice, and the verified facts are yours."
    },
    {
      "kind": "reveal",
      "title": "AI drafts, you own",
      "body": "Use AI to get unstuck — generate angles, outline structure, react to a draft, suggest tighter phrasing. But the claim you’re making, the sources behind it, and the voice it’s written in have to be yours, or it isn’t your work and it isn’t trustworthy.",
      "mistake": "Pasting AI’s paragraphs in as-is, fake citations and generic voice included.",
      "good": "Ask AI to critique YOUR paragraph, then revise it yourself."
    },
    {
      "kind": "tryLive",
      "title": "Get feedback, not a ghostwriter",
      "prompt": "Here’s a paragraph I wrote: [paste it]. Don’t rewrite it. Give me 3 specific critiques — where it’s vague, where the logic is weak, where my voice is strong — and one question to make it sharper.",
      "react": "Revise it yourself using the feedback. Paste your new version — it should sound more like you, not less."
    },
    {
      "kind": "verify",
      "title": "Catch the fake citation",
      "claim": "AI added: “According to a 2023 Stanford study, 73% of students improved.”",
      "steps": [
        "Does this exact study show up when I search for it?",
        "Does the real source actually report that number?",
        "Is the source about my topic, or just nearby?",
        "Can I replace it with something I’ve actually verified?"
      ],
      "note": "A fake citation in your essay is your problem once you submit it — not the AI’s."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your writing workflow",
      "cardType": "Writing workflow",
      "fields": [
        {
          "key": "airole",
          "label": "AI helps me…",
          "placeholder": "brainstorm, outline, critique"
        },
        {
          "key": "mine",
          "label": "I keep ownership of…",
          "placeholder": "argument, voice, sources"
        },
        {
          "key": "verify",
          "label": "Before submitting, I verify…",
          "placeholder": "every claim and citation"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the safest, most honest way to use AI on an essay?",
      "options": [
        {
          "text": "Let AI write it, then change a few words",
          "ok": false,
          "feedback": "Still not your work — and the fake facts come along for the ride."
        },
        {
          "text": "Write it yourself; use AI to critique and verify, you revise",
          "ok": true,
          "feedback": "Right — your argument and voice, AI as editor."
        },
        {
          "text": "Trust AI’s citations since it sounds well-researched",
          "ok": false,
          "feedback": "“Sounds researched” is exactly how fake citations slip in."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-20",
  "num": 20,
  "arc": "Applying",
  "title": "Coding & debugging",
  "coreQuestion": "AI gave me code — do I actually understand it?",
  "blurb": "Use AI to explain errors and write tests, not to paste mystery code you can’t defend.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It works. Why?",
      "scenario": "You asked AI to fix your bug. It pasted back 30 lines that work. You have no idea why. Next bug, you’re stuck again — because you didn’t learn anything, you just borrowed an answer.",
      "prompt": "What’s the difference between using AI to code and using it to learn to code?"
    },
    {
      "kind": "reveal",
      "title": "AI is a great explainer, a risky autopilot",
      "body": "AI is genuinely useful for explaining error messages, suggesting tests, reviewing your logic, and unsticking you. The danger is pasting code you can’t read: it works until it doesn’t, and then you can’t fix it because you never understood it.",
      "mistake": "Shipping code you couldn’t explain to another person.",
      "good": "Make AI explain the fix and write a test — so you understand and can prove it works."
    },
    {
      "kind": "workflowChain",
      "title": "Build the debug workflow",
      "goal": "Fix a bug with AI’s help and actually understand the fix.",
      "correct": [
        "Read the error message yourself first",
        "Ask AI to explain what the error means",
        "Ask for a hint about the likely cause, not the full fix",
        "Try the fix and ask AI for one test that proves it",
        "Explain the bug and the fix in plain English"
      ],
      "note": "If you can explain it and a test passes, it’s really fixed — not just temporarily quiet."
    },
    {
      "kind": "tryLive",
      "title": "Make AI teach the bug",
      "prompt": "Here’s an error and my code: [paste]. Explain what the error means in plain English and ask me what I think is causing it BEFORE you suggest a fix. Then suggest one test.",
      "react": "Answer its question first. Paste the exchange — did explaining it out loud help you spot the cause yourself?"
    },
    {
      "kind": "compare",
      "title": "Catch the code you can’t defend",
      "weak": "“Just fix it” → you paste 30 lines you’ve never read into your project.",
      "strong": "“Explain the bug, suggest the smallest fix, and a test” → you understand each change.",
      "why": "Mystery code is a future bug you can’t solve. Understood code is a skill you keep."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your debug coach prompt",
      "cardType": "Debug coach",
      "fields": [
        {
          "key": "explain",
          "label": "Ask AI to explain…",
          "placeholder": "what the error means"
        },
        {
          "key": "hint",
          "label": "Ask for a hint, not…",
          "placeholder": "the whole fix at once"
        },
        {
          "key": "prove",
          "label": "Prove it’s fixed by…",
          "placeholder": "a test + plain-English why"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "When is it safe to use AI-suggested code?",
      "options": [
        {
          "text": "When it runs without errors",
          "ok": false,
          "feedback": "Running ≠ correct ≠ understood. It can break later."
        },
        {
          "text": "When you can explain what it does and a test confirms it",
          "ok": true,
          "feedback": "Right — understanding + a test is what makes it yours."
        },
        {
          "text": "When it’s long enough to look serious",
          "ok": false,
          "feedback": "Length is not correctness — and definitely not understanding."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-21",
  "num": 21,
  "arc": "Applying",
  "title": "Creative work",
  "coreQuestion": "If AI gives the idea, is it still mine?",
  "blurb": "AI generates options; your taste and direction decide what’s actually good.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A hundred ideas, none of them yours",
      "scenario": "AI can spit out 50 song titles, 20 plot twists, or 10 logo directions in seconds. Most are generic. A few are interesting. But it can’t tell which one is right for what YOU’re making — only you can.",
      "prompt": "What part of creative work can AI never do for you?"
    },
    {
      "kind": "classify",
      "title": "Generated vs. directed",
      "prompt": "Sort each move by whether AI is generating raw material or YOU are providing the taste.",
      "buckets": [
        "AI generates options",
        "You provide taste & direction"
      ],
      "items": [
        {
          "text": "“Give me 15 directions for this poster.”",
          "answer": 0
        },
        {
          "text": "Choosing which direction fits your message",
          "answer": 1
        },
        {
          "text": "“List 10 plot twists.”",
          "answer": 0
        },
        {
          "text": "Deciding which twist your story has earned",
          "answer": 1
        }
      ],
      "reveal": "AI is a generator. Taste, judgment, and direction — knowing which option is actually right — stay human."
    },
    {
      "kind": "reveal",
      "title": "Taste is the human part",
      "body": "AI can brainstorm, prototype, and critique creative options at speed. But the goal, the taste, and the choice of which direction to commit to come from you. A pile of AI options is raw material; the creative act is selecting and refining.",
      "mistake": "Accepting the first generated idea because it’s there, not because it’s good for your goal.",
      "good": "Generate widely, then choose with intent and make it your own."
    },
    {
      "kind": "tryLive",
      "title": "Generate, then choose",
      "prompt": "Give me 5 different creative directions for [your project]. Make them genuinely different from each other — different mood, different angle. Don’t pick a favorite; that’s my job.",
      "react": "Choose ONE and write why it fits your goal better than the others. Then describe how you’d change it to make it yours."
    },
    {
      "kind": "compare",
      "title": "Catch the generic idea",
      "weak": "“Make my story better” → AI returns a polished but generic version that fits no particular vision.",
      "strong": "“My story is about quiet grief; give me 5 endings that stay understated” → options shaped by YOUR direction.",
      "why": "Without your direction, AI defaults to the average. With it, AI becomes a tool for your specific taste."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your creative brief",
      "cardType": "Creative brief",
      "fields": [
        {
          "key": "goal",
          "label": "What I’m making & the feeling",
          "placeholder": "mood, message, audience"
        },
        {
          "key": "use",
          "label": "I’ll use AI to…",
          "placeholder": "generate options / critique"
        },
        {
          "key": "mine",
          "label": "I decide…",
          "placeholder": "which direction, and how to make it mine"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes an AI-assisted creative work feel like yours?",
      "options": [
        {
          "text": "You used the very first idea it generated",
          "ok": false,
          "feedback": "That’s the average idea — no taste applied yet."
        },
        {
          "text": "You set the direction, chose with intent, and refined it",
          "ok": true,
          "feedback": "Right — generation is cheap; judgment is the creative act."
        },
        {
          "text": "It looks polished and professional",
          "ok": false,
          "feedback": "Polish isn’t point of view — generic can be polished too."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-22",
  "num": 22,
  "arc": "Applying",
  "title": "Personal productivity",
  "coreQuestion": "Can AI help me plan without inventing a fake-perfect schedule?",
  "blurb": "Good plans respect your real constraints — energy, time, and the things that go wrong.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The plan that ignores your life",
      "scenario": "You ask AI to plan your week. It hands you a flawless schedule: gym at 5am, four hours of deep study, zero breaks, nothing ever running late. It looks amazing. It will collapse by Tuesday.",
      "prompt": "What does a realistic plan include that the “perfect” one ignores?"
    },
    {
      "kind": "classify",
      "title": "Realistic or fantasy?",
      "prompt": "Sort these plan features by whether they survive a real week.",
      "buckets": [
        "Realistic",
        "Fantasy plan"
      ],
      "items": [
        {
          "text": "Buffer time between tasks for when things run late",
          "answer": 0
        },
        {
          "text": "Every single hour packed with no breaks",
          "answer": 1
        },
        {
          "text": "Hardest work scheduled when your energy is highest",
          "answer": 0
        },
        {
          "text": "Assumes you never get tired or distracted",
          "answer": 1
        }
      ],
      "reveal": "A good plan accounts for energy, buffers, priorities, and the fact that things go wrong."
    },
    {
      "kind": "reveal",
      "title": "Plans need your constraints",
      "body": "AI plans well only when it knows the truth: how much time you really have, when your energy is high or low, what actually matters most, and what you’ll drop when life interferes. Give it those constraints and it’s genuinely useful. Skip them and you get a schedule for a robot.",
      "mistake": "Accepting an optimistic plan that assumes a perfect, interruption-free week.",
      "good": "Tell AI your real constraints and ask for buffers and a backup if you fall behind."
    },
    {
      "kind": "tryLive",
      "title": "Plan with real limits",
      "prompt": "Turn this messy task list into a realistic plan for my week: [list]. I have about [X hours]. My energy is highest in the [morning/evening]. Add buffer time and tell me what to drop first if I fall behind.",
      "react": "Read the plan. Would it survive a bad day? Paste the “what to drop first” part — that’s what makes it realistic."
    },
    {
      "kind": "verify",
      "title": "Catch the unrealistic schedule",
      "claim": "AI’s plan: 6 hours of focused study after a full school day, no breaks, finishing everything by Wednesday.",
      "steps": [
        "Does this assume perfect energy and zero interruptions?",
        "Where are the breaks and the buffer time?",
        "What happens to this plan if one thing runs late?",
        "Is the most important task protected, or just everything crammed in?"
      ],
      "note": "A plan that only works on a perfect day isn’t a plan — it’s a wish."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your planning prompt",
      "cardType": "Planning prompt",
      "fields": [
        {
          "key": "limits",
          "label": "My real constraints",
          "placeholder": "hours, energy, fixed commitments"
        },
        {
          "key": "priority",
          "label": "What matters most",
          "placeholder": "the one thing that can’t slip"
        },
        {
          "key": "backup",
          "label": "If I fall behind, I drop…",
          "placeholder": "…"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What separates a useful AI plan from a useless one?",
      "options": [
        {
          "text": "It fills every hour productively",
          "ok": false,
          "feedback": "A packed plan ignores energy and breaks — it breaks fast."
        },
        {
          "text": "It includes your real constraints, buffers, and a fallback",
          "ok": true,
          "feedback": "Right — realistic beats impressive every time."
        },
        {
          "text": "It looks ambitious and disciplined",
          "ok": false,
          "feedback": "Ambition on paper isn’t the same as a plan you’ll keep."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-23",
  "num": 23,
  "arc": "Applying",
  "title": "Business & workflows",
  "coreQuestion": "Which repeated tasks can AI take — and where must a human still check?",
  "blurb": "Automate the repeatable parts, but keep a human checkpoint before anything ships.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The task you do every single week",
      "scenario": "Every week you (or a small business) redo the same thing: drafting the same kind of email, summarizing the same kind of report, sorting the same kind of request. It’s repetitive, rule-based, and a perfect candidate for an AI workflow — if it’s set up safely.",
      "prompt": "What makes a task a good fit for AI — and what would make it dangerous to automate?"
    },
    {
      "kind": "classify",
      "title": "Good fit, or risky?",
      "prompt": "Sort each task by whether it’s a safe candidate for an AI workflow.",
      "buckets": [
        "Good fit for AI",
        "Risky to automate"
      ],
      "items": [
        {
          "text": "Draft a first-pass reply that a person reviews before sending",
          "answer": 0
        },
        {
          "text": "Auto-send replies to customers with no human check",
          "answer": 1
        },
        {
          "text": "Summarize incoming reports for a human to scan",
          "answer": 0
        },
        {
          "text": "Approve refunds automatically based on AI judgment",
          "answer": 1
        }
      ],
      "reveal": "AI fits tasks with clear inputs, repeatable steps, and a human checkpoint before anything important goes out."
    },
    {
      "kind": "reveal",
      "title": "Inputs, steps, outputs — and a checkpoint",
      "body": "A task is a good workflow candidate when it has clear inputs, repeatable steps, and a defined output. The non-negotiable part is the review checkpoint: a human approves before the result reaches a customer, a decision, or anything hard to undo.",
      "mistake": "Automating end-to-end with no one checking, because it ran fine in testing.",
      "good": "Let AI draft and sort; require a human “approve” step before it ships."
    },
    {
      "kind": "workflowChain",
      "title": "Map a safe workflow",
      "goal": "Turn a weekly repeated task into a safe AI-assisted workflow.",
      "correct": [
        "Define the input the task always starts with",
        "Have AI do the repeatable step (draft / sort / summarize)",
        "Produce the output in a consistent format",
        "A human reviews and approves it",
        "Note what to improve for next time"
      ],
      "note": "The human checkpoint is what makes it a workflow you can trust, not just automation you hope works."
    },
    {
      "kind": "tryLive",
      "title": "Draft a workflow",
      "prompt": "I do this repeated task: [describe it]. Help me design a simple workflow: what’s the input, what AI does, what the output looks like, and exactly where a human should review before it goes out.",
      "react": "Look at where AI put the human checkpoint. Is it before the risky step? Move it if not — you own that call."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your workflow review map",
      "cardType": "Workflow map",
      "fields": [
        {
          "key": "input",
          "label": "Input",
          "placeholder": "what the task starts with"
        },
        {
          "key": "aistep",
          "label": "AI step",
          "placeholder": "draft / sort / summarize"
        },
        {
          "key": "check",
          "label": "Human checkpoint",
          "placeholder": "what a person approves, and when"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the one thing a trustworthy AI workflow must include?",
      "options": [
        {
          "text": "Full automation so no human is needed",
          "ok": false,
          "feedback": "No-human automation is exactly where it goes wrong unseen."
        },
        {
          "text": "A human review point before anything important ships",
          "ok": true,
          "feedback": "Right — inputs and outputs matter, but the checkpoint is essential."
        },
        {
          "text": "The fastest possible turnaround",
          "ok": false,
          "feedback": "Speed without a check just lets mistakes out faster."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-24",
  "num": 24,
  "arc": "Applying",
  "title": "Teachers & classrooms",
  "coreQuestion": "How can a teacher use AI without weakening student thinking?",
  "blurb": "AI can plan and give feedback — but student agency and privacy come first.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The helpful tool that backfires",
      "scenario": "A teacher uses AI to generate a worksheet and it quietly hands students every answer. Or pastes a class roster with names and grades into a chat. Both felt efficient. Both undercut the actual job: protecting student thinking and privacy.",
      "prompt": "How should a teacher use AI so students still do the learning?"
    },
    {
      "kind": "classify",
      "title": "Protects learning, or undercuts it?",
      "prompt": "Sort each classroom use of AI.",
      "buckets": [
        "Protects learning & privacy",
        "Undercuts it"
      ],
      "items": [
        {
          "text": "AI generates practice questions students must reason through",
          "answer": 0
        },
        {
          "text": "AI worksheet that includes all the answers students can copy",
          "answer": 1
        },
        {
          "text": "Teacher drafts feedback with AI, then personalizes it",
          "answer": 0
        },
        {
          "text": "Pasting students’ names and grades into a public AI chat",
          "answer": 1
        }
      ],
      "reveal": "Good classroom use gives students practice, keeps the teacher in the loop, and never exposes student data."
    },
    {
      "kind": "reveal",
      "title": "Plan and assist — don’t replace the thinking",
      "body": "Educators can use AI to plan lessons, draft feedback, and generate practice. The lines that protect students: activities should make students reason (not copy), the teacher reviews what AI produces, and no real student data goes into the tool.",
      "mistake": "Designing an activity where AI does the cognitive work the student was supposed to do.",
      "good": "Use AI to create practice and first-draft feedback; keep students thinking and data private."
    },
    {
      "kind": "tryLive",
      "title": "Build a learning-protecting activity",
      "prompt": "Create a 15-minute activity for [grade/subject] that uses AI to help students practice without giving them the answers. Then list any misconceptions it might cause and any privacy risks.",
      "react": "Read its activity. Does it make students reason, or just consume? Rewrite one step so the thinking stays with the student."
    },
    {
      "kind": "verify",
      "title": "Catch the answer-giving lesson plan",
      "claim": "An AI-made activity: “Students read the AI explanation and copy the worked example into their notes.”",
      "steps": [
        "Where in this do students actually have to think?",
        "Could a student finish it without understanding anything?",
        "Does any part expose real student names or data?",
        "How would I change one step to require reasoning?"
      ],
      "note": "If a student can complete it on autopilot, it’s a copying exercise, not a learning one."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your classroom AI rule",
      "cardType": "Classroom AI plan",
      "fields": [
        {
          "key": "use",
          "label": "I’ll use AI to…",
          "placeholder": "plan / draft feedback / make practice"
        },
        {
          "key": "protect",
          "label": "Students still must…",
          "placeholder": "reason, not copy"
        },
        {
          "key": "privacy",
          "label": "I’ll never put into AI…",
          "placeholder": "real student names or grades"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which classroom use of AI best protects student thinking?",
      "options": [
        {
          "text": "An AI worksheet with the answers included for efficiency",
          "ok": false,
          "feedback": "That hands students the answer — no thinking required."
        },
        {
          "text": "AI-generated practice questions students must reason through",
          "ok": true,
          "feedback": "Right — students do the work; AI just made the reps."
        },
        {
          "text": "Pasting the class roster in so AI can “personalize”",
          "ok": false,
          "feedback": "That’s a privacy violation, not personalization."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-25",
  "num": 25,
  "arc": "Building",
  "title": "From prompt to workflow",
  "coreQuestion": "How do I chain prompts into a repeatable workflow?",
  "blurb": "Turn a repeated AI task into a small system with inputs, checks, saved output, and a human approval point.",
  "minutes": 12,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The repeated-task problem",
      "scenario": "You keep asking AI to help with the same kind of task: summarize notes, make a study plan, check a draft, or turn ideas into a project outline. Each time, you rewrite the prompt from scratch.",
      "prompt": "A workflow is how you stop starting over. It turns one useful prompt into a repeatable path."
    },
    {
      "kind": "classify",
      "title": "Sort the pieces",
      "prompt": "Decide whether each piece is a one-off prompt, a workflow step, or unsafe automation.",
      "buckets": [
        "One-off prompt",
        "Workflow step",
        "Unsafe automation"
      ],
      "items": [
        {
          "text": "“Explain this paragraph.”",
          "answer": 0
        },
        {
          "text": "Collect the input before asking AI to transform it.",
          "answer": 1
        },
        {
          "text": "Send the AI answer automatically without anyone checking it.",
          "answer": 2
        },
        {
          "text": "Compare the output against a rubric before saving it.",
          "answer": 1
        }
      ],
      "reveal": "A workflow is not more magic. It is a safer sequence of small steps."
    },
    {
      "kind": "workflowChain",
      "title": "Build the safe order",
      "goal": "Create a repeatable workflow for turning messy class notes into a useful study guide.",
      "correct": [
        "Collect the notes and goal",
        "Ask AI for a first draft",
        "Check facts and missing parts",
        "Revise the prompt or output",
        "Save the final study guide",
        "Decide what still needs human review"
      ],
      "note": "The order matters because AI output should be inspected before it becomes something you rely on."
    },
    {
      "kind": "reveal",
      "title": "What changed?",
      "body": "A prompt asks for one answer. A workflow defines the input, the AI job, the check, the saved artifact, and the human approval point. That is how you begin building with AI instead of only chatting with it.",
      "mistake": "Skipping the check step because the AI answer sounds polished.",
      "good": "Make the check part of the workflow so quality is not optional."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your first workflow card",
      "cardType": "Workflow card",
      "fields": [
        {
          "key": "task",
          "label": "Repeated task",
          "placeholder": "Example: turn notes into a study guide"
        },
        {
          "key": "input",
          "label": "Input needed",
          "placeholder": "What you give the AI first"
        },
        {
          "key": "instruction",
          "label": "AI instruction",
          "placeholder": "What the AI should do"
        },
        {
          "key": "check",
          "label": "Verification check",
          "placeholder": "How you catch weak or wrong output"
        },
        {
          "key": "approval",
          "label": "Human approval point",
          "placeholder": "What you decide before using it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Exit check",
      "question": "Which version is a real workflow?",
      "options": [
        {
          "text": "Ask AI to “make it better” until it sounds good",
          "ok": false,
          "feedback": "That is still a loose conversation, not a repeatable path."
        },
        {
          "text": "Input → AI draft → check → revise → save → human approval",
          "ok": true,
          "feedback": "Right. The workflow includes checks and a decision point."
        },
        {
          "text": "Let AI receive, rewrite, and send everything automatically",
          "ok": false,
          "feedback": "That removes the safety and judgment steps."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-26",
  "num": 26,
  "arc": "Building",
  "title": "Designing AI tools",
  "coreQuestion": "What makes an AI tool genuinely useful instead of just impressive?",
  "blurb": "A real user, a real job, clear success criteria — and a plan for when it fails.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Cool demo, useless tool",
      "scenario": "Someone builds an “AI everything assistant.” It demos great and solves nothing, because it has no specific user, no clear job, and no way to tell if it worked. Meanwhile a tiny “turn my notes into flashcards” tool gets used every day.",
      "prompt": "What does the useful tool have that the impressive one doesn’t?"
    },
    {
      "kind": "classify",
      "title": "Useful, or just impressive?",
      "prompt": "Sort these tool ideas by whether they’re actually buildable and useful.",
      "buckets": [
        "Clear & useful",
        "Vague & impressive-sounding"
      ],
      "items": [
        {
          "text": "“Turns my biology notes into 10 quiz questions.”",
          "answer": 0
        },
        {
          "text": "“An AI that does everything for everyone.”",
          "answer": 1
        },
        {
          "text": "“Checks my essay for unsupported claims before I submit.”",
          "answer": 0
        },
        {
          "text": "“The smartest assistant ever, for all your needs.”",
          "answer": 1
        }
      ],
      "reveal": "A good tool names a specific user, a specific job, the input/output, and how you’d know it worked."
    },
    {
      "kind": "reveal",
      "title": "The tool canvas",
      "body": "A useful AI tool answers: who is the user, what job does it do, what goes in, what comes out, and how do we know it succeeded? Then — the part beginners skip — what happens when it fails or gets bad input? Failure handling is what separates a toy from a tool.",
      "mistake": "Designing for “everyone” and “everything,” which means no one and nothing.",
      "good": "Pick one user and one job; define success and failure before building."
    },
    {
      "kind": "tryLive",
      "title": "Pressure-test a tool idea",
      "prompt": "Critique this AI tool idea using a product checklist: [your idea]. Tell me the user, the exact job, the input and output, how we’d measure success, and what happens when it fails or gets bad input.",
      "react": "Where did your idea fall apart — no clear user, fuzzy success, or no failure plan? Write the fix."
    },
    {
      "kind": "compare",
      "title": "Catch the vague idea",
      "weak": "“An AI study buddy that helps students.”",
      "strong": "“For a 9th grader: paste your notes, get 10 quiz questions; success = you score better on the real test; if notes are blank, it asks for the topic.”",
      "why": "The weak one can’t be built or tested. The strong one has a user, a job, a success measure, and a failure case."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your AI tool canvas",
      "cardType": "AI tool canvas",
      "fields": [
        {
          "key": "user",
          "label": "User & job",
          "placeholder": "who it’s for, what it does"
        },
        {
          "key": "io",
          "label": "Input → output",
          "placeholder": "what goes in, what comes out"
        },
        {
          "key": "success",
          "label": "Success & failure",
          "placeholder": "how I know it worked / what if it fails"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What most separates a real tool from an impressive demo?",
      "options": [
        {
          "text": "It can handle any task you throw at it",
          "ok": false,
          "feedback": "“Anything” is the red flag — no clear job means no real tool."
        },
        {
          "text": "A specific user, a defined job, and a plan for failure",
          "ok": true,
          "feedback": "Right — specificity and failure handling make it usable."
        },
        {
          "text": "It uses the newest, most powerful model",
          "ok": false,
          "feedback": "A powerful model on a vague job is still a vague tool."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-27",
  "num": 27,
  "arc": "Building",
  "title": "Intro to agents",
  "coreQuestion": "What changes when AI can take steps and use tools on its own?",
  "blurb": "Agents act, not just answer — so they need limits and a human checkpoint.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "From answering to acting",
      "scenario": "A chatbot tells you what to do. An agent does it — it can search, open files, send messages, run steps in a row, and keep going toward a goal. That’s powerful. It’s also where small mistakes can snowball without anyone watching.",
      "prompt": "What new risks appear the moment AI can act instead of just answer?"
    },
    {
      "kind": "reveal",
      "title": "Agents follow goals, not judgment",
      "body": "An agent works toward a goal using instructions, tools, and limits. What it doesn’t have is human judgment or responsibility — it won’t notice when “keep going” becomes a bad idea. So the design job is: give it only the tools it needs, cap how far it can go alone, and put a human approval before anything risky or irreversible.",
      "mistake": "Letting an agent take many steps with powerful tools and no checkpoint.",
      "good": "Limit its tools and add a human approval step before high-impact actions."
    },
    {
      "kind": "agentDesign",
      "title": "Give it only what it needs",
      "goal": "Build a safe homework-helper agent that finds and summarizes sources for a student.",
      "tools": [
        {
          "name": "Read-only web search",
          "useful": true
        },
        {
          "name": "Summarize text",
          "useful": true
        },
        {
          "name": "Send emails on your behalf",
          "useful": false
        },
        {
          "name": "Delete files",
          "useful": false
        },
        {
          "name": "Save notes to a draft for you to review",
          "useful": true
        },
        {
          "name": "Make purchases with a saved card",
          "useful": false
        }
      ],
      "note": "Least privilege: an agent should get only the tools its goal actually requires — nothing more."
    },
    {
      "kind": "tryLive",
      "title": "Design a low-risk agent",
      "prompt": "Help me design a low-risk agent for this goal: [goal]. List the steps it would take, which tools it needs, where it could fail, and exactly where a human should approve before it continues.",
      "react": "Find the riskiest step in its plan. Add a human approval right before it. You just made the agent safer than the AI designed it."
    },
    {
      "kind": "verify",
      "title": "Catch the runaway plan",
      "claim": "An agent plan: “Search, draft, send the emails, post the results, and delete the old files — all automatically.”",
      "steps": [
        "How many steps run with no human looking?",
        "Which actions can’t be undone (send, post, delete)?",
        "Does it have tools it doesn’t actually need?",
        "Where would I insert an approval before the irreversible step?"
      ],
      "note": "The danger isn’t one step — it’s many unsupervised steps with powerful, irreversible tools."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your agent safety map",
      "cardType": "Agent safety map",
      "fields": [
        {
          "key": "tools",
          "label": "Tools it actually needs",
          "placeholder": "the minimum, nothing extra"
        },
        {
          "key": "limit",
          "label": "How far it goes alone",
          "placeholder": "step cap / no irreversible actions"
        },
        {
          "key": "check",
          "label": "Human approves before…",
          "placeholder": "sending, posting, deleting, buying"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes an agent safer to use?",
      "options": [
        {
          "text": "Giving it every tool so it never gets stuck",
          "ok": false,
          "feedback": "More tools = more ways for a mistake to do real damage."
        },
        {
          "text": "Only the tools it needs, with a human check before risky actions",
          "ok": true,
          "feedback": "Right — least privilege plus a checkpoint."
        },
        {
          "text": "Letting it run fully on its own to save time",
          "ok": false,
          "feedback": "Unsupervised + powerful is exactly the risky combination."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-28",
  "num": 28,
  "arc": "Building",
  "title": "Voice agents & interfaces",
  "coreQuestion": "How does AI change when you talk to it instead of type?",
  "blurb": "Voice and new interfaces remove friction — and remove the pause where you’d normally check.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "“Hey — just do it.”",
      "scenario": "Typing makes you slow down and read. Talking to an AI — or tapping one button — feels instant and effortless. “Add it to my calendar.” “Text them I’m running late.” Done, before you’ve really checked what it did.",
      "prompt": "What do you gain with voice and one-tap interfaces — and what quietly disappears?"
    },
    {
      "kind": "classify",
      "title": "Friction: helpful or risky?",
      "prompt": "Removing friction is great for some things and dangerous for others. Sort them.",
      "buckets": [
        "Fine to make frictionless",
        "Keep a check here"
      ],
      "items": [
        {
          "text": "“Set a 10-minute timer.”",
          "answer": 0
        },
        {
          "text": "“Send this message to the whole group.”",
          "answer": 1
        },
        {
          "text": "“What’s the weather?”",
          "answer": 0
        },
        {
          "text": "“Buy it now with my saved card.”",
          "answer": 1
        }
      ],
      "reveal": "Low-stakes, easy-to-undo actions can be frictionless. Anything sent, shared, or paid for deserves a confirm."
    },
    {
      "kind": "reveal",
      "title": "Convenience removes the pause",
      "body": "Voice and simple interfaces are powerful because they remove friction — fewer steps between wanting something and getting it. But that same friction is where you’d normally catch a mistake: a misheard word, the wrong contact, an action you didn’t mean. Good voice design adds confirmation back for anything that matters.",
      "mistake": "Letting a voice assistant send, buy, or share without reading back what it understood.",
      "good": "For anything with consequences, make the interface confirm before it acts."
    },
    {
      "kind": "tryLive",
      "title": "Test the misunderstanding",
      "prompt": "Pretend you’re a voice assistant. I’ll give a spoken-style command and you’ll show me exactly what you understood and what you’d do BEFORE doing it. Command: [your command].",
      "react": "Did its “what I understood” match what you meant? Note where a misheard command could have caused a real problem."
    },
    {
      "kind": "verify",
      "title": "Catch the frictionless mistake",
      "claim": "A voice assistant: “Okay, I’ve texted your whole contact list that you’re quitting.” (you said “text Sam I’m quitting the group”)",
      "steps": [
        "Did it read back who and what before acting?",
        "Was this action easy to undo — or already sent?",
        "Where should a confirmation step have been?",
        "Which commands should always require a confirm?"
      ],
      "note": "The faster the interface, the more important the read-back before irreversible actions."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your voice-interface rule",
      "cardType": "Voice interface rule",
      "fields": [
        {
          "key": "frictionless",
          "label": "Frictionless is fine for…",
          "placeholder": "timers, info, easy undos"
        },
        {
          "key": "confirm",
          "label": "Always confirm before…",
          "placeholder": "send / buy / share / delete"
        },
        {
          "key": "readback",
          "label": "I want it to read back…",
          "placeholder": "who and what, before acting"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What should a well-designed voice assistant do before a high-impact action?",
      "options": [
        {
          "text": "Act instantly — that’s the whole point of voice",
          "ok": false,
          "feedback": "Instant is great until it sends the wrong thing to everyone."
        },
        {
          "text": "Read back what it understood and confirm before doing it",
          "ok": true,
          "feedback": "Right — add the pause back where consequences are real."
        },
        {
          "text": "Assume it heard correctly to keep things fast",
          "ok": false,
          "feedback": "Assuming is how a misheard word becomes a real mistake."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-29",
  "num": 29,
  "arc": "Building",
  "title": "Evaluation & testing",
  "coreQuestion": "How do I know if my AI workflow actually works?",
  "blurb": "Define success, then try to break it — especially on the hard cases.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "“It worked when I tried it.”",
      "scenario": "You built an AI workflow, tested it on one easy example, and it nailed it. Ship it? That one easy test tells you almost nothing about what happens with weird input, edge cases, or the hard examples real users will throw at it.",
      "prompt": "What would actually prove your AI workflow works — not just that it can?"
    },
    {
      "kind": "reveal",
      "title": "Evaluation = success criteria + hard cases",
      "body": "Real evaluation has four parts: clear success criteria (what “good” means), example cases to run, deliberate failure cases (the tricky inputs), and human review of the results. Testing only on easy examples is how broken things ship looking fine.",
      "mistake": "Declaring success after one happy-path test.",
      "good": "Write the hard cases first, then check if the workflow survives them."
    },
    {
      "kind": "classify",
      "title": "Real test, or fake confidence?",
      "prompt": "Sort these by whether they actually test the workflow.",
      "buckets": [
        "Real test",
        "Fake confidence"
      ],
      "items": [
        {
          "text": "Try a deliberately tricky, messy input",
          "answer": 0
        },
        {
          "text": "Run the one example you already know works",
          "answer": 1
        },
        {
          "text": "Check the output against a written rubric",
          "answer": 0
        },
        {
          "text": "“It looked right, so it’s probably fine.”",
          "answer": 1
        }
      ],
      "reveal": "A real test includes hard cases and a rubric — not just the example that already passes."
    },
    {
      "kind": "tryLive",
      "title": "Generate tests, then add a hard one",
      "prompt": "Here’s my AI workflow: [describe it]. Generate 4 test cases including at least one tricky edge case, and a simple rubric for judging if each output is good.",
      "react": "Now add ONE more failure case AI didn’t think of — the nastiest input you can imagine. Run it. Did the workflow survive?"
    },
    {
      "kind": "verify",
      "title": "Catch the easy-only test",
      "claim": "“I tested my essay-checker on one clean paragraph and it worked, so it’s done.”",
      "steps": [
        "Was the test input easy, or actually representative?",
        "Did I try messy, empty, or tricky inputs?",
        "Is there a rubric, or just “looked right”?",
        "What’s the worst input a real user could give it?"
      ],
      "note": "A workflow is only as proven as its hardest passing test — not its easiest."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your evaluation checklist",
      "cardType": "Evaluation checklist",
      "fields": [
        {
          "key": "success",
          "label": "Success means…",
          "placeholder": "what “good” looks like"
        },
        {
          "key": "hard",
          "label": "Hard cases I’ll test",
          "placeholder": "messy / empty / tricky inputs"
        },
        {
          "key": "review",
          "label": "How I’ll judge results",
          "placeholder": "rubric + human review"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes a test of an AI workflow trustworthy?",
      "options": [
        {
          "text": "It passes the example you designed it for",
          "ok": false,
          "feedback": "The happy path always passes — it proves the least."
        },
        {
          "text": "It includes hard cases and is judged against a rubric",
          "ok": true,
          "feedback": "Right — edge cases plus clear criteria are what prove it."
        },
        {
          "text": "The output looks polished",
          "ok": false,
          "feedback": "Polish hides failure — it’s not the same as correct."
        }
      ]
    }
  ]
});
  L.push({
  "id": "chapter-30",
  "num": 30,
  "arc": "Building",
  "title": "Build a capstone",
  "coreQuestion": "What can I actually build now that I understand AI?",
  "blurb": "Put it all together: a real project where AI helps and you stay in charge.",
  "minutes": 14,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Now build something real",
      "scenario": "You’ve learned how AI works, how to prompt it, how to verify it, where its limits are, and how to design safe workflows and tools. This is where it becomes yours: pick one real thing to build and make it work.",
      "prompt": "What useful thing would you build — a study coach, a workflow assistant, a creative partner, a debug helper, a planner, or a classroom activity?"
    },
    {
      "kind": "classify",
      "title": "Strong project, or not yet?",
      "prompt": "A capstone needs all the pieces. Sort what belongs in a strong project plan.",
      "buckets": [
        "Belongs in the plan",
        "Missing / not enough"
      ],
      "items": [
        {
          "text": "A clear user and the problem it solves",
          "answer": 0
        },
        {
          "text": "“It uses AI and is really cool.”",
          "answer": 1
        },
        {
          "text": "Defined input, output, and a success measure",
          "answer": 0
        },
        {
          "text": "No plan for failure, privacy, or human review",
          "answer": 1
        }
      ],
      "reveal": "A strong capstone names the user, problem, input, output, prompt/workflow, risks, how it’s tested, and what stays human."
    },
    {
      "kind": "reveal",
      "title": "The eight pieces of a real project",
      "body": "A complete AI project has: a user, a problem, an input, an output, the prompt or workflow that does the work, the risks (privacy, errors, misuse), an evaluation plan (how you tested it), and a reflection on what AI did vs. what you decided. Miss the last three and it’s a demo, not a project.",
      "mistake": "Building something impressive with no success measure, no failure plan, and no human checkpoint.",
      "good": "Define success, test the hard cases, and keep the human in charge of the important calls."
    },
    {
      "kind": "tryLive",
      "title": "Have AI critique your plan",
      "prompt": "Here’s my capstone plan: [user, problem, input, output, workflow]. Critique it. What’s unclear, what could fail, what privacy or accuracy risks exist, and where must a human stay in charge? Don’t rewrite my plan — pressure-test it.",
      "react": "Read the critique and fix the weakest part yourself. The plan is yours; AI just stress-tested it."
    },
    {
      "kind": "workflowChain",
      "title": "Order your build",
      "goal": "Take your capstone from idea to a tested, trustworthy project.",
      "correct": [
        "Define the user and the problem",
        "Define the input and the output",
        "Build the prompt or workflow that does the work",
        "List the risks (privacy, errors, misuse)",
        "Test it on easy AND hard cases",
        "Decide what AI did and what stays a human call"
      ],
      "note": "This is every arc of the course in one sequence: understand, prompt, verify, judge, apply, build."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your capstone project card",
      "cardType": "Capstone project",
      "fields": [
        {
          "key": "user",
          "label": "User & problem",
          "placeholder": "who it helps, what problem"
        },
        {
          "key": "io",
          "label": "Input → output & workflow",
          "placeholder": "what it takes in and produces"
        },
        {
          "key": "human",
          "label": "What AI did vs. what I decided",
          "placeholder": "and how I tested it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Final check",
      "question": "What turns an AI capstone from a demo into a real project?",
      "options": [
        {
          "text": "It looks impressive and uses a powerful model",
          "ok": false,
          "feedback": "Impressive isn’t the bar — tested and trustworthy is."
        },
        {
          "text": "It defines success, tests hard cases, and keeps a human in charge",
          "ok": true,
          "feedback": "Right — that’s the whole course in one project. You built it."
        },
        {
          "text": "AI did all the work end to end",
          "ok": false,
          "feedback": "Then it’s the AI’s project, not yours — you stayed out of charge."
        }
      ]
    }
  ]
});
  L.push({
    "id": "chapter-31",
    "num": 31,
    "arc": "Staying in Charge",
    "title": "What not to share with AI",
    "coreQuestion": "What is safe to type into an AI, and what should I keep to myself?",
    "blurb": "Treat the chat box like a public window. Decide your line before you paste.",
    "minutes": 7,
    "resources": [
      {
        "label": "Mozilla — privacy tips for AI chat",
        "url": "https://www.mozillafoundation.org/en/privacynotincluded/"
      }
    ],
    "steps": [
      {
        "kind": "coldOpen",
        "title": "Right before you hit paste",
        "scenario": "You want help wording a tricky message, so you copy the whole email thread into an AI tool — names, phone numbers, your home address, the works. It is so easy you do not even think about it.",
        "prompt": "Before reading on: what in that thread should never have gone in?"
      },
      {
        "kind": "classify",
        "title": "Safe to share, or keep private?",
        "prompt": "Sort what is usually fine to type into an AI from what you should hold back.",
        "buckets": [
          "Usually fine",
          "Keep private"
        ],
        "items": [
          {
            "text": "A made-up example instead of your real essay topic",
            "answer": 0
          },
          {
            "text": "Your full name, address, and school together",
            "answer": 1
          },
          {
            "text": "A general question about a medical symptom",
            "answer": 0
          },
          {
            "text": "Someone else's private messages or photos",
            "answer": 1
          },
          {
            "text": "A password, bank detail, or ID number",
            "answer": 1
          },
          {
            "text": "A summary of a problem with the names removed",
            "answer": 0
          }
        ],
        "reveal": "Rule of thumb: if you would not write it on a whiteboard in a busy hallway, do not paste it into an AI."
      },
      {
        "kind": "reveal",
        "title": "The chat box is not a diary",
        "body": "Many AI tools store what you type and may use it to improve their systems. You usually cannot get it back. So share the shape of a problem, not the private details.",
        "mistake": "Pasting real names, contact info, or anything about another person who did not agree.",
        "good": "Swap real details for placeholders — [my friend], [a city], [the date] — and you still get great help."
      },
      {
        "kind": "tryLive",
        "title": "Try it for real",
        "prompt": "Help me rewrite this message to sound kinder. I have replaced private details with placeholders in brackets — keep the placeholders exactly as they are and do not ask me to fill them in: [paste your message with names and numbers swapped for brackets].",
        "note": "Notice you got the same quality of help without handing over anyone's real information."
      },
      {
        "kind": "toolkitSave",
        "title": "Save your privacy line",
        "cardType": "Privacy line",
        "fields": [
          {
            "key": "never",
            "label": "I will never paste…",
            "placeholder": "passwords, addresses, other people's info"
          },
          {
            "key": "swap",
            "label": "Instead I will swap it for…",
            "placeholder": "[brackets] and made-up examples"
          },
          {
            "key": "check",
            "label": "Before I paste, I will ask…",
            "placeholder": "would I put this on a public board?"
          }
        ]
      },
      {
        "kind": "exitCheck",
        "title": "Quick check",
        "question": "What is the safest way to get help with a sensitive message?",
        "options": [
          {
            "text": "Paste everything — the AI keeps it private anyway",
            "ok": false,
            "feedback": "You cannot count on that. Assume what you type may be stored."
          },
          {
            "text": "Replace real names and details with placeholders first",
            "ok": true,
            "feedback": "Exactly — same help, none of the private data handed over."
          },
          {
            "text": "Never use AI for anything personal, ever",
            "ok": false,
            "feedback": "Too far — with placeholders it is genuinely useful and safe."
          }
        ]
      }
    ]
  });
  L.push({
    "id": "chapter-32",
    "num": 32,
    "arc": "Staying in Charge",
    "title": "Keeping your own voice",
    "coreQuestion": "How do I use AI on my work without it stops being mine?",
    "blurb": "Use AI as a coach, not a ghostwriter. The goal is your understanding, not just a finished page.",
    "minutes": 8,
    "resources": [],
    "steps": [
      {
        "kind": "coldOpen",
        "title": "The question you cannot answer",
        "scenario": "You hand in an essay the AI mostly wrote. The next day your teacher asks, casually, 'So what made you argue that?' — and you realize you cannot explain a single line of it.",
        "prompt": "Before reading on: who actually did the learning there?"
      },
      {
        "kind": "classify",
        "title": "Still your thinking, or outsourced?",
        "prompt": "Which of these keep the work yours, and which quietly hand it over?",
        "buckets": [
          "Still mine",
          "Handed over"
        ],
        "items": [
          {
            "text": "Ask AI to quiz you on a chapter you read",
            "answer": 0
          },
          {
            "text": "Submit an AI-written essay as your own",
            "answer": 1
          },
          {
            "text": "Write a draft, then ask AI where the argument is weak",
            "answer": 0
          },
          {
            "text": "Paste the prompt and turn in whatever it returns",
            "answer": 1
          },
          {
            "text": "Ask AI to explain feedback so you can revise it yourself",
            "answer": 0
          }
        ],
        "reveal": "The test is simple: could you stand up and defend every sentence as your own thinking?"
      },
      {
        "kind": "reveal",
        "title": "Coach, not ghostwriter",
        "body": "A good coach makes you better and then steps back; a ghostwriter replaces you. Aim for help that leaves you understanding more, not help that leaves you holding a page you cannot explain.",
        "mistake": "Letting AI produce the final words so you can skip the thinking.",
        "good": "Let AI question, challenge, and tighten your work — but keep the ideas and the wording yours."
      },
      {
        "kind": "tryLive",
        "title": "Try it for real",
        "prompt": "Here is a paragraph I wrote: [paste your own writing]. Do not rewrite it. Instead, ask me three sharp questions that would make my argument stronger, and point out one place where my reasoning is thin.",
        "note": "You keep the pen. The AI just makes you a sharper writer."
      },
      {
        "kind": "toolkitSave",
        "title": "Save your honesty rule",
        "cardType": "Honesty rule",
        "fields": [
          {
            "key": "use",
            "label": "I will let AI…",
            "placeholder": "quiz me, critique, explain feedback"
          },
          {
            "key": "keep",
            "label": "I will always write myself…",
            "placeholder": "my ideas and my final words"
          },
          {
            "key": "test",
            "label": "My test before I submit…",
            "placeholder": "can I defend every line?"
          }
        ]
      },
      {
        "kind": "exitCheck",
        "title": "Quick check",
        "question": "What is the clearest sign you used AI well on schoolwork?",
        "options": [
          {
            "text": "You finished much faster than usual",
            "ok": false,
            "feedback": "Speed is not the goal — understanding is."
          },
          {
            "text": "You can explain and defend every part in your own words",
            "ok": true,
            "feedback": "Exactly. If you can teach it back, it is yours."
          },
          {
            "text": "The writing sounds more advanced than you normally write",
            "ok": false,
            "feedback": "That is often the warning sign, not the win."
          }
        ]
      }
    ]
  });
  L.push({
    "id": "chapter-33",
    "num": 33,
    "arc": "Staying in Charge",
    "title": "When not to use AI",
    "coreQuestion": "When is doing it myself the whole point?",
    "blurb": "Some things lose their value — or their learning — the moment you outsource them. Know which.",
    "minutes": 7,
    "resources": [],
    "steps": [
      {
        "kind": "coldOpen",
        "title": "A message that missed",
        "scenario": "A friend is going through something hard. You ask AI to write them a comforting text. It is polished, kind, and completely not you — and somehow they can tell.",
        "prompt": "Before reading on: what was lost by outsourcing that?"
      },
      {
        "kind": "classify",
        "title": "Reach for AI, or do it yourself?",
        "prompt": "Sort the moments where AI helps from the moments where doing it yourself is the point.",
        "buckets": [
          "Reach for AI",
          "Do it yourself"
        ],
        "items": [
          {
            "text": "Brainstorming ideas for a project",
            "answer": 0
          },
          {
            "text": "A heartfelt message to someone you love",
            "answer": 1
          },
          {
            "text": "Summarizing a long article to get started",
            "answer": 0
          },
          {
            "text": "Practicing mental math you want to get faster at",
            "answer": 1
          },
          {
            "text": "Drafting a boring routine email",
            "answer": 0
          },
          {
            "text": "Learning a skill where the struggle is how you grow",
            "answer": 1
          }
        ],
        "reveal": "If the doing is the point — the learning, the practice, the meaning — keep it yours."
      },
      {
        "kind": "reveal",
        "title": "Match the tool to the goal",
        "body": "AI is great when the goal is the output. It is the wrong choice when the goal is your growth or your genuine presence. The skill is noticing which one you are in.",
        "mistake": "Defaulting to AI for everything, including the things that only matter because you did them.",
        "good": "Ask what the task is really for. If it is to learn, to practice, or to be truly you — do it yourself."
      },
      {
        "kind": "tryLive",
        "title": "Try it for real",
        "prompt": "Here are the things on my plate this week: [list 5 tasks]. For each one, ask me a single question that would help me decide whether to use AI or do it myself, and why.",
        "note": "The win is not a finished to-do list — it is getting sharper at deciding."
      },
      {
        "kind": "toolkitSave",
        "title": "Save your skip list",
        "cardType": "When I skip AI",
        "fields": [
          {
            "key": "skip",
            "label": "I will do myself…",
            "placeholder": "heartfelt messages, skills I'm building"
          },
          {
            "key": "why",
            "label": "Because the point is…",
            "placeholder": "learning / practice / being real"
          },
          {
            "key": "ask",
            "label": "My question before reaching for AI…",
            "placeholder": "what is this task really for?"
          }
        ]
      },
      {
        "kind": "exitCheck",
        "title": "Quick check",
        "question": "When is it smartest NOT to use AI?",
        "options": [
          {
            "text": "Whenever a task feels hard",
            "ok": false,
            "feedback": "Hard is often exactly where AI can help — that is not the test."
          },
          {
            "text": "When doing it yourself is the point — learning, practice, or being genuine",
            "ok": true,
            "feedback": "Exactly. Match the tool to what the task is really for."
          },
          {
            "text": "Never — more AI is always better",
            "ok": false,
            "feedback": "Not so — some things only matter because you did them yourself."
          }
        ]
      }
    ]
  });
  window.V2_LESSONS = L.sort(function(a,b){return a.num-b.num;});
  window.V2_ARCS = {
  "orientation": "Orientation",
  "understanding": "Understanding",
  "conversation": "Conversation & Prompting",
  "judgment": "Judgment & Safety",
  "applying": "Applying",
  "building": "Building",
  "staying": "Staying in Charge"
};
  if (typeof window.LESSONS === 'undefined') window.LESSONS = window.V2_LESSONS;
})();
