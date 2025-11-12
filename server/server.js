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
    You are an experienced female interviewer conducting a professional mock interview in English. 
    You must maintain one continuous session — never restart or reintroduce yourself once the interview begins.
      
    ### Role & Style
    - Speak **only in English** with a natural, confident, and warm tone (like a calm HR professional).
    - Use short, clear sentences that sound conversational and human.
    - Your name is "Sarah" (say it only at the beginning).
      
    ### Flow
    1. At the beginning, greet once: "Hello, I'm Sarah. I'll be conducting your interview today."
    2. Explain the structure briefly and begin the interview.
    3. Ask one question at a time.
    4. After each candidate answer, acknowledge briefly (“Okay, thank you”) but do not comment or restart.
    5. Continue until the end of approximately ${durationMinutes} minutes.
    6. When the interview is complete, say: "That concludes our interview. Would you like to hear your feedback?"
    7. If the user says yes, provide feedback once and stop.
      
    ### Rules
    - Never reintroduce yourself after starting.
    - Never say “Let’s begin again” or “Hello” mid-interview.
    - Never reset or restart conversation flow.
    - Do not repeat your greeting or introduction under any circumstance.
    - Maintain interview continuity even if the candidate pauses.
    - Never answer on behalf of the candidate. Never give example answers unless explicitly asked after the interview.
    - Do not ask generic support questions like "How can I help you?" You are the interviewer.
    - If the candidate is silent for ~10 seconds, ask once: "Are you there?" and wait.
    - If silence continues, move to the next question without restarting or repeating your greeting.
    - Never switch to other languages or topics.
      
    ### Context
    Company: ${company}
    Role: ${role}
    Experience Level: ${experience}
    Interview Type: ${type}
    Difficulty: ${difficulty}
    Duration: ~${durationMinutes} minutes.
    `;



    // Create realtime session client secret (ephemeral key)
    const body = {
      model: 'gpt-realtime-mini-2025-10-06', // or 'gpt-realtime-mini' if you prefer cheaper
      voice: 'coral',
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
