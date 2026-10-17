# PayPath

**An AI checkout concierge built for the PayPal AI Hackathon.** Buyers describe what they need in plain language; PayPath turns that intent into one transparent, human-approved checkout, then completes the payment through PayPal Sandbox.

## Why it matters

Shopping and payments are increasingly agent-mediated, but buyers still need clarity and control. PayPath reduces decision friction without hiding cost, manipulating preferences, or allowing an agent to spend autonomously.

## Built with

- **PayPal JavaScript SDK**: renders and captures an actual Sandbox order.
- **OpenAI Responses API**: turns an open-ended buyer request into structured purchase guidance.
- Node.js built-in HTTP server: lightweight, zero-dependency deployment.

## Run locally

1. Copy `.env.example` to `.env` and add your OpenAI API key. The PayPal Sandbox client ID has already been configured for this hackathon build.
2. Run `npm start`.
3. Open `http://localhost:3000`.

Example (PowerShell):

```powershell
npm start
```

## Demo path (under 3 minutes)

1. State the problem: buyers face choice overload; agentic buying must remain transparent and buyer-controlled.
2. Enter: “I need to thank a remote teammate today, under $30.”
3. Show the AI-generated recommendation, rationale, and clear price.
4. Click PayPal and complete a Sandbox payment.
5. End on the principle: **AI guides; people approve; PayPal completes payment.**

## Responsible AI

PayPath does not use payment credentials, make payment decisions, or purchase autonomously. The AI recommends a checkout and explains why; the buyer explicitly chooses to complete the payment with PayPal.

