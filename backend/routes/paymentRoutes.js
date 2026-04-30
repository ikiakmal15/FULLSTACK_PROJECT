const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Simpan sementara di folder uploads

router.post('/upload', verifyToken, upload.single('bukti'), paymentController.uploadPayment);

module.exports = router;