const express = require('express');
const budgetController = require('../controllers/budgetController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/summary', budgetController.getBudgetSummary);
router
  .route('/')
  .get(budgetController.listBudgets)
  .post(budgetController.upsertBudget);

router
  .route('/:id')
  .put(budgetController.updateBudget)
  .delete(budgetController.deleteBudget);

module.exports = router;
