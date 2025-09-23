// counters.js
window.formatAbbreviated = function(n) {
        if (n >= 1_000_000_000_000) return (n / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T';
        if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        return n.toString();
};

class Odometer {
        constructor(container, opts = {}) {
                this.container = container;
                this.duration = opts.duration ?? 2000;
                this.direction = opts.direction ?? 'up';
                this.current = '0';
                this.container.style.setProperty('--duration', this.duration + 'ms');
                this.container.style.display = 'inline-flex';
                this.container.style.alignItems = 'flex-end';
                this.buildSlots(this.current, this.current);
        }
        
        set(n) {
                const num = Math.max(0, Math.floor(n));
                const target = formatAbbreviated(num);
                if (target === this.current) return;
                const prev = this.current;
                this.buildSlots(prev, target);
                this.current = target;
        }
        
        buildSlots(prevStr, targetStr) {
                const prev = prevStr.split('');
                const target = targetStr.split('');
                const maxLen = Math.max(prev.length, target.length);
                const pad = (arr) => { while (arr.length < maxLen) arr.unshift('0'); return arr; };
                const p = pad(prev.slice());
                const t = pad(target.slice());
                
                this.container.innerHTML = '';
                const slots = [];
                
       for (let i = 0; i < maxLen; i++) {
                        const chP = p[i];
                        const chT = t[i];
                        
                        if (/\d/.test(chT)) {
                                const slot = document.createElement('div');
                                slot.className = 'slot digit';
                                slot.style.display = 'inline-block';
                                const inner = document.createElement('div');
                                inner.className = 'inner';
                                
                                for (let cycle = 0; cycle < 2; cycle++) {
                                        for (let d = 0; d <= 9; d++) {
                                                const s = document.createElement('span');
                                                s.textContent = d;
                                                s.style.display = 'block';
                                                s.style.lineHeight = '1em';
                                                inner.appendChild(s);
                                        }
                                }
                                
                                slot.appendChild(inner);
                                this.container.appendChild(slot);
                                slots.push({ inner, prevDigit: +chP, targetDigit: +chT });
                        } else {
                                const sep = document.createElement('div');
                                sep.className = 'slot sep';
                                sep.style.display = 'inline-block';
                                sep.style.marginLeft = '-0.2em';
                                sep.style.fontWeight = 'bold';
                                sep.style.marginBottom = '.1em';
                                sep.style.fontSize = '0.9em';
                                sep.textContent = chT;
                                this.container.appendChild(sep);
                        }
                }
                
       requestAnimationFrame(() => {
  slots.forEach(({ inner, prevDigit }) => {
                                const h = inner.querySelector('span').getBoundingClientRect().height;
                                inner.style.transform = `translateY(-${prevDigit * h}px)`;
                        });
                        
                        void this.container.offsetHeight;
                        
                        slots.forEach(({ inner, prevDigit, targetDigit }) => {
                                const h = inner.querySelector('span').getBoundingClientRect().height;
                                let from = prevDigit;
                                let to = targetDigit;
                                
                                if (this.direction === 'up') {
             if (to <= from) to += 10;
                                } else {
                                        if (to >= from) to -= 10;
                                }
                                
                                inner.style.transition = `transform ${this.duration}ms ease-in-out`;
                                inner.style.transform = `translateY(-${to * h}px)`;
                                
                                inner.addEventListener('transitionend', () => {
                                        inner.style.transition = 'none';
                                        inner.style.transform = `translateY(-${targetDigit * h}px)`;
                                }, { once: true });
                        });
                });
        }
}

window.runCounters = function() {
        const followersContainer = document.getElementById('followersCounter');
        const followingContainer = document.getElementById('followingCounter');
        
        if (!followersContainer.dataset.odometerInitialized) {
                const followers = new Odometer(followersContainer, { duration: 3000 });
                const following = new Odometer(followingContainer, { duration: 3000 });
                
                followers.set(10680000);
                following.set(390);
                
                followersContainer.dataset.odometerInitialized = true;
                followingContainer.dataset.odometerInitialized = true;
        }
};

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
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                setTimeout(closeSidebar, 150);
        });
});

// Escape key closes sidebar
document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
});

// DOMContentLoaded logic
window.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        
        const splash = document.querySelector('.prntAppPic');
        const nav = document.querySelector('nav.mainNav');
        const mainBody = document.querySelector('.mainBody');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        
        setTimeout(() => {
                splash.style.display = 'none';
                nav.style.display = 'flex';
                mainBody.style.display = 'flex';
                sidebar.style.display = 'block';
                sidebarOverlay.style.display = 'block';
                
                // ✅ Pass the global openSidebar function to gestures
                window.initSwipeGestures(window.openSidebar);
        }, 1200);
});