# AI Interview Coach 🎙️

A real-time AI-powered interview practice tool that simulates professional interviews in both voice and text modes. Built using OpenAI Realtime API, Node.js, and WebRTC.

## 🚀 Features

* 🎤 **Voice Interview Mode (Real-time)**  
  Human-like AI interviewer using OpenAI Realtime (STT + reasoning + TTS).
* 💬 **Text Interview Mode**  
  Structured Q&A interviews powered by GPT-4o-mini with context memory.
* 📚 **Study FAQ Generator**  
  Role-specific FAQs generated in clean JSON and rendered dynamically.
* 🖥️ **Modern UI**  
  Dark-mode interface, audio visualizer, timers, and smooth controls.
* 🔒 **Secure Backend**  
  Uses ephemeral OpenAI realtime keys — API keys never reach the browser.
* ☁️ **Fully Deployed** on Render with CI/CD from GitHub.

## 🏗️ Tech Stack

**Frontend:**
* HTML, CSS, JavaScript
* WebRTC (Realtime audio)
* Canvas API (Audio visualizer)

**Backend:**
* Node.js + Express
* OpenAI Realtime API & GPT-4o-mini
* CORS, dotenv, fetch

**Deployment:**
* GitHub (source control)
* Render (hosting + auto deploy)

## 🔧 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/interview-coach.git
cd interview-coach/server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your OpenAI API key
Create `.env` inside `server/`:
```env
OPENAI_API_KEY=your_key_here
```

### 4. Run the development server
```bash
npm start
```

### 5. Open the app
Visit:
```
http://localhost:8787
```

## 📁 Project Structure

```
interview-coach/
│
├── server/
│   ├── server.js        # Backend API and session handler
│   ├── package.json
│   └── public/
│        └── index.html  # Frontend UI + JS
│
└── README.md
```

## 🎯 Core Functionality

* `/session` → Creates ephemeral realtime session
* `/chat` → Text-mode interview messages
* `/faq` → Generates role-based FAQ list
* WebRTC handles live voice streaming

## 📸 Screenshots

will add screenshots here


## 👤 Developer

**Punith Borehalli Somashekaraiah**

* 🔗 [Website](https://yourwebsite.com)
* 💼 [LinkedIn](https://linkedin.com/in/yourprofile)
* 🛠️ [GitHub](https://github.com/yourusername)
