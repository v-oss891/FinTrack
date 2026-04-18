const asyncHandler = require('../utils/asyncHandler');
const analyticsService = require('../services/analyticsService');

const getProfile = asyncHandler(async (req, res) => {
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

const getDashboard = asyncHandler(async (req, res) => {
  const month = req.query.month;
  const dashboard = await analyticsService.getDashboard(req.user._id, month);
  res.json({
    status: 'success',
    data: dashboard,
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getUTCFullYear();
  const analytics = await analyticsService.getAnalytics(req.user._id, year);
  res.json({
    status: 'success',
    data: analytics,
  });
});

const getInsights = asyncHandler(async (req, res) => {
  const month = req.query.month;
  const insights = await analyticsService.getInsights(req.user._id, month);
  res.json({
    status: 'success',
    data: insights,
  });
});

module.exports = {
  getProfile,
  getDashboard,
  getAnalytics,
  getInsights,
};
