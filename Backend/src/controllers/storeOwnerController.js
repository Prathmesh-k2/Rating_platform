const db = require('../config/database');

exports.getDashboard = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        if (req.user.role !== 'owner' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied: Must be a store owner' });
        }

        // Get stores owned by user along with avg rating
        const storesQuery = `
            SELECT 
                s.store_id, s.name, s.address,
                (SELECT AVG(rating_value) FROM ratings WHERE store_id = s.store_id) AS avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE store_id = s.store_id) AS total_ratings
            FROM stores s
            WHERE s.owner_id = ?
        `;
        const [stores] = await db.query(storesQuery, [user_id]);

        // Get raters for these stores
        const ratingsQuery = `
            SELECT 
                r.rating_id, r.rating_value, r.review_text, r.created_at,
                u.user_id, u.name AS user_name, u.email AS user_email,
                s.name AS store_name, s.store_id
            FROM ratings r
            JOIN stores s ON r.store_id = s.store_id
            JOIN users u ON r.user_id = u.user_id
            WHERE s.owner_id = ?
            ORDER BY r.created_at DESC
        `;
        const [ratings] = await db.query(ratingsQuery, [user_id]);

        res.json({ 
            success: true, 
            dashboard: {
                stores,
                recent_ratings: ratings
            } 
        });
    } catch (error) {
        console.error("Error in getDashboard:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
