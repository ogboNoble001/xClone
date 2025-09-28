import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// FIXED CORS - Added localhost:7700
app.use(cors({
    origin: [
        "http://localhost:3000", 
        "http://localhost:7700", // YOUR FRONTEND PORT - THIS WAS MISSING!
        "http://localhost:5000",
        "http://localhost:8000",
        "https://x-clone.vercel.app", 
        "https://xclone-vc7a.onrender.com"
    ], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Step 1: Starting backend
console.log("🔹 Backend initializing...");

// Step 2: Connect to MongoDB
console.log("🔹 Connecting to MongoDB...");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully");
        
        // Step 3: Start Express server **after MongoDB connects**
        console.log("🔹 Starting Express server...");
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
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

// ========================
// Middleware for Authentication
// ========================
const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.status(401).json({ authenticated: false, message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ authenticated: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// ========================
// Routes
// ========================

// Root
app.get("/", (req, res) => {
    res.json({ message: "Express backend running" });
});

// Check authentication status
app.get("/api/auth/status", (req, res) => {
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.json({ authenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.clearCookie('authToken');
            return res.json({ authenticated: false });
        }
        res.json({ 
            authenticated: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            } 
        });
    });
});

// DB status
const states = ["disconnected", "connected", "connecting", "disconnecting"];
app.get("/api/db-status", (req, res) => {
    const state = states[mongoose.connection.readyState];
    res.json({ status: state, message: `MongoDB connection is ${state}` });
});

// Signup route
app.post("/api/signup", async (req, res) => {
    const { username, email, password } = req.body;
    
    console.log("🔹 Signup attempt:", { email, username });
    
    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: "❌ All fields are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "❌ Please enter a valid email" });
    }

    // Password strength validation
    if (password.length < 6) {
        return res.status(400).json({ message: "❌ Password must be at least 6 characters long" });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            console.log("❌ Email already exists");
            return res.status(400).json({ message: "❌ Email already registered" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = new User({ 
            username: username.trim(), 
            email: email.toLowerCase(), 
            password: hashedPassword 
        });
        await newUser.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        console.log(`✅ New user created: ${newUser.username}`);
        
        res.status(201).json({ 
            message: "✅ User created successfully",
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email 
            }
        });
    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ message: "❌ Error creating user" });
    }
});

// Login route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    console.log("🔹 Login attempt for:", email);
    
    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: "❌ Email and password are required" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "❌ Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.status(400).json({ message: "❌ Invalid credentials" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        console.log(`✅ User logged in: ${user.username}`);
        
        res.json({ 
            message: `✅ Welcome back, ${user.username}!`,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            }
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ message: "❌ Error logging in" });
    }
});

// Logout route
app.post("/api/logout", (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    res.json({ message: "✅ Logged out successfully" });
});

// Get user profile (protected route)
app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (err) {
        console.error("❌ Profile fetch error:", err);
        res.status(500).json({ message: "❌ Error fetching profile" });
    }
});

// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ 
        message: "✅ Access granted to protected content",
        user: req.user
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Global error:", err);
    res.status(500).json({ message: "Internal server error" });
});