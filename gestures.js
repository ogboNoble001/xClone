// gestures.js
window.initSwipeGestures = function(openSidebarFn) {
    if (typeof openSidebarFn !== 'function') return; // safety
    let startX = 0;
    let startY = 0;
    let isSwipeActive = false;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        if (startX < 50) isSwipeActive = true;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isSwipeActive) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = currentX - startX;
        const deltaY = Math.abs(currentY - startY);
        if (deltaX > 80 && deltaY < 100) {
            openSidebarFn();
            isSwipeActive = false;
        }
    });
    
    document.addEventListener('touchend', () => {
        isSwipeActive = false;
    });
};