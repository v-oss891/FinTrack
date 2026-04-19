const analyticsService = require('../services/AnalyticsService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Controller for handling user-specific data requests.
 */
class UserController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  /**
   * Returns the profile of the current logged-in user.
   */
  getProfile = asyncHandler(async (req, res) => {
    res.json({
      status: 'success',
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  });

  /**
   * Returns dashboard summary data.
   */
  getDashboard = asyncHandler(async (req, res) => {
    const month = req.query.month;
    const dashboard = await this.analyticsService.getDashboard(req.user._id, month);
    res.json({
      status: 'success',
      data: dashboard,
    });
  });

  /**
   * Returns full year analytics data.
   */
  getAnalytics = asyncHandler(async (req, res) => {
    const year = Number(req.query.year) || new Date().getUTCFullYear();
    const analytics = await this.analyticsService.getAnalytics(req.user._id, year);
    res.json({
      status: 'success',
      data: analytics,
    });
  });

  /**
   * Returns natural language insights.
   */
  getInsights = asyncHandler(async (req, res) => {
    const month = req.query.month;
    const insights = await this.analyticsService.getInsights(req.user._id, month);
    res.json({
      status: 'success',
      data: insights,
    });
  });
}

module.exports = new UserController(analyticsService);
