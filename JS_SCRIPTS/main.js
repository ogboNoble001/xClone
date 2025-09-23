window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('.nav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        setTimeout(() => {
                splash.style.display = 'none';
                nav.style.display = 'flex';
                mainBody.style.display = 'flex';
                sidebar.style.display = 'block';
                sidebarOverlay.style.display = 'block';
                

        }, 1050);
});