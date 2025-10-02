window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        if (sidebar.classList.contains('active')) runCounters();
};

window.openSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        runCounters();
};

window.closeSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
};

// Menu item click logic
document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
                e.preventDefault();
         if(item.id === 'profileMenuBtn' || item.classList.contains('profile-menu-btn')) {
        return; // Exit early - don't add active, don't close sidebar
}
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                setTimeout(closeSidebar, 150);
        });
});


// DOMContentLoaded logic
window.addEventListener('DOMContentLoaded', () => {
        
        
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        setTimeout(() => {
                
                // ✅ Pass the global openSidebar function to gestures
                window.initSwipeGestures(window.openSidebar);
        }, 1200);
});