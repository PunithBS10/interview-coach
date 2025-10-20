import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// Create ephemeral session key
app.post('/session', async (req, res) => {
  try {
    const body = {
      model: 'gpt-realtime-mini', // or 'gpt-realtime'
      voice: 'verse',
      instructions:
        "You are a friendly real-time interview coach. Ask one interview question at a time, " +
        "listen completely, then provide short, constructive feedback (under 20 seconds)."
    };

    const resp = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Error from OpenAI:', text);
      return res.status(resp.status).json({ error: text });
    }

    const json = await resp.json();
    const ek = json?.client_secret?.value;
    if (!ek) return res.status(500).json({ error: 'No ephemeral key in response.' });
    res.json({ ephemeral_key: ek });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// Fallback to index.html for any route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
