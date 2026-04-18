const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { validateEmail } = require('../utils/validators');

const signToken = (id) =>
  jwt.sign(
    { id },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    throw new AppError('Name must be at least 2 characters.', 400);
  }

  if (!validateEmail(email)) {
    throw new AppError('Email is invalid.', 400);
  }

  if (!password || password.length < 6) {
    throw new AppError('Password must be at least 6 characters.', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new AppError('Email is already registered.', 400);
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    user: sanitizeUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = signToken(user._id);

  res.json({
    status: 'success',
    token,
    user: sanitizeUser(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully on the client.',
  });
});

module.exports = {
  register,
  login,
  logout,
};
