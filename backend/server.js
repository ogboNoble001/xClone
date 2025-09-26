import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
        try {
                await mongoose.connect(process.env.MONGO_URI, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                });
                console.log("✅ MongoDB connected");
        } catch (err) {
                console.error("❌ MongoDB connection error:", err);
                process.exit(1);
        }
};

connectDB();

app.get("/", (req, res) => {
        res.send("Backend running with MongoDB 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));