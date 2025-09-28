document.addEventListener('DOMContentLoaded', () => {
    console.log("🔹 Debug sign-in page loaded");
    
    const backendUrl = "https://xclone-vc7a.onrender.com";
    
    // Test backend connection
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
    
    // ======================
    // Password visibility toggle
    // ======================
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
        });
    });
    
    // ======================
    // Tab switching
    // ======================
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    signinTab?.addEventListener('click', () => {
        signinTab.classList.add('active');
        signupTab?.classList.remove('active');
        signinForm?.classList.remove('hidden');
        signupForm?.classList.add('hidden');
    });
    
    signupTab?.addEventListener('click', () => {
        signupTab.classList.add('active');
        signinTab?.classList.remove('active');
        signupForm?.classList.remove('hidden');
        signinForm?.classList.add('hidden');
    });
    
    // ======================
    // Password strength & match
    // ======================
    const signupPassword = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const strengthDiv = document.getElementById('password-strength');
    const matchDiv = document.getElementById('password-match');
    
    signupPassword?.addEventListener('input', () => {
        const strength = getPasswordStrength(signupPassword.value);
        if (strengthDiv) {
            strengthDiv.textContent = strength.text;
            strengthDiv.style.color = strength.color;
        }
        checkPasswordMatch();
    });
    
    confirmPassword?.addEventListener('input', checkPasswordMatch);
    
    function checkPasswordMatch() {
        if (!signupPassword || !confirmPassword || !matchDiv) return;
        if (!confirmPassword.value) {
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
        return /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= 8;
    }
    
    function getPasswordStrength(password) {
        if (password.length < 6) return { text: 'Too short', color: 'red' };
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        if (hasLetter && hasNumber && hasSpecial && password.length >= 8) return { text: 'Strong password', color: '#53D500' };
        if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)) return { text: 'Medium strength', color: 'orange' };
        return { text: 'Weak password', color: 'red' };
    }
    
    // ======================
    // SIGN-IN FORM
    // ======================
    const signinFormElement = document.getElementById('signin-form');
    signinFormElement?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("signin-email")?.value?.trim();
        const password = document.getElementById("signin-password")?.value;
        
        if (!email || !password) return alert("Please fill in all fields");
        
        try {
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // ✅ Successful login
                alert("Login successful! " + data.message);
                window.location.href = "/index.html"; // redirect only on success
            } else {
                alert("Login failed: " + data.message);
            }
        } catch (error) {
            console.error("❌ Login error:", error);
            alert("Connection error: " + error.message);
        }
    });
    
    // ======================
    // SIGN-UP FORM
    // ======================
    const signupFormElement = document.getElementById('signup-form');
    signupFormElement?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById("signup-username")?.value?.trim();
        const email = document.getElementById("signup-email")?.value?.trim();
        const password = signupPassword?.value;
        const confirm = confirmPassword?.value;
        
        if (!username || !email || !password || !confirm) return alert("Please fill in all fields");
        if (password !== confirm) return alert("Passwords do not match");
        if (!isStrongPassword(password)) return alert("Password must contain letters, numbers, and special characters");
        
        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // ✅ Successful signup
                alert("Signup successful! " + data.message);
                window.location.href = "/index.html"; // redirect only on success
            } else {
                alert("Signup failed: " + data.message);
            }
        } catch (error) {
            console.error("❌ Signup error:", error);
            alert("Connection error: " + error.message);
        }
    });
    
    console.log("✅ Debug sign-in page setup complete");
});