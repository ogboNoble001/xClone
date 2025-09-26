window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        // UI elements (splash/menu)
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        // Top nav icons toggle
        const topNavIcns = document.querySelectorAll('.topNav div');
        topNavIcns.forEach(icn => {
                icn.addEventListener('click', () => {
                        topNavIcns.forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Sidebar/icons toggle
        const icns = document.querySelectorAll('.icns');
        icns.forEach(icn => {
                icn.addEventListener('click', () => {
                        icns.forEach(other => other.classList.remove('active'));
                        icn.classList.add('active');
                });
        });
        
        // Show main UI after splash
        setTimeout(() => {
                splash.style.display = 'none';
                nav.style.display = 'flex';
                mainBody.style.display = 'flex';
                sidebar.style.display = 'block';
                sidebarOverlay.style.display = 'block';
                console.log("🖥 Main UI visible");
                
                // Fetch backend/MongoDB status once
                fetch("https://xclone-vc7a.onrender.com/api/db-status")
                        .then(res => {
                                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                                return res.json();
                        })
                        .then(status => {
                                console.log(`🔹 Backend status: online`);
                                console.log(`🗄 MongoDB status: ${status.status}`);
                        })
                        .catch(err => console.error("❌ Fetch error:", err));
                
        }, 1050);
});