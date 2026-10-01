(function () {
    'use strict';

    let ticking = false;

    function updateBgDim() {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const maxScroll = (window.innerHeight || 800) * 0.7;
        const p = Math.min(scrollY / maxScroll, 1);
        const dimValue = (0.12 + p * 0.68).toFixed(2);
        document.documentElement.style.setProperty('--bg-dim', dimValue);
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateBgDim);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateBgDim();
})();
