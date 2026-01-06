const track = document.getElementById('carouselTrack');
const menuToggle = document.getElementById('menuToggle');
const boxButton = document.getElementById('boxButton');
const slideNavPanel = document.getElementById('slideNavPanel');
const slideNavItems = document.querySelectorAll('.slide-nav-item');
const carouselContainer = document.getElementById('carouselContainer');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
const leftZone = document.getElementById('leftZone');
const rightZone = document.getElementById('rightZone');
const sliderBarContainer = document.getElementById('sliderBarContainer');
const sliderHandle = document.getElementById('sliderHandle');
const sliderProgress = document.getElementById('sliderProgress');
const slides = document.querySelectorAll('.slide');

let currentSlide = 0;
const totalSlides = 6;
let mouseX = 0;
let isNavigating = false;
let isThumbnailView = false;
let isDragging = false;
let sliderWidth = 0;

const slideNames = ['Home', 'Residential', 'Commercial', 'Interiors', 'Planning', 'About'];

function calculateThumbnailOffset() {
    // Calculate the offset needed to center the current slide
    // Each slide is 15% width + 1% margins = 16% total
    const slideWidth = 16;
    const containerCenter = 50; // 50% of container
    const slideCenter = 7.5; // Half of 15% slide width
    
    // Offset to center current slide: center of container - (position of current slide + half its width)
    const offset = containerCenter - (currentSlide * slideWidth + slideCenter + 0.5);
    return offset;
}

function updateCarousel(animate = true, skipTransform = false) {
    // Set up transitions
    const transitionDuration = animate ? '1.2s' : '0s';
    track.style.transition = animate ? 
        'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 
        'none';
    
    // Apply transforms for each slide
    slides.forEach((slide, index) => {
        slide.style.transition = animate ? 
            'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 
            'none';
    });
    
    // Calculate transform based on view mode
    if (!skipTransform) {
        if (isThumbnailView) {
            // In thumbnail view, center the current slide
            const slideWidth = 16;
            const offset = calculateThumbnailOffset();
            track.style.transform = `translateX(${offset}%)`;
        } else {
            // In full view, slides are 100% width
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }
    
    // Update active nav item
    slideNavItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentSlide);
    });
    
    // Update slider
    updateSlider();
}

function updateCarouselContinuous(position) {
    // For smooth continuous scrolling in thumbnail view
    if (isThumbnailView) {
        const slideWidth = 16;
        const containerCenter = 50;
        const slideCenter = 7.5;
        const offset = containerCenter - (position * slideWidth + slideCenter + 0.5);
        track.style.transform = `translateX(${offset}%)`;
    }
}

function updateSlider() {
    const percentage = (currentSlide / (totalSlides - 1)) * 100;
    sliderHandle.style.left = percentage + '%';
    sliderProgress.style.width = percentage + '%';
}

function goToSlide(index, animate = true) {
    if (index >= 0 && index < totalSlides) {
        currentSlide = index;
        updateCarousel(animate);
    }
}

function nextSlide() {
    if (!isNavigating) {
        isNavigating = true;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        setTimeout(() => isNavigating = false, 1200);
    }
}

function prevSlide() {
    if (!isNavigating) {
        isNavigating = true;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        setTimeout(() => isNavigating = false, 1200);
    }
}

// Menu toggle
menuToggle.addEventListener('click', () => {
    slideNavPanel.classList.toggle('active');
});

// Box button - toggle thumbnail view with smooth transitions
boxButton.addEventListener('click', () => {
    isThumbnailView = !isThumbnailView;
    
    if (isThumbnailView) {
        // ENTERING THUMBNAIL VIEW
        
        // Step 1: Fade out content immediately (0.5s)
        slides.forEach(slide => {
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
                sliderWidth = sliderBarContainer.querySelector('.slider-bar-wrapper').offsetWidth;
            }, 1500);
            
        }, 500);
        
    } else {
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
                slides.forEach(slide => {
                    const content = slide.querySelector('.slide-content');
                    if (content) {
                        content.style.transition = 'opacity 0.5s ease-in';
                        content.style.opacity = '1';
                    }
                });
            }, 1400);
            
        }, 100);
    }
});

