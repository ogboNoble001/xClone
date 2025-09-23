window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const icns = document.querySelectorAll('.icns');

icns.forEach((icn) => {
        icn.addEventListener('click', () => {
                // First remove 'active' from all icons
                icns.forEach((otherIcn) => {
                        otherIcn.classList.remove('active');
                });
                // Then add 'active' to the clicked icon
                icn.classList.add('active');
        });
});
      
        setTimeout(() => {
                splash.style.display = 'none';
                nav.style.display = 'flex';
                mainBody.style.display = 'flex';
                sidebar.style.display = 'block';
                sidebarOverlay.style.display = 'block';
                

        }, 1050);
});