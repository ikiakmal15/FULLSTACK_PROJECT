const express = require('express');
const router = express.Router();
const { checkDiscount } = require('../controllers/discountController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const db = require('../config/db');

router.post('/check', verifyToken, checkDiscount);

// Admin: Tambah Diskon
router.post('/add', verifyToken, isAdmin, async (req, res) => {
    const { kode_promo, potongan_persen, masa_berlaku } = req.body;
    await db.execute(
        'INSERT INTO discounts (kode_promo, potongan_persen, masa_berlaku) VALUES (?, ?, ?)',
        [kode_promo, potongan_persen, masa_berlaku]
    );
    res.json({ message: "Diskon baru berhasil dibuat!" });
});

module.exports = router;