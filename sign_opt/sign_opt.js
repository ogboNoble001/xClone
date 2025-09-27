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
            
            console.log('Sign up form submitted');
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
                