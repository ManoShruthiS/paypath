import { generateAgentPlan } from '../lib/agent.mjs';

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

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const intent = body.intent?.trim();
  const budgetLimit = body.budgetLimit;

  if (!intent || intent.length < 5) {
    return res.status(400).json({ error: 'Please enter a goal or procurement requirement for the agent.' });
  }

  try {
    const plan = await generateAgentPlan(
      intent,
      budgetLimit,
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_MODEL || 'gpt-4.1-mini'
    );
    return res.status(200).json(plan);
  } catch (error) {
    console.error('Plan API Error:', error);
    return res.status(500).json({ error: 'Agent execution failed', detail: error.message });
  }
}
