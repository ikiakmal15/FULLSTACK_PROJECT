const paymentService = require('../services/paymentService');

exports.uploadPayment = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Anda wajib mengunggah file bukti pembayaran!" });
        
        const payload = {
            booking_id: req.body.booking_id,
            metode_bayar: req.body.metode_bayar,
            bukti_bayar: req.file.filename
        };

        await paymentService.processUploadPayment(payload);
        res.json({ message: "Pembayaran berhasil dikirim! Menunggu konfirmasi admin." });
    } catch (error) {
        if (error.message.includes("tidak ditemukan")) return res.status(404).json({ message: error.message });
        res.status(500).json({ error: error.message });
    }
};

exports.confirmPaymentByBooking = async (req, res) => {
    try {
        await paymentService.processConfirmPayment(req.body);
        res.json({ message: "Status transaksi berhasil diperbarui!" });
    } catch (error) {
        if (error.message.includes("Tidak ada transaksi")) return res.status(404).json({ message: error.message });
        res.status(500).json({ error: error.message });
    }
};