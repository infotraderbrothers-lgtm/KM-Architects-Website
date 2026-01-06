/* ===================================
   THUMBNAILVIEW.JS - Thumbnail Mode Logic & Transitions
   =================================== */

// Thumbnail view toggle functionality
const ThumbnailView = {
    init() {
        const boxButton = document.getElementById('boxButton');
        boxButton.addEventListener('click', () => this.toggle());
    },
    
    toggle() {
        AppState.isThumbnailView = !AppState.isThumbnailView;
        
        if (AppState.isThumbnailView) {
            this.enter();
        } else {
            this.exit();
        }
    },
    
    enter() {
        // ENTERING THUMBNAIL VIEW
        
        // Step 1: Fade out content immediately (0.5s)
        AppState.slides.forEach(slide => {
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.style.transition = 'opacity 0.5s ease-out';
                content.style.opacity = '0';
            }
        });
        
        // Step 2: After content fades (0.5s), apply thumbnail transformations
        setTimeout(() => {
            // Add thumbnail view class
            document.body.classList.add('thumbnail-view');
            
            // Force a reflow to ensure the class is applied
            void document.body.offsetHeight;
            
            // Update carousel with smooth transform
            updateCarousel(true);
            
            // Step 3: Show labels after everything settles (1.2s transition + 0.3s delay)
            setTimeout(() => {
                document.body.classList.add('labels-visible');
                
                // Initialize slider width
                const sliderBarContainer = document.getElementById('sliderBarContainer');
                AppState.sliderWidth = sliderBarContainer.querySelector('.slider-bar-wrapper').offsetWidth;
            }, 1500);
            
        }, 500);
    },
    
    exit() {
        // EXITING THUMBNAIL VIEW
        
        // Step 1: Remove labels class
        document.body.classList.remove('labels-visible');
        
        // Step 2: Start transition back to full view
        setTimeout(() => {
            document.body.classList.remove('thumbnail-view');
            
            // Force a reflow
            void document.body.offsetHeight;
            
            // Update carousel position smoothly
            updateCarousel(true);
            
            // Step 3: Fade content back in after slides expand (1.2s + 0.2s)
            setTimeout(() => {
                AppState.slides.forEach(slide => {
                    const content = slide.querySelector('.slide-content');
                    if (content) {
                        content.style.transition = 'opacity 0.5s ease-in';
                        content.style.opacity = '1';
                    }
                });
            }, 1400);
            
        }, 100);
    }
};

// Initialize thumbnail view on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ThumbnailView.init();
});
