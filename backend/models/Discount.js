const db = require('../config/db');

class Discount {
    static findValidPromo(kode) {
        return db.execute(
            'SELECT * FROM discounts WHERE kode_promo = ? AND masa_berlaku >= CURDATE()',
            [kode]
        );
    }

    static create(data) {
        const { kode_promo, potongan_persen, masa_berlaku } = data;
        return db.execute(
            'INSERT INTO discounts (kode_promo, potongan_persen, masa_berlaku) VALUES (?, ?, ?)',
            [kode_promo, potongan_persen, masa_berlaku]
        );
    }

    static findAllActive() {
        return db.execute('SELECT * FROM discounts WHERE masa_berlaku >= CURDATE() ORDER BY id DESC');
    }

    static findAll() {
        return db.execute('SELECT * FROM discounts ORDER BY id DESC');
    }

    static delete(id) {
        return db.execute('DELETE FROM discounts WHERE id = ?', [id]);
    }
}

module.exports = Discount;