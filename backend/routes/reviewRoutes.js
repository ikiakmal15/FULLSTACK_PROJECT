const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:field_id', reviewController.getFieldReviews);
router.post('/', verifyToken, reviewController.addReview);

module.exports = router;