const db = require('../config/db');

exports.checkDiscount = async (req, res) => {
    const { kode } = req.body;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM discounts WHERE kode_promo = ? AND masa_berlaku >= CURDATE()',
            [kode]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Kode promo tidak valid atau expired" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};