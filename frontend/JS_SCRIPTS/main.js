// THEME INIT
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
    } else {
        localStorage.setItem('theme', 'light');
        xIcon.src='/frontend/res/file_00000000d1bc6243b622c7897a43e5b3.png'
    }
})();

// COOKIE CONSENT
(function checkCookieConsent() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    const cookieBanner = document.getElementById('cookieBanner');
    if (!cookieConsent && cookieBanner) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    const acceptBtn = document.getElementById('cookieAccept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }
    const declineBtn = document.getElementById('cookieDecline');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
})();

// AUTH CHECK WITH RETRIES
(async function checkAuthentication() {
    const API_URLS = [
        'https://xclone-vc7a.onrender.com',
        'http://localhost:5000'
    ];
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = "/sign_opt/sign_opt.html";
        return;
    }

    let workingURL = null;
    const MAX_RETRIES = 5;

    async function tryVerify(url) {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                console.log(`🔍 Trying ${url} (Attempt ${attempt}/${MAX_RETRIES})`);
                const response = await fetch(`${url}/api/verify-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                    signal: AbortSignal.timeout(5000)
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Authenticated via ${url}`);
                    localStorage.setItem('API_URL', url);
                    localStorage.setItem('username', data.username);
                    return true;
                } else {
                    console.warn(`❌ Auth failed (status ${response.status})`);
                }
            } catch (err) {
                console.warn(`⚠️ Attempt ${attempt} failed:`, err.message);
            }
            await new Promise(res => setTimeout(res, 1000)); // wait 1s before retry
        }
        return false;
    }

    for (const url of API_URLS) {
        if (await tryVerify(url)) {
            workingURL = url;
            break;
        }
    }

    if (!workingURL) {
        console.error("❌ Could not connect after all retries - redirecting");
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

    const username = localStorage.getItem('username');
    if (username) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        const sidebarUsername = document.getElementById('sidebarUsername');
        if (usernameDisplay) usernameDisplay.textContent = `@${username}`;
        if (sidebarUsername) sidebarUsername.textContent = `@${username}`;
        if (sidebarUsername) profileName.textContent= `@${username}`
    }

    const themeToggleSidebar = document.getElementById('themeToggleSidebar');
    if (themeToggleSidebar) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        if (currentTheme === 'dark') {
            sidebarSunIcon.style.display = 'none';
            sidebarMoonIcon.style.display = 'block';
            themeToggleText.textContent = 'Light Mode';
        }
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

    const splash = document.querySelector('.prntAppPic');
    const nav = document.querySelector('nav.mainNav');
    const mainBody = document.querySelector('.mainBody');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    const topNavIcns = document.querySelectorAll('.topNav div');
    topNavIcns.forEach(icn => {
        icn.addEventListener('click', () => {
            topNavIcns.forEach(other => other.classList.remove('active'));
            icn.classList.add('active');
        });
    });

    const icns = document.querySelectorAll('.icns');
    icns.forEach(icn => {
        icn.addEventListener('click', () => {
            icns.forEach(other => other.classList.remove('active'));
            icn.classList.add('active');
        });
    });

    setTimeout(() => {
        splash.style.display = 'none';
        nav.style.display = 'flex';
        mainBody.style.display = 'flex';
        sidebar.style.display = 'block';
        sidebarOverlay.style.display = 'block';
        console.log("🖥 Main UI visible");
        const apiUrl = localStorage.getItem('API_URL');
        if (apiUrl) console.log(`📡 Using backend: ${apiUrl}`);
        lucide.createIcons();
    }, 1050);
});