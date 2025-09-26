import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                });
                console.log("✅ MongoDB connected successfully");
        } catch (error) {
                console.error("❌ MongoDB connection error:", error.message);
        }
};

// Mock posts data
const posts = [
        { id: 1, text: "Hello from xClone!" },
        { id: 2, text: "This is a test post." },
        { id: 3, text: "Backend working with MongoDB." }
];

// Routes
app.get("/", (req, res) => res.json({ message: "Backend running successfully!" }));

app.get("/api/posts", (req, res) => res.json(posts));

app.get("/api/db-status", (req, res) => {
        const status = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
        res.json({
                status,
                message: `MongoDB connection is ${status}`
        });
});

// Start server and connect to MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        connectDB();
});