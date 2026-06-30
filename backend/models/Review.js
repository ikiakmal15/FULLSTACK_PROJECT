const db = require('../config/db');

class Review {
    static create(data) {
        const { user_id, field_id, rating, ulasan } = data;
        return db.execute(
            'INSERT INTO reviews (user_id, field_id, rating, ulasan) VALUES (?, ?, ?, ?)',
            [user_id, field_id, rating, ulasan]
        );
    }

    static findByFieldId(field_id) {
        return db.execute(
            'SELECT r.*, u.nama FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.field_id = ? ORDER BY r.id DESC',
            [field_id]
        );
    }

    static deleteByUserId(user_id) {
        return db.execute('DELETE FROM reviews WHERE user_id = ?', [user_id]);
    }
}

module.exports = Review;