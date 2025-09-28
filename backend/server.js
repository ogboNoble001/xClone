import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'https://x-clone-real.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

console.log("🔹 Backend initializing...");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
};

connectDB();

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ authenticated: false, message: "No token provided" });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.clearCookie("authToken");
            return res.status(403).json({ authenticated: false, message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

app.get("/", (req, res) => res.json({ message: "Express backend running" }));

app.get("/api/db-status", (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    const state = states[mongoose.connection.readyState];
    res.json({ status: state, message: `MongoDB connection is ${state}` });
});

app.get("/api/auth/status", (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.json({ authenticated: false });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.clearCookie("authToken");
            return res.json({ authenticated: false });
        }
        res.json({ authenticated: true, user });
    });
});

app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: "❌ All fields are required" });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ message: "❌ Please enter a valid email" });
    
    if (password.length < 6)
        return res.status(400).json({ message: "❌ Password must be at least 6 characters" });
    
    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "❌ Email already registered" });
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username: username.trim(), email: email.toLowerCase(), password: hashedPassword });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        res.status(201).json({ message: "✅ User created successfully", user: { id: newUser._id, username: newUser.username, email: newUser.email } });
        
    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ message: "❌ Error creating user" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "❌ Email and password required" });
    
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "❌ Invalid credentials" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials" });
        
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        res.json({ message: `✅ Welcome back, ${user.username}!`, user: { id: user._id, username: user.username, email: user.email } });
        
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "❌ Error logging in" });
    }
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("authToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none', path: '/' });
    res.json({ message: "✅ Logged out successfully" });
});

app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (err) {
        console.error("❌ Profile error:", err);
        res.status(500).json({ message: "❌ Error fetching profile" });
    }
});

app.use('*', (req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
    console.error("❌ Global error:", err);
    res.status(500).json({ message: "Internal server error" });
});