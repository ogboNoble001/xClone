import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock posts data
const posts = [
        { id: 1, text: "Hello from xClone!" },
        { id: 2, text: "This is a test post." },
        { id: 3, text: "Backend iorking without MongoDB." }
];

// Route to get posts
app.get("/api/posts", (req, res) => {
        res.json(posts);
});

// Optional: root route
app.get("/", (req, res) => {
        res.json({ message: "Backend running successfully!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));