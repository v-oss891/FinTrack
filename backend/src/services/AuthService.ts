import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository';
import env from '../config/env';
import AppError from '../utils/AppError';
import { validateEmail } from '../utils/validators';

/**
 * Service for handling authentication logic.
 */
class AuthService {
  private userRepository;

  constructor(userRepo: any) {
    this.userRepository = userRepo;
  }

  signToken(id: string) {
    return jwt.sign({ id }, env.jwtSecret as string, {
      expiresIn: env.jwtExpiresIn,
    });
  }

  sanitizeUser(user: any) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async register(userData: any) {
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

  async login(email: string, password: string) {
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

export default new AuthService(userRepository);
