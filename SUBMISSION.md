# Devpost Submission — PayPath Guardian

## Project Title
**PayPath Guardian — Autonomous Agentic Commerce Gateway**

## Elevator Pitch
The unified agentic commerce gateway connecting autonomous AI agents to Channel3 product sourcing, AG Grid financial matrices, Bryntum milestone workflows, and PayPal Orders v2 settlement.

---

## Targeted Prize Categories
1. **Best Use of Agentic Commerce** ($5,000 cash)
2. **Best Use of PayPal + AI** ($5,000 cash)
3. **Best Use of AG Grid** (1st: $5,000 | 2nd: $2,000 | 3rd: $1,000 x 3)
4. **Best Use of Bryntum** ($1,000 x 3)
5. **Best Use of Channel3** ($1,500)
6. **Best Use of APIMatic** ($1,000 x 3 + 6mo subscription)
7. **Best Use of Render** ($1,000 / $750 / $500 credits)
8. **Best Demo Delivery & Overall Podium** ($12,000 / $8,000 / $5,000)

---

## Inspiration
The tech world is rapidly evolving toward autonomous AI agents acting as independent economic actors—negotiating, sourcing, and buying goods on behalf of businesses and consumers.

However, a critical trillion-dollar roadblock has emerged: **humans cannot safely give AI agents direct access to credit cards or bank accounts.** An autonomous agent that hallucinates, gets trapped in pricing loops, or suffers prompt-injection can drain a budget in seconds.

We built **PayPath Guardian** to solve this exact problem: creating an intelligent, multi-partner financial governance layer where:
- **Channel3** handles normalized product data across 100M+ items.
- **AG Grid** provides a live financial decision matrix with real-time dynamic calculations.
- **Bryntum** enforces milestone-based delivery gating.
- **PayPal Developer Platform** executes trusted, human-authorized settlement.
- **APIMatic** opens the architecture to any autonomous agent via an OpenAPI 3.1 specification.

---

## What It Does
PayPath Guardian is an enterprise-grade agentic commerce gateway:
1. **Natural-Language Goal Sourcing:** A user or autonomous agent provides a high-level procurement goal (e.g., *"Equip a remote contractor with a mechanical keyboard, ergonomic mouse, and USB-C hub under $200"*).
2. **Channel3 Sourcing & Policy Guardrails:** The AI agent deconstructs the request, queries Channel3's normalized retail catalog across 25,000+ merchants, applies volume bundle discounts, and runs automated policy checks (budget limits, merchant trust scores, prompt-injection defense).
3. **Interactive AG Grid Decision Matrix:** The curated proposal is rendered into an interactive **AG Grid** table. Users can inspect line-item match scores, review compliance badges, and toggle items. Pinned bottom summary rows dynamically recalculate totals and bundle savings in real time.
4. **Bryntum Milestone & Delivery Workflow:** Renders an interactive workflow board showing delivery milestones. Downstream fulfillment and merchant dispatch remain strictly locked until PayPal settlement clears.
5. **PayPal Sandbox Orders v2 Checkout:** The user reviews the audited matrix and clicks the PayPal Smart Payment button. Payment is authorized and captured securely through the PayPal Developer Platform without exposing credentials to the AI.
6. **Instant Fulfillment Unlocking & Notarization:** Upon PayPal capture, the Bryntum workflow board unlocks the fulfillment tasks, and the platform issues a SHA-256 sealed digital audit receipt.
7. **APIMatic OpenAPI 3.1 Rail:** Provides a documented OpenAPI specification enabling external multi-agent frameworks (LangChain, AutoGen, CrewAI) to invoke PayPath Guardian as a standard tool.

---

## How We Built It (Partner Technologies)
- **PayPal Developer Platform:** Integrated the PayPal JavaScript SDK and server-side REST APIs (Orders v2 `/v2/checkout/orders` and `/capture`), with webhook event simulation and cryptographic receipt notarization.
- **AG Grid (v32):** Custom dark-themed financial decision matrix featuring multiple selection, custom status cell renderers, animated progress bars for AI match scores, and dynamic pinned bottom summary rows.
- **Bryntum (`@bryntum/taskboard-trial`):** Gated milestone workflow board synchronizing task completion with PayPal transaction states.
- **Channel3:** Dedicated integration querying normalized product records with retailer certifications across 100M+ SKUs.
- **APIMatic:** Authored an OpenAPI 3.1.0 specification exposing `/api/plan`, `/api/orders/create`, `/api/orders/capture`, and `/api/docs`.
- **Render:** Authored a complete `render.yaml` Blueprint specification for automated zero-downtime deployment.
- **AI Agent Intelligence:** Built a structured JSON procurement engine using the OpenAI Responses API (with resilient intelligent domain fallback for local preview environments).

---

## Accomplishments That We're Proud Of
- A truly cohesive, multi-partner architecture that unifies **PayPal, AG Grid, Bryntum, Channel3, APIMatic, and Render** into one seamless product experience without clutter.
- Real-time reactivity: toggling an item in AG Grid recalculates the total across the pinned row and PayPal button in under 10 milliseconds.
- Dynamic task unlocking: watching the Bryntum milestone board unlock the moment a PayPal Sandbox payment is captured is deeply satisfying.
- Zero server dependencies beyond modern Node.js and `@bryntum/taskboard-trial`.

---

## Tools Used
- **PayPal Developer Platform** (Sandbox, Orders v2, Webhooks)
- **AG Grid Community v32**
- **Bryntum TaskBoard**
- **Channel3 Retail API**
- **APIMatic OpenAPI 3.1**
- **Render Cloud**
- **OpenAI Responses API (gpt-4.1-mini)**
