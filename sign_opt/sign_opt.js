document.addEventListener('DOMContentLoaded', () => {
    const backendUrl = "https://xclone-vc7a.onrender.com";
    
    async function checkExistingAuth() {
        try {
            const res = await fetch(`${backendUrl}/api/auth/status`, { credentials: 'include' });
            const data = await res.json();
            if (data.authenticated) {
                window.location.href = "/index.html";
            }
        } catch (err) {
            console.error("❌ Error checking auth:", err);
        }
    }
    checkExistingAuth();
    
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    if (signinTab && signupTab && signinForm && signupForm) {
        signinTab.addEventListener('click', () => {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        });
        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            signupForm.classList.remove('hidden');
            signinForm.classList.add('hidden');
        });
    }
    
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.dataset.target;
            const input = document.getElementById(inputId);
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
            btn.textContent = input.type === 'password' ? 'Show' : 'Hide';
        });
    });
    
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
    if (confirmPassword) confirmPassword.addEventListener('input', checkPasswordMatch);
    
    function checkPasswordMatch() {
        if (!signupPassword || !confirmPassword || !matchDiv) return;
        if (confirmPassword.value === '') { matchDiv.textContent = ''; return; }
        if (signupPassword.value === confirmPassword.value) {
            matchDiv.textContent = 'Passwords match';
            matchDiv.style.color = '#53D500';
        } else {
            matchDiv.textContent = 'Passwords do not match';
            matchDiv.style.color = 'red';
        }
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
    
    function isStrongPassword(password) { return getPasswordStrength(password).text === 'Strong password'; }
    
    const signinFormElement = document.getElementById('signin-form');
    if (signinFormElement) signinFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById("signin-email")?.value?.trim();
        const password = document.getElementById("signin-password")?.value;
        if (!email || !password) { alert("Please fill in all fields"); return; }
        try {
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) window.location.href = "/index.html";
            else alert("Login failed: " + data.message);
        } catch (error) {
            console.error("❌ Detailed error:", error);
            alert("Connection error: " + error.message);
        }
    });
    
    const signupFormElement = document.getElementById('signup-form');
    if (signupFormElement) signupFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById("signup-username")?.value?.trim();
        const email = document.getElementById("signup-email")?.value?.trim();
        const password = signupPassword?.value;
        const confirm = confirmPassword?.value;
        if (!username || !email || !password || !confirm) { alert("Please fill in all fields"); return; }
        if (password !== confirm) { alert("Passwords do not match"); return; }
        if (!isStrongPassword(password)) { alert("Password must be strong: letters, numbers, and special characters, min 8 chars"); return; }
        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (response.ok) window.location.href = "/index.html";
            else alert("Signup failed: " + data.message);
        } catch (error) {
            console.error("❌ Detailed error:", error);
            alert("Connection error: " + error.message);
        }
    });
});