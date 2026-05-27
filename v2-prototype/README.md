# Learning AI V2 Local Prototype

This folder hosts the V2 local-host prototype used for:

- 30-lesson interactive flow from V2 blueprint
- local progress + toolkit card tracking
- optional local session tracking backend (name, active users, elapsed time)

## How to run

1. Start from `/Users/Aaravshah/Documents/public`:
   - `npm run start:v2`
2. Open:
   - `http://127.0.0.1:8080/v2-prototype/index.html#path`
3. For session logging:
   - enter a name
   - click **Start Session**
   - you will see active users and cumulative community time.

If the API is not available, the UI still works in **local-only mode** and will save progress/toolkit cards in the browser.

## If you also want this in the deploy repo

Sync this folder into:
`/Users/Aaravshah/Documents/auto changing website for realtime/PartnerAi-deploy/v2-prototype`

Then commit from that repository for GitHub Pages deployment.
