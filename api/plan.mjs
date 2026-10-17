function fallbackPlan(intent) {
  const lower = intent.toLowerCase();
  const price = /\$(\d+(?:\.\d{1,2})?)/.exec(intent)?.[1] || (lower.includes('gift') ? '25.00' : '49.00');
  const title = lower.includes('gift') ? 'PayPath Gift Credit' : lower.includes('subscription') ? 'PayPath Pro — first month' : 'PayPath Smart Checkout';
  return {
    title, price,
    reason: `I turned “${intent.slice(0, 92)}${intent.length > 92 ? '…' : ''}” into one clear, low-friction checkout.`,
    steps: ['Confirm the purchase details', 'Pay securely with PayPal', 'Receive an instant receipt and next-step summary'],
    impact: 'The agent removes choice overload while keeping the buyer in control of the final payment.',
    mode: 'demo',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const intent = body.intent?.trim();
  if (!intent || intent.length < 8) return res.status(400).json({ error: 'Tell the concierge a little more about what you need.' });
  if (!process.env.OPENAI_API_KEY) return res.status(200).json(fallbackPlan(intent));

  try {
    const prompt = `You are PayPath, an ethical AI commerce concierge. Convert the buyer intent into ONE simple, realistic digital-product checkout. Return ONLY JSON with title (max 45 chars), price (numeric string 5-150), reason (max 150 chars), steps (array of exactly 3 short strings), impact (max 130 chars). Never claim you completed payment. Intent: ${intent}`;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: prompt, temperature: 0.55 }),
    });
    if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
    const payload = await response.json();
    const text = (payload.output_text || '{}').replace(/^```json\s*|\s*```$/g, '');
    return res.status(200).json({ ...JSON.parse(text), mode: 'live' });
  } catch (error) {
    return res.status(502).json({ error: 'Live AI could not respond. Check the OpenAI deployment settings.', detail: error.message });
  }
}

