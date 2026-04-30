const db = require('../config/db');

exports.uploadPayment = async (req, res) => {
    const { booking_id, metode_bayar } = req.body;
    const bukti_bayar = req.file ? req.file.filename : 'default.jpg'; // Menggunakan multer nanti

    try {
        // 1. Catat ke tabel payments
        await db.execute(
            'INSERT INTO payments (booking_id, metode_bayar, bukti_bayar) VALUES (?, ?, ?)',
            [booking_id, metode_bayar, bukti_bayar]
        );

        // 2. Update status di tabel bookings menjadi 'confirmed' (atau tunggu verifikasi admin)
        await db.execute('UPDATE bookings SET status = "confirmed" WHERE id = ?', [booking_id]);

        res.json({ message: "Pembayaran berhasil dikirim!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};