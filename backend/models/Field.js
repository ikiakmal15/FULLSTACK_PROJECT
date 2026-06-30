const db = require('../config/db');

class Field {
    static findAllWithBookings() {
        return db.execute(`
            SELECT 
                f.*,
                GROUP_CONCAT(
                    CONCAT(b.tanggal, ' (', b.jam_mulai, ' - ', b.jam_selesai, ')')
                ) AS tanggal_terbooking
            FROM fields f
            LEFT JOIN bookings b ON f.id = b.field_id
            GROUP BY f.id
            ORDER BY f.id DESC
        `);
    }

    static findById(id) {
        return db.execute('SELECT * FROM fields WHERE id = ?', [id]);
    }

    static create(data) {
        const { nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup, gambar } = data;
        return db.execute(
            'INSERT INTO fields (nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup, gambar) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup, gambar]
        );
    }

    static updateWithImage(id, data) {
        const { nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup, gambar } = data;
        return db.execute(
            'UPDATE fields SET nama_lapangan=?, tipe=?, harga_per_jam=?, deskripsi=?, jam_buka=?, jam_tutup=?, gambar=? WHERE id=?',
            [nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup, gambar, id]
        );
    }

    static updateWithoutImage(id, data) {
        const { nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup } = data;
        return db.execute(
            'UPDATE fields SET nama_lapangan=?, tipe=?, harga_per_jam=?, deskripsi=?, jam_buka=?, jam_tutup=? WHERE id=?',
            [nama_lapangan, tipe, harga_per_jam, deskripsi, jam_buka, jam_tutup, id]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM fields WHERE id = ?', [id]);
    }
}

module.exports = Field;