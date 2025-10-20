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

// serve the UI
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /session
 * Body: { company, role, experience, type, difficulty, durationMinutes }
 * Returns: { ephemeral_key }
 */
app.post('/session', async (req, res) => {
  try {
    const {
      company = 'Generic',
      role = 'Software Engineer',
      experience = 'Mid-level',
      type = 'Technical',
      difficulty = 'Medium',
      durationMinutes = 5
    } = req.body || {};

    // Build instructions for a *real* interview (no per-answer feedback)
    const instructions = `
You are acting as a professional interviewer for ${company}.
Conduct a realistic ${type.toLowerCase()} interview for the role: ${role}.
The candidate's experience level is ${experience}.
Use a ${difficulty.toLowerCase()} difficulty across your questions.

Rules:
- Ask one question at a time.
- Do NOT give feedback after each answer.
- Keep a natural flow and cover key competencies for this role.
- After approximately ${durationMinutes} minutes OR when you decide the interview feels complete,
  say exactly: "The interview is complete. Would you like to hear your feedback?"
- If the user says "yes", then provide a single, structured feedback summary:
  * Strengths
  * Areas to improve
  * 2–3 concrete tips
- Keep spoken responses concise and professional.
`;

    // Create realtime session client secret (ephemeral key)
    const body = {
      model: 'gpt-realtime', // or 'gpt-realtime-mini' if you prefer cheaper
      voice: 'verse',
      instructions
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

// Fallback SPA route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
 express();
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
