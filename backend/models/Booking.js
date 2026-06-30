const db = require('../config/db');

class Booking {
    static checkAvailability(field_id, tanggal, mulai, selesai) {
        return db.execute(
            `SELECT * FROM bookings 
             WHERE field_id = ? 
               AND tanggal = ? 
               AND status != 'cancelled'
               AND (? < jam_selesai AND ? > jam_mulai)`,
            [field_id, tanggal, mulai, selesai]
        );
    }

    static create(data) {
        const { user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga } = data;
        return db.execute(
            'INSERT INTO bookings (user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
            [user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga]
        );
    }

    static findByUserId(user_id) {
        return db.execute(
            `SELECT b.*, f.nama_lapangan 
             FROM bookings b 
             JOIN fields f ON b.field_id = f.id 
             WHERE b.user_id = ?
             ORDER BY b.id DESC`, 
            [user_id]
        );
    }

    static findOccupied(field_id, tanggal) {
        return db.execute(
            'SELECT jam_mulai, jam_selesai FROM bookings WHERE field_id = ? AND tanggal = ? AND status != "cancelled"',
            [field_id, tanggal]
        );
    }

    static findAllWithDetails() {
        return db.execute(`
            SELECT 
                b.id AS booking_id, b.tanggal, b.jam_mulai, b.jam_selesai, b.total_harga, 
                b.status AS booking_status, f.nama_lapangan, u.nama AS nama_user, p.bukti_bayar           
            FROM bookings b
            JOIN fields f ON b.field_id = f.id
            JOIN users u ON b.user_id = u.id
            LEFT JOIN payments p ON b.id = p.booking_id
            ORDER BY b.tanggal DESC, b.jam_mulai DESC
        `);
    }

    static updateStatus(id, status) {
        return db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    }

    static deleteByIdAndUser(id, user_id) {
        return db.execute('DELETE FROM bookings WHERE id = ? AND user_id = ?', [id, user_id]);
    }

    static countTotalBookings() {
        return db.execute('SELECT COUNT(*) as count FROM bookings');
    }

    static countUserBookings(user_id) {
        return db.execute('SELECT COUNT(*) AS total_booking FROM bookings WHERE user_id = ?', [user_id]);
    }

    static calculateTotalIncome() {
        return db.execute('SELECT SUM(total_harga) as total FROM bookings WHERE status = "confirmed"');
    }

    static findRecentWithDetails(limit) {
        return db.execute(`
            SELECT b.*, u.nama, f.nama_lapangan 
            FROM bookings b 
            JOIN users u ON b.user_id = u.id 
            JOIN fields f ON b.field_id = f.id 
            ORDER BY b.id DESC 
            LIMIT ?`, 
            [limit]
        );
    }

    static deleteByUserId(user_id) {
        return db.execute('DELETE FROM bookings WHERE user_id = ?', [user_id]);
    }
}

module.exports = Booking;