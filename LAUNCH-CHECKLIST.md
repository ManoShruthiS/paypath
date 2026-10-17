# PayPath launch checklist — October 18

## Before recording

- Create a PayPal **Sandbox** app at [developer.paypal.com](https://developer.paypal.com/) and copy its client ID.
- Set `PAYPAL_CLIENT_ID` in your local environment or deployment host.
- Create a file named `.env` beside `server.mjs`, then add `OPENAI_API_KEY=your_key` for the live concierge. Without it, the app intentionally uses its built-in demo mode. `.env` is excluded from GitHub.
- Run `npm start` and open `http://localhost:3000`.
- Use a PayPal Sandbox buyer account for the payment demo.
- Test the exact demo prompt once: “I need to thank a remote teammate today, under $30.”

## For Devpost

- Upload the public repository with a visible open-source license.
- Deploy the app and add its live URL, or include clear local setup instructions.
- Paste `SUBMISSION.md` into the project description sections.
- Record a public YouTube video under 3 minutes using the supplied script.
- Explicitly name **PayPal JavaScript SDK** and **OpenAI Responses API** in the tools section.
- Make sure the video shows the app working end-to-end, including PayPal Sandbox checkout.

## Strong final polish

- Replace the default browser tab title with your deployed URL before recording.
- Keep the demo to one buyer scenario; a single crisp story beats a feature tour.
- Say the responsible-AI principle out loud: “AI guides; people approve; PayPal completes.”

