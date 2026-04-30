const db = require('../config/db');

exports.addReview = async (req, res) => {
    const { field_id, rating, ulasan } = req.body;
    const user_id = req.user.id;
    try {
        await db.execute(
            'INSERT INTO reviews (user_id, field_id, rating, ulasan) VALUES (?, ?, ?, ?)',
            [user_id, field_id, rating, ulasan]
        );
        res.status(201).json({ message: "Terima kasih atas ulasannya!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFieldReviews = async (req, res) => {
    const { field_id } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT r.*, u.nama FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.field_id = ?',
            [field_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};