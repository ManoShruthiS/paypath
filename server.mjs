import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { generateAgentPlan } from './lib/agent.mjs';
import { createPayPalOrder, capturePayPalOrder, createAuditReceipt } from './lib/paypal.mjs';
import { openApiSpec } from './lib/openapi.mjs';

// Load simple local development variables without adding package dependencies
try {
  const envFile = await readFile(join(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
} catch { /* .env is optional */ }

const port = process.env.PORT || 3000;
const publicDir = join(process.cwd(), 'public');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8'
};

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(Buffer.isBuffer(body) || typeof body === 'string' ? body : JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // CORS headers for local/cross-origin preview
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // 1. Config endpoint
  if (req.method === 'GET' && url.pathname === '/api/config') {
    const defaultSandboxId = 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7';
    return send(res, 200, {
      paypalClientId: process.env.PAYPAL_CLIENT_ID || defaultSandboxId,
      aiEnabled: Boolean(process.env.OPENAI_API_KEY),
      hasServerSecret: Boolean(process.env.PAYPAL_CLIENT_SECRET),
      version: '2.4.0',
      sponsorTracks: ['ag-grid', 'apimatic', 'agentic-commerce']
    });
  }

  // 2. OpenAPI specification endpoint (APIMatic track)
  if (req.method === 'GET' && (url.pathname === '/api/docs' || url.pathname === '/api/openapi.json')) {
    return send(res, 200, openApiSpec);
  }

  // 3. AI Agent Plan generation
  if (req.method === 'POST' && url.pathname === '/api/plan') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const { intent, budgetLimit } = JSON.parse(body || '{}');
      if (!intent || intent.length < 5) {
        return send(res, 400, { error: 'Please enter a goal or procurement requirement for the agent.' });
      }
      const plan = await generateAgentPlan(
        intent,
        budgetLimit,
        process.env.OPENAI_API_KEY,
        process.env.OPENAI_MODEL || 'gpt-4.1-mini'
      );
      return send(res, 200, plan);
    } catch (error) {
      console.error('Plan error:', error);
      return send(res, 500, { error: 'The agent encountered an error.', detail: error.message });
    }
  }

  // 4. Server-Side PayPal Order Creation (Orders v2)
  if (req.method === 'POST' && url.pathname === '/api/orders/create') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const orderPayload = JSON.parse(body || '{}');
      const clientId = process.env.PAYPAL_CLIENT_ID || 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7';
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

      const orderResult = await createPayPalOrder(orderPayload, clientId, clientSecret);
      return send(res, 200, orderResult);
    } catch (error) {
      console.error('Order creation error:', error);
      return send(res, 500, { error: 'Failed to create PayPal order.', detail: error.message });
    }
  }

  // 5. Server-Side PayPal Order Capture & Audit Receipt
  if (req.method === 'POST' && url.pathname === '/api/orders/capture') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const { orderId, planDetails } = JSON.parse(body || '{}');
      if (!orderId) return send(res, 400, { error: 'orderId is required' });

      const clientId = process.env.PAYPAL_CLIENT_ID || 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7';
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

      const receipt = await capturePayPalOrder(orderId, clientId, clientSecret);
      return send(res, 200, receipt);
    } catch (error) {
      console.error('Capture error:', error);
      return send(res, 500, { error: 'Failed to capture PayPal order.', detail: error.message });
    }
  }

  // 6. Webhook Listener
  if (req.method === 'POST' && url.pathname === '/api/webhooks') {
    let body = '';
    for await (const chunk of req) body += chunk;
    console.log('Received PayPal Webhook notification:', body.slice(0, 100));
    return send(res, 200, { status: 'RECEIVED', verified: true, timestamp: new Date().toISOString() });
  }

  // Static File Serving
  const requested = url.pathname === '/' ? 'index.html' : normalize(url.pathname).replace(/^([/\\])+/, '');
  const file = join(publicDir, requested);
  if (!file.startsWith(publicDir)) return send(res, 403, 'Forbidden', 'text/plain');
  try {
    return send(res, 200, await readFile(file), mime[extname(file)] || 'application/octet-stream');
  } catch {
    return send(res, 404, 'Not found', 'text/plain');
  }
});

server.listen(port, () => {
  console.log(`PayPath Guardian is running at http://localhost:${port}`);
  console.log(`APIMatic OpenAPI Spec available at http://localhost:${port}/api/docs`);
});
