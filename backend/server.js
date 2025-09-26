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

// Post schema and model
const postSchema = new mongoose.Schema({
        text: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", (req, res) => res.json({ message: "Backend running successfully!" }));

// Fetch all posts from MongoDB
app.get("/api/posts", async (req, res) => {
        try {
                const posts = await Post.find().sort({ createdAt: -1 });
                res.json(posts);
        } catch (error) {
                res.status(500).json({ error: "Failed to fetch posts" });
        }
});

// Check MongoDB connection status
app.get("/api/db-status", (req, res) => {
        const status = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
        res.json({ status, message: `MongoDB connection is ${status}` });
});

// Add a new post
app.post("/api/posts", async (req, res) => {
        try {
                const { text } = req.body;
                if (!text) return res.status(400).json({ error: "Text is required" });
                
                const newPost = new Post({ text });
                await newPost.save();
                res.status(201).json(newPost);
        } catch (error) {
                res.status(500).json({ error: "Failed to creat post" });
        }
});

// Start server and connect to MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        connectDB();
});