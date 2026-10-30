const defaultSandboxId = 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7';

export default function handler(_req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || defaultSandboxId,
    aiEnabled: Boolean(process.env.OPENAI_API_KEY),
    hasServerSecret: Boolean(process.env.PAYPAL_CLIENT_SECRET),
    version: '2.4.0',
    sponsorTracks: ['ag-grid', 'apimatic', 'agentic-commerce']
  });
}
