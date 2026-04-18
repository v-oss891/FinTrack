# FinTrack

FinTrack is a full-stack personal finance tracker built with React, Node.js, Express, MongoDB, and JWT authentication. It includes protected auth flows, transaction CRUD, monthly budgets with alerts, analytics dashboards, CSV export, and basic AI-style spending insights.

## Tech Stack

- Frontend: React, React Router, Axios, Recharts, Framer Motion
- Backend: Node.js, Express, Mongoose, JWT
- Database: MongoDB

## Folder Structure

```text
FinTrack/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── constants/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── providers/
│       ├── api.js
│       ├── constants.js
│       ├── styles.css
│       └── utils.js
└── README.md
```

## Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `GET /api/users/dashboard?month=YYYY-MM`
- `GET /api/users/analytics?year=YYYY`
- `GET /api/users/insights?month=YYYY-MM`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/export/csv`
- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`
- `GET /api/budgets/summary?month=YYYY-MM`

## Database Models

### User
- `name`
- `email`
- `password`

### Transaction
- `user`
- `title`
- `amount`
- `type`
- `category`
- `paymentMethod`
- `notes`
- `date`

### Budget
- `user`
- `month`
- `category`
- `amount`
- `alertThreshold`

## Setup

### 1. Backend

```bash
cd /Users/vanshjain/Documents/SESD/FinTrack/backend
cp .env.example .env
npm install
npm run dev
```

Set `MONGODB_URI` in `.env` to either:

- `mongodb://127.0.0.1:27017/fintrack`
- or your MongoDB Atlas connection string

### 2. Frontend

```bash
cd /Users/vanshjain/Documents/SESD/FinTrack/frontend
cp .env.example .env
npm install
npm start
```

## Run Locally

1. Start MongoDB locally or use MongoDB Atlas.
2. Start the backend on `http://localhost:8000`.
3. Start the frontend on `http://localhost:3000`.
4. Register a new account and begin adding transactions and budgets.

## Features

- JWT authentication with protected routes
- Dashboard with total balance, monthly income, monthly expenses, savings, recent activity, and alerts
- Transaction add, edit, delete, filter, and CSV export
- Monthly budgets with threshold warnings and over-budget alerts
- Analytics charts for monthly performance and category-wise spending
- Basic AI-style insight generation from spending behavior

## Notes

- The old mixed Postgres/in-memory implementation has been replaced with a MongoDB-based architecture.
- Environment variables are required before starting the backend.
