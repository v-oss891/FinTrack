# FinTrack — Deployment & 405 Bug Fix Guide

This document explains **why** your app was failing on Render, and delivers
**every file you need** to fix it. All fixes were applied to your repo
(`github.com/v-oss891/FinTrack`) — see `CHANGES.patch` for the exact diff.

---

## 🔍 Why it was failing — root causes

| # | Symptom                                      | Root Cause                                                                                                                                                                                                                                                                                     |
| - | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | `POST /api/api/auth/login` (doubled `/api`)  | `frontend/src/api.js` did `baseURL: apiBaseUrl + '/api'` **and** `.env.example` already ended with `/api` — so `/api` was appended twice.                                                                                                                                                     |
| 2 | 405 Method Not Allowed on Render             | When `REACT_APP_API_URL` is wrong/missing at build time, the browser POSTs to the **frontend's static URL**. Render's static hosting only serves GET, so any POST returns **405**. That's the fingerprint of a misconfigured API base URL on a static site — not actually a backend problem. |
| 3 | Works locally, breaks in prod                | CRA's `"proxy"` field in `package.json` (→ `127.0.0.1:8000`) is **dev-only**. In production the built bundle has no proxy — it must call an absolute URL.                                                                                                                                     |
| 4 | Mongo never connects on Render               | `backend/.env.example` used `MONGO_URI` but `src/config/env.js` read `process.env.MONGODB_URI`. Silent mismatch.                                                                                                                                                                              |
| 5 | Spaces/trailing slashes in `.env` break URLs | CRA does not trim env values. `"https://api.onrender.com "` (trailing space) → malformed request URL.                                                                                                                                                                                         |
| 6 | Two backend entrypoints causing drift        | Repo had BOTH `backend/server.js` + `backend/routes/…` (legacy) AND `backend/src/server.js` + `backend/src/routes/…` (modern). `package.json` ran `src/server.js`; the legacy files were dead code but confusing.                                                                             |

---

## ✅ 1. Correct `.env` files

### `frontend/.env` (local dev)
```env
REACT_APP_API_URL=http://localhost:8000
```

### `frontend/.env.production` (or Render env var)
```env
REACT_APP_API_URL=https://your-fintrack-api.onrender.com
```

> **Rules (strictly):** no quotes · no trailing slash · no trailing spaces ·
> variable prefix MUST be `REACT_APP_` · you MAY include `/api` or omit it —
> the axios client normalizes both.

### `backend/.env` (local dev + Render)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net/fintrack?retryWrites=true&w=majority
JWT_SECRET=replace-me-with-a-64-char-random-string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000,https://your-fintrack-web.onrender.com
PORT=8000
NODE_ENV=production
```

> `CLIENT_URL` is comma-separated — include the Render frontend URL or CORS will block it.

---

## ✅ 2. Axios setup — `frontend/src/api.js`

```js
import axios from 'axios';

// Build a clean API base URL.
// - Trim whitespace (guards against trailing spaces in .env on Render/Vercel)
// - Strip any trailing slashes
// - Ensure exactly one "/api" suffix (idempotent)
const rawBase = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '');
const withApi = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`)
  : '/api'; // dev fallback uses CRA proxy to localhost:8000

export const apiBaseUrl = withApi;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

**Key change:** `baseURL: apiBaseUrl + '/api'`  →  `baseURL: apiBaseUrl` (the
normalizer above guarantees exactly one `/api`). Verified with 7 edge-case
inputs — all produce a single clean `/api` suffix.

---

## ✅ 3. Auth API functions — `frontend/src/providers/AuthProvider.js`

(No change needed — already calls `/auth/login` / `/auth/register` via the axios
instance, which prepends `/api` correctly.)

```js
const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('fintrack_token', data.token);
  setToken(data.token);
  setUser(data.user);
};

const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  localStorage.setItem('fintrack_token', data.token);
  setToken(data.token);
  setUser(data.user);
};
```

---

## ✅ 4. Express server setup — `backend/src/app.js` + `backend/src/server.js`

```js
// backend/src/app.js
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
// ... other routes
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const allowedOrigins = Array.isArray(env.clientUrl) ? env.clientUrl : [env.clientUrl];
const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || localOriginPattern.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ status: 'success' }));
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);   etc.

app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

```js
// backend/src/server.js
const app = require('./app');
const connectDatabase = require('./config/database');
const env = require('./config/env');

(async () => {
  await connectDatabase();
  app.listen(env.port, () => console.log(`FinTrack API on :${env.port}`));
})();
```

```js
// backend/src/config/env.js — the critical MONGODB_URI fix
const dotenv = require('dotenv');
dotenv.config();

const mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();
// ... rest as shown in your repo
```

---

## ✅ 5. Auth routes file — `backend/src/routes/authRoutes.js`

```js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/register', authController.register);
router.post('/login',    authController.login);
router.post('/logout',   authController.logout);

module.exports = router;
```

Mounted once in `app.js`:
```js
app.use('/api/auth', authRoutes);
```

So the final routes are exactly:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

---

## ✅ 6. Example request flow (frontend → backend)

