const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { validateEmail } = require('../utils/validators');

/**
 * Service for handling authentication logic.
 * Delegating DB operations to UserRepository.
 */
class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  signToken(id) {
    return jwt.sign({ id }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async register(userData) {
    const { name, email, password } = userData;

    if (!name || name.trim().length < 2) {
      throw new AppError('Name must be at least 2 characters.', 400);
    }

    if (!validateEmail(email)) {
      throw new AppError('Email is invalid.', 400);
    }

    if (!password || password.length < 6) {
      throw new AppError('Password must be at least 6 characters.', 400);
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already registered.', 400);
    }

    const user = await this.userRepository.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = this.signToken(user._id);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new AppError('Email and password are required.', 400);
    }

    const user = await this.userRepository.findByEmail(email, true);

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = this.signToken(user._id);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }
}

module.exports = new AuthService(userRepository);
