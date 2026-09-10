require('dotenv').config();
const express = require("express");
const adminRoutes = require("./src/routes/admin");
const authRoutes = require("./src/routes/auth");
const storeRoutes = require("./src/routes/stores");
const ratingRoutes = require("./src/routes/ratings");
const storeOwnerRoutes = require("./src/routes/storeOwner");
const db = require('./src/config/database');

const app = express();

app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

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