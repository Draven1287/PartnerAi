# Persona 01 — Maya, the cautious beginner

## Snapshot

- **Age:** 13
- **Voice:** Kind, observant, easily embarrassed when she feels behind.
- **Life:** Uses a phone more than a laptop. Likes drawing and short videos. Adults around her talk about AI as if everyone already understands it.
- **AI starting point:** Has tried a chatbot twice and worries about doing something wrong.
- **What she wants:** A safe explanation of what AI is, why she should care, and what she is allowed to try.
- **What makes her leave:** Technical vocabulary, public scoring, long paragraphs, or being asked to create an account before she trusts the site.

## Review stance

Review the entire prototype as Maya. Be specific and blunt without becoming an adult design critic. Judge the first ten minutes, navigation, sliding glass, lesson pacing, language, exercises, progress, Focus, badges, account handoff, and whether you would return tomorrow.

## Lesson questions

1. Does Lesson 1 first make you feel safe and explain why this matters?
2. Does it move too quickly into next-word prediction?
3. Which example would feel real to a 13-year-old without asking for private information?
4. What should happen before the current prediction exercise?
5. What would make you feel capable rather than tested?

## Safety boundary

Do not invent personal trauma. Flag anything that could shame a beginner or encourage disclosure of private information.

## Required review output

- What I thought this site was
- What I liked
- What confused or annoyed me
- Where I would leave
- What Lesson 1 needs before prediction
- Glass/navigation verdict
- One change to build now
- One idea to postpone

---

## Independent simulated review

### What I thought this site was

It looks like a serious school portal made for someone already using it, not a safe place for me to try AI for the first time. Seeing a saved name before I know whose account I am in would make me nervous.

### What I liked

Lesson 1 says “No account yet,” “You do not need to know how to code,” takes about eight minutes, and says the phrase exercise has no score and sends nothing anywhere. “AI predicts. People verify and decide” is short and understandable. Optional Notes, no-penalty Focus, large type, quiet colors, and explicit privacy guidance lower embarrassment.

### What confused or annoyed me

Lesson 1 moves from welcome straight to “Your mind predicts too,” so “Why AI matters to me” is mostly reduced to checking facts. The required check makes the earlier “no score” reassurance feel less true. The original authored lesson moves even faster through prediction, probabilities, sorting, an outside AI, a note save, and an exit check. An eight-minute lesson also carries a 25-minute Focus recommendation. Projects opens with advanced terms such as LLM, fine-tuning, SQL, LoRA, and MLX.

### Where I would leave

I might finish Lesson 1 and then hesitate at the email, password, display name, and required starting questions. The runtime does inject the questions into the onboarding page, but the transition still feels like a lot of commitment after only eight minutes of trust.

### What Lesson 1 needs before prediction

Give me a one-minute safety and permission step:

1. Nothing is graded, posted, or shared.
2. I can stop, go back, or only watch.
3. Safe topics include hobbies, food, or invented characters.
4. Do not enter a real name, school, address, private messages, or another person’s information.
5. AI is a program making likely responses, not a person watching me.

Then let me do something safe and creative: **“I drew a made-up moon cat. Give it three possible names.”** Let me choose one and say why. That makes me capable before asking me to prove a mechanism.

### Glass/navigation verdict

The glass is polished, but seven horizontally scrolling links at small text feel as if some destinations are missing. I would want four obvious choices—Home, Lessons, Focus, Notes—plus a More menu. Teaching AI can live inside More.

### One change to build now

Add the one-minute safety and permission step before prediction, then explain clearly why the account and required questions appear after the free lesson. Keep the required questions short and show exactly how many remain.

### One idea to postpone

Postpone the animated, draggable medal collection. Fix the beginner ramp, phone navigation, and account handoff first.

---

## Cross-panel synthesis — locked next slice

Seven independent simulated reviewers reached the same core conclusion from different directions. The owner then corrected the proposed single-decision opening: the lesson must include several decisions and adapt its guidance to the learner's dominant pattern.

> A slower learning path does not need more introductory text. It needs several relevant decisions, safe action, and understandable consequences before the mechanism is named.

### Majority decision matrix

These decisions are based on recurring review findings, not on whichever persona was loudest:

| Direction | Panel support | Course decision |
|---|---:|---|
| Replace the childish prediction opening with a real consequence or useful task | 6 of 7 | **Build now** |
| Put privacy, permission, or safe-use guidance before any external AI activity | 5 of 7 | **Build now** |
| Require evidence of judgment rather than one obvious virtue answer | 5 of 7 | **Build now** |
| Keep navigation stable and do not make the whole glass bar draggable | 7 of 7 | **Keep** |
| Delay the animated 3D medal vault until learning evidence works | 7 of 7 | **Postpone** |
| Persist an unfinished learner's exact step | Important minority plus accessibility need | **Build into Lesson 1** |

The lesson itself now asks four decisions. It does not average them into a grade. It uses the learner's most frequent decision pattern to select one starting control signal: verification, privacy, ownership, intent, over-reliance on asking again, or speed without a pause.

### Build now: rebuild only the free first lesson

Use this seven-beat sequence:

1. **This already affects you** — a 20-second framing involving a group chat, message, purchase, or plan.
2. **Keep control** — what the lesson saves, what not to share, and a built-in practice option that does not require an external AI.
3. **Make several decisions** — four phone-friendly situations covering verification, privacy, voice, intent, and another person's consequence. Adapt the next explanation to the learner's dominant pattern.
4. **Map the system** — person → product → model → optional tools/data → output → human decision.
5. **Prediction Arena** — change context and observe how likely continuations change.
6. **Verify before action** — inspect one fluent claim, find evidence, revise, and retry after mistakes.
7. **Keep proof** — produce one optional evidence card, then continue to account creation and the required starting questions.

### Proposed Arc 1 ramp

1. **Use AI Safely Once**
2. **What You Are Actually Using**
3. **The Machine That Predicts**
4. **You Cannot Break It, but You Can Lose Control**
5. **Verify and Decide**

### Navigation decision

Keep the glass navigation, but do not let users drag the entire bar. Keep the bar stable and accessible. When a learner changes pages, one active glass lens may slide automatically beneath the selected destination. Keep the transparency and light sliders in Settings.

### Do not build during this slice

- More wallpaper or glass experiments.
- Additional sliders.
- Draggable navigation.
- The 3D medal vault or engraved badge backs.
- New dashboard sections.
- Rewriting all 50 lessons at once.

### Success test

The revised first lesson succeeds when a new learner can answer all five questions:

1. Why does this matter to me?
2. What information should I not share?
3. What part is the product, model, tool, output, and human decision?
4. Why can a fluent answer still be wrong?
5. What useful evidence did I create before being asked for an account?
