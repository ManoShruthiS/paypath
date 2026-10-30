# PayPath Guardian — Hackathon Launch Checklist

## Phase 1: Code & Testing (Complete ✅)
- [x] Node.js server with PayPal Orders v2 REST API helpers.
- [x] AG Grid Community v32 Decision Matrix with interactive selection, custom badges, and live pinned total row.
- [x] Structured AI Agent procurement engine with guardrail audit and execution trace HUD.
- [x] SHA-256 sealed cryptographic audit receipts.
- [x] OpenAPI 3.1.0 specification for APIMatic judging.
- [x] Zero-dependency, secure runtime architecture.

## Phase 2: Git & Deployment (Next Steps)
- [ ] Test locally: run `npm start` and open `http://localhost:3000`.
- [ ] Commit all changes to the public GitHub repository:
  ```bash
  git add .
  git commit -m "Upgrade PayPath to Guardian: AG Grid Decision Matrix & PayPal Orders v2"
  git push origin main
  ```
- [ ] Verify Vercel / Render deployment:
  - If deploying on Vercel: import repository, set environment variables (`OPENAI_API_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`).
  - Verify live URL loads cleanly with live AI badge.

## Phase 3: Demo Video Recording (Under 3 Minutes)
- [ ] Use screen recorder (OBS, Loom, or Windows Xbox Game Bar: `Win + Alt + R`).
- [ ] Follow the exact script from `README.md` (2:15 total duration):
  1. **Hook (0:00–0:20):** Explain the danger of giving AI agents credit cards.
  2. **Solution (0:20–0:45):** Introduce PayPath Guardian.
  3. **Live Agent Sourcing (0:45–1:15):** Click preset (e.g. Contractor Dev Kit), show live execution trace HUD.
  4. **AG Grid Decision Matrix (1:15–1:45):** Highlight sorting, filtering, deselecting an item, and showing live pinned total recalculation.
  5. **PayPal Checkout (1:45–2:15):** Click PayPal Smart Button, log into Sandbox Personal account, complete approval.
  6. **Receipt & Close (2:15–2:30):** Show SHA-256 sealed audit receipt and APIMatic OpenAPI modal.
- [ ] Upload video to YouTube as **Public** or **Unlisted** (with title: *PayPath Guardian — PayPal AI Hackathon Demo*).

## Phase 4: Devpost Submission
- [ ] Open the Devpost submission draft: https://paypalaihackathon.devpost.com/
- [ ] Fill in Project Details using content from `SUBMISSION.md`.
- [ ] Paste public GitHub repository link: `https://github.com/ManoShruthiS/paypath`
- [ ] Paste YouTube video URL.
- [ ] Select Sponsor Categories:
  - **Best Use of AG Grid**
  - **Best Use of APIMatic**
  - **Best Use of Agentic Commerce**
  - **Best Use of PayPal + AI**
- [ ] Submit before the deadline (November 13, 2026)!
