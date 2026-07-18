# Learning AI V3 launch-readiness plan — 2026-07-17

## Bottom line

V3 is **now a functional local preview, but is not ready to replace production V2 yet**. The new `/v3/` shell uses Open Design's editorial direction while reusing the proven V2 authentication, API, curriculum, progress, Saved Notes, settings, projects, and lesson engine. All 50 lessons remain available. Remaining launch work is production preview deployment, bare-domain repair, broader interaction QA, human lesson review, and owner approval.

## Checklist status

### 1. Ensure Railway is operational — PARTIAL

Verified now:

- `https://www.learningai4you.com/health` returns 200.
- `https://www.learningai4you.com/api/health` returns 200.
- The backend reports production, healthy PostgreSQL, and migration version 6.
- `https://www.learningai4you.com/v2/` returns 200.
- Fake-database backend route tests pass.

Still incomplete:

- `https://learningai4you.com` fails TLS hostname validation.
- `https://api.learningai4you.com/health` returns 503.
- The public API hostname is unnecessary because the browser already uses the working same-origin `/api/*` proxy.
- The backend-readiness checker now matches migration 6, the same-origin API proxy, and the Saved Notes archive endpoint; its static checks pass.
- A fresh production signup/progress/Saved Notes isolation walkthrough should be performed before launch; the current health checks do not prove all authenticated flows.

### 2. Ensure all 50 lessons are created — CODE COMPLETE; HUMAN REVIEW REMAINS

Current evidence:

- 50 stable `chapter-N` lessons.
- 10 arcs, five lessons each.
- The authoritative `_arcs.mjs` and `chapter-1.mjs` through `chapter-50.mjs` files now live inside the repository, so a clean GitHub/Railway checkout can reproduce the curriculum.
- `node tools/build-lessons.mjs --check` proves those sources exactly match both `v2/lessons.js` and `coolify-backend/curriculum-seed.json` without rewriting files.
- No stubs.
- Every lesson includes an `exitCheck` and at least two learner actions.
- Lesson-quality audit: 50 lessons, 19 interaction rhythms, 0 failures, 0 warnings.
- Launch audit: 0 failures and 9 non-blocking warnings for lessons that intentionally omit optional Saved Notes prompts.

Remaining work:

- Human editorial review for accuracy, age-appropriateness, anxiety sensitivity, repetition, and real-world transfer.
- Live browser walkthrough of representative lessons from every arc.
- External fact-check of time-sensitive claims.
- Testing with actual learners aged 13+; automated checks cannot prove comprehension or confidence.

Accuracy correction completed during this audit:

- Chapter 25 is now **Make the Answer Checkable**. It no longer teaches learners to ask an AI to expose private reasoning or to treat a detailed explanation as proof. Learners request assumptions, evidence or sources, arithmetic, uncertainty, and an independent check, then verify the most consequential claim themselves.
- This matches current [OpenAI reasoning guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices), which advises direct prompts and warns that chain-of-thought prompting can be unnecessary or harmful, and current [Anthropic prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), which says most multi-step reasoning can be handled internally while explicit intermediate outputs are useful when the workflow itself must be inspected.
- The corrected source was rebuilt into both the browser lesson bundle and backend curriculum seed. The 50-lesson quality audit still reports 0 failures and 0 warnings.

### 3. Discard the payment cycle and consider free access — COMPLETE FOR V3

The production backend has `ENFORCE_COURSE_ACCESS=false`, so no paywall is active. The obsolete one-time Core 50 purchase and future Continuum subscription branch has been removed from the shared learner application.

Recorded launch policy:

- Make all 50 lessons free at launch.
- Remove purchase, locked-core, and future-subscription language from the learner UI.
- Keep the provider-neutral entitlement/payment tables dormant rather than deleting them during launch work; they are not harmful while enforcement is off and can support future donations, school licenses, or optional services without another migration.
- Do not place fundraising or commercial prompts inside lessons.

### 4. Make V3 match V2 and provide a launch preview — FUNCTIONAL LOCAL PREVIEW COMPLETE; LAUNCH VALIDATION REMAINS

What exists:

