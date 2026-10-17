# PayPath — AI checkout concierge

## One-line pitch

PayPath turns a buyer’s plain-English need into a transparent, personalized checkout that the buyer explicitly approves and completes with PayPal.

## Inspiration

Online buying is full of choice overload. AI can make discovery and decision-making radically simpler, but only if it remains explainable and never takes spending decisions away from people. We wanted to explore a better version of agentic commerce: one where AI guides the buyer, the buyer stays in charge, and PayPal makes the final step familiar and trusted.

## What it does

A buyer describes a goal in everyday language — for example, “I need to thank a remote teammate today, under $30.” PayPath uses AI to turn that request into one clear checkout recommendation with an upfront price, a short explanation, and an easy-to-scan path. When the buyer is happy, they complete the purchase using PayPal Sandbox.

The agent never accesses a buyer’s payment credentials, never executes a payment by itself, and always makes the buyer’s approval the final action.

## How we built it

PayPath uses the OpenAI Responses API to turn unstructured intent into a structured commerce recommendation. A lightweight Node.js server exposes the concierge endpoint and keeps keys on the server. The PayPal JavaScript SDK creates and captures an actual Sandbox order in the browser. The interface was designed to make AI reasoning, pricing, and buyer control visible instead of burying them in a chat transcript.

## Challenges we ran into

The key product challenge was restraint. It is easy to build an agent that sounds decisive; it is harder to build one that helps without pretending to have authority over someone’s money. We designed every step around clear recommendations, disclosed pricing, and explicit user confirmation.

## Accomplishments that we’re proud of

- A complete intent-to-checkout flow rather than a static AI mockup.
- A real PayPal Sandbox payment path.
- An AI experience that explains its recommendation and respects buyer agency.
- A polished demo flow that can be understood in seconds.

## What we learned

Trust is a product feature in AI commerce. Useful recommendations need a visible rationale, and payments need a clear handoff from AI assistance to human approval.

## What’s next for PayPath

We would add product catalog integrations, seller-defined fulfilment options, multilingual support, and user-controlled preference memory. Longer term, PayPath could become a consent-based interface for AI-assisted recurring commerce — always with clear limits and buyer review.

## Demo video script (about 2 minutes)

**0:00–0:15 — The problem**  
“Shopping online gives us infinite choice, but when we have a simple need, that choice becomes friction. AI can help — but it should never decide how we spend.”

**0:15–0:30 — The idea**  
“This is PayPath, an AI checkout concierge. You describe what you need, it creates one transparent path to purchase, and you remain in control.”

**0:30–1:05 — Live concierge**  
Type: “I need to thank a remote teammate today, under $30.” Click **Build my checkout**.  
“The AI turns an ambiguous request into a simple recommendation, explains why it chose it, shows the exact price, and makes the next steps obvious.”

**1:05–1:35 — Trust principle**  
“Notice what PayPath does not do: it doesn’t have my payment details, and it doesn’t purchase on my behalf. The AI guides; the buyer approves.”

**1:35–1:55 — PayPal checkout**  
Click the PayPal button and complete a Sandbox payment.  
“Once the buyer chooses to proceed, PayPal handles the familiar, trusted payment flow.”

**1:55–2:10 — Close**  
“PayPath shows a future for agentic commerce that is not just faster, but more transparent. AI guides. People approve. PayPal completes.”

