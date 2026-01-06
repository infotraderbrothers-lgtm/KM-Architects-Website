/* ===================================
   NAVIGATION.JS - Arrow Navigation & Click Zones
   =================================== */

const Navigation = {
    leftArrow: null,
    rightArrow: null,
    leftZone: null,
    rightZone: null,
    
    init() {
        // Get DOM elements
        this.leftArrow = document.getElementById('leftArrow');
        this.rightArrow = document.getElementById('rightArrow');
        this.leftZone = document.getElementById('leftZone');
        this.rightZone = document.getElementById('rightZone');
        
        // Setup event listeners
        this.setupClickHandlers();
        this.setupMouseTracking();
        this.setupKeyboardNavigation();
    },
    
    setupClickHandlers() {
        // Click zone handlers
        this.leftZone.addEventListener('click', () => this.prevSlide());
        this.rightZone.addEventListener('click', () => this.nextSlide());
        
        // Arrow click handlers
        this.leftArrow.addEventListener('click', () => this.prevSlide());
        this.rightArrow.addEventListener('click', () => this.nextSlide());
    },
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            if (!AppState.isDragging && !AppState.isThumbnailView) {
                AppState.mouseX = e.clientX;
                const mouseY = e.clientY;
                const windowWidth = window.innerWidth;
                const threshold = windowWidth * 0.15;
                const headerHeight = 100;

                // Don't show arrows in header area
                if (mouseY < headerHeight) {
                    this.hideArrows();
                    document.body.classList.remove('hide-cursor');
                } else if (AppState.mouseX < threshold) {
                    this.showLeftArrow();
                    document.body.classList.add('hide-cursor');
                } else if (AppState.mouseX > windowWidth - threshold) {
                    this.showRightArrow();
                    document.body.classList.add('hide-cursor');
                } else {
                    this.hideArrows();
                    document.body.classList.remove('hide-cursor');
                }
            } else if (AppState.isThumbnailView) {
                // Ensure cursor is normal in thumbnail view
                this.hideArrows();
                document.body.classList.remove('hide-cursor');
            }
        });
    },
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'ArrowLeft') this.prevSlide();
        });
    },
    
    showLeftArrow() {
        this.leftArrow.classList.add('show');
        this.rightArrow.classList.remove('show');
        this.leftZone.classList.add('active');
        this.rightZone.classList.remove('active');
    },
    
    showRightArrow() {
        this.rightArrow.classList.add('show');
        this.leftArrow.classList.remove('show');
        this.rightZone.classList.add('active');
        this.leftZone.classList.remove('active');
    },
    
    hideArrows() {
        this.leftArrow.classList.remove('show');
        this.rightArrow.classList.remove('show');
        this.leftZone.classList.remove('active');
        this.rightZone.classList.remove('active');
    },
    
    nextSlide() {
        if (!AppState.isNavigating) {
            AppState.isNavigating = true;
            AppState.currentSlide = (AppState.currentSlide + 1) % AppState.totalSlides;
            updateCarousel();
            setTimeout(() => AppState.isNavigating = false, 1800);
        }
    },
    
    prevSlide() {
        if (!AppState.isNavigating) {
            AppState.isNavigating = true;
            AppState.currentSlide = (AppState.currentSlide - 1 + AppState.totalSlides) % AppState.totalSlides;
            updateCarousel();
            setTimeout(() => AppState.isNavigating = false, 1800);
        }
    }
};

// Initialize navigation on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});
