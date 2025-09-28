// Debugging sign-in/sign-up JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔹 Sign-in/Sign-up page loaded");
    
    // ------------------------------
    // Backend URL - CHANGE THIS TO YOUR ACTUAL BACKEND URL
    // ------------------------------
    const backendUrl = "https://xclone-vc7a.onrender.com"; // Change this if different
    
    // Test backend connection on page load
    testBackendConnection();
    
    async function testBackendConnection() {
        try {
            console.log("🔹 Testing backend connection to:", backendUrl);
            
            const response = await fetch(`${backendUrl}/api/db-status`);
            const data = await response.json();
            
            console.log("✅ Backend connection successful:", data);
        } catch (error) {
            console.error("❌ Backend connection failed:", error);
            console.log("Please check:");
            console.log("1. Backend URL is correct:", backendUrl);
            console.log("2. Backend server is running");
            console.log("3. CORS is properly configured");
        }
    }
    
    // Check if user is already authenticated
    checkIfAlreadyAuthenticated();
    
    // ------------------------------
    // Toggle password visibility
    // ------------------------------
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.dataset.target;
            const input = document.getElementById(inputId);
            if (!input) return;
            
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = 'Hide';
            } else {
                input.type = 'password';
                btn.textContent = 'Show';
            }
        });
    });
    
    // ------------------------------
    // Tabs switching
    // ------------------------------
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const authTitle = document.querySelector('.auth-title');
    const authSubtitle = document.querySelector('.auth-subtitle');
    
    if (signinTab) {
        signinTab.addEventListener('click', () => {
            signinTab.classList.add('active');
            if (signupTab) signupTab.classList.remove('active');
            if (signinForm) signinForm.classList.remove('hidden');
            if (signupForm) signupForm.classList.add('hidden');
            if (authTitle) authTitle.textContent = 'Welcome back';
            if (authSubtitle) authSubtitle.textContent = 'Sign in to your account';
        });
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            if (signinTab) signinTab.classList.remove('active');
            if (signupForm) signupForm.classList.remove('hidden');
            if (signinForm) signinForm.classList.add('hidden');
            if (authTitle) authTitle.textContent = 'Create account';
            if (authSubtitle) authSubtitle.textContent = 'Join X today';
        });
    }
    
    // ------------------------------
    // Password strength + match
    // ------------------------------
    const signupPassword = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const strengthDiv = document.getElementById('password-strength');
    const matchDiv = document.getElementById('password-match');
    
    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const strength = getPasswordStrength(signupPassword.value);
            if (strengthDiv) {
                strengthDiv.textContent = strength.text;
                strengthDiv.style.color = strength.color;
            }
            checkPasswordMatch();
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', checkPasswordMatch);
    }
    
    function checkPasswordMatch() {
        if (!confirmPassword || !signupPassword || !matchDiv) return;
        
        if (confirmPassword.value === '') {
            matchDiv.textContent = '';
            return;
        }
        if (signupPassword.value === confirmPassword.value) {
            matchDiv.textContent = 'Passwords match';
            matchDiv.style.color = '#53D500';
        } else {
            matchDiv.textContent = 'Passwords do not match';
            matchDiv.style.color = 'red';
        }
    }
    
    function isStrongPassword(password) {
        return /[A-Za-z]/.test(password) &&
            /\d/.test(password) &&
            /[^A-Za-z0-9]/.test(password) &&
            password.length >= 8;
    }
    
    function getPasswordStrength(password) {
        if (password.length < 6) return { text: 'Too short', color: 'red' };
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        if (hasLetter && hasNumber && hasSpecial && password.length >= 8)
            return { text: 'Strong password', color: '#53D500' };
        if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial))
            return { text: 'Medium strength', color: 'orange' };
        return { text: 'Weak password', color: 'red' };
    }
    
    // ------------------------------
    // Check if already authenticated
    // ------------------------------
    async function checkIfAlreadyAuthenticated() {
        try {
            const response = await fetch(`${backendUrl}/api/auth/status`, {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.authenticated) {
                console.log("✅ User already authenticated, redirecting to main page...");
                window.location.href = "/index.html";
            }
        } catch (error) {
            console.log("🔹 User not authenticated, staying on sign-in page");
        }
    }
    
    // ------------------------------
    // Sign-in form submission
    // ------------------------------
    const signinFormElement = document.getElementById('signin-form');
    if (signinFormElement) {
        signinFormElement.addEventListener('submit', async e => {
            e.preventDefault();
            
            const email = document.getElementById("signin-email")?.value;
            const password = document.getElementById("signin-password")?.value;
            
            console.log("🔹 Attempting sign-in with:", { email: email ? "provided" : "missing", password: password ? "provided" : "missing" });
            
            try {
                console.log("🔹 Making request to:", `${backendUrl}/api/login`);
                
                const res = await fetch(`${backendUrl}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include', // Add this for cookies
                    body: JSON.stringify({ email, password })
                });
                
                console.log("🔹 Response status:", res.status);
                console.log("🔹 Response headers:", Object.fromEntries(res.headers.entries()));
                
                const data = await res.json();
                console.log("🔹 Response data:", data);
                
                if (res.ok) {
                    // ✅ Login successful → redirect
                    alert(data.message);
                    window.location.href = "/index.html";
                } else {
                    // ❌ Login failed → show error
                    alert(data.message);
                }
            } catch (err) {
                console.error("❌ Detailed sign-in error:", err);
                console.log("Error details:");
                console.log("- Error name:", err.name);
                console.log("- Error message:", err.message);
                console.log("- Backend URL used:", backendUrl);
                
                alert("❌ Error connecting to server. Check console for details.");
            }
        });
    }
    
    // ------------------------------
    // Sign-up form submission
    // ------------------------------
    const signupFormElement = document.getElementById('signup-form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async e => {
            e.preventDefault();
            
            const username = document.getElementById("signup-username")?.value;
            const email = document.getElementById("signup-email")?.value;
            const password = signupPassword?.value;
            const confirm = confirmPassword?.value;
            
            if (password !== confirm) {
                alert("❌ Passwords do not match");
                return;
            }
            if (!isStrongPassword(password)) {
                alert("❌ Password must contain letters, numbers, and special characters");
                return;
            }
            
            console.log("🔹 Attempting sign-up with:", {
                username: username ? "provided" : "missing",
                email: email ? "provided" : "missing",
                password: password ? "provided" : "missing"
            });
            
            try {
                console.log("🔹 Making request to:", `${backendUrl}/api/signup`);
                
                const res = await fetch(`${backendUrl}/api/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include', // Add this for cookies
                    body: JSON.stringify({ username, email, password })
                });
                
                console.log("🔹 Response status:", res.status);
                console.log("🔹 Response headers:", Object.fromEntries(res.headers.entries()));
                
                const data = await res.json();
                console.log("🔹 Response data:", data);
                
                if (res.ok) {
                    alert(data.message);
                    window.location.href = "/index.html";
                } else {
                    // ❌ Signup failed → show error
                    alert(data.message);
                }
            } catch (err) {
                console.error("❌ Detailed sign-up error:", err);
                console.log("Error details:");
                console.log("- Error name:", err.name);
                console.log("- Error message:", err.message);
                console.log("- Backend URL used:", backendUrl);
                
                alert("❌ Error connecting to server. Check console for details.");
            }
        });
    }
});