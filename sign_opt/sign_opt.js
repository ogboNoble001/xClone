// Debug version - Replace your current sign-in JavaScript with this
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔹 Debug sign-in page loaded");
    
    const backendUrl = "https://xclone-vc7a.onrender.com";
    
    // Test backend connection first
    testBackend();
    
    async function testBackend() {
        try {
            console.log("Testing backend connection...");
            const response = await fetch(`${backendUrl}/api/db-status`);
            const data = await response.json();
            console.log("✅ Backend test successful:", data);
        } catch (error) {
            console.error("❌ Backend test failed:", error);
            alert("Cannot connect to backend. Check console for details.");
        }
    }
    
    // Password visibility toggle
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
    
    // Tab switching
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    if (signinTab) {
        signinTab.addEventListener('click', () => {
            signinTab.classList.add('active');
            if (signupTab) signupTab.classList.remove('active');
            if (signinForm) signinForm.classList.remove('hidden');
            if (signupForm) signupForm.classList.add('hidden');
        });
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            if (signinTab) signinTab.classList.remove('active');
            if (signupForm) signupForm.classList.remove('hidden');
            if (signinForm) signinForm.classList.add('hidden');
        });
    }
    
    // Password strength for signup
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
    
    // SIGN-IN FORM - Simplified with detailed logging
    const signinFormElement = document.getElementById('signin-form');
    if (signinFormElement) {
        signinFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log("🔹 Sign-in form submitted");
            
            const email = document.getElementById("signin-email")?.value?.trim();
            const password = document.getElementById("signin-password")?.value;
            
            console.log("Form data:", { email: email || "MISSING", password: password ? "PROVIDED" : "MISSING" });
            
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }
            
            try {
                console.log("🔹 Making login request to:", `${backendUrl}/api/login`);
                
                const response = await fetch(`${backendUrl}/api/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });
                
                console.log("Response status:", response.status);
                console.log("Response ok:", response.ok);
                
                const data = await response.json();
                console.log("Response data:", data);
                
                if (response.ok) {
                    alert("Login successful! " + data.message);
                    window.location.href = "/index.html";
                } else {
                    alert("Login failed: " + data.message);
                }
                
            } catch (error) {
                console.error("❌ Detailed error:", error);
                console.log("Error name:", error.name);
                console.log("Error message:", error.message);
                alert("Connection error: " + error.message);
            }
        });
    }
    
    // SIGN-UP FORM - Simplified with detailed logging  
    const signupFormElement = document.getElementById('signup-form');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log("🔹 Sign-up form submitted");
            
            const username = document.getElementById("signup-username")?.value?.trim();
            const email = document.getElementById("signup-email")?.value?.trim();
            const password = signupPassword?.value;
            const confirm = confirmPassword?.value;
            
            console.log("Form data:", {
                username: username || "MISSING",
                email: email || "MISSING",
                password: password ? "PROVIDED" : "MISSING",
                confirm: confirm ? "PROVIDED" : "MISSING"
            });
            
            if (!username || !email || !password || !confirm) {
                alert("Please fill in all fields");
                return;
            }
            
            if (password !== confirm) {
                alert("Passwords do not match");
                return;
            }
            
            if (!isStrongPassword(password)) {
                alert("Password must contain letters, numbers, and special characters");
                return;
            }
            
            try {
                console.log("🔹 Making signup request to:", `${backendUrl}/api/signup`);
                
                const response = await fetch(`${backendUrl}/api/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password })
                });
                
                console.log("Response status:", response.status);
                console.log("Response ok:", response.ok);
                
                const data = await response.json();
                console.log("Response data:", data);
                
                if (response.ok) {
                    alert("Signup successful! " + data.message);
                    window.location.href = "/index.html";
                } else {
                    alert("Signup failed: " + data.message);
                }
                
            } catch (error) {
                console.error("❌ Detailed error:", error);
                console.log("Error name:", error.name);
                console.log("Error message:", error.message);
                alert("Connection error: " + error.message);
            }
        });
    }
    
    console.log("✅ Debug sign-in page setup complete");
});