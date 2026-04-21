const db = require('../config/db');

class Field {
    static findAll() {
        return db.execute('SELECT * FROM fields');
    }
    static create(data) {
        const { nama_lapangan, tipe, harga_per_jam, deskripsi } = data;
        return db.execute(
            'INSERT INTO fields (nama_lapangan, tipe, harga_per_jam, deskripsi) VALUES (?, ?, ?, ?)',
            [nama_lapangan, tipe, harga_per_jam, deskripsi]
        );
    }
    static update(id, data) {
        const { nama_lapangan, tipe, harga_per_jam, deskripsi } = data;
        return db.execute(
            'UPDATE fields SET nama_lapangan=?, tipe=?, harga_per_jam=?, deskripsi=? WHERE id=?',
            [nama_lapangan, tipe, harga_per_jam, deskripsi, id]
        );
    }
    static delete(id) {
        return db.execute('DELETE FROM fields WHERE id = ?', [id]);
    }
}
module.exports = Field;