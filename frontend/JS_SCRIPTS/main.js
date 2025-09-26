window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        const topNavIcns = document.querySelectorAll('.topNav div');
        
        topNavIcns.forEach((icn) => {
                icn.addEventListener('click', () => {
                        topNavIcns.forEach((otherIcn) => {
                                otherIcn.classList.remove('active');
                        });
                        icn.classList.add('active');
                });
        });
        
        const icns = document.querySelectorAll('.icns');
        icns.forEach((icn) => {
                icn.addEventListener('click', () => {
                        icns.forEach((otherIcn) => {
                                otherIcn.classList.remove('active');
                        });
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
        
fetch("https://xclone-vc7a.onrender.com/api/posts")
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
    })
    .then(posts => {
        posts.forEach(post => {
            console.log(post.text);
        });
    })
    .catch(err => console.error("Fetch Error:", err));
})