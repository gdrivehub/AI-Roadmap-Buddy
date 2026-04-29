# 🧠 AI Learning Roadmap Generator

> Generate personalized, step-by-step learning roadmaps for any skill — powered by AI, tracked per device.

**Live Demo:** [ai-roadmap-buddy.vercel.app](https://ai-roadmap-buddy.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)
![OpenRouter](https://img.shields.io/badge/OpenRouter-GPT--4o--mini-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![Koyeb](https://img.shields.io/badge/Backend-Koyeb-blueviolet?style=flat-square)

---

## ✨ What It Does

Enter any learning goal and get a complete, structured roadmap in seconds:

- 🗺 **Step-by-step phases** — Beginner to advanced, broken into clear milestones
- ⏱ **Realistic timelines** — Estimated weeks/months per phase and overall
- 🔗 **Curated resources** — Real links to courses, docs, and tools
- ✅ **Progress tracking** — Check off phases, see your completion percentage
- 📊 **Personal dashboard** — Every device sees only its own roadmaps
- 🔒 **No login required** — Device fingerprint keeps your data private

---

## 🖼 Screenshots

| Home | Roadmap | Dashboard |
|------|---------|-----------|
| Enter your goal | AI-generated phases + resources | Track all your roadmaps |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas + Mongoose |
| AI | OpenRouter API → `openai/gpt-4o-mini` |
| Device Identity | `localStorage` UUID (no login needed) |
| Frontend Deploy | Vercel |
| Backend Deploy | Koyeb |

---

## 📁 Project Structure

```
AI-Roadmap-Buddy/
│
├── client/                          # Next.js Frontend (deployed on Vercel)
│   ├── app/
│   │   ├── page.js                  # Home page — goal input
│   │   ├── layout.js                # Root layout + fonts
│   │   ├── globals.css              # Global styles + dark theme
│   │   ├── dashboard/
│   │   │   └── page.js              # Dashboard — list all roadmaps
│   │   └── roadmap/
│   │       └── [id]/
│   │           └── page.js          # Roadmap detail + step tracker
│   ├── lib/
│   │   ├── api.js                   # All API calls (auto-injects deviceId)
│   │   └── deviceId.js              # Device fingerprint via localStorage
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                          # Node.js Backend (deployed on Koyeb)
│   ├── index.js                     # Express app entry point
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Roadmap.js               # Roadmap + Step schemas
│   ├── routes/
│   │   └── roadmap.js               # All API route handlers
│   ├── middleware/
│   │   └── aiService.js             # OpenRouter AI integration
│   ├── Dockerfile                   # Docker config for Koyeb
│   └── package.json
│
├── package.json                     # Root package.json (Koyeb detection)
├── package-lock.json                # Lockfile (required by Koyeb)
├── Procfile                         # Koyeb start command
├── .env.example                     # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account → [mongodb.com/atlas](https://mongodb.com/atlas) (free tier works)
- OpenRouter API key → [openrouter.ai](https://openrouter.ai) (free credits available)

### 1. Clone the repo
```bash
git clone https://github.com/gdrivehub/AI-Roadmap-Buddy.git
cd AI-Roadmap-Buddy
```

### 2. Setup backend
```bash
cd server
cp .env.example .env
# Fill in your values (see Environment Variables section below)
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup frontend
```bash
cd client
# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm install
npm run dev
# App runs on http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend — `server/.env`

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxx   # From openrouter.ai
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-roadmap
PORT=5000
CLIENT_URL=http://localhost:3000          # Your frontend URL (for CORS)
```

### Frontend — `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000  # Your backend URL
```

---

## 🌐 API Reference

Base URL: `https://great-meridith-manrisky73-695cc9d3.koyeb.app`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/generate-roadmap` | Generate roadmap with AI |
| `GET` | `/api/roadmap/:id` | Get a roadmap by ID |
| `GET` | `/api/roadmaps?userId=xxx` | List roadmaps for a device |
| `PATCH` | `/api/update-step` | Mark a step complete/pending |
| `DELETE` | `/api/roadmap/:id` | Delete a roadmap |

### Generate Roadmap
```json
POST /api/generate-roadmap
{
  "goal": "Become a SOC Analyst",
  "userId": "dev_m3k2x_ab7f9c2d"
}

// Response
{
  "success": true,
  "roadmapId": "664f3a...",
  "roadmap": {
    "goal": "Become a SOC Analyst",
    "timeline": "6-9 months",
    "steps": [...],
    "resources": [...]
  }
}
```

### Update Step
```json
PATCH /api/update-step
{
  "roadmapId": "664f3a...",
  "stepId": "664f3b...",
  "status": "completed"
}
```

---

## ☁️ Deployment

### Backend → Koyeb

1. Push code to GitHub (make sure `package.json`, `package-lock.json`, and `Procfile` are at the **root**)
2. Go to [koyeb.com](https://koyeb.com) → **Create Service** → **GitHub**
3. Select repo → configure:

| Setting | Value |
|---------|-------|
| Build command | `npm install` |
| Run command | `npm start` |
| Port | `5000` |

4. Add environment variables:

| Key | Value |
|-----|-------|
| `OPENROUTER_API_KEY` | your key |
| `MONGODB_URI` | your Atlas URI |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://ai-roadmap-buddy.vercel.app` |

5. Deploy — your backend URL will look like `https://xxx-yyy-zzz.koyeb.app`

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
2. Set **Root Directory** to `client`
3. Add environment variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://xxx-yyy-zzz.koyeb.app` ← your Koyeb URL |

4. Deploy → your app is live at `https://ai-roadmap-buddy.vercel.app`

> ⚠️ After updating any env var on Vercel, go to **Deployments → Redeploy** for changes to take effect.

---

## 🔒 Privacy — How Device Isolation Works

No login is required. Each browser generates a unique device ID on first visit:

```
dev_m3k2x_ab7f9c2d   ← stored in localStorage
```

- All roadmaps are tagged with this ID
- Dashboard only shows roadmaps from the current device
- Other users/devices never see your roadmaps
- **Note:** Clearing browser storage or switching browsers will generate a new ID and start fresh

---

## 🗄️ Database Schema

### Roadmap
```js
{
  userId: String,           // device fingerprint
  goal: String,             // user's learning goal
  timeline: String,         // e.g. "3-6 months"
  steps: [Step],            // phases of the roadmap
  resources: [Resource],    // links and tools
  completionPercentage: Number,  // auto-calculated
  createdAt: Date
}
```

### Step
```js
{
  title: String,
  description: String,
  tasks: [String],
  status: "pending" | "in-progress" | "completed",
  order: Number
}
```

---

## 🐳 Docker (Optional)

```bash
cd server
docker build -t ai-roadmap-api .
docker run -p 5000:5000 \
  -e OPENROUTER_API_KEY=your_key \
  -e MONGODB_URI=your_uri \
  -e PORT=5000 \
  -e CLIENT_URL=http://localhost:3000 \
  ai-roadmap-api
```

---

## 📝 License

MIT — free to use, modify, and deploy.

---

## 🙌 Built With

- [Next.js](https://nextjs.org)
- [Express](https://expressjs.com)
- [MongoDB Atlas](https://mongodb.com/atlas)
- [OpenRouter](https://openrouter.ai)
- [Tailwind CSS](https://tailwindcss.com)
- [Koyeb](https://koyeb.com)
- [Vercel](https://vercel.com)
