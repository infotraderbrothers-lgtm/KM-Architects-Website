// Main application logic
window.activeIndex = 0;
window.isCarousel = false;
window.transitioning = false;

function updateContent() {
    const mainTitle = document.getElementById('mainTitle');
    const actionBtnText = document.getElementById('actionBtnText');
    const mainImage = document.getElementById('mainImage');
    
    mainTitle.textContent = pages[window.activeIndex].description;
    actionBtnText.textContent = pages[window.activeIndex].buttonText;
    mainImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${pages[window.activeIndex].image}')`;
}

function handleToggle() {
    if (window.transitioning) return;
    
    window.transitioning = true;
    const toggleBtn = document.getElementById('toggleBtn');
    const header = document.getElementById('header');
    const content = document.getElementById('content');
    const mainImageContainer = document.getElementById('mainImageContainer');
    const carouselView = document.getElementById('carouselView');
    const carouselStage = document.getElementById('carouselStage');
    const scrollBar = document.getElementById('scrollBar');
    
    toggleBtn.disabled = true;

    if (!window.isCarousel) {
        // SHRINK SEQUENCE
        content.classList.add('fade-out');
        header.classList.add('fade-out');
        
        setTimeout(() => {
            mainImageContainer.classList.add('shrunk');
            
            setTimeout(() => {
                // Set carousel rotation to match current activeIndex before showing
                const anglePerCard = 360 / pages.length;
                rotation = window.activeIndex * anglePerCard;
                targetRotation = rotation;
                updateCarousel();
                
                carouselView.classList.add('active');
                
                setTimeout(() => {
                    mainImageContainer.style.opacity = '0';
                    
                    const cards = carouselStage.children;
                    for (let card of cards) {
                        card.classList.add('visible');
                    }
                    scrollBar.classList.add('visible');
                    updateCarousel();
                    
                    setTimeout(() => {
                        header.classList.remove('fade-out');
                        window.isCarousel = true;
                        window.transitioning = false;
                        toggleBtn.disabled = false;
                    }, 1000);
                }, 500);
            }, 2000);
        }, 1000);
    } else {
        // GROW SEQUENCE
        const cards = carouselStage.children;
        for (let card of cards) {
            card.classList.remove('visible');
        }
        scrollBar.classList.remove('visible');
        header.classList.add('fade-out');
        
        setTimeout(() => {
            updateContent();
            mainImageContainer.style.opacity = '1';
            
            setTimeout(() => {
                carouselView.classList.remove('active');
                mainImageContainer.classList.remove('shrunk');
                
                setTimeout(() => {
                    content.classList.remove('fade-out');
                    header.classList.remove('fade-out');
                    
                    window.isCarousel = false;
                    window.transitioning = false;
                    toggleBtn.disabled = false;
                }, 2000);
            }, 500);
        }, 1000);
    }
}

function init() {
    // Wait for logo animation to complete before showing main site
    const loadingScreen = document.getElementById('loadingScreen');
    const container = document.querySelector('.container');
    
    // Logo fades in (1s) + shines (2s) = 3s total, then fade out
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // After loading screen fades out, show main container
        setTimeout(() => {
            container.classList.add('visible');
            
            // Initialize main application
            updateContent();
            createCarouselCards();
            initCarousel();
            initNavigation();
            
            const toggleBtn = document.getElementById('toggleBtn');
            toggleBtn.addEventListener('click', handleToggle);
        }, 1000); // Wait for fade out to complete
    }, 3000); // Logo animation duration
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
