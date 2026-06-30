// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            // For a production app, we would add a CSS class to animate the mobile menu.
            // For now, simple toggle of display style.
            const currentDisplay = window.getComputedStyle(navLinks).display;
            
            if (currentDisplay === 'none') {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(15, 23, 42, 0.95)';
                navLinks.style.backdropFilter = 'blur(16px)';
                navLinks.style.padding = '1rem 0';
                navLinks.style.borderBottom = '1px solid var(--surface-border)';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }

    // Window resize handler to reset menu styles
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'row';
            navLinks.style.position = 'static';
            navLinks.style.background = 'transparent';
            navLinks.style.padding = '0';
            navLinks.style.borderBottom = 'none';
        } else if (navLinks) {
            navLinks.style.display = 'none';
        }
    });
});
