# PayPath — handoff for the next agent

## Goal

Finish and submit a competitive entry for the **PayPal AI Hackathon**. The deadline stated by the user is **October 18, 2026**. The project is an AI-assisted checkout concierge called **PayPath**.

## Latest status — read this first

- **GitHub repository:** `https://github.com/ManoShruthiS/paypath`
- **Latest ready deployment:** `https://paypath-5ih17khil-mahi-77d1.vercel.app`
- **Stable Git integration alias:** `https://paypath-git-main-mahi-77d1.vercel.app`
- **Vercel project:** `paypath`, team `Mahi` / `mahi-77d1`, project id `prj_IFeqHb5OJ3iiRh7dxJ9NvhTAgVqs`.
- The latest deployment is **READY** and uses GitHub commit `87538b5d4253b873aaa50486d964ae90e1bb77ea` (`Show live AI connection status in checkout`).
- `OPENAI_API_KEY` and `OPENAI_MODEL` are configured in Vercel as sensitive variables for **production, preview, and development**. Do not read, print, ask for, or overwrite their values.
- The user must now open the latest URL, enter a fresh prompt, and look at the small label above the result title. It says either **LIVE AI RECOMMENDATION** or **DEMO MODE — AI KEY NOT CONNECTED**. This is the next critical verification step.
- Do **not** claim a prize is guaranteed. Be candid that the app must be live-tested, PayPal Sandbox-tested, video-recorded, and submitted before it is competitive.

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
| `api/config.mjs` | Vercel Serverless Function exposing non-secret client configuration. |
| `api/plan.mjs` | Vercel Serverless Function that calls the OpenAI Responses API privately. |
| `vercel.json` | Vercel function configuration. |
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
- The same OpenAI settings were added to Vercel. They are sensitive and their values must never be read or disclosed.
- `.env` also sets `OPENAI_MODEL=gpt-4.1-mini`. If the deployment reports a model-access error, have the user set a model available to their API project; do not ask them to paste their key.

## Verified behaviour

- The app originally returned a Buffer object in the browser. This was fixed in `server.mjs`: `send()` now sends `Buffer` objects directly.
- The browser UI renders correctly at `http://localhost:3003` in the present environment.
- The planning endpoint returns a complete structured response in local fallback mode.
- Syntax checks for `server.mjs` and `public/app.js` passed.
- The local Codex Windows environment blocks outbound network calls from Node (`fetch` fails with `EACCES`). This is an environment restriction, **not a bad API key or application bug**.
- Therefore local preview intentionally falls back to a clearly labelled offline preview when OpenAI cannot be reached. On an ordinary hosting platform, it should make the live OpenAI request.
- Vercel deployment routes were added under `api/`, because a long-running local Node server is not the correct Vercel runtime shape.
- The UI now displays **LIVE AI RECOMMENDATION** for a successful OpenAI response and **DEMO MODE — AI KEY NOT CONNECTED** for the fallback. This avoids accidentally presenting demo data as live AI to judges.

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

1. Open the latest deployed URL and test a fresh prompt; get a screenshot with the Live-AI status label visible.
2. If it says `DEMO MODE`, inspect Vercel environment-variable scope and whether the user pasted the actual API key. Never request or inspect the secret value. Redeploy after any scope/value change.
3. If it says `LIVE AI RECOMMENDATION`, test the PayPal Sandbox button using the user’s personal Sandbox account. Do not use a real payment.
4. Improve only what is needed for the final demo—do not risk the working deployment with broad refactors.
5. Capture a clean deployed demo, not a local offline-preview notice.
6. Use `SUBMISSION.md` for Devpost text and the under-three-minute demo script.

## Suggested improvements if time remains

These are optional after deployment works; do not jeopardize the core demo.

- Replace client-side `actions.order.create` with server-side PayPal Orders v2 creation/capture so the PayPal integration is more production-like. This requires the PayPal Client Secret, which must be entered only as a private deployment variable by the user—never pasted into chat or committed.
- Add a lightweight “why this recommendation” section that surfaces specific constraints extracted from user intent.
- Add a non-deceptive demo-ready status badge distinguishing `Live AI` from `Local Preview`.
- Improve documentation with deployment URL, GitHub URL, and screenshots after deployment.

## Submission requirements already researched

The entry must meaningfully use both PayPal and AI, provide a functional demo, public open-source code repository with license, clear run instructions or hosted demo, and a public YouTube video under three minutes demonstrating the app. Judging focuses on technical implementation, design, potential impact, innovation, and presentation.

## Paste-ready prompt for a new agent

> Continue the PayPath hackathon project from `C:\Users\manos\Documents\Codex\2026-10-17\hi\outputs\PayPath`. Read `HANDOFF.md`, `README.md`, and `SUBMISSION.md` first. The GitHub repo is `https://github.com/ManoShruthiS/paypath`; the latest Vercel deployment is `https://paypath-5ih17khil-mahi-77d1.vercel.app`, and it is READY. The app includes a visible status label: `LIVE AI RECOMMENDATION` means the OpenAI integration works; `DEMO MODE — AI KEY NOT CONNECTED` means it does not. The user has set Vercel secret variables, but their values must never be requested, read, printed, or committed. First obtain the screenshot showing which mode the deployed app is in. Then test PayPal Sandbox checkout only after Live AI is confirmed. Do not claim a prize is guaranteed; prioritize an honest, end-to-end demo, polished video, and Devpost submission before nonessential refactors.

