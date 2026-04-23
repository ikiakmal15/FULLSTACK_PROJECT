const db = require('../config/db');

class Booking {
    static checkAvailability(field_id, tanggal, mulai, selesai) {
        return db.execute(
            `SELECT * FROM bookings 
             WHERE field_id = ? AND tanggal = ? 
             AND (
                (jam_mulai < ? AND jam_selesai > ?) -- Bentrok di tengah atau overlap
             )`,
            [field_id, tanggal, selesai, mulai]
        );
    }

    static create(data) {
        const { user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga } = data;
        return db.execute(
            'INSERT INTO bookings (user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, field_id, tanggal, jam_mulai, jam_selesai, total_harga]
        );
    }

    static findByUserId(user_id) {
        return db.execute(
            `SELECT b.*, f.nama_lapangan 
             FROM bookings b 
             JOIN fields f ON b.field_id = f.id 
             WHERE b.user_id = ?`, [user_id]
        );
    }
}
module.exports = Booking;