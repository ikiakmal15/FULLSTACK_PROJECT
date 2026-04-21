const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// User & Admin bisa melihat lapangan
router.get('/', fieldController.getAllFields);

// Hanya Admin yang bisa mengelola (Tambah, Edit, Hapus)
router.post('/', verifyToken, isAdmin, fieldController.addField);
router.put('/:id', verifyToken, isAdmin, fieldController.updateField);
router.delete('/:id', verifyToken, isAdmin, fieldController.deleteField);

module.exports = router;