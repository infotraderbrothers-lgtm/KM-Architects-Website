// Menu functionality
window.menuOpen = false;

function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuBtn.addEventListener('click', toggleMenu);
    
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const sectionName = this.textContent.toLowerCase();
            
            toggleMenu();
            
            setTimeout(function() {
                showLoadingTransition(function() {
                    navigateToSection(sectionName);
                });
            }, 500);
        });
    });
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
