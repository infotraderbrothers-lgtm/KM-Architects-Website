/* ===================================
   SLIDER.JS - Bottom Slider Bar Functionality
   =================================== */
const Slider = {
    container: null,
    handle: null,
    progress: null,
    
    init() {
        // Get DOM elements
        this.container = document.getElementById('sliderBarContainer');
        this.handle = document.getElementById('sliderHandle');
        this.progress = document.getElementById('sliderProgress');
        
        // Setup event listeners
        this.setupDragging();
        
        // Initial update
        this.updateSlider();
    },
    
    setupDragging() {
        // Mouse down on handle
        this.handle.addEventListener('mousedown', (e) => {
            AppState.isDragging = true;
            AppState.sliderWidth = this.container.querySelector('.slider-bar-wrapper').offsetWidth;
            this.handle.style.transition = 'none';
            this.progress.style.transition = 'none';
            AppState.track.style.transition = 'none';
            
            AppState.slides.forEach(slide => {
                slide.style.transition = 'none';
            });
            
            e.preventDefault();
        });
        
        // Mouse move (dragging)
        document.addEventListener('mousemove', (e) => {
            if (AppState.isDragging) {
                this.handleDrag(e);
            }
        });
        
        // Mouse up (stop dragging)
        document.addEventListener('mouseup', () => {
            if (AppState.isDragging) {
                AppState.isDragging = false;
                this.handle.style.transition = 'left 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
                this.progress.style.transition = 'width 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
                AppState.track.style.transition = 'transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                AppState.slides.forEach(slide => {
                    slide.style.transition = 'all 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
                });
                
                updateCarousel();
            }
        });
    },
    
    handleDrag(e) {
        const rect = this.container.querySelector('.slider-bar-wrapper').getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // Slider range is 11.5% to 88.5% = 77% usable width
        const sliderStart = AppState.sliderWidth * 0.115;
        const sliderEnd = AppState.sliderWidth * 0.885;
        const usableWidth = sliderEnd - sliderStart;
        
        // Clamp x to the usable range
        x = Math.max(sliderStart, Math.min(x, sliderEnd));
        
        // Calculate percentage within the usable range
        const relativeX = x - sliderStart;
        const percentage = (relativeX / usableWidth) * 100;
        
        // For smooth continuous scrolling, use decimal position
        const position = (percentage / 100) * (AppState.totalSlides - 1);
        const slideIndex = Math.round(position);
        
        // Update handle and progress positions (offset by 11.5%)
        const visualPercentage = 11.5 + (percentage * 0.77);
        this.handle.style.left = visualPercentage + '%';
        this.progress.style.width = (visualPercentage - 11.5) + '%';
        
        // Calculate transform based on view mode with smooth scrolling
        if (AppState.isThumbnailView) {
            const slideWidth = 16;
            const containerCenter = 50;
            const slideCenter = 7.5;
            const offset = containerCenter - (position * slideWidth + slideCenter + 0.5);
            AppState.track.style.transform = `translateX(${offset}%)`;
        } else {
            AppState.track.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
        
        AppState.currentSlide = slideIndex;
        
        // Update active nav item
        AppState.slideNavItems.forEach((item, index) => {
            item.classList.toggle('active', index === AppState.currentSlide);
        });
    },
    
    updateSlider() {
        // Map slide position to slider range (11.5% to 88.5%)
        const percentage = (AppState.currentSlide / (AppState.totalSlides - 1)) * 77 + 11.5;
        this.handle.style.left = percentage + '%';
        this.progress.style.width = (percentage - 11.5) + '%';
    }
};

// Initialize slider on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Slider.init();
});
