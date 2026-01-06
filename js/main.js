/* ===================================
   MAIN.JS - Global State & Initialization
   =================================== */
// Global state object
const AppState = {
    currentSlide: 0,
    totalSlides: 6,
    isNavigating: false,
    isThumbnailView: false,
    isDragging: false,
    mouseX: 0,
    sliderWidth: 0,
    
    // DOM Elements
    track: null,
    carouselContainer: null,
    slides: null,
    slideNavItems: null,
    
    // Initialize DOM references
    init() {
        this.track = document.getElementById('carouselTrack');
        this.carouselContainer = document.getElementById('carouselContainer');
        this.slides = document.querySelectorAll('.slide');
        this.slideNavItems = document.querySelectorAll('.slide-nav-item');
    }
};

// Utility function to update carousel position
function updateCarousel(animate = true, skipTransform = false) {
    const transitionDuration = animate ? '1.8s' : '0s';
    AppState.track.style.transition = animate ? 
        'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)' : 
        'none';
    
    // Apply transforms for each slide
    AppState.slides.forEach((slide, index) => {
        slide.style.transition = animate ? 
            'all 1.8s cubic-bezier(0.4, 0, 0.2, 1)' : 
            'none';
    });
    
    // Calculate transform based on view mode
    if (!skipTransform) {
        if (AppState.isThumbnailView) {
            // In thumbnail view, center the current slide
            const slideWidth = 16;
            const containerCenter = 50;
            const slideCenter = 7.5;
            const offset = containerCenter - (AppState.currentSlide * slideWidth + slideCenter + 0.5);
            AppState.track.style.transform = `translateX(${offset}%)`;
        } else {
            // In full view, slides are 100% width
            AppState.track.style.transform = `translateX(-${AppState.currentSlide * 100}%)`;
        }
    }
    
    // Update active nav item
    AppState.slideNavItems.forEach((item, index) => {
        item.classList.toggle('active', index === AppState.currentSlide);
    });
}

// Utility function to go to specific slide
function goToSlide(index, animate = true) {
    if (index >= 0 && index < AppState.totalSlides) {
        AppState.currentSlide = index;
        updateCarousel(animate);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    updateCarousel(false);
});
