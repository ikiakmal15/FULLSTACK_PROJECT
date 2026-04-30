const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, isAdmin, getAdminStats);

module.exports = router;