// AUTH CHECK - Run this FIRST before anything else
(async function checkAuthentication() {
        // Array of possible backend URLs - tries each one until it finds a working one
        const API_URLS = [
                'https://xclone-vc7a.onrender.com', 
                'http://192.168.1.5:5000', // Your computer's local IP
                'http://192.168.1.10:5000', // Alternative local IP
                'http://localhost:5000', // Localhost fallback
                'http://127.0.0.1:5000' // Another localhost option
        ];
        
        let workingURL = null;
        const token = localStorage.getItem('authToken');
        
        // No token? Redirect to sign in
        if (!token) {
                console.log("❌ No token found - redirecting to sign in");
                window.location.href = "/sign_opt/sign_opt.html";
                return;
        }
        
        // Try each URL until one works
        for (const url of API_URLS) {
                try {
                        console.log(`🔍 Trying backend at: ${url}`);
                        
                        const response = await fetch(`${url}/api/verify-token`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token }),
                                signal: AbortSignal.timeout(5000) // 5 second timeout
                        });
                        
                        if (response.ok) {
                                const data = await response.json();
                                console.log(`✅ Connected to backend at: ${url}`);
                                console.log("✅ User authenticated:", data.username);
                                
                                // Store the working URL for future requests
                                localStorage.setItem('API_URL', url);
                                localStorage.setItem('username', data.username);
                                
                                workingURL = url;
                                break; // Exit loop - found working backend
                        } else {
                                console.log(`❌ Auth failed at ${url} - trying next...`);
                        }
                        
                } catch (error) {
                        console.log(`❌ Could not reach ${url} - trying next...`);
                        // Continue to next URL
                }
        }
        
        // If no backend responded successfully
        if (!workingURL) {
                console.error("❌ Could not connect to any backend - redirecting to sign in");
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                localStorage.removeItem('API_URL');
                window.location.href = "/sign_opt/sign_opt.html";
        }
        
})();

// MAIN APP CODE - Runs after auth check
window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        // UI elements (splash/menu)
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        // Top nav icons toggle
        const topNavIcns = document.querySelectorAll('.topNav div');
        topNavIcns.forEach(icn => {
                icn.addEventListener('click', () => {
                        topNavIcns.forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Profile button - Logout
        const profileSignIn = document.querySelector('#profile');
        profileSignIn.addEventListener('click', () => {
                // Log out user
                localStorage.removeItem('authToken');
                localStorage.removeItem('username');
                localStorage.removeItem('API_URL');
                window.location.href = "/sign_opt/sign_opt.html";
        });
        
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
                
                // Show which backend is being used
                const apiUrl = localStorage.getItem('API_URL');
                if (apiUrl) {
                        console.log(`📡 Using backend: ${apiUrl}`);
                }
        }, 1050);
});