# FinTrack 🚀

FinTrack is a premium full-stack personal finance tracker refactored into a modern **Object-Oriented Programming (OOP)** architecture using **TypeScript**. It features a clean, layered structure (Controller-Service-Repository) for maximum scalability and maintainability.

## ✨ Features

- **Auth**: Secure JWT authentication with protected routes and class-based AuthService.
- **Transactions**: CRUD operations for income/expenses with filtering and CSV export.
- **Budgets**: Monthly budget management with category-specific logic and over-spending alerts.
- **Analytics**: Dynamic dashboards using Recharts, showing balances, savings rates, and category insights.
- **Clean Architecture**: Strictly separated layers to decouple business logic from database and transport protocols.
- **Premium UI**: Modern, responsive interface built with Framer Motion and custom CSS (Glassmorphism aesthetics).

## 🛠 Tech Stack

- **Frontend**: React (TSX), React Router, Axios, Recharts, Framer Motion, TypeScript.
- **Backend**: Node.js, Express, Mongoose, JWT, TypeScript.
- **Database**: MongoDB.
- **Deployment**: Render (powered by Render Blueprints).

## 📂 Architecture & Folder Structure

We follow a **Controller-Service-Repository** pattern to ensure Single Responsibility and high testability.

```text
FinTrack/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers (Class-based)
│   │   ├── services/         # Business logic (Class-based)
│   │   ├── repositories/     # Database abstractions (NEW)
│   │   ├── models/           # Mongoose TS schemas
│   │   ├── routes/           # Express route definitions
│   │   ├── middleware/       # Auth & Error handling
│   │   ├── app.ts            # App configuration
│   │   └── server.ts         # Entry point
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── models/           # Data models (Transaction/Budget classes)
│   │   ├── services/         # API Service layer (Class-based)
│   │   ├── providers/        # Auth context (Typed)
│   │   ├── components/       # Functional UI components
│   │   └── pages/            # View logic
│   └── tsconfig.json
└── render.yaml               # Deployment blueprint
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- npm or yarn

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env with MONGODB_URI and JWT_SECRET
npm run build   # Compiles TS to JS
npm run dev     # Starts with ts-node for development
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start       # Starts React development server
```

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Authenticate and get token |
| `GET` | `/api/users/dashboard` | Get financial summary & insights |
| `GET` | `/api/transactions` | List/Filter transactions |
| `POST` | `/api/transactions` | Create a new transaction |
| `GET` | `/api/budgets/summary` | Get monthly budget progress |

## 📦 Deployment
This project is configured for **Render**. Pushing to the `main` branch triggers the `render.yaml` blueprint, which automatically:
1. Builds the TypeScript backend.
2. Builds the React production bundle.
3. Deploys services to a global CDN/Web service.

---
*Maintained with ❤️ using Antigravity AI.*
