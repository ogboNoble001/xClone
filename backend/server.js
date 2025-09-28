import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:7700",
        "https://x-clone.vercel.app",
        "https://xclone-vc7a.onrender.com"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ----------------------
// MongoDB connection
// ----------------------
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("✅ MongoDB connected");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};
connectDB();

// ----------------------
// User schema & model
// ----------------------
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ----------------------
// Auth middleware
// ----------------------
const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ authenticated: false, message: "No token" });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ authenticated: false, message: "Invalid token" });
        req.user = user;
        next();
    });
};

// ----------------------
// Routes
// ----------------------
app.get("/", (req, res) => res.json({ message: "Express backend running" }));

app.get("/api/db-status", (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    const state = states[mongoose.connection.readyState];
    res.json({ status: state, message: `MongoDB connection is ${state}` });
});

// Signup
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });
    
    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "Email already registered" });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username: username.trim(),
            email: email.toLowerCase(),
            password: hashedPassword
        });
        
        const token = jwt.sign({ id: newUser._id, username, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(201).json({ message: "User created successfully", user: { id: newUser._id, username, email } });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Error creating user" });
    }
});

// Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        const token = jwt.sign({ id: user._id, username: user.username, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.json({ message: `Welcome back, ${user.username}!`, user: { id: user._id, username: user.username, email } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Logout
app.post("/api/logout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    res.json({ message: "Logged out successfully" });
});

// Protected route example
app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ user });
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

// 404 handler
app.use("*", (req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error:", err);
    res.status(500).json({ message: "Internal server error" });
});