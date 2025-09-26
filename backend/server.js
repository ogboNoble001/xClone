import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        })
        .then(() => console.log("✅ MongoDB connected successfully"))
        .catch(err => console.error("❌ MongoDB connection error:", err));

// Define a simple Post schema
const postSchema = new mongoose.Schema({
        text: String,
        createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

// API routes
app.get("/api/posts", async (req, res) => {
        const posts = await Post.find();
        res.json(posts);
});

app.post("/api/posts", async (req, res) => {
        const { text } = req.body;
        const newPost = new Post({ text });
        await newPost.save();
        res.json(newPost);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));