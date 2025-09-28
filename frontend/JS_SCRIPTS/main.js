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
                updateUserDisplay(data.user);
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

// Update user display in sidebar
function updateUserDisplay(user) {
        // Update sidebar username display
        const sidebarUsernames = document.querySelectorAll('.sidebar-subtitle span');
        if (sidebarUsernames[0]) {
                sidebarUsernames[0].textContent = `@${user.username}`;
        }
        
        // Update profile section username
        const profileUsername = document.querySelector('#profile .ai-c span');
        if (profileUsername) {
                profileUsername.textContent = `@${user.username}`;
        }
        
        // Update any other username displays
        document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = user.username || 'User';
        });
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
        
        if (confirm(profileInfo)) handleLogout();
}

// Display welcome message
function displayWelcomeMessage() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        console.log(`🎉 Welcome back, ${currentUser.username}!`);
        updateUserDisplay(currentUser);
}

// Add logout functionality
function addLogoutFunctionality() {
        // Make logout functions globally available
        window.logout = handleLogout;
        window.handleLogout = handleLogout;
        
        // Legacy logout button support
        const logoutButton = document.querySelector('#logout-btn');
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
        
        document.querySelectorAll('.logout-option').forEach(item => {
                item.addEventListener('click', handleLogout);
        });
}

// Main logout function (now matches the HTML handleLogout)
async function handleLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Show loading state if button exists
        if (logoutBtn) {
                logoutBtn.disabled = true;
                logoutBtn.innerHTML = '<i data-lucide="loader-2" class="menu-icon animate-spin"></i><span>Logging out...</span>';
                // Re-create icons for the loading spinner
                lucide.createIcons();
        }
        
        try {
                console.log("🔹 Logging out...");
                
                // Set flag to prevent redirect loops
                sessionStorage.setItem('userLoggedOut', 'true');
                
                const response = await fetch(`${backendUrl}/api/logout`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                
                // FORCE clear cookie on frontend (fixes Vercel deployment issue)
                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                
                // Clear all user data thoroughly
                localStorage.removeItem('currentUser');
                sessionStorage.clear();
                
                console.log("🔹 Cleared all cookies and storage data");
                
                if (response.ok) {
                        console.log("✅ Logout successful:", data.message);
                        // Small delay to ensure cookie clearing takes effect
                        setTimeout(() => {
                                window.location.href = "/sign_opt/sign_opt.html";
                        }, 100);
                } else {
                        throw new Error(data.message || 'Logout failed');
                }
                
        } catch (error) {
                console.error("❌ Error logging out:", error);
                
                // Force clear data anyway - especially important for Vercel
                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                localStorage.removeItem('currentUser');
                sessionStorage.clear();
                
                // Reset button state if it exists
                if (logoutBtn) {
                        logoutBtn.disabled = false;
                        logoutBtn.innerHTML = '<i data-lucide="log-out" class="menu-icon"></i><span>Logout</span>';
                        lucide.createIcons();
                }
                
                // Show error to user
                alert('Failed to logout properly. Please try again.');
                
                // Force redirect after a moment if button reset doesn't work
                setTimeout(() => {
                        window.location.href = "/sign_opt/sign_opt.html";
                }, 2000);
        }
}

// Legacy logout function for backward compatibility
async function logout() {
        return handleLogout();
}

// Additional features
function setupAdditionalFeatures() {
        // Periodic auth check (every 5 minutes)
        setInterval(async () => {
                try {
                        const response = await fetch(`${backendUrl}/api/auth/status`, {
                                credentials: 'include'
                        });
                        const data = await response.json();
                        
                        if (data.authenticated) {
                                localStorage.setItem('currentUser', JSON.stringify(data.user));
                                updateUserDisplay(data.user);
                        } else {
                                // User session expired
                                console.log("⚠️ Session expired, redirecting to login");
                                localStorage.removeItem('currentUser');
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                } catch (error) {
                        console.log("⚠️ Auth check failed:", error);
                }
        }, 300000); // 5 minutes
        
        // Network status logging
        window.addEventListener('online', () => console.log("🌐 Back online"));
        window.addEventListener('offline', () => console.log("📴 Gone offline"));
}

// Sidebar functions (if not defined elsewhere)
function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
}

function openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('open');
}

// Page visibility refresh
document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
                checkAuthStatus();
        }
});

// Initialize app when DOM is loaded
window.addEventListener('DOMContentLoaded', initializeApp);

// Global error handler
window.addEventListener('error', event => {
        console.error('❌ Uncaught error:', event.error);
});

// Expose functions globally for other scripts
window.appFunctions = {
        checkAuthStatus,
        handleLogout,
        logout: handleLogout, // Alias for backward compatibility
        showUserProfile,
        closeSidebar,
        openSidebar,
        updateUserDisplay
};