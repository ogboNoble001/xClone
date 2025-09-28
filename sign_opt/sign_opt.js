document.addEventListener('DOMContentLoaded', () => {
    const backendUrl = "https://xclone-vc7a.onrender.com";
    
    // 1️⃣ Check if user is already logged in
    async function checkExistingAuth() {
        try {
            const res = await fetch(`${backendUrl}/api/auth/status`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.authenticated) {
                // User is already logged in → redirect to main page
                console.log("🔹 User already logged in, redirecting to index.html...");
                window.location.href = "/index.html";
            }
        } catch (err) {
            console.error("❌ Error checking auth:", err);
        }
    }
    
    // Only run check for returning users on page load
    checkExistingAuth();
    
    // 2️⃣ Sign-in form submission
    const signinFormElement = document.getElementById('signin-form');
    if (signinFormElement) {
        signinFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById("signin-email")?.value?.trim();
            const password = document.getElementById("signin-password")?.value;
            
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            try {
                const response = await fetch(`${backendUrl}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                if (response.ok) {
                    // ✅ Login successful → redirect immediately
                    window.location.href = "/index.html";
                } else {
                    alert("Login failed: " + data.message);
                }
                
            } catch (error) {
                console.error("❌ Detailed error:", error);
                alert("Connection error: " + error.message);
            }
        });
    }
    
    // 3️⃣ Sign-up form submission
    const signupFormElement = document.getElementById('signup-form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById("signup-username")?.value?.trim();
            const email = document.getElementById("signup-email")?.value?.trim();
            const password = document.getElementById("signup-password")?.value;
            const confirm = document.getElementById("confirm-password")?.value;
            
            if (!username || !email || !password || !confirm) {
                alert("Please fill in all fields");
                return;
            }
            
            if (password !== confirm) {
                alert("Passwords do not match");
                return;
            }
            
            try {
                const response = await fetch(`${backendUrl}/api/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password })
                });
                
                const data = await response.json();
                if (response.ok) {
                    // ✅ Signup successful → redirect immediately
                    window.location.href = "/index.html";
                } else {
                    alert("Signup failed: " + data.message);
                }
                
            } catch (error) {
                console.error("❌ Detailed error:", error);
                alert("Connection error: " + error.message);
            }
        });
    }
});