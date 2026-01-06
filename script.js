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

let currentSlide = 0;
const totalSlides = 6;
let mouseX = 0;
let isNavigating = false;
let isThumbnailView = false;
let isDragging = false;
let sliderWidth = 0;

const slideNames = ['Home', 'Residential', 'Commercial', 'Interiors', 'Planning', 'About'];

function updateCarousel(animate = true) {
    if (!animate) {
        track.style.transition = 'none';
    } else {
        track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Calculate transform based on view mode
    if (isThumbnailView) {
        // In thumbnail view, use continuous scrolling
        // Slide width is 15% + 1% margins = 16% total
        const slideWidth = 16;
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    } else {
        // In full view, slides are 100% width
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
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
        track.style.transform = `translateX(-${position * slideWidth}%)`;
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
        // Step 1: Start fading out content immediately
        document.querySelectorAll('.slide-content').forEach(content => {
            content.style.transition = 'opacity 0.5s ease-out';
            content.style.opacity = '0';
        });
        
        // Step 2: After content fades, apply thumbnail class and transformations
        setTimeout(() => {
            document.body.classList.add('thumbnail-view');
            updateCarousel(true);
            
            // Initialize slider width after transition completes
            setTimeout(() => {
                sliderWidth = sliderBarContainer.querySelector('.slider-bar-wrapper').offsetWidth;
            }, 1200);
        }, 500);
        
    } else {
        // Step 1: Remove thumbnail view class to start transition back
        document.body.classList.remove('thumbnail-view');
        
        // Step 2: Update carousel position smoothly
        updateCarousel(true);
        
        // Step 3: Fade content back in after carousel expands
        setTimeout(() => {
            document.querySelectorAll('.slide-content').forEach(content => {
                content.style.transition = 'opacity 0.5s ease-in';
                content.style.opacity = '1';
            });
        }, 700);
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
            const slideWidth = 16; // percentage (15% slide + 1% margins)
            track.style.transform = `translateX(-${position * slideWidth}%)`;
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

// Initialize slider
updateSlider();
