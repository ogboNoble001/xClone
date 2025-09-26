import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Check MongoDB connection
        fetch('https://xclone-vc7a.onrender.com')
        .then(() => console.log("✅ MongoDB connected successfully"))
        .catch(err => console.error("❌ MongoDB connection error:", err));

// Simple route to test server
app.get("/", (req, res) => {
        res.send("Backend running and MongoDB connection checked!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));