const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const { field_id, tanggal, jam_mulai, jam_selesai, total_harga } = req.body;
        const user_id = req.user.id; // Diambil dari token JWT

        // 1. Cek apakah jam tersebut sudah ada yang booking
        const [isBooked] = await Booking.checkAvailability(field_id, tanggal, jam_mulai, jam_selesai);
        
        if (isBooked.length > 0) {
            return res.status(400).json({ message: "Jadwal sudah terisi, silakan pilih jam lain." });
        }

        // 2. Simpan booking jika tersedia
        await Booking.create({ user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga });
        res.status(201).json({ message: "Booking berhasil dibuat! Menunggu pembayaran." });
    } catch (error) {
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