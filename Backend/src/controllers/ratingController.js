const db = require('../config/database');

exports.upsertRating = async (req, res) => {
    try {
        const { store_id, rating_value, review_text } = req.body;
        const user_id = req.user.user_id;

        if (!store_id || !rating_value) {
            return res.status(400).json({ success: false, message: 'Store ID and rating value are required' });
        }

        const query = `
            INSERT INTO ratings (user_id, store_id, rating_value, review_text) 
            VALUES (?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            rating_value = VALUES(rating_value), 
            review_text = VALUES(review_text)
        `;
        const params = [user_id, store_id, rating_value, review_text || null];

        await db.query(query, params);
        res.json({ success: true, message: 'Rating submitted/updated successfully' });
    } catch (error) {
        console.error("Error in upsertRating:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
