require('dotenv').config();
const express = require("express");
const adminRoutes = require("./src/routes/admin");
const db = require('./src/config/database');

const app = express();

app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Check DB Connection
    try {
        await db.pool.getConnection(); // Need to export pool to use getConnection(), alternatively we can run a simple query
        console.log(" Database connected successfully.");
    } catch (error) {
        console.error(" Database connection failed:", error.message);
    }
});