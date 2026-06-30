const bookingService = require('../services/bookingService');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const payload = { ...req.body, user_id: req.user.id };
        await bookingService.processNewBooking(payload);
        res.status(201).json({ message: "Booking berhasil dibuat! Menunggu pembayaran." });
    } catch (error) {
        if (error.message.includes("lewat") || error.message.includes("beroperasi") || error.message.includes("terisi")) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message.includes("tidak ditemukan")) return res.status(404).json({ message: error.message });
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const [rows] = await Booking.findByUserId(req.user.id);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOccupiedSchedules = async (req, res) => {
    try {
        const [rows] = await Booking.findOccupied(req.query.field_id, req.query.tanggal);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const [rows] = await Booking.findAllWithDetails();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        await Booking.updateStatus(req.params.id, "cancelled");
        res.json({ message: "Status pesanan berhasil diubah menjadi cancelled." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBookingByUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Sesi Anda habis, silakan login kembali." });

        const [result] = await Booking.deleteByIdAndUser(req.params.id, userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan atau hak akses ditolak." });
        }
        res.json({ message: "Booking berhasil dibatalkan dan pesanan Anda telah dihapus!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};