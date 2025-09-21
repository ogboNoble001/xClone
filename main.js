window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons()
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
                
                initSwipeGestures();
        }, 1200);
});

function initSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let isSwipeActive = false;
        
        document.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                
                if (startX < 50) {
                        isSwipeActive = true;
                }
        });
        
        document.addEventListener('touchmove', (e) => {
                if (!isSwipeActive) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                
                const deltaX = currentX - startX;
                const deltaY = Math.abs(currentY - startY);
                
                if (deltaX > 80 && deltaY < 100) {
                        openSidebar();
                        isSwipeActive = false;
                }
        });
        
        document.addEventListener('touchend', () => {
                isSwipeActive = false;
        });
}

function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
}

function openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar.classList.add('active');
        overlay.classList.add('active');
}

function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
}

document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
                closeSidebar();
        }
});

document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
                e.preventDefault();
                
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                setTimeout(closeSidebar, 150);
        });
});