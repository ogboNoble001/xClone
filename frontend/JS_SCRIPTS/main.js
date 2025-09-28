// main.js - Frontend with authentication check and smooth UI handling

const backendUrl = "https://xclone-vc7a.onrender.com";

// ========================
// Check if user is authenticated
// ========================
async function checkAuthStatus() {
        try {
                console.log("🔹 Checking authentication status...");
                
                const response = await fetch(`${backendUrl}/api/auth/status`, {
                        method: 'GET',
                        credentials: 'include', // include cookies
                        headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                
                if (!data.authenticated) {
                        console.log("❌ User not authenticated, redirecting to signup...");
                        window.location.href = "/sign_opt/sign_opt.html";
                        return false;
                }
                
                console.log("✅ User authenticated:", data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return true;
                
        } catch (error) {
                console.error("❌ Error checking auth status:", error);
                window.location.href = "/sign_opt/sign_opt.html";
                return false;
        }
}

// ========================
// Initialize App
// ========================
async function initializeApp() {
        console.log("🔹 Initializing app...");
        
        const isAuthenticated = await checkAuthStatus();
        if (!isAuthenticated) {
                console.log("❌ Authentication failed, stopping app initialization");
                return;
        }
        
        console.log("✅ Authentication successful, proceeding...");
        
        lucide.createIcons();
        
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
        document.querySelector('#profile')?.addEventListener('click', showUserProfile);
        
        // Side nav icons
        document.querySelectorAll('.icns').forEach(icn => {
                icn.addEventListener('click', () => {
                        document.querySelectorAll('.icns').forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Show main UI after splash
        setTimeout(() => {
                splash && (splash.style.display = 'none');
                nav && (nav.style.display = 'flex');
                mainBody && (mainBody.style.display = 'flex');
                sidebar && (sidebar.style.display = 'block');
                sidebarOverlay && (sidebarOverlay.style.display = 'block');
                console.log("🖥 Main UI visible");
                
                displayWelcomeMessage();
        }, 1050);
        
        addLogoutFunctionality();
        setupAdditionalFeatures();
}

// ========================
// User profile modal / info
// ========================
function showUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        const profileInfo = `
👤 Profile Information:
Name: ${currentUser.username || 'N/A'}
Email: ${currentUser.email || 'N/A'}
User ID: ${currentUser.id || 'N/A'}

Do you want to logout?`;
        
        if (confirm(profileInfo)) logout();
}

// ========================
// Display welcome message
// ========================
function displayWelcomeMessage() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log(`🎉 Welcome back, ${currentUser.username}!`);
        
        document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = currentUser.username || 'User';
        });
}

// ========================
// Logout functionality
// ========================
function addLogoutFunctionality() {
        window.logout = logout;
        
        document.querySelector('#logout-btn')?.addEventListener('click', logout);
        document.querySelectorAll('.logout-option').forEach(item => item.addEventListener('click', logout));
}

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
                } else {
                        console.error("❌ Logout failed, redirecting anyway");
                }
                
                window.location.href = "/sign_opt/sign_opt.html";
                
        } catch (error) {
                console.error("❌ Logout error:", error);
                localStorage.removeItem('currentUser');
                window.location.href = "/sign_opt/sign_opt.html";
        }
}

// ========================
// Additional features
// ========================
function setupAdditionalFeatures() {
        // Periodic refresh of user auth
        setInterval(async () => {
                try {
                        const response = await fetch(`${backendUrl}/api/auth/status`, { method: 'GET', credentials: 'include' });
                        const data = await response.json();
                        
                        if (data.authenticated) {
                                localStorage.setItem('currentUser', JSON.stringify(data.user));
                        } else {
                                localStorage.removeItem('currentUser');
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                } catch (error) {
                        console.error("❌ Error refreshing auth status:", error);
                }
        }, 300000); // every 5 minutes
        
        window.addEventListener('online', () => console.log("🌐 Back online"));
        window.addEventListener('offline', () => console.log("📴 Offline"));
}

// ========================
// Handle visibility change
// ========================
document.addEventListener('visibilitychange', () => {
        if (!document.hidden) checkAuthStatus();
});

// ========================
// Initialize app
// ========================
window.addEventListener('DOMContentLoaded', initializeApp);

// ========================
// Global error handler
// ========================
window.addEventListener('error', event => console.error('❌ Uncaught error:', event.error));

// ========================
// Export functions
// ========================
window.appFunctions = { checkAuthStatus, logout, showUserProfile };