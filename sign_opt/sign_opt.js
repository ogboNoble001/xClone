// Complete sign-in/sign-up JavaScript with authentication
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔹 Sign-in/Sign-up page loaded");
    
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
            signupTab.classList.remove('active');
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            if (authTitle) authTitle.textContent = 'Welcome back';
            if (authSubtitle) authSubtitle.textContent = 'Sign in to your account';
        });
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            signupForm.classList.remove('hidden');
            signinForm.classList.add('hidden');
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
            matchDiv.textContent = '✅ Passwords match';
            matchDiv.style.color = '#53D500';
        } else {
            matchDiv.textContent = '❌ Passwords do not match';
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
        if (password.length < 6) return { text: 'Too short (min 6 chars)', color: 'red' };
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        
        if (hasLetter && hasNumber && hasSpecial && password.length >= 8)
            return { text: '✅ Strong password', color: '#53D500' };
        if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial))
            return { text: '⚡ Medium strength', color: 'orange' };
        return { text: '⚠️ Weak password', color: 'red' };
    }
    
    // ------------------------------
    // Backend URL
    // ------------------------------
    const backendUrl = "https://xclone-vc7a.onrender.com";
    
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
    // Loading state management
    // ------------------------------
    function setLoadingState(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input');
        
        if (loading) {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = submitBtn.textContent.includes('Sign in') ? 'Signing in...' : 'Creating account...';
            }
            inputs.forEach(input => input.disabled = true);
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.textContent.includes('Signing') ? 'Sign in' : 'Create account';
            }
            inputs.forEach(input => input.disabled = false);
        }
    }
    
    // ------------------------------
    // Show error/success messages
    // ------------------------------
    function showMessage(message, type = 'error') {
        // Remove any existing message
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 12px 16px;
            margin: 10px 0;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            ${type === 'error' 
                ? 'background-color: #fee; color: #c53030; border: 1px solid #fed7d7;' 
                : 'background-color: #f0fff4; color: #22543d; border: 1px solid #9ae6b4;'
            }
        `;
        
        // Insert message at the top of the form container
        const authContainer = document.querySelector('.auth-container') || document.body;
        authContainer.insertBefore(messageDiv, authContainer.firstChild);
        
        // Auto-remove success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }
    
    // ------------------------------
    // Sign-in form submission
    // ------------------------------
    if (signinForm) {
        signinForm.addEventListener('submit', async e => {
            e.preventDefault();
            
            const email = document.getElementById("signin-email")?.value?.trim();
            const password = document.getElementById("signin-password")?.value;
            
            // Validation
            if (!email || !password) {
                showMessage("❌ Please fill in all fields");
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage("❌ Please enter a valid email address");
                return;
            }
            
            setLoadingState(signinForm, true);
            
            try {
                console.log("🔹 Attempting to sign in...");
                
                const res = await fetch(`${backendUrl}/api/login`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    credentials: 'include', // Important: include cookies
                    body: JSON.stringify({ email, password })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    // ✅ Login successful
                    console.log("✅ Login successful");
                    showMessage(data.message, 'success');
                    
                    // Store user data
                    if (data.user) {
                        localStorage.setItem('currentUser', JSON.stringify(data.user));
                    }
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 1000);
                } else {
                    // ❌ Login failed
                    console.log("❌ Login failed:", data.message);
                    showMessage(data.message);
                }
            } catch (err) {
                console.error("❌ Sign-in error:", err);
                showMessage("❌ Error connecting to server. Please check your internet connection and try again.");
            } finally {
                setLoadingState(signinForm, false);
            }
        });
    }
    
    // ------------------------------
    // Sign-up form submission
    // ------------------------------
    if (signupForm) {
        signupForm.addEventListener('submit', async e => {
            e.preventDefault();
            
            const username = document.getElementById("signup-username")?.value?.trim();
            const email = document.getElementById("signup-email")?.value?.trim();
            const password = signupPassword?.value;
            const confirm = confirmPassword?.value;
            
            // Validation
            if (!username || !email || !password || !confirm) {
                showMessage("❌ Please fill in all fields");
                return;
            }
            
            // Username validation
            if (username.length < 2) {
                showMessage("❌ Username must be at least 2 characters long");
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage("❌ Please enter a valid email address");
                return;
            }
            
            // Password match validation
            if (password !== confirm) {
                showMessage("❌ Passwords do not match");
                return;
            }
            
            // Password strength validation
            if (!isStrongPassword(password)) {
                showMessage("❌ Password must contain at least 8 characters with letters, numbers, and special characters");
                return;
            }
            
            setLoadingState(signupForm, true);
            
            try {
                console.log("🔹 Attempting to sign up...");
                
                const res = await fetch(`${backendUrl}/api/signup`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    credentials: 'include', // Important: include cookies
                    body: JSON.stringify({ username, email, password })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    // ✅ Signup successful
                    console.log("✅ Signup successful");
                    showMessage(data.message, 'success');
                    
                    // Store user data
                    if (data.user) {
                        localStorage.setItem('currentUser', JSON.stringify(data.user));
                    }
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                        window.location.href = "/index.html";
                    }, 1000);
                } else {
                    // ❌ Signup failed
                    console.log("❌ Signup failed:", data.message);
                    showMessage(data.message);
                }
            } catch (err) {
                console.error("❌ Sign-up error:", err);
                showMessage("❌ Error connecting to server. Please check your internet connection and try again.");
            } finally {
                setLoadingState(signupForm, false);
            }
        });
    }
    
    // ------------------------------
    // Additional utility functions
    // ------------------------------
    
    // Clear form function
    function clearForm(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
            input.disabled = false;
        });
        
        // Clear password strength indicators
        if (strengthDiv) strengthDiv.textContent = '';
        if (matchDiv) matchDiv.textContent = '';
    }
    
    // Handle enter key in forms
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const activeForm = document.querySelector('form:not(.hidden)');
            if (activeForm) {
                const submitBtn = activeForm.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    e.preventDefault();
                    submitBtn.click();
                }
            }
        }
    });
    
    // Handle form reset
    const resetButtons = document.querySelectorAll('button[type="reset"]');
    resetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const form = e.target.closest('form');
            if (form) {
                setTimeout(() => clearForm(form), 10);
            }
        });
    });
    
    // Auto-focus first input
    setTimeout(() => {
        const visibleForm = document.querySelector('form:not(.hidden)');
        if (visibleForm) {
            const firstInput = visibleForm.querySelector('input:not([disabled])');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }, 100);
    
    // Handle network status
    window.addEventListener('online', () => {
        console.log("🌐 Back online");
        showMessage("✅ Connection restored", 'success');
    });
    
    window.addEventListener('offline', () => {
        console.log("📴 Gone offline");
        showMessage("❌ No internet connection. Please check your network.", 'error');
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', (e) => {
        // Clear any sensitive data if needed
        // This is optional and depends on your security requirements
    });
    
    console.log("✅ Sign-in/Sign-up page initialization complete");
});