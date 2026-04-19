require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8000;

// Debug logs (IMPORTANT)
console.log("Starting server...");
console.log("PORT:", PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Missing");

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());

// Connect DB FIRST
connectDB();

// Log when connected
mongoose.connection.once('open', () => {
  console.log('MongoDB connected ✅');
});

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});