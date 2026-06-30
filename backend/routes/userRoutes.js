const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/admin/users', verifyToken, isAdmin, userController.getAllUsers);
router.delete('/admin/users/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;