function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'Hide';
    } else {
        input.type = 'password';
        button.textContent = 'Show';
    }
}

document.getElementById('signin-tab').addEventListener('click', function() {
    document.getElementById('signin-tab').classList.add('active');
    document.getElementById('signup-tab').classList.remove('active');
    document.getElementById('signin-form').classList.remove('hidden');
    document.getElementById('signup-form').classList.add('hidden');
    document.querySelector('.auth-title').textContent = 'Welcome back';
    document.querySelector('.auth-subtitle').textContent = 'Sign in to your account';
});

document.getElementById('signup-tab').addEventListener('click', function() {
    document.getElementById('signup-tab').classList.add('active');
    document.getElementById('signin-tab').classList.remove('active');
    document.getElementById('signup-form').classList.remove('hidden');
    document.getElementById('signin-form').classList.add('hidden');
    document.querySelector('.auth-title').textContent = 'Create account';
    document.querySelector('.auth-subtitle').textContent = 'Join X today';
});

document.getElementById('signin-form').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Sign in form submitted');
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    if (!isStrongPassword(password)) {
        alert('Password must contain letters, numbers, and special characters.');
        return;
    }
    console.log('Sign up form submitted');
});

document.getElementById('signup-password').addEventListener('input', checkPasswords);
document.getElementById('confirm-password').addEventListener('input', checkPasswords);

function checkPasswords() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const matchDiv = document.getElementById('password-match');
    
    if (!confirmPassword) {
        matchDiv.textContent = '';
        return;
    }
    
    if (password === confirmPassword) {
        matchDiv.textContent = 'Passwords match';
        matchDiv.style.color = '#53D500';
    } else {
        matchDiv.textContent = 'Passwords do not match';
        matchDiv.style.color = 'red';
    }
}

function isStrongPassword(password) {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return hasLetter && hasNumber && hasSpecial && password.length >= 8;
}

function getPasswordStrength(password) {
    if (password.length < 6) {
        return { text: 'Too short', color: 'red' };
    }
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (hasLetter && hasNumber && hasSpecial && password.length >= 8) {
        return { text: 'Strong password', color: '#53D500' };
    } else if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)) {
        return { text: 'Medium strength', color: 'orange' };
    } else {
        return { text: 'Weak password', color: 'red' };
    }
}

document.getElementById('signup-password').addEventListener('input', function() {
    const password = this.value;
    const strengthText = getPasswordStrength(password);
    const strengthDiv = document.getElementById('password-strength');
    strengthDiv.textContent = strengthText.text;
    strengthDiv.style.color = strengthText.color;
});

fetch("https://xclone-vc7a.onrender.com/api/db-status")
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(status => {
        console.log(`🔹 Backend status: online`);
        console.log(`🗄 MongoDB status: ${status.status}`);
    })
    .catch(err => console.error("❌ Fetch error:", err));