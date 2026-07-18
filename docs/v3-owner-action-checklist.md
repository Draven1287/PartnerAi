# Learning AI V3 — what Aarav and Dad need to do

Updated: 17 July 2026

## The short version

The functional V3 and all 50 lesson sources exist locally and pass the current automated and browser checks. V3 is **not deployed** yet. Production still serves V2 on `www.learningai4you.com`; the selected canonical domain `learningai4you.com` still has an invalid certificate.

## Aarav — required next actions

1. **Accept the Railway workspace invitation.** Dad should invite `aarav@shah.so` to the correct Railway workspace/project with permission to edit services, variables, deployments, and domains. Use Aarav's own login; do not share Dad's password or account session. Once the project appears, Codex can inspect it and deploy `/v3/` without replacing V2.
2. **Launch-access decision recorded.** All 50 lessons are free, with no lesson paywall, trial boundary, purchase requirement, or subscription interruption. No paid offer is promised for launch. Optional donations, school licensing, or genuinely separate paid services can be considered later outside lessons.
3. **Review the hidden V3 preview after deployment.** Approve or reject the product direction only after testing the real dashboard, lesson player, progress, Saved Notes, settings, and phone layout—not a static design screenshot.
4. **Provide the full Classic transcript only if one exists.** The available DOCX is a partial summary and has already been extracted. Do not delay deployment if there is no fuller export.
5. **Recruit a small learner review group.** At minimum: two learners aged 13–17, including one who feels anxious about AI; ideally include a keyboard-only or assistive-technology user.

## Dad — Railway access first

1. In the correct Railway workspace, invite `aarav@shah.so` with permission to edit services, variables, deployments, and domains. Billing access is not required.
2. Confirm the dedicated Learning AI project is in that workspace and that its plan is active.
3. Confirm Railway's GitHub integration can access `Draven1287/PartnerAi`.
4. Revoke the Railway token previously shared in chat. Do not create or paste a replacement token if workspace membership works.
5. Tell Aarav the invitation was sent and the exact Railway project name. Do not change services or DNS yet.

## Dad / Namecheap — do only after Railway shows the exact values

1. In Railway, open the custom domain `learningai4you.com` and copy its exact verification TXT name and value.
2. In Namecheap Advanced DNS, add that TXT record exactly. Never guess the Railway verification value.
3. Confirm the apex `@` host points to Railway's assigned frontend target.
4. Remove conflicting apex A, AAAA, parking, or URL-redirect records only after comparing them with Railway's instructions.
5. Keep the currently working `www` CNAME and `_railway-verify.www` TXT while the bare-domain certificate is being issued.
6. Once `https://learningai4you.com/health` works with a valid certificate, set the frontend Railway variable `CANONICAL_HOST=learningai4you.com`.
7. Verify that `www.learningai4you.com/anything` returns HTTP 308 to `learningai4you.com/anything` and preserves the path/query.
8. Remove the public `api` DNS record unless a separate public API hostname is intentionally required. V3 uses the safer same-origin `/api/*` proxy.

## What Codex will do after Railway login

1. Inspect the frontend, backend, and PostgreSQL services without changing the live root route.
2. Deploy the current repository as hidden `noindex` `/v3/` while `/` and `/v2/` continue serving V2.
3. Run `tools/check-v3-production.mjs` for TLS, health, API, canonical metadata, assets, and the `www` redirect.
4. Run a production test-account walkthrough: login, curriculum, dashboard, progress, gated activity evidence, Saved Notes, settings, logout/login restoration, account isolation, and self-service deletion with a disposable account.
5. Finish a human keyboard-only and assistive-technology session. The 200%-equivalent reflow and all 19 full-rhythm checks already pass locally.
6. Record defects and fix them before requesting owner approval.
7. Rehearse cutover and rollback. V3 replaces V2 only after approval.

## Things nobody should do yet

- Do not redirect `www` to the bare domain before the bare-domain certificate is valid.
- Do not replace the production root route with V3.
- Do not enable course-access enforcement or introduce a paywall.
- Do not delete payment/entitlement tables during launch work; leave them dormant.
- Do not treat automated checks as proof that a 13-year-old understands the lessons.
