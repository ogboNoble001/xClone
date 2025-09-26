import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
        res.send("Backend running for xClone 🚀");
});

// example API route (you can extend later)
app.get("/api/posts", (req, res) => {
        res.json([
                { id: 1, text: "Hello world" },
                { id: 2, text: "First xClone post!" }
        ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));