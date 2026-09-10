const db = require('../config/database');

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const address = req.body.address || null;

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, address]
    );
    res.status(201).json({ id: result.insertId, name, email, role, address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
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

    res.json({
      totalUsers: parseInt(usersCountRows[0].count, 10),
      totalStores: parseInt(storesCountRows[0].count, 10),
      totalRatings: parseInt(ratingsCountRows[0].count, 10)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard counts' });
  }
};
