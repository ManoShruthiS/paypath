import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

// Load simple local development variables without adding a package dependency.
// Hosting platforms provide these values directly and safely ignore this file.
try {
  const envFile = await readFile(join(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
} catch { /* .env is optional */ }

const port = process.env.PORT || 3000;
const publicDir = join(process.cwd(), 'public');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(Buffer.isBuffer(body) || typeof body === 'string' ? body : JSON.stringify(body));
}

function fallbackPlan(intent) {
  const lower = intent.toLowerCase();
  const amount = /\$(\d+(?:\.\d{1,2})?)/.exec(intent)?.[1] || (lower.includes('gift') ? '25.00' : '49.00');
  const product = lower.includes('gift') ? 'PayPath Gift Credit' : lower.includes('subscription') ? 'PayPath Pro — first month' : 'PayPath Smart Checkout';
  return {
    title: product,
    price: amount,
    reason: `I turned “${intent.slice(0, 92)}${intent.length > 92 ? '…' : ''}” into one clear, low-friction checkout.`,
    steps: ['Confirm the purchase details', 'Pay securely with PayPal', 'Receive an instant receipt and next-step summary'],
    impact: 'The agent removes choice overload while keeping the buyer in control of the final payment.'
  };
}

async function aiPlan(intent) {
  if (!process.env.OPENAI_API_KEY) return { ...fallbackPlan(intent), mode: 'demo' };
  const prompt = `You are PayPath, an ethical AI commerce concierge. Convert the buyer intent into ONE simple, realistic digital-product checkout. Return ONLY JSON with title (max 45 chars), price (numeric string 5-150), reason (max 150 chars), steps (array of exactly 3 short strings), impact (max 130 chars). Never claim you completed payment. Intent: ${intent}`;
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: prompt, temperature: 0.55 })
    });
    if (!response.ok) throw new Error(`AI request failed (${response.status})`);
    const payload = await response.json();
    const text = payload.output_text || '{}';
    return { ...JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')), mode: 'live' };
  } catch (error) {
    // Some locked-down local environments deny outbound network access. The deployed app still uses live AI.
    return { ...fallbackPlan(intent), mode: 'local-preview', localMessage: 'Local preview is offline; your deployed app will use the live AI connection.' };
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/api/config') {
    // A PayPal client ID is intentionally public: the JavaScript SDK needs it in the buyer's browser.
    // Deployment settings can override this Sandbox fallback with PAYPAL_CLIENT_ID.
    return send(res, 200, { paypalClientId: process.env.PAYPAL_CLIENT_ID || 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7', aiEnabled: Boolean(process.env.OPENAI_API_KEY) });
  }
  if (req.method === 'POST' && url.pathname === '/api/plan') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const { intent } = JSON.parse(body);
      if (!intent || intent.length < 8) return send(res, 400, { error: 'Tell the concierge a little more about what you need.' });
      return send(res, 200, await aiPlan(intent));
    } catch (error) {
      return send(res, 500, { error: 'The concierge hit a snag. Please try again.', detail: error.message });
    }
  }
  const requested = url.pathname === '/' ? 'index.html' : normalize(url.pathname).replace(/^([/\\])+/, '');
  const file = join(publicDir, requested);
  if (!file.startsWith(publicDir)) return send(res, 403, 'Forbidden', 'text/plain');
  try { return send(res, 200, await readFile(file), mime[extname(file)] || 'application/octet-stream'); }
  catch { return send(res, 404, 'Not found', 'text/plain'); }
});
server.listen(port, () => console.log(`PayPath is live at http://localhost:${port}`));

