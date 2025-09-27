document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
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
    
    // Tabs
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
    
    // Password strength + match
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
    
    // Backend form submissions
    const backendUrl = "https://your-app.onrender.com"; // replace with your Render backend URL
    
    document.getElementById('signin-form').addEventListener('submit', async e => {
        e.preventDefault();
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;
        
        try {
            const res = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("❌ Error connecting to server");
        }
    });
    
    document.getElementById('signup-form').addEventListener('submit', async e => {
        e.preventDefault();
        const username = document.getElementById("signup-username").value;
        const email = document.getElementById("signup-email").value;
        const password = signupPassword.value;
        const confirm = confirmPassword.value;
        
        if (password !== confirm) {
            alert("❌ Passwords do not match");
            return;
        }
        if (!isStrongPassword(password)) {
            alert("❌ Password must contain letters, numbers, and special characters");
            return;
        }
        
        try {
            const res = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("❌ Error connecting to server");
        }
    });
});