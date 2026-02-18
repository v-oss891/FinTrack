# FinTrack – Personal Finance & Investment Analytics System

## Overview
FinTrack is a full-stack financial management and analytics system designed to help users track income, expenses, budgets, and investments. The system applies mathematical and statistical formulas to provide insights into financial behavior.

## Features
- User Authentication
- Income & Expense Tracking
- Budget Monitoring
- Investment Tracking
- ROI & CAGR Calculation
- Financial Analytics (Mean, Standard Deviation, Savings Rate)

## Architecture
The backend follows a clean layered architecture:

Controller → Service → Repository → Database

The system follows:
- MVC Pattern
- Repository Pattern
- OOP Principles (Encapsulation, Abstraction)

## Tech Stack
- Backend: Node.js + Express
- Database: PostgreSQL
- Frontend: React
- Environment: VS Code

## Project Structure
FinTrack/
│
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
├── ErDiagram.md
│
└── backend/
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── models/
    ├── routes/
    ├── config/
    ├── utils/
    └── server.js