- Production V2 with working account, dashboard, lessons, progress, Saved Notes, Access, and Settings.
- Open Design premium motion product proof with all 50 lesson identities and the preferred visual direction.
- Claude Design product proof with a tested representative lesson state machine.
- A real `/v3/` preview that shares V2's API, all 50 lessons, account state, progress, Saved Notes, settings, projects, and gating behavior.
- V3-specific premium navigation, entry composition, route/progress motion, free-access page, responsive layout, reduced-motion behavior, and forced-colors safeguards.
- Successful local browser checks for signup, the full 50-tile dashboard, the free-access route, a real lesson, a locked gate, the correct gate unlock, and a 390×844 phone viewport with no horizontal document overflow.
- Successful render checks for the first lesson in every one of the ten arcs, including its title, opening step, Saved Notes notebook, Next action, and desktop overflow measurement; no browser warnings or errors were recorded.
- Successful desktop and 390×844 phone render checks for every distinct interaction type used by the curriculum: `coldOpen`, `reveal`, `nextWord`, `classify`, `tryLive`, `toolkitSave`, `exitCheck`, `workflowChain`, `compare`, `verify`, `promptRepair`, and `agentDesign`. Every expected step title and navigation action rendered, with no horizontal overflow.
- Functional theme checks at phone width for Default, Light, Dark, Sepia, and High Contrast. Each setting applied distinct background, text, and accent tokens, preserved navigation, and produced no horizontal overflow.
- The Settings page now includes an explicit Full motion / Reduce motion control in addition to respecting the device preference. Browser verification confirmed the selected state, zero animation duration in reduced mode, preserved information, and no phone-width overflow.
- The V3 keyboard focus contract now overrides inherited V2 styles with a visible 3px focus ring, and the SPA-safe skip link prevents route replacement before moving focus to the course container. A browser check at a 720×450 CSS viewport (the reflow equivalent of 200% zoom on a 1440px viewport) showed 705px document width, no horizontal overflow, all seven visible authentication controls retained, and the sign-in form readable after vertical scrolling.
- Functional gate checks now cover classification, live-attempt evidence, independent-verification evidence, prompt repair, ordered workflow construction, least-privilege agent design, and a correct exit check. Each produced the authored feedback and made the next action available; Saved Notes remained optional.
- One representative lesson from every one of the 19 distinct full-lesson rhythms has now completed a step-by-step render sweep: 125/125 steps showed the expected lesson title and part number, lesson navigation, and Saved Notes notebook with no desktop horizontal overflow.
- A repeatable `tools/check-v3-preview.mjs` verifier.
- A repeatable `tools/check-v3-production.mjs` verifier for bare-domain TLS, frontend/API health, hidden-preview metadata and assets, the `www` redirect, plus optional existing-account authentication checks.
- A local canonical-host integration check: a request for `www.learningai4you.com/v3/?lesson=25` returns HTTP 308 to `https://learningai4you.com/v3/?lesson=25`, while the same request on `learningai4you.com` serves V3 directly with HTTP 200.
- Self-service account deletion in Settings, protected by authentication, CSRF, and an exact `DELETE` confirmation. The backend route suite and a disposable-account browser walkthrough confirm that incorrect confirmation is rejected, exact confirmation removes the account and learning data, the old session loses access, and the deleted email can create a fresh account.

What does not exist:

- No deployed hidden production V3 route yet; production remains on V2.
- No final V2-to-V3 cutover and rollback rehearsal.
- No production-authenticated V3 walkthrough against Railway/PostgreSQL.
- The 12 distinct interaction types have now been rendered on desktop and phone, all five theme states have been exercised, every gated behavior family has passed at least one functional browser check, all 19 full-lesson rhythms have a complete render sweep, and the 200%-equivalent reflow layout has passed. The remaining local coverage gap is a real human keyboard-only and assistive-technology session; production still needs the same authenticated checks after deployment.
- No owner preview approval or representative 13–17-year-old learner testing.

Current public recheck on 17 July 2026:

- `https://www.learningai4you.com/health` still returns HTTP 200 from Railway.
- `https://www.learningai4you.com/v3/` returns HTTP 404, proving the local V3 has not been deployed yet.
- `https://learningai4you.com` still fails certificate hostname validation, so the selected canonical host is not production-safe yet.

Preview candidate:

- `v3/index.html`

### 5. Confirm step 5 and review lessons — ACTIVE, BUT STEP 4 IS NOT COMPLETE

Curriculum review can proceed in parallel with V3 integration. We are actively at the research-and-review stage, but cannot honestly say the sequential checklist has reached a completed step 5 because V3 parity and preview approval remain open.

Current-source comparison:

- Anthropic's AI Fluency course moves through generative-AI foundations, delegation, description/prompting, discernment, and diligence. Learning AI covers all five, but should make the repeated **Delegation → Description → Discernment → Diligence** loop more explicit across later arcs.
- OpenAI Academy's AI Foundations path emphasizes AI/LLM basics, clear instructions, useful context, output review, responsible use, applied workflows, boundaries, and reusable processes. Learning AI covers these well; the strongest alignment is the move from understanding to repeatable, checked workflows.
- Khan Academy's student sequence begins with what the tool is, how to communicate, when to use it, moderation/history, learning use cases, and relying on information. Khan's current guidance stresses attempts before help, verification, privacy, human oversight, and practice. Learning AI is stronger on general agency and building, but should borrow the pedagogical discipline of giving help after an attempt and measuring whether the learner can still perform independently.

