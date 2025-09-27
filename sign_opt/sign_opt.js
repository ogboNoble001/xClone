document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputId = btn.dataset.target; // <button data-target="signup-password">
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
    
    // Password strength and match
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
    
    // Form submissions
    document.getElementById('signin-form').addEventListener('submit', e => {
        e.preventDefault();
        console.log('Sign in form submitted');
    });
    
    document.getElementById('signup-form').addEventListener('submit', e => {
        e.preventDefault();
        if (signupPassword.value !== confirmPassword.value) {
            alert('Passwords do not match');
            return;
        }
        if (!isStrongPassword(signupPassword.value)) {
            alert('Password must contain letters, numbers, and special characters.');
            return;
        }
        console.log('Sign up form submitted');
    });
    
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
});