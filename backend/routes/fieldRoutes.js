const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);
router.post('/', verifyToken, isAdmin, upload.single('gambar'), fieldController.addField);
router.put('/:id', verifyToken, isAdmin, upload.single('gambar'), fieldController.updateField);
router.delete('/:id', verifyToken, isAdmin, fieldController.deleteField);

module.exports = router;