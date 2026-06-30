const Discount = require('../models/Discount');
const Booking = require('../models/Booking');

exports.checkDiscount = async (req, res) => {
    try {
        const { kode } = req.body;
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Sesi Anda habis, silakan login kembali." });

        const [bookingCountRows] = await Booking.countUserBookings(userId);
        const totalBooking = bookingCountRows[0]?.total_booking || 0;

        const [rows] = await Discount.findValidPromo(kode);
        if (rows.length === 0) return res.status(404).json({ message: "Kode promo tidak valid atau expired" });

        if (totalBooking <= 5) {
            return res.status(403).json({ 
                message: `Maaf, kode promo ini eksklusif untuk member loyal. Anda baru memesan ${totalBooking} kali. Minimal harus lebih dari 5 kali booking!` 
            });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addDiscount = async (req, res) => {
    try {
        await Discount.create(req.body);
        res.status(201).json({ message: "Kode promo baru berhasil disimpan ke database!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllDiscount = async (req, res) => {
    try {
        const [rows] = await Discount.findAllActive();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDiscount = async (req, res) => {
    try {
        const [result] = await Discount.delete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Voucher diskon tidak ditemukan." });
        res.json({ message: "Voucher diskon berhasil dihapus permanen!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};