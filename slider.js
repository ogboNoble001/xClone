 let firstOpenNav= true
 function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        if (sidebar.classList.contains('active')) runCounters();
        if (!firstOpenNav) {
                return
        }
        else {
      document.querySelectorAll('.menu-item').forEach(item => {
       item.classList.add('')
      })
                firstOpenNav= !firstOpenNav
        }
}
 function openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        runCounters();
}

function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
}

// Menu item click logic
document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                setTimeout(closeSidebar, 150);
        });
});

// Escape key closes sidebar
document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
});