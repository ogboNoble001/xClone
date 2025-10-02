// Profile page functionality
const profileMenuBtn = document.getElementById('profileMenuBtn');
const profilePage = document.getElementById('profilePage');
const profileBackBtn = document.getElementById('profileBackBtn');

if (profileMenuBtn && profilePage) {
    profileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get username from localStorage
        const username = localStorage.getItem('username') || 'user';
        
        // Update profile page with user data
        document.getElementById('profileHeaderName').textContent = username;
        document.getElementById('profileName').textContent = username;
        document.getElementById('profileUsername').textContent = `@${username}`;
        document.getElementById('postAuthorName').textContent = username;
        document.getElementById('postAuthorUsername').textContent = `@${username}`;
        
        // Show profile page
        profilePage.classList.add('active');
        
        // Refresh icons
        lucide.createIcons();
        
        // Close sidebar if open
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    });
}

if (profileBackBtn && profilePage) {
    profileBackBtn.addEventListener('click', () => {
        profilePage.classList.remove('active');
    });
}