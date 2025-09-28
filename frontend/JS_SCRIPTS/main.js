window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        // UI elements (splash/menu)
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        // Backend URL
        const backendUrl = "https://xclone-vc7a.onrender.com";
        
        // Top nav icons toggle
        const topNavIcns = document.querySelectorAll('.topNav div');
        topNavIcns.forEach(icn => {
                icn.addEventListener('click', () => {
                        topNavIcns.forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Sidebar icons toggle
        const icns = document.querySelectorAll('.icns');
        icns.forEach(icn => {
                icn.addEventListener('click', () => {
                        icns.forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Show main UI after splash
        setTimeout(() => {
                splash.style.display = 'none';
                nav.style.display = 'flex';
                mainBody.style.display = 'flex';
                sidebar.style.display = 'block';
                sidebarOverlay.style.display = 'block';
                console.log("🖥 Main UI visible");
        }, 1050);
        
        // ==========================
        // LOGIN / SIGNUP FORMS
        // ==========================
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        
        // Sign In
        signinForm.addEventListener('submit', async e => {
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
                        
                        if (res.ok) {
                                alert(data.message);
                                // Redirect to main page after successful login
                                window.location.href = "/index.html"; // adjust to your main page path
                        } else {
                                alert(data.message);
                        }
                } catch (err) {
                        alert("❌ Error connecting to server");
                        console.error(err);
                }
        });
        
        // Sign Up
        signupForm.addEventListener('submit', async e => {
                e.preventDefault();
                const username = document.getElementById("signup-username").value;
                const email = document.getElementById("signup-email").value;
                const password = document.getElementById("signup-password").value;
                const confirm = document.getElementById("confirm-password").value;
                
                if (password !== confirm) {
                        alert("❌ Passwords do not match");
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
                        
                        if (res.ok) {
                                // Redirect to sign-in page after signup
                                window.location.href = '/sign_opt/sign_opt.html';
                        }
                        
                } catch (err) {
                        alert("❌ Error connecting to server");
                        console.error(err);
                }
        });
});