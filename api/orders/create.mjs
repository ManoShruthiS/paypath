import { createPayPalOrder } from '../../lib/paypal.mjs';

const defaultSandboxId = 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const clientId = process.env.PAYPAL_CLIENT_ID || defaultSandboxId;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    const result = await createPayPalOrder(body, clientId, clientSecret);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
