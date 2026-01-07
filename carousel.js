// Carousel management
let rotation = 0;
let targetRotation = 0;
let rotationVelocity = 0;
let isScrolling = false;

function createCarouselCards() {
    const carouselStage = document.getElementById('carouselStage');
    carouselStage.innerHTML = '';
    
    pages.forEach((page, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.style.backgroundImage = `url(${page.image})`;
        
        const label = document.createElement('div');
        label.className = 'carousel-label';
        label.innerHTML = `
            <div class="label-title">${page.title}</div>
            <div class="label-subtitle">${page.subtitle}</div>
        `;
        
        card.appendChild(label);
        carouselStage.appendChild(card);
    });
    
    updateCarousel();
}

function updateCarousel() {
    const carouselStage = document.getElementById('carouselStage');
    const cards = carouselStage.children;
    const totalCards = pages.length;
    const anglePerCard = 360 / totalCards;
    const radius = 600;

    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const newActiveIndex = Math.round(normalizedRotation / anglePerCard) % totalCards;
    
    if (newActiveIndex !== window.activeIndex) {
        window.activeIndex = newActiveIndex;
    }

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        
        // Calculate angle relative to active card being at position 0
        let relativeIndex = i - window.activeIndex;
        if (relativeIndex < 0) relativeIndex += totalCards;
        
        const angle = (relativeIndex * anglePerCard) * (Math.PI / 180);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius; // Active card at z=0
        
        const depthFactor = (z + radius) / (radius * 2);
        const baseOpacity = 0.3 + (depthFactor * 0.7);
        
        const isActive = i === window.activeIndex;
        
        // Calculate glow intensity based on position (brightest at center)
        const glowIntensity = depthFactor;
        const glowOpacity = glowIntensity * 0.6;
        
        // No scaling - cards stay at 400x400px
        card.style.transform = `translateX(${x}px) translateZ(${z}px)`;
        
        if (card.classList.contains('visible')) {
            card.style.opacity = baseOpacity;
        }
        
        card.style.zIndex = Math.round(z);
        card.style.filter = isActive ? 'brightness(1.3)' : 'brightness(0.7)';
        
        // Update glow
        if (card.classList.contains('visible')) {
            card.style.setProperty('--glow-opacity', glowOpacity);
        }
        
        const label = card.querySelector('.carousel-label');
        if (isActive && card.classList.contains('visible')) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    }
}

function animateCarousel() {
    if (window.isCarousel) {
        targetRotation += rotationVelocity;
        rotation += (targetRotation - rotation) * 0.15;
        rotationVelocity *= 0.88;
        
        updateCarousel();
    }
    
    requestAnimationFrame(animateCarousel);
}

function initCarousel() {
    const scrollBar = document.getElementById('scrollBar');
    
    scrollBar.addEventListener('mouseenter', () => {
        isScrolling = true;
        scrollBar.classList.add('active');
    });
    
    scrollBar.addEventListener('mouseleave', () => {
        isScrolling = false;
        scrollBar.classList.remove('active');
    });
    
    scrollBar.addEventListener('wheel', (e) => {
        if (isScrolling) {
            e.preventDefault();
            const maxSpeed = 2;
            const scrollDelta = Math.max(-maxSpeed, Math.min(maxSpeed, e.deltaY * 0.08));
            rotationVelocity += scrollDelta;
            rotationVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, rotationVelocity));
        }
    });
    
    animateCarousel();
}
