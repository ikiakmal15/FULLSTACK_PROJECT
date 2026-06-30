const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('bukti'), paymentController.uploadPayment);
router.post('/confirm-by-booking', verifyToken, isAdmin, paymentController.confirmPaymentByBooking);

module.exports = router;