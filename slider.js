 function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        if (sidebar.classList.contains('active')){
                runCounters();
                runSidebarAnimations(); 
        } 

}
 function openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        runCounters();
        runSidebarAnimations();
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

window.runSidebarAnimations = function() {
  const username = document.querySelector('.sidebar-subtitle span:first-child');
  const sectionTitles = document.querySelectorAll('.menu-section-title');
  const menuItems = document.querySelectorAll('.menu-item');
  
  // Only animate if not already animated
  if (!username.classList.contains('animate-username')) {
    // Animate username
    username.classList.add('animate-username');
    
    // Animate section titles
    sectionTitles.forEach(title => {
      title.classList.add('animate-section-title');
    });
    
    // Animate menu items with stagger
    menuItems.forEach(item => {
      item.classList.add('animate-menu-item');
    });
  }
};