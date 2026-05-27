window.V2_LESSON_BLUEPRINT = [
  {
    id: 'lesson-1',
    index: 1,
    slug: 'lesson-1',
    title: 'Why AI matters now',
    subtitle: 'Start from your choices, not from hype.',
    hook: {
      title: 'You see this all the time at school and home.',
      scenario: 'A friend uses AI and gets better grades. Another friend says that is cheating. One more says AI is dangerous. What should you do right now?'
    },
    tryFirst: {
      prompt: 'Pick the least-bad starting response.',
      choices: [
        {
          label: 'Never use AI for school.',
          feedback: 'Too extreme. It may protect against copying, but also blocks useful learning support.'
        },
        {
          label: 'Use AI for everything because everyone else will.',
          feedback: 'You will get speed, but you may outsource understanding and never build judgment.'
        },
        {
          label: 'Use AI when it helps you learn, and keep proof of your thinking.',
          feedback: 'Strong. You are setting a practical rule: use AI as support, not as a replacement for thought.',
          correct: true
        }
      ]
    },
    reveal: {
      title: 'Agency is the real skill.',
      body: 'AI can be useful, but every useful learner keeps ownership: choose your goal, ask for checks, and decide what counts as done.',
      mistake: 'A fluent answer can still be wrong or low effort. Never confuse output speed with understanding.',
      good: 'Use AI when it improves your judgment, planning, or reflection. Skip it when it tempts you to stop thinking.'
    },
    prompt: 'I am deciding whether AI can help me without replacing my thinking. Give me 5 useful use cases and 5 risky shortcuts for students or workers, and mark one check question for each risky shortcut.',
    saveTemplate: {
      line1: 'I want AI to help me ________.',
      line2: 'I will not let AI decide ________.',
      line3: 'Before I trust AI, I will check ________.',
      line4: 'If I do not understand, I will rewrite the prompt before I use it.'
    },
    mastery: 'Write one useful opportunity and one boundary in your own words.',
    next: 'lesson-2'
  },
  {
    id: 'lesson-2',
    index: 2,
    slug: 'lesson-2',
    title: 'First useful AI conversation',
    subtitle: 'Your first useful conversation starts with framing, not perfection.',
    hook: {
      title: 'You have 10 minutes to learn something hard.',
      scenario: 'You are stuck. You need help, but you want to keep understanding, not outsource it.'
    },
    tryFirst: {
      prompt: 'Which prompt is most likely to get a useful, checkable answer?',
      choices: [
        {
          label: 'Help me study for biology.',
          feedback: 'Too short. The AI can guess, but your output will be generic.'
        },
        {
          label: 'Explain the concept and give me examples.',
          feedback: 'Better than generic, but missing constraints and a check step.'
        },
        {
          label: 'You are my tutor. I am studying photosynthesis. Ask me one question first, give one hint, then give one short explanation. Ask me to test one example before finalizing.',
          feedback: 'Strong. You gave role, context, structure, and a required learner check.',
          correct: true
        }
      ]
    },
    reveal: {
      title: 'Good prompts create a loop, not one-shot magic.',
      body: 'A useful request includes role, current level, what help you want, and what the AI should not do for you.',
      mistake: 'Even good prompts fail if you accept a full answer immediately without checking your own understanding.',
      good: 'Ask for a short output first, then one follow-up with your own attempt.'
    },
    prompt: 'Act like a peer tutor. Ask what I understand, give one hint, then wait for my attempt and only then give your second explanation.',
    saveTemplate: {
      line1: 'Subject: ________',
      line2: 'Current level: ________',
      line3: 'What I want: a hint, not the final answer',
      line4: 'Check I did first: ________'
    },
    mastery: 'State one change you made between your first prompt and your final request.',
    next: 'lesson-3'
  },
  {
    id: 'lesson-3',
    index: 3,
    slug: 'lesson-3',
    title: 'What AI actually is',
    subtitle: 'AI is a pattern system, not a human mind.',
    hook: {
      title: 'A classmate says AI "understands" everything.',
      scenario: 'You are helping a friend decide whether to trust an AI response that sounds very confident.'
    },
    tryFirst: {
      prompt: 'Which frame keeps your options open?',
      choices: [
        {
          label: 'AI is thinking like a human and is mostly always right.',
          feedback: 'This is the biggest misconception. Confidence is not proof.'
        },
        {
          label: 'AI is trained software that recognizes and generates patterns from data.',
          feedback: 'Good practical frame. It explains where AI is useful and where it needs verification.',
          correct: true
        },
        {
          label: 'AI is a perfect information source, like a live library search.',
          feedback: 'Wrong. AI output is generated and can invent missing details.'
        }
      ]
    },
    reveal: {
      title: 'Patterns are useful, not infallible.',
      body: 'AI is strongest at generating probable language patterns; that helps you get useful drafts and ideas fast.',
      mistake: 'A polished paragraph can still be fabricated or weakly grounded.',
      good: 'Use AI to generate options, then test and refine each output against your own understanding.'
    },
    prompt: 'Explain AI to a 14-year-old in 3 simple lines. Then ask 2 trap questions I can use to check if my definition is too naive.',
    saveTemplate: {
      line1: 'Myth: ________',
      line2: 'Reality: ________',
      line3: 'Example in my life: ________',
      line4: 'What I still need to verify: ________'
    },
    mastery: 'Write a 3-line definition without saying AI is "smart like a person."',
    next: 'lesson-4'
  },
  {
    id: 'lesson-4',
    index: 4,
    slug: 'lesson-4',
    title: 'What an LLM is',
    subtitle: 'Tokens, context, and output limits become your control points.',
    hook: {
      title: 'You can finish a sentence in seconds, then still get the wrong answer.',
      scenario: 'Your model gives a fluent response but misses one key line in the requirements.'
    },
    tryFirst: {
      prompt: 'Pick the best completion shape for the blank.',
      choices: [
        {
          label: 'LLM means the model stores facts like a file and retrieves them instantly every time.',
          feedback: 'Overstated. Retrieval is separate from the model unless tools are attached.'
        },
        {
          label: 'LLM = a large model that predicts likely next tokens from context and training data.',
          feedback: 'Correct. It explains fluency, speed, and why confidence can exist without certainty.',
          correct: true
        },
        {
          label: 'LLM = a simple formula for ranking search results.',
          feedback: 'Not right. It can use ranking-like ideas, but that is not the full behavior.'
        }
      ]
    },
    reveal: {
      title: 'LLM behavior is constrained by context and token budget.',
      body: 'If critical constraints are missing, output can drift. If context is narrow, output can be wrong and confident.',
      mistake: 'Assuming it "remembers" everything like a person leads to trust mistakes.',
      good: 'Add context limits, output format, and a verification step to make usage safer.'
    },
    prompt: 'Give me one short exercise to teach a peer the difference between fluency and truth using only one AI answer example.',
    saveTemplate: {
      line1: 'Model: ________',
      line2: 'Token: ________',
      line3: 'Context: ________',
      line4: 'Verify with: ________'
    },
    mastery: 'Explain in your own words how tokens, context, and verification connect.',
    next: 'lesson-5'
  },
  {
    id: 'lesson-5',
    index: 5,
    slug: 'lesson-5',
    title: 'Prompt repair: goal, context, constraints, format',
    subtitle: 'The difference between asking and prompting.',
    hook: {
      title: 'You got a boring or wrong answer again.',
      scenario: 'Same question, different prompt quality can completely change output.'
    },
    tryFirst: {
      prompt: 'Which prompt should you fix first?',
      choices: [
        {
          label: 'Give me the answer.',
          feedback: 'Too vague. Output will be broad and low-value.'
        },
        {
          label: 'Write me a 250-word summary.',
          feedback: 'Missing goal context and constraints. Still weak.',
          correct: true
        },
        {
          label: 'As a writing mentor, create a 250-word study summary for a 10th grader with 3 key ideas, one warning, and a 2-question quiz. Do not give away final homework answers.',
          feedback: 'Strong. You added goal, audience, constraints, format, and a safety boundary.',
          correct: true
        }
      ]
    },
    reveal: {
      title: 'Repair quality is your skill.',
      body: 'Prompts are executable instructions. The better your prompt design, the better your control loop becomes.',
      mistake: 'A "better-looking" prompt can still be wrong if the goal is unclear.',
      good: 'Keep goals concrete, constraints explicit, and ask for a quick self-check from the AI.'
    },
    prompt: 'Create a prompt-repair template with goal, context, constraints, format, and quality check. Fill it for your current study or work task.',
    saveTemplate: {
      line1: 'Goal: ________',
      line2: 'Context: ________',
      line3: 'Constraints: ________',
      line4: 'Format: ________',
      line5: 'Quality check: ________'
    },
    mastery: 'Repair one weak prompt and compare with your original response.',
    next: 'lesson-6'
  }
];
