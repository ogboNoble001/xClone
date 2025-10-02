(function initTheme() {
        var xIcon = document.querySelector('.xIcon')
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme')
        xIcon.src='/frontend/res/x-social-media-white-icon.png'
        localStorage.setItem('theme', 'dark');
        const counters= document.querySelectorAll('.counter')
        counters.forEach((counter) =>  {
             counter.style.color='#fff1f2'
        })
        
        }
        else{
                localStorage.setItem('theme', 'light');
                   xIcon.src='/frontend/res/file_00000000d1bc6243b622c7897a43e5b3.png'
        }
})();

// COOKIE CONSENT CHECK
(function checkCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        const cookieBanner = document.getElementById('cookieBanner');
        
        // If user hasn't chosen yet, show banner after a delay
        if (!cookieConsent && cookieBanner) {
                setTimeout(() => {
                        cookieBanner.classList.add('show');
                }, 1000);
        }
        
        // Accept button
        const acceptBtn = document.getElementById('cookieAccept');
        if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                        localStorage.setItem('cookieConsent', 'accepted');
                        cookieBanner.classList.remove('show');
                        console.log('✅ Cookies accepted');
                });
        }
        
        // Decline button
        const declineBtn = document.getElementById('cookieDecline');
        if (declineBtn) {
                declineBtn.addEventListener('click', () => {
                        localStorage.setItem('cookieConsent', 'declined');
                        cookieBanner.classList.remove('show');
                        console.log('❌ Cookies declined');
                });
        }
})();

// AUTH CHECK - Run this BEFORE anything else
(async function checkAuthentication() {
        // Array of possible backend URLs
        const API_URLS = [
                'https://xclone-vc7a.onrender.com',
                'http://192.168.1.5:5000',
                'http://192.168.1.10:5000',
                'http://localhost:5000',
                'http://127.0.0.1:5000'
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
                                signal: AbortSignal.timeout(5000)
                        });
                        
                        if (response.ok) {
                                const data = await response.json();
                                console.log(`✅ Connected to backend at: ${url}`);
                                console.log("✅ User authenticated:", data.username);
                                
                                localStorage.setItem('API_URL', url);
                                localStorage.setItem('username', data.username);
                                
                                workingURL = url;
                                break;
                        } else {
                                console.log(`❌ Auth failed at ${url} - trying next...`);
                        }
                        
                } catch (error) {
                        console.log(`❌ Could not reach ${url} - trying next...`);
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

// MAIN APP CODE
window.addEventListener('DOMContentLoaded', () => {
      const profileName= document.querySelector('#profileName')  
        lucide.createIcons();
        
        // Display username from localStorage
        const username = localStorage.getItem('username');
        if (username) {
                const usernameDisplay = document.getElementById('usernameDisplay');
                const sidebarUsername = document.getElementById('sidebarUsername');
                if (usernameDisplay) usernameDisplay.textContent = `@${username}`;
                if (sidebarUsername) sidebarUsername.textContent = `@${username}`;
                if (sidebarUsername) profileName.textContent= `@${username}`
        }
        
        // Theme toggle functionality
        const themeToggleSidebar = document.getElementById('themeToggleSidebar');
 
        
        
        if (themeToggleSidebar) {
                // Set initial state
                const currentTheme = localStorage.getItem('theme') || 'dark';
                if (currentTheme === 'dark') {
                        sidebarSunIcon.style.display = 'none';
                        sidebarMoonIcon.style.display = 'block';
                        themeToggleText.textContent = 'Light Mode';
                }
                
                // Toggle theme on click
                themeToggleSidebar.addEventListener('click', (e) => {
                        e.preventDefault();
                        document.body.classList.toggle('dark-theme');
                        
                        if (document.body.classList.contains('dark-theme')) {
                                localStorage.setItem('theme', 'dark');
                                sidebarSunIcon.style.display = 'none';
                                sidebarMoonIcon.style.display = 'block';
                                themeToggleText.textContent = 'Light Mode';
                        } else {
                                localStorage.setItem('theme', 'light');
                                sidebarSunIcon.style.display = 'block';
                                sidebarMoonIcon.style.display = 'none';
                                themeToggleText.textContent = 'Dark Mode';
                        }
                        
                        lucide.createIcons();
                });
        }
        
        // UI elements
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
        


        // Bottom nav icons
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
                
                const apiUrl = localStorage.getItem('API_URL');
                if (apiUrl) {
                        console.log(`📡 Using backend: ${apiUrl}`);
                }
                
                lucide.createIcons();
        }, 1050);
});