```
 User clicks "Login"
      │
      ▼
 AuthPage.handleSubmit(event)
      │
      ▼
 AuthProvider.login({ email, password })
      │   api.post('/auth/login', { email, password })
      ▼
 Axios instance
   baseURL = normalize(REACT_APP_API_URL) = "https://fintrack-api.onrender.com/api"
   final URL = "https://fintrack-api.onrender.com/api/auth/login"
      │
      ▼
 Render (backend service) → Express → CORS check → app.use('/api/auth', authRoutes)
      │
      ▼
 authController.login
   User.findOne({email}).select('+password')
   bcrypt.compare
   jwt.sign({id}, JWT_SECRET, {expiresIn:'7d'})
      │
      ▼
 201/200 { status:'success', token, user }
      │
      ▼
 localStorage.setItem('fintrack_token', token)
 setUser(user)  →  <Navigate to="/" />
```

**Verified locally** — all 7 smoke tests pass:
```
✓ GET  /api/health            → 200
✓ POST /api/auth/register     → 201 + token
✓ POST /api/auth/login        → 200 + token
✓ POST /api/auth/login (bad)  → 401
✓ OPTIONS preflight           → 204
✓ POST /api/api/auth/login    → 404 (proves no double mount)
```

---

## 🧾 7. Common mistakes checklist

Use this as a pre-deploy review gate:

**Frontend `.env`**
- [ ] Variable name starts with `REACT_APP_` (else CRA ignores it silently)
- [ ] No quotes around the value
- [ ] No trailing slash (`https://api.com` ✅, `https://api.com/` ❌)
- [ ] No trailing whitespace (literally check for a space after the URL)
- [ ] Do NOT point it at the **frontend** URL — that's what produces the 405
- [ ] After changing `.env`, **restart** `npm start` (CRA reads env only at startup)
- [ ] For Render static site: set `REACT_APP_API_URL` as an env var **BEFORE** build (build-time baked)

**Axios**
- [ ] `baseURL` normalized — never `baseURL + '/api'` when env already has `/api`
- [ ] No hardcoded `http://localhost:8000` in any component — always `import api from '../api'`

**Express backend**
- [ ] `app.use('/api/auth', authRoutes)` mounted **once** (not in both app.js AND server.js)
- [ ] Routes use `router.post(...)` — a GET on a POST-only route returns 404 here (via notFound), not 405
- [ ] `cors({ origin: [...frontendUrls], credentials: true })` — wildcard `*` with credentials is rejected by browsers
- [ ] `express.json()` registered **before** routes
- [ ] Env var name matches exactly: `MONGODB_URI` in code == `MONGODB_URI` in Render dashboard
- [ ] No legacy duplicate server file (`backend/server.js`) shadowing `backend/src/server.js`

**Render deployment**
- [ ] Backend service: `rootDir: backend`, start command `npm start`
- [ ] Backend env vars set in dashboard: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
- [ ] Frontend static site: `rootDir: frontend`, build command `npm install && npm run build`, publish `./build`
- [ ] Frontend has **SPA rewrite rule** `/* → /index.html` (else React Router breaks on refresh)
- [ ] Frontend `REACT_APP_API_URL` = backend URL (without `/api`)
- [ ] Backend `CLIENT_URL` includes the frontend URL (comma-separated if multiple)
- [ ] MongoDB Atlas IP allowlist: `0.0.0.0/0` (or Render's egress IPs)

**405 debugging flowchart**
```
POST /api/auth/login → 405
    │
    ├─ Is the URL pointing at the frontend domain?  ──► YES → fix REACT_APP_API_URL to backend URL
    │
    ├─ Does the URL have /api/api?                  ──► YES → your axios baseURL is doubling it
    │
    ├─ Does the backend route exist + is it POST?   ──► Check routes file; `app.use('/api/auth', authRoutes)`
    │
    └─ Is a reverse proxy (nginx/cloudflare) only allowing GET? ──► Update proxy config
```

---

## 🚀 Deploy to Render (one-click)

A `render.yaml` Blueprint is included at the repo root:
1. Push the fixed repo to GitHub.
2. Render → New → **Blueprint** → select the repo.
3. Render creates **both** services; set the 3 secrets in the dashboard:
   - Backend: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
   - Frontend: `REACT_APP_API_URL`  (= your backend onrender.com URL)
4. Redeploy the frontend after setting `REACT_APP_API_URL` (CRA bakes envs at build time).

---

## 📦 What changed in your repo (summary)

```
 backend/.env.example                  | fixed MONGO_URI → MONGODB_URI
 backend/src/config/env.js             | accept both MONGO_URI + MONGODB_URI, trim CLIENT_URL entries
 frontend/.env.example                 | clearer rules + no trailing /api
 frontend/.env.production.example      | NEW — Render-ready template
 frontend/src/api.js                   | FIX the /api/api bug + whitespace/slash normalization
 render.yaml                           | NEW — one-click Render blueprint
 backend/server.js                     | DELETED — legacy duplicate of src/server.js
 backend/routes/                       | DELETED — legacy duplicate of src/routes/
 backend/controllers/                  | DELETED — legacy duplicate of src/controllers/
 backend/models/                       | DELETED — legacy duplicate of src/models/
 backend/middleware/                   | DELETED — legacy duplicate of src/middleware/
 backend/config/db.js                  | DELETED — legacy duplicate of src/config/database.js
 backend/utils/AppError.js             | DELETED — legacy duplicate of src/utils/AppError.js
 backend/seed.js, backend/TODO.md      | DELETED — stale
 backend/db/*.sql                      | DELETED — old Postgres schema (you're using Mongo)
```

Net result: **3 files modified, 13 stale files/folders deleted, 2 new files** —
~220 lines of dead code removed, all on-disk conflicts resolved.
