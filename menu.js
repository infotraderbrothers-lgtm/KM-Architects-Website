// Menu functionality
window.menuOpen = false;

function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    
    menuBtn.addEventListener('click', toggleMenu);
}

function toggleMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    
    window.menuOpen = !window.menuOpen;
    
    if (window.menuOpen) {
        menuBtn.classList.add('active');
        menuOverlay.classList.add('active');
    } else {
        menuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
}
