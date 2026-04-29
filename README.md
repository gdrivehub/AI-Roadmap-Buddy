# 🧠 AI Learning Roadmap Generator

A full-stack AI-powered web application that generates personalized, step-by-step learning roadmaps from any goal — with progress tracking, resources, and timelines.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![Tech Stack](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=nodedotjs)
![Tech Stack](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/OpenRouter-AI-orange?style=flat-square)
![Deploy](https://img.shields.io/badge/Koyeb-Deploy-blueviolet?style=flat-square)

---

## ✨ Features

- 🤖 **AI-Powered Roadmaps** — Enter any learning goal; get a structured 5–8 phase roadmap
- 📋 **Step-by-Step Phases** — Beginner to advanced with tasks for each phase
- ⏱ **Timelines** — Realistic estimates for how long each roadmap takes
- 🔗 **Resources** — Real links to courses, docs, and tools
- ✅ **Progress Tracking** — Check off phases, see % completion
- 📊 **Dashboard** — View, open, and manage all your roadmaps

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI | OpenRouter API (GPT-4o Mini) |
| Deployment | Koyeb (backend) + Vercel (frontend) |

---

## 📁 Project Structure

```
ai-roadmap-generator/
├── client/                    # Next.js Frontend
│   ├── app/
│   │   ├── page.js            # Home page (goal input)
│   │   ├── dashboard/
│   │   │   └── page.js        # Roadmap list dashboard
│   │   ├── roadmap/
│   │   │   └── [id]/
│   │   │       └── page.js    # Individual roadmap view
│   │   ├── layout.js          # Root layout
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   └── api.js             # API utility functions
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Roadmap.js         # Roadmap + Step schemas
│   ├── routes/
│   │   └── roadmap.js         # All API routes
│   ├── middleware/
│   │   └── aiService.js       # OpenRouter AI integration
│   ├── index.js               # Express app entry
│   ├── Dockerfile             # Docker config for Koyeb
│   ├── koyeb.yaml             # Koyeb deployment config
│   └── package.json
│
├── .env.example               # Environment variables template
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-roadmap-generator.git
cd ai-roadmap-generator
```

### 2. Setup the Backend
```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

### 3. Setup the Frontend
```bash
cd client
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

### 4. Open in browser
- Frontend: http://localhost:3000
- Backend health: http://localhost:5000/health

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
OPENROUTER_API_KEY=sk-or-v1-...     # Get from openrouter.ai
MONGODB_URI=mongodb+srv://...        # MongoDB Atlas connection string
PORT=5000
CLIENT_URL=http://localhost:3000     # Frontend URL (for CORS)
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000   # Backend URL
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate-roadmap` | Generate a new roadmap with AI |
| `GET` | `/api/roadmap/:id` | Get a roadmap by ID |
| `GET` | `/api/roadmaps` | List all roadmaps |
| `PATCH` | `/api/update-step` | Update a step's status |
| `DELETE` | `/api/roadmap/:id` | Delete a roadmap |
| `GET` | `/health` | Health check |

### Generate Roadmap
```json
POST /api/generate-roadmap
{
  "goal": "Become a SOC Analyst"
}

Response:
{
  "success": true,
  "roadmapId": "64f...",
  "roadmap": { ... }
}
```

### Update Step
```json
PATCH /api/update-step
{
  "roadmapId": "64f...",
  "stepId": "64f...",
  "status": "completed"
}
```

---

## ☁️ Deployment

### Backend → Koyeb

1. Push code to GitHub
2. Go to [koyeb.com](https://koyeb.com) → Create Service → GitHub
3. Select your repo, set:
   - **Build command**: `cd server && npm ci`
   - **Run command**: `cd server && npm start`
   - **Port**: `5000`
4. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `MONGODB_URI`
   - `PORT=5000`
   - `CLIENT_URL=https://your-frontend.vercel.app`
5. Deploy!

Alternatively, use the included `koyeb.yaml`:
```bash
koyeb app init ai-roadmap --git github.com/YOUR_USERNAME/ai-roadmap-generator
```

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory**: `client`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-koyeb-backend.koyeb.app`
4. Deploy!

---

## 🐳 Docker (Backend)

```bash
cd server
docker build -t ai-roadmap-api .
docker run -p 5000:5000 \
  -e OPENROUTER_API_KEY=your_key \
  -e MONGODB_URI=your_uri \
  ai-roadmap-api
```

---

## 📝 License

MIT — free to use, modify, and deploy.
