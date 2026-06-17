# Learning AI V2 — Review & Implementation Package

Hand this whole folder to **Codex** (implement + push to GitHub) and **Opus** (review). Start with **`REVIEW-HANDOFF.md`** — it routes each of you and has both checklists.

## What's here

| File | What it is |
|---|---|
| `Learning AI V2 - Redesign.dc.html` | The full redesigned app — guest path, auth + remember-me, diagnostic (shuffled), dashboard + mosaic, gated lessons, interactive walk-through videos, 4 themes. |
| `Explainer Library.dc.html` | The reusable tap-through "walk-through" engine (3 sample lesson videos). |
| `Backend Console.dc.html` | Admin analytics dashboard + live connection diagnostics. |
| `support.js` | Runtime needed to open the three `.dc.html` files in a browser. Keep it next to them. |
| `REVIEW-HANDOFF.md` | **Read first.** Reviewer routing, file map, walk-through guidance, push + review checklists. |
| `BACKEND.md` | Stack, data model, every endpoint, CORS/cookie/Cloudflare config, auth lifecycle. |
| `HANDOFF.md` | Round-1 handoff: porting plan + theme tokens + voice/audience decisions. |
| `server/` | Deployable reference API — `server.js` (Express), `schema.sql` (Postgres), `package.json`. |
| `backend-client-v2.js` | Frontend bridge for all endpoints (credentials/CORS handled). |
| `animations.jsx` | Timeline engine (for the optional cinematic explainers). |
| `v2/sunrise-progress.png` | Mosaic reveal image. |

## How to view the designs
Open any of the three `.dc.html` files directly in a browser (keep `support.js` beside them). They're self-contained — progress is held in the browser; the live site wires them to the backend.

## The two real next steps (both flagged in the handoff)
1. **Author lessons 11–30** — only ~9–10 are written today; the rest are stubs. Should be Aarav-voiced, from the blueprint, not mass-generated.
2. **Deploy + wire the backend** — Shaleen does Coolify + Cloudflare (BACKEND.md §5–6); Codex deploys `server/` and wires the frontend.

> Nothing here is on GitHub yet — committing this is the next action.
