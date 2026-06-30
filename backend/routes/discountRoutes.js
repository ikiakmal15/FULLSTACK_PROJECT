const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/check', verifyToken, discountController.checkDiscount);
router.post('/add', verifyToken, isAdmin, discountController.addDiscount);
router.get('/all', verifyToken, isAdmin, discountController.getAllDiscount);
router.delete('/:id', verifyToken, isAdmin, discountController.deleteDiscount);

module.exports = router;