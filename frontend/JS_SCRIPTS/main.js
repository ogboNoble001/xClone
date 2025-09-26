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
                process.exit(1); // Exit if DB connection fails
        }
};

// Simple test route
app.get("/", (req, res) => {
        res.json({ message: "Express server is running and MongoDB connection is secured!" });
});

// Check MongoDB connection status
const states = ["disconnected", "connected", "connecting", "disconnecting"];
app.get("/api/db-status", (req, res) => {
        const state = states[mongoose.connection.readyState];
        res.json({ status: state, message: `MongoDB connection is ${state}` });
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;
const startServer = async () => {
        await connectDB();
        console.log("🚀 Express server is ready");
        app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
};

startServer();