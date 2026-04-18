const express = require('express');
const transactionController = require('../controllers/transactionController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/export/csv', transactionController.exportTransactionsCsv);
router
  .route('/')
  .get(transactionController.listTransactions)
  .post(transactionController.createTransaction);

router
  .route('/:id')
  .get(transactionController.getTransaction)
  .put(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
