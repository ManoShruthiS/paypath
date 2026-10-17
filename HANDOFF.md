# PayPath — handoff for the next agent

## Goal

Finish and submit a competitive entry for the **PayPal AI Hackathon**. The deadline stated by the user is **October 18, 2026**. The project is an AI-assisted checkout concierge called **PayPath**.

## Project location

`C:\Users\manos\Documents\Codex\2026-10-17\hi\outputs\PayPath`

This is the only user-facing project folder. Do not work from `work\paypath`; it is an earlier mirror.

## What PayPath does

1. A buyer writes a natural-language need.
2. The server calls the OpenAI Responses API to turn it into a structured purchase recommendation: title, price, rationale, three steps, and impact statement.
3. The browser displays the recommendation and renders a PayPal Sandbox checkout button.
4. The buyer—not the AI—approves and completes the test payment.

Core pitch: **“AI guides; people approve; PayPal completes.”**

## Current implementation

| File | Purpose |
|---|---|
| `server.mjs` | Zero-dependency Node server. Serves the app, `/api/config`, and `/api/plan`. Calls OpenAI server-side. |
| `public/index.html` | Interface and product narrative. |
| `public/app.js` | Calls the planning API and renders PayPal JS SDK buttons. |
| `public/style.css` | Finished responsive visual design. |
| `.env` | User-created private configuration. **Never commit, display, or request its contents.** |
| `.gitignore` | Excludes `.env` and dependencies. |
| `README.md` | Local setup and product explanation. |
| `SUBMISSION.md` | Devpost content and demo-video script. |
| `LAUNCH-CHECKLIST.md` | Submission checklist. |
| `LICENSE` | MIT license, required for the public repository. |

## Credentials and accounts already prepared

- A PayPal **Sandbox** developer app exists. Its public client ID is already configured in `server.mjs` as a fallback, and may be overridden by `PAYPAL_CLIENT_ID` in deployment settings.
- PayPal Sandbox Business and Personal test accounts exist. Their credentials are private. Do not request them in chat; direct the user to use the personal Sandbox account during checkout testing.
- The user created an OpenAI API key and saved it privately in `.env` as `OPENAI_API_KEY`.
- `.env` also sets `OPENAI_MODEL=gpt-4.1-mini`. If the deployment reports a model-access error, have the user set a model available to their API project; do not ask them to paste their key.

## Verified behaviour

- The app originally returned a Buffer object in the browser. This was fixed in `server.mjs`: `send()` now sends `Buffer` objects directly.
- The browser UI renders correctly at `http://localhost:3003` in the present environment.
- The planning endpoint returns a complete structured response in local fallback mode.
- Syntax checks for `server.mjs` and `public/app.js` passed.
- The local Codex Windows environment blocks outbound network calls from Node (`fetch` fails with `EACCES`). This is an environment restriction, **not a bad API key or application bug**.
- Therefore local preview intentionally falls back to a clearly labelled offline preview when OpenAI cannot be reached. On an ordinary hosting platform, it should make the live OpenAI request.

## Important honesty rule

Do not claim the local fallback is live AI. In the UI, it says the local preview is offline. The deployed app needs to be tested with the OpenAI key before any video claim of live AI.

## Git state

- A Git repository was initialized in this folder.
- Nothing has been committed or pushed.
- The environment may show a Git “dubious ownership” warning. Use a per-command safe-directory override if needed, rather than changing global Git settings:

```powershell
git -c safe.directory='C:/Users/manos/Documents/Codex/2026-10-17/hi/outputs/PayPath' status
```

## Immediate priority plan

1. Create a **public** GitHub repository named `paypath` (the user has a GitHub account but has not created the repo yet).
2. Commit and push this folder. Verify `.env` is not tracked.
3. Deploy to Vercel or another Node-compatible host. Vercel is the recommended route.
4. Set deployment environment variables privately:
   - `OPENAI_API_KEY` — user enters this, never the agent
   - `OPENAI_MODEL` — initially `gpt-4.1-mini`
   - optionally `PAYPAL_CLIENT_ID` — already embedded as a public Sandbox fallback
5. Open the deployed URL and test one real AI recommendation. Fix model or billing errors only if the deployment response gives a precise error.
6. Test PayPal Sandbox checkout using the user’s Personal Sandbox account. Do not make any real payment.
7. Capture a clean deployed demo, not the local offline-preview notice.
8. Use `SUBMISSION.md` for Devpost text and the under-three-minute demo script.

## Suggested improvements if time remains

These are optional after deployment works; do not jeopardize the core demo.

- Replace client-side `actions.order.create` with server-side PayPal Orders v2 creation/capture so the PayPal integration is more production-like. This requires the PayPal Client Secret, which must be entered only as a private deployment variable by the user—never pasted into chat or committed.
- Add a lightweight “why this recommendation” section that surfaces specific constraints extracted from user intent.
- Add a non-deceptive demo-ready status badge distinguishing `Live AI` from `Local Preview`.
- Improve documentation with deployment URL, GitHub URL, and screenshots after deployment.

## Submission requirements already researched

The entry must meaningfully use both PayPal and AI, provide a functional demo, public open-source code repository with license, clear run instructions or hosted demo, and a public YouTube video under three minutes demonstrating the app. Judging focuses on technical implementation, design, potential impact, innovation, and presentation.

## Paste-ready prompt for a new agent

> Continue the PayPath hackathon project from `C:\Users\manos\Documents\Codex\2026-10-17\hi\outputs\PayPath`. Read `HANDOFF.md`, `README.md`, and `SUBMISSION.md` first. The user needs a competitive PayPal AI Hackathon submission by October 18, 2026. The project already has a polished Node/vanilla-JS app, a PayPal Sandbox client ID configured, and an OpenAI key in a private `.env` file. Never expose or request secret values. Local Node networking is blocked in this Codex environment, so deploy before judging whether the OpenAI integration works. Help create and push a public GitHub repo, deploy to Vercel, configure secrets only through private environment settings, test live AI plus PayPal Sandbox checkout, and finish the Devpost/video materials. Be honest: local fallback is not live AI. Prioritize an end-to-end deployed demo over nonessential refactors.
