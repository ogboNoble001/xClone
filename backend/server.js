import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection test
const testConnection = async () => {
        try {
                await mongoose.connect(process.env.MONGODB_URI);
                console.log("✅ MongoDB connected successfully");
        } catch (error) {
                console.error("❌ MongoDB connection error:", error);
        }
};

// Mock posts data (keeping your original data)
const posts = [
        { id: 1, text: "Hello from xClone!" },
        { id: 2, text: "This is a test post." },
        { id: 3, text: "Backend working without MongoDB." }
];

// Route to get posts (unchanged)
app.get("/api/posts", (req, res) => {
        res.json(posts);
});

// Route to check MongoDB connection status
app.get("/api/db-status", async (req, res) => {
        try {
                if (mongoose.connection.readyState === 1) {
                        res.json({
                                status: "connected",
                                message: "MongoDB connection is active"
                        });
                } else {
                        res.json({
                                status: "disconnected",
                                message: "MongoDB connection is not active"
                        });
                }
        } catch (error) {
                res.status(500).json({
                        status: "error",
                        message: "Error checking MongoDB status",
                        error: error.message
                });
        }
});

// Root route (unchanged)
app.get("/", (req, res) => {
        res.json({ message: "Backend running successfully!" });
});

// Test MongoDB connection when server starts
testConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));