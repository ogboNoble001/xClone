document.addEventListener('DOMContentLoaded', () => {
    // THEME TOGGLE FUNCTIONALITY - Run this FIRST
(function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const xIcon =document.querySelector('.main-logo')
    const body = document.body;
    
    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        xIcon.src='/frontend/res/x-social-media-white-icon.png'
    }
    
    // Toggle theme
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            
            if (body.classList.contains('dark-theme')) {
                xIcon.src='/frontend/res/x-social-media-white-icon.png'
                localStorage.setItem('theme', 'dark');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                xIcon.src='/frontend/res/file_00000000d1bc6243b622c7897a43e5b3.png'
                localStorage.setItem('theme', 'light');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }
})();
    // ------------------------------
    // Feedback helper
    // ------------------------------
    function showFeedback(elementId, message, type = "error") {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = message;
        el.className = `form-feedback ${type}`;
        el.style.display = "block";
    }
    
    function clearFeedback(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = "";
            el.style.display = "none";
        }
    }
    
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
        clearFeedback("signup-feedback");
    });
    
    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        signinForm.classList.add('hidden');
        authTitle.textContent = 'Create account';
        authSubtitle.textContent = 'Join X today';
        clearFeedback("signin-feedback");
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
    // Backend URLs
    // ------------------------------
    const API_URLS = [
        'https://xclone-vc7a.onrender.com',
        'http://192.168.1.5:5000',
        'http://192.168.1.10:5000',
        'http://localhost:5000',
        "http://127.0.0.1:3000"
    ];
    
    async function tryBackendRequest(endpoint, data) {
        for (const url of API_URLS) {
            try {
                const response = await fetch(`${url}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    signal: AbortSignal.timeout(10000)
                });
                
                const responseData = await response.json();
                localStorage.setItem('API_URL', url);
                return { response, data: responseData };
            } catch (error) {
                console.log(`❌ Failed to reach ${url} - trying next...`);
            }
        }
        throw new Error("Could not connect to any backend server");
    }
    
    // ------------------------------
    // Sign-in form submission
    // ------------------------------
    signinForm.addEventListener('submit', async e => {
        e.preventDefault();
        clearFeedback("signin-feedback");
        
        const signInButton = document.getElementById('signIn');
        const originalText = signInButton.textContent;
        signInButton.textContent = 'Signing in...';
        signInButton.disabled = true;
        
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;
        
        try {
            const { response, data } = await tryBackendRequest("/api/login", { email, password });
            
            if (response.ok) {
                showFeedback("signin-feedback", data.message, "success");
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);
                setTimeout(() => window.location.href = "/index.html", 1000);
            } else {
                showFeedback("signin-feedback", data.message, "error");
                signInButton.textContent = originalText;
                signInButton.disabled = false;
            }
        } catch (err) {
            showFeedback("signin-feedback", " Check your internet connection.", "error");
            signInButton.textContent = originalText;
            signInButton.disabled = false;
        }
    });
    
    // ------------------------------
    // Sign-up form submission
    // ------------------------------
    signupForm.addEventListener('submit', async e => {
        e.preventDefault();
        clearFeedback("signup-feedback");
        
        const signUpButton = document.getElementById('signUp');
        const originalText = signUpButton.textContent;
        signUpButton.textContent = 'Creating account...';
        signUpButton.disabled = true;
        
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = signupPassword.value;
        const confirm = confirmPassword.value;
        
        if (password !== confirm) {
            showFeedback("signup-feedback", "Passwords do not match", "error");
            signUpButton.textContent = originalText;
            signUpButton.disabled = false;
            return;
        }
        if (!isStrongPassword(password)) {
            showFeedback("signup-feedback", " Password must contain letters, numbers, and special characters", "error");
            signUpButton.textContent = originalText;
            signUpButton.disabled = false;
            return;
        }
        
        try {
            const { response, data } = await tryBackendRequest("/api/signup", { username, email, password });
            
            if (response.ok) {
                showFeedback("signup-feedback", data.message + " Please sign in with your new account.", "success");
                setTimeout(() => {
                    signinTab.click();
                    document.getElementById("signin-email").value = email;
                }, 1200);
                signUpButton.textContent = originalText;
                signUpButton.disabled = false;
            } else {
                showFeedback("signup-feedback", data.message, "error");
                signUpButton.textContent = originalText;
                signUpButton.disabled = false;
            }
        } catch (err) {
            showFeedback("signup-feedback", "Check your internet connection.", "error");
            signUpButton.textContent = originalText;
            signUpButton.disabled = false;
        }
    });
});