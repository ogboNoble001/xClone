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
                await mongoose.connect(process.env.MONGO_URI);
                console.log("✅ MongoDB connected successfully");
        } catch (error) {
                console.error("❌ MongoDB connection error:", error.message);
                process.exit(1); // Exit if DB connection fails
        }
};

// Post schema and model
const postSchema = new mongoose.Schema({
        text: { type: String, required: true, maxlength: 500 }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", (req, res) => {
        res.json({ message: "Backend running successfully!" });
});

// Fetch all posts
app.get("/api/posts", async (req, res) => {
        try {
                const posts = await Post.find().sort({ createdAt: -1 });
                res.json(posts);
        } catch (error) {
                res.status(500).json({ error: "Failed to fetch posts" });
        }
});

// Check MongoDB connection status
const states = ["disconnected", "connected", "connecting", "disconnecting"];
app.get("/api/db-status", (req, res) => {
        const state = states[mongoose.connection.readyState];
        res.json({ status: state, message: `MongoDB connection is ${state}` });
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
                res.status(500).json({ error: "Failed to create post" });
        }
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;
const startServer = async () => {
        await connectDB();
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();