const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;

  // Every normal signup gets user role
  const userRole = "user";

  if (!name || !email || !password || !address) {
    return res.status(400).json({
      error: "Name, email, password and address are required"
    });
  }

  try {
    // Check existing email
    const [existingUsers] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: "User already exists with that email"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users
       (name, email, password, role, address)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, userRole, address]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_id: result.insertId,
      role: userRole
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      error: "Server error during signup"
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required"
    });
  }

  try {
    // Get user from MySQL
    const [users] = await db.query(
      `SELECT user_id, name, email, password, role
             FROM users
             WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      error: "Server error during login"
    });
  }
};