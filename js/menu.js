/* ===================================
   MENU.JS - Navigation Menu Panel
   =================================== */

const Menu = {
    toggle: null,
    panel: null,
    
    init() {
        // Get DOM elements
        this.toggle = document.getElementById('menuToggle');
        this.panel = document.getElementById('slideNavPanel');
        
        // Setup event listeners
        this.setupToggle();
        this.setupNavigation();
        this.setupClickOutside();
    },
    
    setupToggle() {
        this.toggle.addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });
    },
    
    setupNavigation() {
        // Slide navigation items
        AppState.slideNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const slideIndex = parseInt(item.dataset.slide);
                goToSlide(slideIndex);
                this.panel.classList.remove('active');
            });
        });
    },
    
    setupClickOutside() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && !this.toggle.contains(e.target)) {
                this.panel.classList.remove('active');
            }
        });
    }
};

// Initialize menu on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Menu.init();
});