// Slide navigation
slideNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const slideIndex = parseInt(item.dataset.slide);
        goToSlide(slideIndex);
        slideNavPanel.classList.remove('active');
    });
});

// Slider dragging functionality
sliderHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    sliderWidth = sliderBarContainer.querySelector('.slider-bar-wrapper').offsetWidth;
    sliderHandle.style.transition = 'none';
    sliderProgress.style.transition = 'none';
    track.style.transition = 'none';
    
    slides.forEach(slide => {
        slide.style.transition = 'none';
    });
    
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const rect = sliderBarContainer.querySelector('.slider-bar-wrapper').getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, sliderWidth));
        
        const percentage = (x / sliderWidth) * 100;
        
        // For smooth continuous scrolling, use decimal position
        const position = (percentage / 100) * (totalSlides - 1);
        const slideIndex = Math.round(position);
        
        sliderHandle.style.left = percentage + '%';
        sliderProgress.style.width = percentage + '%';
        
        // Calculate transform based on view mode with smooth scrolling
        if (isThumbnailView) {
            const slideWidth = 16;
            const containerCenter = 50;
            const slideCenter = 7.5;
            const offset = containerCenter - (position * slideWidth + slideCenter + 0.5);
            track.style.transform = `translateX(${offset}%)`;
        } else {
            track.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
        
        currentSlide = slideIndex;
        
        // Update active nav item
        slideNavItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSlide);
        });
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        sliderHandle.style.transition = 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        sliderProgress.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        slides.forEach(slide => {
            slide.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        updateCarousel();
    }
});

// Mouse position tracking for arrow visibility
document.addEventListener('mousemove', (e) => {
    if (!isDragging && !isThumbnailView) {
        mouseX = e.clientX;
        const mouseY = e.clientY;
        const windowWidth = window.innerWidth;
        const threshold = windowWidth * 0.15;
        const headerHeight = 100;

        // Don't show arrows in header area
        if (mouseY < headerHeight) {
            leftArrow.classList.remove('show');
            rightArrow.classList.remove('show');
            leftZone.classList.remove('active');
            rightZone.classList.remove('active');
            document.body.classList.remove('hide-cursor');
        } else if (mouseX < threshold) {
            leftArrow.classList.add('show');
            rightArrow.classList.remove('show');
            leftZone.classList.add('active');
            rightZone.classList.remove('active');
            document.body.classList.add('hide-cursor');
        } else if (mouseX > windowWidth - threshold) {
            rightArrow.classList.add('show');
            leftArrow.classList.remove('show');
            rightZone.classList.add('active');
            leftZone.classList.remove('active');
            document.body.classList.add('hide-cursor');
        } else {
            leftArrow.classList.remove('show');
            rightArrow.classList.remove('show');
            leftZone.classList.remove('active');
            rightZone.classList.remove('active');
            document.body.classList.remove('hide-cursor');
        }
    } else if (isThumbnailView) {
        // Ensure cursor is normal in thumbnail view
        leftArrow.classList.remove('show');
        rightArrow.classList.remove('show');
        leftZone.classList.remove('active');
        rightZone.classList.remove('active');
        document.body.classList.remove('hide-cursor');
    }
});

// Click zone handlers
leftZone.addEventListener('click', prevSlide);
rightZone.addEventListener('click', nextSlide);

// Arrow click handlers
leftArrow.addEventListener('click', prevSlide);
rightArrow.addEventListener('click', nextSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!slideNavPanel.contains(e.target) && !menuToggle.contains(e.target)) {
        slideNavPanel.classList.remove('active');
    }
});

// Initialize
updateCarousel(false);
