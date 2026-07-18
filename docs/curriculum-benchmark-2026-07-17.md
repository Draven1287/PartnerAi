# Learning AI curriculum benchmark — 17 July 2026

## Decision

Keep the ten-arc, 50-lesson architecture. It covers the same core beginner competencies as the current Anthropic, OpenAI, and Khan Academy pathways while differentiating through continuous practice in learner control, emotional boundaries, real-life transfer, and building. Do not copy their wording, interface, lesson order, or brand treatment.

## Current first-party benchmarks

- [Anthropic AI Fluency: Framework & Foundations](https://www.anthropic.com/learn/claude-for-you?vid=39) moves from generative-AI foundations through Delegation, Description, Discernment, and Diligence, including a description–discernment loop.
- [OpenAI Academy Courses](https://academy.openai.com/pages/courses) moves from AI and LLM basics into clear instructions, context, output review, delegation, repeatable workflows, and agents.
- [Khan Academy responsible AI guidance](https://support.khanacademy.org/hc/en-us/articles/42929379091725-How-can-I-use-Khan-Academy-s-AI-features-responsibly) emphasizes thinking before accepting, no sensitive data, independent checking, academic integrity, and trusted-adult guidance for learners under 18.
- [Khan Academy's responsible development approach](https://support.khanacademy.org/hc/en-us/articles/13965308352781-What-is-Khan-Academy-s-approach-to-responsible-AI-development) makes model errors and harmful outputs explicit and uses adult access, visibility, moderation, reporting, and feedback loops for minors using its live AI product.
- [Khanmigo community guidance](https://support.khanacademy.org/hc/en-us/articles/13860282793869-What-are-the-Community-Guidelines-for-Khanmigo) reinforces clear questions, context, multiple sources, critical thinking, privacy, and learning rather than cheating.

## Capability map

| Learning AI arc | Anthropic parallel | OpenAI parallel | Khan parallel | Learning AI's distinct job |
| --- | --- | --- | --- | --- |
| 1. First Contact | Introduction; generative AI | AI foundations | What AI is and can/cannot do | Replace media panic with a usable first control rule |
| 2. How It Works | Generative-AI deep dive | LLM basics | Training, capabilities, limits | Explain prediction, context, tools, and confident error without false personhood |
| 3. Talking to AI | Description | Instructions and context | Clear, specific questions | Turn intention into goals, context, constraints, format, and follow-up control |
| 4. Trust & Everyday AI | Discernment | Review outputs responsibly | Multiple sources and critical thinking | Calibrate reliance across ordinary tools and verify outside the model |
| 5. Prompting Craft | Description–discernment loop | Improve instructions and outputs | Better questions | Practice iterative repair, comparison, and reusable patterns |
| 6. Judgment & Safety | Diligence | Boundaries and responsible use | Privacy, integrity, safety | Keep final approval, spot bias/manipulation, and protect other people's data |
| 7. AI & Being Human | Ethical and safe interaction | Human review | AI supports rather than replaces learning | Preserve voice, skill, relationships, honesty, and responsibility |
| 8. AI for Real Life | Applied delegation | Applied workflows | Learning-purpose use | Transfer control to school, work, health, money, travel, and decisions |
| 9. Building with AI | Applying delegation | Repeatable workflows | Practice and mastery | Build small systems with review points, ownership, and evidence |
| 10. Becoming a Builder | Diligence in systems | Agents and workflows | Responsible creation and sharing | Define permissions, test failure modes, teach the skill, and graduate with a personal kit |

## What is already strong

- Exactly 50 authored lessons with stable identities, ten arcs, at least two gated actions, and a fresh exit check in every lesson.
- Learner evidence and feedback require observable practice instead of passive completion.
- Verification, privacy, bias, synthetic media, emotional boundaries, high-stakes limits, human approval, and building are distributed across the course rather than isolated in one safety chapter.
- The course contains no live model, so it does not expose minors to an unmoderated embedded chatbot. External practice still needs clear boundaries and links to outside-service terms.

## Gaps and required actions

| Priority | Gap | Required action | Release state |
| --- | --- | --- | --- |
| P0 | Product says 13+ while the questionnaire offered “Under 13” | Remove that option and state the 13+ scope next to the control | Implemented locally |
| P0 | Minor-facing account/privacy model lacks explicit trusted-adult and external-tool guidance | Add plain-language privacy guidance; complete an owner-approved privacy/terms review before broad promotion to minors | Guidance implemented; review pending |
| P0 | Production V3 is not yet deployed and the bare-domain certificate is not valid | Deploy hidden V3, repair apex DNS/TLS, then enable the path-preserving `www` redirect | Pending |
| P1 | Real teenagers have not yet tested comprehension, anxiety, and interaction usability | Run moderated review with 13–17-year-olds and a responsible adult; record confusion, distress, and transfer evidence | Pending |
| P1 | Every lesson needs traceability to the four shared behaviours | Maintain arc-level coverage for Describe, Delegate, Discern, and Diligence without forcing every lesson to teach all four | Implemented locally and audited |
| P1 | Academic-integrity language could disappear during later editing | Audit attempt-first, authorship, disclosure, school/work policy, agent permissions, and human-transfer evidence in the relevant lessons | Implemented locally and audited |

## Approval gate

The curriculum itself is structurally ready for a hidden V3 preview. Public launch to the intended 13+ audience still requires: production deployment, bare-domain TLS, authenticated production QA, real 13–17 learner review, and an owner-approved privacy/terms review. The benchmark supports the curriculum direction; it does not certify legal compliance or real-world comprehension.
