const backendUrl = "https://xclone-vc7a.onrender.com";

async function checkAuthStatus() {
    try {
        const response = await fetch(`${backendUrl}/api/auth/status`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
        const data = await response.json();
        if (!data.authenticated) { window.location.href = "/sign_opt/sign_opt.html"; return false; }
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return true;
    } catch (error) {
        console.error("❌ Error checking auth status:", error);
        window.location.href = "/sign_opt/sign_opt.html";
        return false;
    }
}

async function initializeApp() {
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) return;

    lucide.createIcons();
    const splash = document.querySelector('.prntAppPic');
    const nav = document.querySelector('nav.mainNav');
    const mainBody = document.querySelector('.mainBody');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const topNavIcns = document.querySelectorAll('.topNav div');
    topNavIcns.forEach(icn => icn.addEventListener('click', () => { topNavIcns.forEach(other => other.classList.remove('active')); icn.classList.add('active'); }));

    const profileSignIn = document.querySelector('#profile');
    if (profileSignIn) profileSignIn.addEventListener('click', showUserProfile);

    const icns = document.querySelectorAll('.icns');
    icns.forEach(icn => icn.addEventListener('click', () => { icns.forEach(other => other.classList.remove('active')); icn.classList.add('active'); }));

    setTimeout(() => {
        if (splash) splash.style.display = 'none';
        if (nav) nav.style.display = 'flex';
        if (mainBody) mainBody.style.display = 'flex';
        if (sidebar) sidebar.style.display = 'block';
        if (sidebarOverlay) sidebarOverlay.style.display = 'block';
        displayWelcomeMessage();
    }, 1050);

    addLogoutFunctionality();
    setupAdditionalFeatures();
}

function showUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const profileInfo = `👤 Profile Information:\nName: ${currentUser.username || 'N/A'}\nEmail: ${currentUser.email || 'N/A'}\nUser ID: ${currentUser.id || 'N/A'}\n\nWould you like to logout?`;
    if (confirm(profileInfo)) logout();
}

function displayWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log(`🎉 Welcome back, ${currentUser.username}!`);
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => element.textContent = currentUser.username || 'User');
}

function addLogoutFunctionality() {
    window.logout = logout;
    const logoutButton = document.querySelector('#logout-btn');
    if (logoutButton) logoutButton.addEventListener('click', logout);
    const logoutMenuItems = document.querySelectorAll('.logout-option');
    logoutMenuItems.forEach(item => item.addEventListener('click', logout));
}

async function logout() {
    try {
        await fetch(`${backendUrl}/api/logout`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
        localStorage.removeItem('currentUser');
        window.location.href = "/sign_opt/sign_opt.html";
    } catch (error) {
        console.error("❌ Error logging out:", error);
        localStorage.removeItem('currentUser');
        window.location.href = "/sign_opt/sign_opt.html";
    }
}

function setupAdditionalFeatures() {
    setInterval(async () => {
        try {
            const response = await fetch(`${backendUrl}/api/auth/status`, { method: 'GET', credentials: 'include' });
            const data = await response.json();
            if (data.authenticated) localStorage.setItem('currentUser', JSON.stringify(data.user));
            else { localStorage.removeItem('currentUser'); window.location.href = "/sign_opt/sign_opt.html"; }
        } catch (error) { console.error("❌ Error refreshing auth status:", error); }
    }, 300000);

    window.addEventListener('online', () => console.log("🌐 Back online"));
    window.addEventListener('offline', () => console.log("📴 Gone offline"));
}

document.addEventListener('visibilitychange', () => { if (!document.hidden) checkAuthStatus(); });
window.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('error', (event) => console.error('❌ Uncaught error:', event.error));
window.appFunctions = { checkAuthStatus, logout, showUserProfile };