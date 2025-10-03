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
        const followersContainer = document.getElementById('')
        const profileFollowing = document.getElementById('profileFollowing')
      const profileFollowers = document.getElementById('profileFollowers')
        // Show profile page
        profilePage.classList.add('active');
        const followers = new Odometer(profileFollowers, { duration: 3000 });
                const following = new Odometer(profileFollowing, { duration: 3000 });
                
                followers.set(0);
                following.set(0);
                
        // Refresh icons
        lucide.createIcons();
        

    });
}

if (profileBackBtn && profilePage) {
    profileBackBtn.addEventListener('click', () => {
        profilePage.classList.remove('active');
    });
}

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        
                        if (confirm('Are you sure you want to logout?')) {
                                localStorage.removeItem('authToken');
                                localStorage.removeItem('username');
                                localStorage.removeItem('API_URL');
                                console.log('👋 User logged out');
                                window.location.href = "/sign_opt/sign_opt.html";
                        }
                });
        }
        