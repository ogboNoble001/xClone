// AUTH CHECK - If already logged in, redirect to main page
(async function checkIfAlreadyLoggedIn() {
        // Array of possible backend URLs
        const API_URLS = [
                'https://xclone-vc7a.onrender.com',    // Production (Render)
                'http://192.168.1.5:5000',              // Your computer's local IP
                'http://192.168.1.10:5000',             // Alternative local IP
                'http://localhost:7700',                // Localhost fallback
                'http://127.0.0.1:5000'                 // Another localhost option
        ];
        
        const token = localStorage.getItem('authToken');
        
        // If no token, user needs to sign in - stay on this page
        if (!token) {
                console.log("No token found - user needs to sign in");
                return;
        }
        
        // If token exists, verify it
        for (const url of API_URLS) {
                try {
                        console.log(`🔍 Checking token with: ${url}`);
                        
                        const response = await fetch(`${url}/api/verify-token`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token }),
                                signal: AbortSignal.timeout(5000)
                        });
                        
                        if (response.ok) {
                                const data = await response.json();
                                console.log(`✅ Token valid - redirecting to main page`);
                                
                                // Save working URL
                                localStorage.setItem('API_URL', url);
                                
                                // Redirect to main page - user already logged in
                                window.location.href = "/index.html";
                                return;
                        }
                        
                } catch (error) {
                        console.log(`❌ Could not reach ${url} - trying next...`);
                }
        }
        
        // If we get here, token is invalid - remove it
        console.log("Token invalid - clearing and staying on sign in page");
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('API_URL');
        
})();

document.addEventListener('DOMContentLoaded', () => {
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
    
    signinTab.addEventListener('click', () => {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        authTitle.textContent = 'Welcome back';
        authSubtitle.textContent = 'Sign in to your account';
    });
    
    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        signinForm.classList.add('hidden');
        authTitle.textContent = 'Create account';
        authSubtitle.textContent = 'Join X today';
    });
    
    // ------------------------------
    // Password strength + match
    // ------------------------------
    const signupPassword = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('confirm-password');
    const strengthDiv = document.getElementById('password-strength');
    const matchDiv = document.getElementById('password-match');
    
    signupPassword.addEventListener('input', () => {
        const strength = getPasswordStrength(signupPassword.value);
        strengthDiv.textContent = strength.text;
        strengthDiv.style.color = strength.color;
        checkPasswordMatch();
    });
    
    confirmPassword.addEventListener('input', checkPasswordMatch);
    
    function checkPasswordMatch() {
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
    // Backend URLs (Multiple options)
    // ------------------------------
    const API_URLS = [
        'https://xclone-vc7a.onrender.com',    // Production (Render)
        'http://192.168.1.5:5000',              // Your computer's local IP
        'http://192.168.1.10:5000',             // Alternative local IP
        'http://localhost:5000',                // Localhost fallback
        'http://127.0.0.1:5000'                 // Another localhost option
    ];
    
    // Function to try each backend URL until one works
    async function tryBackendRequest(endpoint, data) {
        for (const url of API_URLS) {
            try {
                console.log(`🔍 Trying: ${url}${endpoint}`);
                
                const response = await fetch(`${url}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(10000) // 10 second timeout
                });
                
                const responseData = await response.json();
                
                // Save the working URL for future use
                localStorage.setItem('API_URL', url);
                console.log(`✅ Connected to: ${url}`);
                
                return { response, data: responseData };
                
            } catch (error) {
                console.log(`❌ Failed to reach ${url} - trying next...`);
                // Continue to next URL
            }
        }
        
        // If no backend worked
        throw new Error("Could not connect to any backend server");
    }
    
    // ------------------------------
    // Sign-in form submission
    // ------------------------------
    signinForm.addEventListener('submit', async e => {
        e.preventDefault();
        
        const signInButton = document.getElementById('signIn');
        const originalText = signInButton.textContent;
        signInButton.textContent = 'Signing in...';
        signInButton.disabled = true;
        
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;
        
        try {
            const { response, data } = await tryBackendRequest("/api/login", { email, password });
            
            if (response.ok) {
                // ✅ Login successful
                alert(data.message);
                
                // Save token and username
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                
                // Redirect to main page
                window.location.href = "/index.html";
            } else {
                // ❌ Login failed
                alert(data.message);
                signInButton.textContent = originalText;
                signInButton.disabled = false;
            }
        } catch (err) {
            alert("❌ Error: Could not connect to any server. Check your internet connection.");
            signInButton.textContent = originalText;
            signInButton.disabled = false;
        }
    });
    
    // ------------------------------
    // Sign-up form submission
    // ------------------------------
    signupForm.addEventListener('submit', async e => {
        e.preventDefault();
        
        const signUpButton = document.getElementById('signUp');
        const originalText = signUpButton.textContent;
        signUpButton.textContent = 'Creating account...';
        signUpButton.disabled = true;
        
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = signupPassword.value;
        const confirm = confirmPassword.value;
        
        if (password !== confirm) {
            alert("❌ Passwords do not match");
            signUpButton.textContent = originalText;
            signUpButton.disabled = false;
            return;
        }
        if (!isStrongPassword(password)) {
            alert("❌ Password must contain letters, numbers, and special characters");
            signUpButton.textContent = originalText;
            signUpButton.disabled = false;
            return;
        }
        
        try {
            const { response, data } = await tryBackendRequest("/api/signup", { username, email, password });
            
            if (response.ok) {
                // ✅ Signup successful
                alert(data.message + "\n\nPlease sign in with your new account.");
                
                // Switch to sign-in tab
                signinTab.click();
                
                // Pre-fill email
                document.getElementById("signin-email").value = email;
                
                signUpButton.textContent = originalText;
                signUpButton.disabled = false;
            } else {
                // ❌ Signup failed
                alert(data.message);
                signUpButton.textContent = originalText;
                signUpButton.disabled = false;
            }
        } catch (err) {
            alert("❌ Error: Could not connect to any server. Check your internet connection.");
            signUpButton.textContent = originalText;
            signUpButton.disabled = false;
        }
    });
});
