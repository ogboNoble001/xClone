import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const app = express();

// ========================
// CORS setup
// ========================
const allowedOrigins = [
    "https://startling-manatee-3912f5.netlify.app",
    "https://x-clone-real.vercel.app",
    "http://localhost:7700"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

// ========================
// MongoDB Connection
// ========================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

connectDB();

// ========================
// User Schema + Model
// ========================
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// ========================
// Cloudinary Config
// ========================
cloudinary.config({
    secure: true // reads CLOUDINARY_URL from .env
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profiles",
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({ storage });

// ========================
// Routes
// ========================

// Root
app.get("/", (req, res) => {
    res.json({ message: "Express backend running" });
});

// DB status
const states = ["disconnected", "connected", "connecting", "disconnecting"];
app.get("/api/db-status", (req, res) => {
    const state = states[mongoose.connection.readyState];
    res.json({ status: state, message: `MongoDB connection is ${state}` });
});

// Upload photo (standalone)
app.post("/api/upload-photo", upload.single("photo"), (req, res) => {
    res.json({ imageUrl: req.file.path });
});

// Signup route
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error creating user" });
    }
});

// Login route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: `Welcome back, ${user.username}`,
            token: token,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Verify token route
app.post("/api/verify-token", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json({
            valid: true,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});