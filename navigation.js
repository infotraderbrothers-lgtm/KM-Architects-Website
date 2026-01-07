// Navigation between slides
function nextSlide() {
    if (!window.transitioning && !window.isCarousel) {
        window.transitioning = true;
        
        const mainImage = document.getElementById('mainImage');
        const nextImage = document.getElementById('nextImage');
        const textLayer = document.getElementById('textLayer');
        const nextTextLayer = document.getElementById('nextTextLayer');
        const mainTitle = document.getElementById('mainTitle');
        const actionBtnText = document.getElementById('actionBtnText');
        const nextTitle = document.getElementById('nextTitle');
        const nextBtnText = document.getElementById('nextBtnText');
        
        // Set up next image and text
        const newIndex = (window.activeIndex + 1) % pages.length;
        nextImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${pages[newIndex].image}')`;
        nextImage.style.display = 'block';
        nextImage.className = 'main-image positioned-right';
        
        nextTitle.textContent = pages[newIndex].description;
        nextBtnText.textContent = pages[newIndex].buttonText;
        nextTextLayer.style.display = 'flex';
        nextTextLayer.className = 'text-layer positioned-right';
        
        // Force reflow
        nextImage.offsetHeight;
        nextTextLayer.offsetHeight;
        
        // Animate both images and text
        mainImage.classList.add('slide-out-left');
        nextImage.classList.remove('positioned-right');
        nextImage.classList.add('slide-in-from-right');
        
        textLayer.classList.add('slide-out-left');
        nextTextLayer.classList.remove('positioned-right');
        nextTextLayer.classList.add('slide-in-from-right');
        
        setTimeout(() => {
            window.activeIndex = newIndex;
            
            // Disable transitions temporarily
            mainImage.style.transition = 'none';
            nextImage.style.transition = 'none';
            textLayer.style.transition = 'none';
            nextTextLayer.style.transition = 'none';
            
            // Swap images and text
            mainImage.style.backgroundImage = nextImage.style.backgroundImage;
            mainImage.className = 'main-image';
            nextImage.style.display = 'none';
            nextImage.className = 'main-image';
            
            mainTitle.textContent = pages[window.activeIndex].description;
            actionBtnText.textContent = pages[window.activeIndex].buttonText;
            textLayer.className = 'text-layer';
            nextTextLayer.style.display = 'none';
            nextTextLayer.className = 'text-layer';
            
            // Re-enable transitions after a frame
            requestAnimationFrame(() => {
                mainImage.style.transition = '';
                nextImage.style.transition = '';
                textLayer.style.transition = '';
                nextTextLayer.style.transition = '';
            });
            
            window.transitioning = false;
        }, 2000);
    }
}

function prevSlide() {
    if (!window.transitioning && !window.isCarousel) {
        window.transitioning = true;
        
        const mainImage = document.getElementById('mainImage');
        const nextImage = document.getElementById('nextImage');
        const textLayer = document.getElementById('textLayer');
        const nextTextLayer = document.getElementById('nextTextLayer');
        const mainTitle = document.getElementById('mainTitle');
        const actionBtnText = document.getElementById('actionBtnText');
        const nextTitle = document.getElementById('nextTitle');
        const nextBtnText = document.getElementById('nextBtnText');
        
        // Set up next image and text
        const newIndex = (window.activeIndex - 1 + pages.length) % pages.length;
        nextImage.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${pages[newIndex].image}')`;
        nextImage.style.display = 'block';
        nextImage.className = 'main-image positioned-left';
        
        nextTitle.textContent = pages[newIndex].description;
        nextBtnText.textContent = pages[newIndex].buttonText;
        nextTextLayer.style.display = 'flex';
        nextTextLayer.className = 'text-layer positioned-left';
        
        // Force reflow
        nextImage.offsetHeight;
        nextTextLayer.offsetHeight;
        
        // Animate both images and text
        mainImage.classList.add('slide-out-right');
        nextImage.classList.remove('positioned-left');
        nextImage.classList.add('slide-in-from-left');
        
        textLayer.classList.add('slide-out-right');
        nextTextLayer.classList.remove('positioned-left');
        nextTextLayer.classList.add('slide-in-from-left');
        
        setTimeout(() => {
            window.activeIndex = newIndex;
            
            // Disable transitions temporarily
            mainImage.style.transition = 'none';
            nextImage.style.transition = 'none';
            textLayer.style.transition = 'none';
            nextTextLayer.style.transition = 'none';
            
            // Swap images and text
            mainImage.style.backgroundImage = nextImage.style.backgroundImage;
            mainImage.className = 'main-image';
            nextImage.style.display = 'none';
            nextImage.className = 'main-image';
            
            mainTitle.textContent = pages[window.activeIndex].description;
            actionBtnText.textContent = pages[window.activeIndex].buttonText;
            textLayer.className = 'text-layer';
            nextTextLayer.style.display = 'none';
            nextTextLayer.className = 'text-layer';
            
            // Re-enable transitions after a frame
            requestAnimationFrame(() => {
                mainImage.style.transition = '';
                nextImage.style.transition = '';
                textLayer.style.transition = '';
                nextTextLayer.style.transition = '';
            });
            
            window.transitioning = false;
        }, 2000);
    }
}

function initNavigation() {
    const leftZone = document.getElementById('leftZone');
    const rightZone = document.getElementById('rightZone');
    const customCursorLeft = document.getElementById('customCursorLeft');
    const customCursorRight = document.getElementById('customCursorRight');
    
    // Mouse movement for custom cursor
    window.addEventListener('mousemove', (e) => {
        // Update custom cursor position
        customCursorLeft.style.left = (e.clientX - 16) + 'px';
        customCursorLeft.style.top = (e.clientY - 16) + 'px';
        customCursorRight.style.left = (e.clientX - 16) + 'px';
        customCursorRight.style.top = (e.clientY - 16) + 'px';

        if (window.isCarousel || window.transitioning) {
            leftZone.classList.remove('active');
            rightZone.classList.remove('active');
            document.body.classList.remove('cursor-left', 'cursor-right');
            customCursorLeft.classList.remove('active');
            customCursorRight.classList.remove('active');
            return;
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const threshold = windowWidth * 0.15;
        const headerHeight = 100;
        // Calculate the top of the text area
        const textAreaTop = windowHeight - (15 * 16);

        if (e.clientY < headerHeight || e.clientY > textAreaTop) {
            leftZone.classList.remove('active');
            rightZone.classList.remove('active');
            document.body.classList.remove('cursor-left', 'cursor-right');
            customCursorLeft.classList.remove('active');
            customCursorRight.classList.remove('active');
        } else if (e.clientX < threshold) {
            leftZone.classList.add('active');
            rightZone.classList.remove('active');
            document.body.classList.add('cursor-left');
            document.body.classList.remove('cursor-right');
            customCursorLeft.classList.add('active');
            customCursorRight.classList.remove('active');
        } else if (e.clientX > windowWidth - threshold) {
            leftZone.classList.remove('active');
            rightZone.classList.add('active');
            document.body.classList.remove('cursor-left');
            document.body.classList.add('cursor-right');
            customCursorLeft.classList.remove('active');
            customCursorRight.classList.add('active');
        } else {
            leftZone.classList.remove('active');
            rightZone.classList.remove('active');
            document.body.classList.remove('cursor-left', 'cursor-right');
            customCursorLeft.classList.remove('active');
            customCursorRight.classList.remove('active');
        }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (window.isCarousel || window.transitioning) return;
        
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Click zone navigation
    leftZone.addEventListener('click', prevSlide);
    rightZone.addEventListener('click', nextSlide);
}
