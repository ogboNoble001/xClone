import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Step 1: Starting backend
console.log("🔹 Backend initializing...");

// Step 2: Connect to MongoDB
console.log("🔹 Connecting to MongoDB...");

const connectDB = async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                });
                console.log("✅ MongoDB connected successfully");
                
                // Step 3: Start Express server **after MongoDB connects**
                console.log("🔹 Starting Express server...");
                const PORT = process.env.PORT || 5000;
                app.listen(PORT, () => {
                        console.log(`🚀 Server listening on port ${PORT}`);
                });
                
        } catch (err) {
                console.error("❌ MongoDB connection error:", err.message);
                process.exit(1); // Stop server if DB fails
        }
};

connectDB();

// Optional test route
app.get("/", (req, res) => {
        res.json({ message: "Express backend running" });
});

// Optional DB status route
const states = ["disconnected", "connected", "connecting", "disconnecting"];
app.get("/api/db-status", (req, res) => {
        const state = states[mongoose.connection.readyState];
        res.json({ status: state, message: `MongoDB connection is ${state}` });
});