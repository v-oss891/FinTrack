const authService = require('../services/AuthService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Controller for handling authentication requests.
 * Responsibilities: Request validation and orchestrating service calls for auth.
 */
class AuthController {
  /**
   * @param {AuthService} authService - The auth service instance.
   */
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Handle user registration.
   */
  register = asyncHandler(async (req, res) => {
    const result = await this.authService.register(req.body);

    res.status(201).json({
      status: 'success',
      ...result,
    });
  });

  /**
   * Handle user login.
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);

    res.json({
      status: 'success',
      ...result,
    });
  });

  /**
   * Handle user logout (stateless JWT logout).
   */
  logout = asyncHandler(async (req, res) => {
    res.json({
      status: 'success',
      message: 'Logged out successfully on the client.',
    });
  });
}

module.exports = new AuthController(authService);
