// main.js - Complete updated frontend with authentication check

// Backend URL - make sure this matches your backend
const backendUrl = "https://xclone-vc7a.onrender.com";

// Check authentication status before loading main UI
async function checkAuthStatus() {
        try {
                console.log("🔹 Checking authentication status...");
                
                const response = await fetch(`${backendUrl}/api/auth/status`, {
                        method: 'GET',
                        credentials: 'include', // Important: include cookies
                        headers: {
                                'Content-Type': 'application/json'
                        }
                });
                
                const data = await response.json();
                
                if (!data.authenticated) {
                        // User is not authenticated, redirect to signup page
                        console.log("❌ User not authenticated, redirecting to signup...");
                        window.location.href = "/sign_opt/sign_opt.html";
                        return false;
                }
                
                console.log("✅ User authenticated:", data.user);
                // Store user data in localStorage for easy access
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return true;
                
        } catch (error) {
                console.error("❌ Error checking auth status:", error);
                // If there's an error, redirect to signup as a safety measure
                console.log("❌ Redirecting to signup due to error");
                window.location.href = "/sign_opt/sign_opt.html";
                return false;
        }
}

// Main initialization function
async function initializeApp() {
        console.log("🔹 Initializing app...");
        
        // Check if user is authenticated first
        const isAuthenticated = await checkAuthStatus();
        
        if (!isAuthenticated) {
                // Don't proceed with app initialization if not authenticated
                console.log("❌ Authentication failed, stopping app initialization");
                return;
        }
        
        console.log("✅ Authentication successful, proceeding with app initialization");
        
        // If we reach here, user is authenticated - proceed with normal app initialization
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
        
        // Profile click handler - now shows profile instead of redirecting to signin
        const profileSignIn = document.querySelector('#profile');
        if (profileSignIn) {
                profileSignIn.addEventListener('click', () => {
                        // Show user profile or profile settings instead of signin
                        showUserProfile();
                });
        }
        
        // Side navigation icons
        const icns = document.querySelectorAll('.icns');
        icns.forEach(icn => {
                icn.addEventListener('click', () => {
                        icns.forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Show main UI after splash (keep your original timing)
        setTimeout(() => {
                if (splash) splash.style.display = 'none';
                if (nav) nav.style.display = 'flex';
                if (mainBody) mainBody.style.display = 'flex';
                if (sidebar) sidebar.style.display = 'block';
                if (sidebarOverlay) sidebarOverlay.style.display = 'block';
                console.log("🖥 Main UI visible");
                
                // Display welcome message with user info
                displayWelcomeMessage();
                
        }, 1050); // Keep your original 1050ms timing
        
        // Add logout functionality
        addLogoutFunctionality();
        
        // Add other event listeners and functionality
        setupAdditionalFeatures();
}

// Function to show user profile (you can customize this)
function showUserProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        // You can replace this alert with a proper profile modal or page
        const profileInfo = `
👤 Profile Information:
Name: ${currentUser.username || 'N/A'}
Email: ${currentUser.email || 'N/A'}
User ID: ${currentUser.id || 'N/A'}

Would you like to logout?`;
        
        if (confirm(profileInfo)) {
                logout();
        }
}

// Display welcome message
function displayWelcomeMessage() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log(`🎉 Welcome back, ${currentUser.username}!`);
        
        // You can add a toast notification or update UI to show user name
        // For example, update a user name display element if you have one
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
                element.textContent = currentUser.username || 'User';
        });
}

// Add logout functionality
function addLogoutFunctionality() {
        // Create logout function available globally
        window.logout = logout;
        
        // If you have a logout button in your UI, attach the event listener
        const logoutButton = document.querySelector('#logout-btn');
        if (logoutButton) {
                logoutButton.addEventListener('click', logout);
        }
        
        // You can also add a logout option to a dropdown menu or settings
        const logoutMenuItems = document.querySelectorAll('.logout-option');
        logoutMenuItems.forEach(item => {
                item.addEventListener('click', logout);
        });
}

// Logout function
async function logout() {
        try {
                console.log("🔹 Logging out...");
                
                const response = await fetch(`${backendUrl}/api/logout`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                                'Content-Type': 'application/json'
                        }
                });
                
                if (response.ok) {
                        console.log("✅ Logout successful");
                        // Clear local storage
                        localStorage.removeItem('currentUser');
                        // Redirect to signup page
                        window.location.href = "/sign_opt/sign_opt.html";
                } else {
                        console.error("❌ Logout failed");
                        // Still redirect as a fallback
                        localStorage.removeItem('currentUser');
                        window.location.href = "/sign_opt/sign_opt.html";
                }
        } catch (error) {
                console.error("❌ Error logging out:", error);
                // Clear local storage and redirect as fallback
                localStorage.removeItem('currentUser');
                window.location.href = "/sign_opt/sign_opt.html";
        }
}

// Setup additional features (you can add your own functionality here)
function setupAdditionalFeatures() {
        // Add any additional event listeners or functionality here
        // For example:
        
        // Refresh user data periodically (optional)
        setInterval(async () => {
                try {
                        const response = await fetch(`${backendUrl}/api/auth/status`, {
                                method: 'GET',
                                credentials: 'include'
                        });
                        const data = await response.json();
                        
                        if (data.authenticated) {
                                localStorage.setItem('currentUser', JSON.stringify(data.user));
                        } else {
                                // Session expired, redirect to login
                                localStorage.removeItem('currentUser');
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                } catch (error) {
                        console.error("❌ Error refreshing auth status:", error);
                }
        }, 300000); // Check every 5 minutes (300000ms)
        
        // Handle network connectivity issues
        window.addEventListener('online', () => {
                console.log("🌐 Back online");
        });
        
        window.addEventListener('offline', () => {
                console.log("📴 Gone offline");
        });
}

// Handle page visibility changes (optional optimization)
document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
                // Page became visible again, optionally refresh auth status
                checkAuthStatus();
        }
});

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', initializeApp);

// Handle any uncaught errors
window.addEventListener('error', (event) => {
        console.error('❌ Uncaught error:', event.error);
});

// Export functions for use in other scripts if needed
window.appFunctions = {
        checkAuthStatus,
        logout,
        showUserProfile
};