const sandboxClientId = 'ELV84JC1c6kH6S8_ZE2TZzL0Nci9fK2uMre15Ze6updxfGBxRwn7q7zfSDNvVdmcTvoviqdPXvvlYPl7';

export default function handler(_req, res) {
  res.status(200).json({
    paypalClientId: process.env.PAYPAL_CLIENT_ID || sandboxClientId,
    aiEnabled: Boolean(process.env.OPENAI_API_KEY),
  });
}

