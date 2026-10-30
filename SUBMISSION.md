# Devpost Submission — PayPath Guardian

## Project Title
**PayPath Guardian — Autonomous Agentic Commerce Gateway**

## Elevator Pitch
The policy-governed payment gateway connecting autonomous AI agents to PayPal Sandbox checkout, real-time AG Grid decision matrices, and immutable audit receipts.

---

## Inspiration
The tech world is rapidly evolving toward autonomous AI agents that act as independent economic actors—negotiating, sourcing, and buying goods on behalf of businesses and consumers.

However, a critical trillion-dollar roadblock has emerged: **humans cannot safely give AI agents direct access to credit cards or bank accounts.** An autonomous agent that hallucinates, gets trapped in pricing loops, or suffers prompt-injection can drain a budget in seconds.

We built **PayPath Guardian** to solve this exact problem: creating an intelligent, policy-governed financial rail that empowers autonomous agents to discover and optimize complex purchases while keeping the human buyer firmly in control of the final payment via PayPal.

---

## What It Does
PayPath Guardian is an enterprise-grade agentic commerce gateway:
1. **Natural-Language Goal Sourcing:** A user or autonomous agent provides a high-level procurement goal (e.g., *"Equip a remote contractor with a mechanical keyboard, ergonomic mouse, and Copilot seat under $200"*).
2. **Autonomous Multi-Vendor Sourcing & Guardrails:** The AI agent deconstructs the request, queries certified merchant nodes, applies volume bundle discounts, and runs automated policy checks (budget limits, merchant trust scores, prompt-injection defense).
3. **Interactive AG Grid Decision Matrix:** The curated proposal is rendered into an interactive **AG Grid** table. Users can inspect line-item match scores, review compliance badges, and toggle items. Pinned bottom summary rows dynamically recalculate totals and bundle savings in real time.
4. **PayPal Sandbox Orders v2 Checkout:** The user reviews the audited matrix and clicks the PayPal Smart Payment button. Payment is authorized and captured securely through the PayPal Developer Platform without exposing credentials to the AI.
5. **Cryptographic Audit Receipt:** Upon capture, the platform generates a SHA-256 sealed digital receipt registering transaction details, payer identity, itemized breakdown, and fulfillment logs.
6. **APIMatic OpenAPI 3.1 Rail:** Provides a documented OpenAPI specification enabling external multi-agent frameworks (LangChain, AutoGen, CrewAI) to invoke PayPath Guardian as a standard tool.

---

## How We Built It
- **PayPal Developer Platform:** Integrated the PayPal JavaScript SDK and server-side REST APIs (Orders v2 `/v2/checkout/orders` and `/capture`), with webhook event simulation and cryptographic receipt notarization.
- **AG Grid Community v32:** Designed a custom dark-themed financial decision matrix featuring multiple selection, custom status cell renderers, animated progress bars for AI match scores, and dynamic pinned bottom summary rows.
- **AI Agent Intelligence:** Built a structured JSON procurement engine using the OpenAI Responses API (with resilient intelligent domain fallback for local preview environments).
- **APIMatic Ready:** Authored an OpenAPI 3.1.0 specification exposing `/api/plan`, `/api/orders/create`, and `/api/orders/capture` endpoints.
- **Runtime:** Lightweight, zero-dependency Node.js server with clean modular architecture (`lib/agent.mjs`, `lib/paypal.mjs`, `lib/openapi.mjs`) compatible with local development, Vercel Serverless Functions, and Render containers.

---

## Challenges We Ran Into
1. **Dynamic Financial Synchronization:** Ensuring that user interactions inside AG Grid (checking/unchecking items or modifying quantities) dynamically and instantaneously updated both the pinned summary row and the PayPal JavaScript SDK purchase unit amount without requiring a full page refresh.
2. **Responsible Agent Autonomy:** Striking the perfect balance between giving the AI agent freedom to find optimal multi-vendor deals and enforcing strict, deterministic safety guardrails that prevent budget overruns or unauthorized transactions.
3. **Cross-Environment Reliability:** Ensuring zero-configuration execution whether running locally in restricted sandbox environments, on Vercel serverless edge functions, or on standalone container hosts.

---

## Accomplishments That We're Proud Of
- Creating a complete, end-to-end working prototype that goes far beyond a generic chatbot by implementing an actual financial command center.
- Deep, purposeful integration of **AG Grid** as the core interactive decision and audit interface.
- Complete alignment with PayPal's strategic vision for Agentic Commerce: **"AI guides; humans approve; PayPal completes."**
- Zero external package dependencies on the server, ensuring maximum execution speed and zero security vulnerabilities.

---

## What We Learned
Trust is the single most important currency in agentic commerce. Giving an AI agent autonomous capabilities only works if the human is provided with full transparency: explainable recommendations, live financial recalculations, and familiar, battle-tested checkout rails like PayPal.

---

## What's Next for PayPath Guardian
- Multi-signature approval workflows for enterprise teams (e.g., procurement requiring manager approval for purchases exceeding $1,000).
- Live catalog webhooks syncing directly with Shopify and WooCommerce merchant inventories.
- Production SDK distribution on npm (`npm install paypath-guardian-sdk`).

---

## Tools & Sponsor Platforms Used
- **PayPal Developer Platform:** PayPal Sandbox, Orders v2 REST API, Webhooks.
- **AG Grid:** AG Grid Community v32 Interactive Decision Matrix & Pinned Financial Rows.
- **APIMatic:** OpenAPI 3.1.0 Specification & API Portal schema.
- **OpenAI:** Responses API (gpt-4.1-mini) for structured intent deconstruction.
