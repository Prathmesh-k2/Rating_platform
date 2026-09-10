const db = require('../config/database');

exports.getStores = async (req, res) => {
    try {
        const userId = req.user ? req.user.user_id : null;
        
        let query = `
            SELECT 
                s.store_id, s.name, s.address, s.email,
                (SELECT AVG(rating_value) FROM ratings WHERE store_id = s.store_id) AS avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE store_id = s.store_id) AS total_ratings
        `;
        let params = [];

        if (userId) {
            query += `, ur.rating_value AS user_rating, ur.review_text AS user_review
                      FROM stores s
                      LEFT JOIN ratings ur ON s.store_id = ur.store_id AND ur.user_id = ?`;
            params.push(userId);
        } else {
            query += ` FROM stores s`;
        }

        const [stores] = await db.query(query, params);
        res.json({ success: true, stores });
    } catch (error) {
        console.error("Error in getStores:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.searchStores = async (req, res) => {
    try {
        const { name = '', address = '' } = req.query;
        const query = `
            SELECT 
                s.store_id, s.name, s.address, s.email,
                (SELECT AVG(rating_value) FROM ratings WHERE store_id = s.store_id) AS avg_rating,
                (SELECT COUNT(*) FROM ratings WHERE store_id = s.store_id) AS total_ratings
            FROM stores s
            WHERE s.name LIKE ? AND s.address LIKE ?
        `;
        const params = [`%${name}%`, `%${address}%`];
        const [stores] = await db.query(query, params);
        res.json({ success: true, stores });
    } catch (error) {
        console.error("Error in searchStores:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
