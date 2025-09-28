import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
});

const User = mongoose.model("User", userSchema);

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

// Signup route
app.post("/api/signup", async (req, res) => {
        const { username, email, password } = req.body;
        try {
                const existing = await User.findOne({ email });
                if (existing) {
                        return res.status(400).json({ success: false, message: "Email already registered" });
                }
                
                const hashedPassword = await bcrypt.hash(password, 10);
                
                const newUser = new User({ username, email, password: hashedPassword });
                await newUser.save();
                
                res.json({ success: true, message: "✅ User created successfully" });
        } catch (err) {
                res.status(500).json({ success: false, message: "❌ Error creating user" });
        }
});

// Login route
app.post("/api/login", async (req, res) => {
        const { email, password } = req.body;
        try {
                const user = await User.findOne({ email });
                if (!user) {
                        // User not found → frontend can redirect to signup
                        return res.status(404).json({ success: false, exists: false, message: "User not found" });
                }
                
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return res.status(400).json({ success: false, exists: true, message: "Invalid credentials" });
                
                // Successful login → frontend can redirect to main page
                res.json({ success: true, exists: true, message: `Welcome back, ${user.username}` });
        } catch (err) {
                res.status(500).json({ success: false, exists: null, message: "❌ Error logging in" });
        }
});