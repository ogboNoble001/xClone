document.addEventListener("DOMContentLoaded", () => {
        const backendUrl = "https://xclone-vc7a.onrender.com";
        
        // ========================
        // Check authentication status
        // ========================
        async function checkAuthStatus() {
                try {
                        const response = await fetch(`${backendUrl}/api/auth/status`, {
                                method: "GET",
                                credentials: "include"
                        });
                        const data = await response.json();
                        
                        if (data.authenticated) {
                                loadApp(data.user);
                        } else {
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                } catch (error) {
                        console.error("❌ Auth check error:", error);
                        window.location.href = "/sign_opt/sign_opt.html";
                }
        }
        
        // ========================
        // Signup
        // ========================
        async function signup(username, email, password) {
                try {
                        const response = await fetch(`${backendUrl}/api/signup`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({ username, email, password })
                        });
                        const data = await response.json();
                        
                        if (response.ok) {
                                window.location.href = "/index.html";
                        } else {
                                alert(data.message || "Signup failed");
                        }
                } catch (error) {
                        console.error("❌ Signup error:", error);
                        alert("Connection error: " + error.message);
                }
        }
        
        // ========================
        // Login
        // ========================
        async function login(email, password) {
                try {
                        const response = await fetch(`${backendUrl}/api/login`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({ email, password })
                        });
                        const data = await response.json();
                        
                        if (response.ok) {
                                window.location.href = "/index.html";
                        } else {
                                alert(data.message || "Login failed");
                        }
                } catch (error) {
                        console.error("❌ Login error:", error);
                        alert("Connection error: " + error.message);
                }
        }
        
        // ========================
        // Logout
        // ========================
        async function logout() {
                try {
                        const response = await fetch(`${backendUrl}/api/logout`, {
                                method: "GET",
                                credentials: "include"
                        });
                        if (response.ok) {
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                } catch (error) {
                        console.error("❌ Logout error:", error);
                }
        }
        
        // ========================
        // Load profile
        // ========================
        async function loadProfile() {
                try {
                        const response = await fetch(`${backendUrl}/api/profile`, {
                                method: "GET",
                                credentials: "include"
                        });
                        const data = await response.json();
                        
                        if (response.ok && data.user) {
                                console.log("✅ User profile loaded:", data.user);
                        } else {
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                } catch (error) {
                        console.error("❌ Profile load error:", error);
                        window.location.href = "/sign_opt/sign_opt.html";
                }
        }
        
        // ========================
        // Load App
        // ========================
        function loadApp(user) {
                console.log("✅ User authenticated:", user);
                loadProfile();
        }
        
        // Run auth check
        checkAuthStatus();
});