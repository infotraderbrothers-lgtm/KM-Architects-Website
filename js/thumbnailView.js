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
        // ENTERING THUMBNAIL VIEW - Smooth Shrink Animation
        
        // Step 1: Fade out content smoothly (0.8s)
        AppState.slides.forEach(slide => {
            const content = slide.querySelector('.slide-content');
            if (content) {
                content.style.transition = 'opacity 0.8s ease-out';
                content.style.opacity = '0';
            }
        });
        
        // Step 2: After content fades (0.8s), apply thumbnail transformations
        setTimeout(() => {
            // Add thumbnail view class
            document.body.classList.add('thumbnail-view');
            
            // Force a reflow to ensure the class is applied
            void document.body.offsetHeight;
            
            // Update carousel with smooth transform (1.8s transition)
            updateCarousel(true);
            
            // Step 3: Show labels after everything settles (1.8s transition + 0.5s delay)
            setTimeout(() => {
                document.body.classList.add('labels-visible');
                
                // Initialize slider width
                const sliderBarContainer = document.getElementById('sliderBarContainer');
                AppState.sliderWidth = sliderBarContainer.querySelector('.slider-bar-wrapper').offsetWidth;
            }, 2300);
            
        }, 800);
    },
    
    exit() {
        // EXITING THUMBNAIL VIEW - Smooth Expand Animation
        
        // Step 1: Remove labels class
        document.body.classList.remove('labels-visible');
        
        // Step 2: Start transition back to full view
        setTimeout(() => {
            document.body.classList.remove('thumbnail-view');
            
            // Force a reflow
            void document.body.offsetHeight;
            
            // Update carousel position smoothly (1.8s transition)
            updateCarousel(true);
            
            // Step 3: Fade content back in after slides expand (1.8s + 0.3s)
            setTimeout(() => {
                AppState.slides.forEach(slide => {
                    const content = slide.querySelector('.slide-content');
                    if (content) {
                        content.style.transition = 'opacity 0.8s ease-in';
                        content.style.opacity = '1';
                    }
                });
            }, 2100);
            
        }, 200);
    }
};
// Initialize thumbnail view on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ThumbnailView.init();
});
