import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// ✅ Azure Translator credentials (keep these secure in production)
const AZURE_KEY = 'CddLLH4ANgaSoz6oGzL5TDUSs2gUkIPkraQcsJq2vrqzHNvelcmxJQQJ99BFACGhslBXJ3w3AAAbACOGuZfT';
const AZURE_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';
const AZURE_REGION = 'centralindia';

// 🔁 POST /api/translate - accepts array of Telugu strings
router.post('/translate', async (req, res) => {
  const { texts } = req.body;

  if (!texts || !Array.isArray(texts)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const response = await axios.post(
      `${AZURE_ENDPOINT}/translate?api-version=3.0&from=te&to=en`,
      texts.map((text) => ({ text })),
      {
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_KEY,
          'Ocp-Apim-Subscription-Region': AZURE_REGION,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4(),
        },
      }
    );

    const translations = response.data.map(
      (item) => item.translations[0].text
    );

    res.json({ translations });
  } catch (error) {
    console.error('Translation API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to translate' });
  }
});

export default router;
