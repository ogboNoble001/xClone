import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        })
        .then(() => console.log("✅ MongoDB connected successfully"))
        .catch(err => console.error("❌ MongoDB connection error:", err));

// test route
app.get("/", (req, res) => {
        res.send("Backend running for xClone 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
});