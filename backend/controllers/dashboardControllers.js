const db = require('../config/db');

exports.getAdminStats = async (req, res) => {
    try {
        const [totalUser] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "user"');
        const [totalBooking] = await db.execute('SELECT COUNT(*) as count FROM bookings');
        const [pendapatan] = await db.execute('SELECT SUM(total_harga) as total FROM bookings WHERE status = "confirmed"');
        const [recentBookings] = await db.execute('SELECT b.*, u.nama, f.nama_lapangan FROM bookings b JOIN users u ON b.user_id = u.id JOIN fields f ON b.field_id = f.id ORDER BY b.created_at DESC LIMIT 5');

        res.json({
            stats: {
                users: totalUser[0].count,
                bookings: totalBooking[0].count,
                income: pendapatan[0].total || 0
            },
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};