const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    try {
        const { field_id, rating, ulasan } = req.body;
        const user_id = req.user.id;

        if (Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({ message: "Rating tidak valid! Harus berskala 1-5." });
        }

        await Review.create({ user_id, field_id, rating, ulasan });
        res.status(201).json({ message: "Terima kasih atas ulasannya!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFieldReviews = async (req, res) => {
    try {
        const { field_id } = req.params;
        
        const [rows] = await Review.findByFieldId(field_id);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};