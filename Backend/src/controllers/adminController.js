const bcrypt = require('bcrypt');
const db = require('../config/database');

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const address = req.body.address || null;

    // Validation matching DB constraints
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: 'Name must be between 20 and 60 characters' });
    }
    if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ error: 'Password must be between 8 and 16 characters' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'A user with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, address]
        );
        res.status(201).json({ success: true, user_id: result.insertId, name, email, role, address });
    } catch (error) {
        console.error(error);
        const msg = error.sqlMessage || error.message || 'Failed to create user';
        res.status(500).json({ error: msg });
    }
};

exports.getUsers = async (req, res) => {
    const {
        role,
        search,
        sortBy = 'user_id',
        order = 'ASC'
    } = req.query;

    try {
        let query = `
            SELECT user_id, name, email, role, address
            FROM users
            WHERE 1=1
        `;

        const params = [];

        // Filter by role
        if (role) {
            query += ` AND role = ?`;
            params.push(role);
        }

        // Search by name or email
        if (search) {
            query += ` AND (name LIKE ? OR email LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        const sortOrder =
            order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // Allowed columns
        const validSortColumns = [
            'user_id',
            'name',
            'email',
            'role'
        ];

        const finalSortBy =
            validSortColumns.includes(sortBy)
                ? sortBy
                : 'user_id';

        query += ` ORDER BY ${finalSortBy} ${sortOrder}`;

        // Execute query
        const [rows] = await db.query(query, params);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching users:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT user_id, name, email, role, address
             FROM users
             WHERE user_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch user"
        });
    }
};
exports.createStore = async (req, res) => {
    const { owner_id, name, email, address } = req.body;

    if (!owner_id || !name || !email || !address) {
        return res.status(400).json({ error: 'Owner ID, name, email, and address are required' });
    }

    try {
        const [ownerCheck] = await db.query('SELECT role FROM users WHERE user_id = ?', [owner_id]);
        if (ownerCheck.length === 0) {
            return res.status(404).json({ error: 'Owner user not found' });
        }
        if (ownerCheck[0].role !== 'owner') {
            return res.status(400).json({ error: 'The specified user is not a store owner' });
        }

        const [result] = await db.query(
            'INSERT INTO stores (owner_id, name, email, address) VALUES (?, ?, ?, ?)',
            [owner_id, name, email, address]
        );
        res.status(201).json({ id: result.insertId, owner_id, name, email, address });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create store' });
    }
};

exports.getDashboard = async (req, res) => {
    try {
        const [usersCountRows] = await db.query('SELECT COUNT(*) AS count FROM users');
        const [storesCountRows] = await db.query('SELECT COUNT(*) AS count FROM stores');
        const [ratingsCountRows] = await db.query('SELECT COUNT(*) AS count FROM ratings');

        const [recentUsers] = await db.query(
            'SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
        );
        const [recentStores] = await db.query(
            'SELECT store_id, name, created_at FROM stores ORDER BY created_at DESC LIMIT 5'
        );
        const [recentRatings] = await db.query(
            'SELECT rating_id, rating_value, review_text, created_at FROM ratings ORDER BY created_at DESC LIMIT 5'
        );

        res.json({
            totalUsers: parseInt(usersCountRows[0].count, 10),
            totalStores: parseInt(storesCountRows[0].count, 10),
            totalRatings: parseInt(ratingsCountRows[0].count, 10),
            recentUsers,
            recentStores,
            recentRatings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const address = req.body.address || null;

    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required' });
    }
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: 'Name must be between 20 and 60 characters' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const [existing] = await db.query('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'A user with this email already exists' });
        }

        let query = 'UPDATE users SET name = ?, email = ?, role = ?, address = ? WHERE user_id = ?';
        let params = [name, email, role, address, id];

        if (password) {
            if (password.length < 8 || password.length > 16) {
                return res.status(400).json({ error: 'Password must be between 8 and 16 characters' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            query = 'UPDATE users SET name = ?, email = ?, password = ?, role = ?, address = ? WHERE user_id = ?';
            params = [name, email, hashedPassword, role, address, id];
        }

        const [result] = await db.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        const msg = error.sqlMessage || error.message || 'Failed to update user';
        res.status(500).json({ error: msg });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { owner_id, name, email, address } = req.body;

    if (!owner_id || !name || !email || !address) {
        return res.status(400).json({ error: 'Owner ID, name, email, and address are required' });
    }

    try {
        const [ownerCheck] = await db.query('SELECT role FROM users WHERE user_id = ?', [owner_id]);
        if (ownerCheck.length === 0) {
            return res.status(404).json({ error: 'Owner user not found' });
        }
        if (ownerCheck[0].role !== 'owner') {
            return res.status(400).json({ error: 'The specified user is not a store owner' });
        }

        const [result] = await db.query(
            'UPDATE stores SET owner_id = ?, name = ?, email = ?, address = ? WHERE store_id = ?',
            [owner_id, name, email, address, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json({ success: true, message: 'Store updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update store' });
    }
};

exports.deleteStore = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM stores WHERE store_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.json({ success: true, message: 'Store deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete store' });
    }
};