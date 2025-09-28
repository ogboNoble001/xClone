// main.js - Updated frontend with safe auth check

const backendUrl = "https://xclone-vc7a.onrender.com";

// Check authentication status before loading main UI
async function checkAuthStatus() {
        try {
                console.log("🔹 Checking authentication status...");
                
                const response = await fetch(`${backendUrl}/api/auth/status`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                
                if (!data.authenticated) {
                        console.log("❌ User not authenticated. Will not redirect automatically.");
                        // Return false but don't redirect immediately — let signup.js handle it
                        return false;
                }
                
                console.log("✅ User authenticated:", data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return true;
                
        } catch (error) {
                console.error("❌ Error checking auth status:", error);
                // Return false without redirect — frontend can handle offline/login page
                return false;
        }
}

// Main initialization function
async function initializeApp() {
        console.log("🔹 Initializing app...");
        
        const isAuthenticated = await checkAuthStatus();
        
        if (!isAuthenticated) {
                console.log("❌ User not authenticated. Stopping main UI initialization.");
                // Don't redirect here; signup.js already handles redirect
                return;
        }
        
        console.log("✅ Authentication successful, proceeding with app initialization");
        
        lucide.createIcons();
        
        // UI elements
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        // Top nav icons toggle
        document.querySelectorAll('.topNav div').forEach(icn => {
                icn.addEventListener('click', () => {
                        document.querySelectorAll('.topNav div').forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Profile click handler
        const profileSignIn = document.querySelector('#profile');
        if (profileSignIn) profileSignIn.addEventListener('click', showUserProfile);
        
        // Side navigation icons
        document.querySelectorAll('.icns').forEach(icn => {
                icn.addEventListener('click', () => {
                        document.querySelectorAll('.icns').forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Show main UI after splash
        setTimeout(() => {
                if (splash) splash.style.display = 'none';
                if (nav) nav.style.display = 'flex';
                if (mainBody) mainBody.style.display = 'flex';
                if (sidebar) sidebar.style.display = 'block';
                if (sidebarOverlay) sidebarOverlay.style.display = 'block';
                console.log("🖥 Main UI visible");
                
                displayWelcomeMessage();
        }, 1050);
        
        addLogoutFunctionality();
        setupAdditionalFeatures();
}

// Show user profile
function showUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const profileInfo = `
👤 Profile Information:
Name: ${currentUser.username || 'N/A'}
Email: ${currentUser.email || 'N/A'}
User ID: ${currentUser.id || 'N/A'}

Would you like to logout?`;
        
        if (confirm(profileInfo)) logout();
}

// Display welcome message
function displayWelcomeMessage() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log(`🎉 Welcome back, ${currentUser.username}!`);
        document.querySelectorAll('.user-name').forEach(el => el.textContent = currentUser.username || 'User');
}

// Add logout functionality
function addLogoutFunctionality() {
        window.logout = logout;
        
        const logoutButton = document.querySelector('#logout-btn');
        if (logoutButton) logoutButton.addEventListener('click', logout);
        
        document.querySelectorAll('.logout-option').forEach(item => item.addEventListener('click', logout));
}

// Logout
async function logout() {
        try {
                console.log("🔹 Logging out...");
                const response = await fetch(`${backendUrl}/api/logout`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                });
                
                localStorage.removeItem('currentUser');
                
                if (response.ok) {
                        console.log("✅ Logout successful");
                        window.location.href = "/sign_opt/sign_opt.html";
                } else {
                        console.error("❌ Logout failed, redirecting anyway");
                        window.location.href = "/sign_opt/sign_opt.html";
                }
        } catch (error) {
                console.error("❌ Error logging out:", error);
                localStorage.removeItem('currentUser');
                window.location.href = "/sign_opt/sign_opt.html";
        }
}

// Additional features
function setupAdditionalFeatures() {
        setInterval(async () => {
                try {
                        const response = await fetch(`${backendUrl}/api/auth/status`, { credentials: 'include' });
                        const data = await response.json();
                        if (data.authenticated) localStorage.setItem('currentUser', JSON.stringify(data.user));
                } catch {}
        }, 300000);
        
        window.addEventListener('online', () => console.log("🌐 Back online"));
        window.addEventListener('offline', () => console.log("📴 Gone offline"));
}

// Page visibility refresh
document.addEventListener('visibilitychange', () => {
        if (!document.hidden) checkAuthStatus();
});

window.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('error', event => console.error('❌ Uncaught error:', event.error));

// Expose functions
window.appFunctions = { checkAuthStatus, logout, showUserProfile };