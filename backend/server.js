import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Only needed if using .env locally

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
        res.send("Backend running for xClone 🚀");
});

// Example API route
app.get("/api/posts", (req, res) => {
        res.json([
                { id: 1, text: "Hello from xClone backend!" },
                { id: 2, text: "No MongoDB required" }
        ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));