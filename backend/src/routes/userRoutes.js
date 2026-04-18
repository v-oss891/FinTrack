const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/me', userController.getProfile);
router.get('/dashboard', userController.getDashboard);
router.get('/analytics', userController.getAnalytics);
router.get('/insights', userController.getInsights);

module.exports = router;