Research sources:

- Anthropic AI Fluency: https://www.anthropic.com/learn/claude-for-you?vid=39
- OpenAI Academy courses: https://academy.openai.com/pages/courses?linkMenu=Courses
- OpenAI ChatGPT Foundations for Teachers: https://academy.openai.com/en/public/clubs/k-12-education-aacga/resources/chatgpt-foundations-for-teachers
- Khanmigo for students: https://www.khanacademy.org/college-careers-more/khanmigo-for-students
- Khanmigo usage guidelines: https://support.khanacademy.org/hc/en-us/articles/25358718125837-Khanmigo-Usage-Guidelines

### 6. Provide the Classic-chat transcript, then develop lessons — AVAILABLE EXTRACT COMPLETE; FULL TRANSCRIPT MISSING

The available DOCX has been extracted to `docs/AI-Learning-Session-Transcript-extracted.md`. It contains 28 non-empty paragraphs and 281 words across two rendered pages; both pages were inspected, and the assistant turns are summaries rather than the original messages. The source itself says it is only a partial summary, not a complete verbatim transcript. It is enough to confirm the learner intent and foundational topics, but not enough to recreate the entire original chat. A full export or copy from the original Classic conversation is required for verbatim recovery.

### 7. Coordinate Open Design, Claude Design, backend, and frontend — STARTED

- Open Design remains the visual/product lead.
- Claude Design contributes selected lesson-copy and interaction-state ideas.
- A separate backend workstream has been started for Railway, migration-6 readiness, same-origin API, and free-access architecture.
- A separate frontend workstream has been started for V3 integration, V2 parity, motion, accessibility, and preview QA.
- Integration contract: stable `chapter-N` IDs, existing `/api/*` endpoints, optional Saved Notes, and at least two real lesson gates plus `exitCheck` must remain unchanged unless both workstreams agree on a versioned migration.

### 8. Remaining Namecheap tasks for Aarav and Dad

1. In Railway, open the custom-domain record for `learningai4you.com` and copy the exact Railway verification TXT name/value.
2. In Namecheap Advanced DNS, add that TXT record exactly. Do not guess its value.
3. Confirm the apex `@` record points to the Railway target assigned to the `learning-ai-web` service and remove conflicting A, AAAA, parking, or URL-redirect records.
4. Keep the already-working `www` CNAME and its `_railway-verify.www` TXT record unchanged.
5. After Railway issues the certificate for the bare domain, make `https://learningai4you.com` canonical and configure `https://www.learningai4you.com` to redirect permanently to it.
6. Recommended: remove the `api` DNS record because V3 uses the canonical same-origin `https://learningai4you.com/api/*`. If a public API subdomain is intentionally retained, copy its exact Railway verification TXT and attach it to the API service; otherwise it will continue returning 503.
7. After DNS propagation, verify all three cases: `www` redirects to the bare domain, the bare-domain V3 route loads with valid TLS, and `https://learningai4you.com/api/health` returns 200.
8. In the frontend Railway service, set `CANONICAL_HOST=learningai4you.com` only after the bare-domain certificate is valid. This makes every `www` path redirect with HTTP 308 to the identical path on the bare domain.

### 9. Audience and experience — DEFINED; REPRESENTATIVE TESTING REMAINS

The course currently targets anxious beginners aged 13+ and aims to move them from media-driven fear to informed agency, practical use, verification, and building. The curriculum and design principles reflect that goal. Launch evidence still needs sessions with real 13–17-year-old learners, including at least one learner with high AI anxiety and one with accessibility needs.

### 10. Clarifications needed from the owner

1. Complete: all 50 lessons are free for V3 launch and future-purchase copy has been removed from the learner UI.
2. Owner decision recorded: use `learningai4you.com` without `www` as the canonical domain; redirect `www` to the bare domain after its certificate is healthy.
3. If a full verbatim Classic transcript exists, export or place it in the public folder; the current DOCX is only a summary.

## Recommended execution order

1. Complete: the full-free launch decision and canonical bare domain have been selected.
2. Finish Namecheap apex verification and redirect; remove or repair the unused API hostname.
3. Publish the working V3 as a hidden `noindex` preview route without replacing V2.
4. Run human keyboard-only and assistive-technology sessions. The 200%-equivalent reflow, 19-rhythm render sweep, representative arcs, themes, high contrast, and reduced motion already pass locally.
5. Complete learner/editorial review and fix evidence-based issues.
6. Run production signup, progress, Saved Notes, settings, logout/login restoration, and account-isolation checks against Railway/PostgreSQL.
7. Owner approves the V3 preview.
8. Rehearse the root-route cutover and rollback, then switch production from V2 to V3.
