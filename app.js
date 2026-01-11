// Main application logic
window.activeIndex = 0;
window.isCarousel = false;
window.transitioning = false;
window.currentSection = 'home';
window.sectionCarouselActive = false;

function updateContent() {
    const pageCategory = document.getElementById('pageCategory');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const mainTitle = document.getElementById('mainTitle');
    const pageDescription = document.getElementById('pageDescription');
    const actionBtnText = document.getElementById('actionBtnText');
    const mainImage = document.getElementById('mainImage');
    
    pageCategory.textContent = pages[window.activeIndex].category;
    pageSubtitle.textContent = pages[window.activeIndex].topSubtitle;
    mainTitle.textContent = pages[window.activeIndex].description;
    pageDescription.textContent = pages[window.activeIndex].pageDescription;
    actionBtnText.textContent = pages[window.activeIndex].buttonText;
    mainImage.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'' + pages[window.activeIndex].image + '\')';
}

function showFullLoadingScreen(callback) {
    const loadingScreen = document.getElementById('loadingScreen');
    
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    loadingScreen.style.pointerEvents = 'all';
    loadingScreen.classList.remove('transition');
    
    const logoBox = loadingScreen.querySelector('.loading-logo-box');
    const logoCornerTL = loadingScreen.querySelector('.loading-logo-corner-tl');
    const logoCornerBR = loadingScreen.querySelector('.loading-logo-corner-br');
    const logoDivider = loadingScreen.querySelector('.loading-logo-divider');
    const logoLetters = loadingScreen.querySelectorAll('.loading-logo-letter');
    const logoName = loadingScreen.querySelector('.loading-logo-name');
    
    logoCornerTL.style.animation = 'none';
    logoCornerBR.style.animation = 'none';
    logoDivider.style.animation = 'none';
    logoLetters[0].style.animation = 'none';
    logoLetters[1].style.animation = 'none';
    logoName.style.animation = 'none';
    
    logoCornerTL.style.opacity = '0';
    logoCornerBR.style.opacity = '0';
    logoDivider.style.opacity = '0';
    logoLetters[0].style.opacity = '0';
    logoLetters[1].style.opacity = '0';
    logoName.style.opacity = '0';
    
    logoCornerTL.offsetHeight;
    
    logoCornerTL.style.animation = 'cornerFade 1s ease-out 1s forwards, cornerFadeOut 1s ease-out 6s forwards';
    logoCornerBR.style.animation = 'cornerFade 1s ease-out 1s forwards, cornerFadeOut 1s ease-out 6s forwards';
    logoDivider.style.animation = 'dividerFade 1s ease-out 1s forwards, dividerFadeOut 1s ease-out 6s forwards';
    logoLetters[0].style.animation = 'letterFade 1s ease-out 1s forwards, letterFadeOut 1s ease-out 6s forwards';
    logoLetters[1].style.animation = 'letterFade 1s ease-out 1s forwards, letterFadeOut 1s ease-out 6s forwards';
    logoName.style.animation = 'textReveal 1.2s ease-out 2.2s forwards, textHide 1s ease-out 5s forwards';
    
    if (callback) {
        setTimeout(callback, 3500);
    }
    
    setTimeout(function() {
        loadingScreen.style.transition = 'opacity 1s ease';
        loadingScreen.style.opacity = '0';
        
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.pointerEvents = 'none';
            loadingScreen.style.transition = '';
        }, 1000);
    }, 6500);
}

function handleToggle() {
    if (window.transitioning || window.menuOpen) return;
    
    if (window.currentSection !== 'home') {
        toggleSectionCarousel();
        return;
    }
    
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
        content.classList.add('fade-out');
        header.classList.add('fade-out');
        
        setTimeout(function() {
            mainImageContainer.classList.add('shrunk');
            
            setTimeout(function() {
                const anglePerCard = 360 / pages.length;
                rotation = window.activeIndex * anglePerCard;
                targetRotation = rotation;
                updateCarousel();
                
                carouselView.classList.add('active');
                
                setTimeout(function() {
                    mainImageContainer.style.opacity = '0';
                    
                    const cards = carouselStage.children;
                    for (let i = 0; i < cards.length; i++) {
                        cards[i].classList.add('visible');
                    }
                    scrollBar.classList.add('visible');
                    updateCarousel();
                    
                    setTimeout(function() {
                        header.classList.remove('fade-out');
                        window.isCarousel = true;
                        window.transitioning = false;
                        toggleBtn.disabled = false;
                    }, 1000);
                }, 500);
            }, 2000);
        }, 1000);
    } else {
        const cards = carouselStage.children;
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.remove('visible');
        }
        scrollBar.classList.remove('visible');
        header.classList.add('fade-out');
        
        setTimeout(function() {
            updateContent();
            mainImageContainer.style.opacity = '1';
            
            setTimeout(function() {
                carouselView.classList.remove('active');
                mainImageContainer.classList.remove('shrunk');
                
                setTimeout(function() {
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

let sectionCarouselRotation = 0;
let sectionCarouselTargetRotation = 0;
let sectionCarouselVelocity = 0;
let sectionCarouselActiveIndex = 0;
let sectionCarouselScrolling = false;

function toggleSectionCarousel() {
    if (window.transitioning) return;
    
    window.transitioning = true;
    const toggleBtn = document.getElementById('toggleBtn');
    const sectionPage = document.getElementById('sectionPage');
    const sectionCarouselView = document.getElementById('sectionCarouselView');
    const header = document.getElementById('header');
    
    toggleBtn.disabled = true;
    
    if (!window.sectionCarouselActive) {
        sectionPage.style.opacity = '0';
        header.style.opacity = '0';
        
        setTimeout(function() {
            sectionPage.style.display = 'none';
            
            if (!sectionCarouselView) {
                createSectionCarousel();
            }
            
            const carouselView = document.getElementById('sectionCarouselView');
            const carouselStage = document.getElementById('sectionCarouselStage');
            const scrollBar = document.getElementById('sectionScrollBar');
            
            carouselView.style.display = 'flex';
            carouselView.classList.add('active');
            
            setTimeout(function() {
                const cards = carouselStage.children;
                for (let i = 0; i < cards.length; i++) {
                    cards[i].classList.add('visible');
                }
                scrollBar.classList.add('visible');
                header.style.opacity = '1';
                
                window.sectionCarouselActive = true;
                window.transitioning = false;
                toggleBtn.disabled = false;
            }, 1000);
        }, 500);
    } else {
        const carouselView = document.getElementById('sectionCarouselView');
        const carouselStage = document.getElementById('sectionCarouselStage');
        const scrollBar = document.getElementById('sectionScrollBar');
        
        const cards = carouselStage.children;
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.remove('visible');
        }
        scrollBar.classList.remove('visible');
        header.style.opacity = '0';
        
        setTimeout(function() {
            carouselView.classList.remove('active');
            
            setTimeout(function() {
                carouselView.style.display = 'none';
                sectionPage.style.display = 'block';
                
                setTimeout(function() {
                    sectionPage.style.opacity = '1';
                    header.style.opacity = '1';
                    window.sectionCarouselActive = false;
                    window.transitioning = false;
                    toggleBtn.disabled = false;
                }, 500);
            }, 500);
        }, 1000);
    }
}

function createSectionCarousel() {
    const container = document.querySelector('.container');
    
    const carouselView = document.createElement('div');
    carouselView.id = 'sectionCarouselView';
    carouselView.className = 'carousel-view';
    carouselView.style.display = 'none';
    
    carouselView.innerHTML = '<div class="carousel-container"><div class="carousel-stage" id="sectionCarouselStage"></div></div><div class="scroll-bar" id="sectionScrollBar"></div>';
    
    container.appendChild(carouselView);
    
    const stage = document.getElementById('sectionCarouselStage');
    
    for (let i = 0; i < sectionPages.length; i++) {
        const page = sectionPages[i];
        const card = document.createElement('div');
        card.className = 'carousel-card';
        card.style.backgroundImage = 'url(' + page.image + ')';
        card.setAttribute('data-section', page.key);
        
        const label = document.createElement('div');
        label.className = 'carousel-label';
        label.innerHTML = '<div class="label-title">' + page.title + '</div><div class="label-subtitle">' + page.subtitle + '</div>';
        
        card.appendChild(label);
        stage.appendChild(card);
        
        card.addEventListener('click', function() {
            const currentIndex = parseInt(this.parentNode.children.length);
            let cardIndex = 0;
            for (let j = 0; j < this.parentNode.children.length; j++) {
                if (this.parentNode.children[j] === this) {
                    cardIndex = j;
                    break;
                }
            }
            
            if (sectionCarouselActiveIndex === cardIndex) {
                const sectionKey = this.getAttribute('data-section');
                
                const carouselView = document.getElementById('sectionCarouselView');
                const cards = stage.children;
                for (let k = 0; k < cards.length; k++) {
                    cards[k].classList.remove('visible');
                }
                const scrollBar = document.getElementById('sectionScrollBar');
                scrollBar.classList.remove('visible');
                
                setTimeout(function() {
                    carouselView.classList.remove('active');
                    
                    setTimeout(function() {
                        carouselView.style.display = 'none';
                        window.sectionCarouselActive = false;
                        
                        const mainImageContainer = document.getElementById('mainImageContainer');
                        mainImageContainer.classList.add('shrunk');
                        mainImageContainer.style.opacity = '0';
                        
                        setTimeout(function() {
                            mainImageContainer.classList.remove('shrunk');
                            mainImageContainer.style.opacity = '1';
                            navigateToSection(sectionKey);
                        }, 2000);
                    }, 500);
                }, 1000);
            }
        });
    }
    
    const scrollBar = document.getElementById('sectionScrollBar');
    scrollBar.addEventListener('mouseenter', function() {
        sectionCarouselScrolling = true;
        scrollBar.classList.add('active');
    });
    
    scrollBar.addEventListener('mouseleave', function() {
        sectionCarouselScrolling = false;
        scrollBar.classList.remove('active');
    });
    
    scrollBar.addEventListener('wheel', function(e) {
        if (sectionCarouselScrolling) {
            e.preventDefault();
            const maxSpeed = 2;
            const scrollDelta = Math.max(-maxSpeed, Math.min(maxSpeed, e.deltaY * 0.08));
            sectionCarouselVelocity += scrollDelta;
            sectionCarouselVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, sectionCarouselVelocity));
        }
    });
    
    animateSectionCarousel();
}
function updateSectionCarousel() {
    const stage = document.getElementById('sectionCarouselStage');
    if (!stage) return;
    
    const cards = stage.children;
    const totalCards = sectionPages.length;
    const anglePerCard = 360 / totalCards;
    const radius = 600;
    const normalizedRotation = ((sectionCarouselRotation % 360) + 360) % 360;
    const newActiveIndex = Math.round(normalizedRotation / anglePerCard) % totalCards;
    
    if (newActiveIndex !== sectionCarouselActiveIndex) {
        sectionCarouselActiveIndex = newActiveIndex;
    }
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        
        let relativeIndex = i - sectionCarouselActiveIndex;
        if (relativeIndex < 0) relativeIndex += totalCards;
        
        const angle = (relativeIndex * anglePerCard) * (Math.PI / 180);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;
        
        const depthFactor = (z + radius) / (radius * 2);
        const baseOpacity = 0.3 + (depthFactor * 0.7);
        
        const isActive = i === sectionCarouselActiveIndex;
        
        const glowIntensity = depthFactor;
        const glowOpacity = glowIntensity * 0.6;
        
        card.style.transform = 'translateX(' + x + 'px) translateZ(' + z + 'px)';
        
        if (card.classList.contains('visible')) {
            card.style.opacity = baseOpacity;
        }
        
        card.style.zIndex = Math.round(z);
        card.style.filter = isActive ? 'brightness(1.3)' : 'brightness(0.7)';
        
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

function animateSectionCarousel() {
    if (window.sectionCarouselActive) {
        sectionCarouselTargetRotation += sectionCarouselVelocity;
        sectionCarouselRotation += (sectionCarouselTargetRotation - sectionCarouselRotation) * 0.15;
        sectionCarouselVelocity *= 0.88;
        
        updateSectionCarousel();
    }
    
    requestAnimationFrame(animateSectionCarousel);
}

function init() {
    const container = document.querySelector('.container');
    
    setTimeout(function() {
        container.classList.add('visible');
        
        setTimeout(function() {
            updateContent();
            createCarouselCards();
            initCarousel();
            initNavigation();
            initMenu();
            initSections();
            
            const toggleBtn = document.getElementById('toggleBtn');
            toggleBtn.addEventListener('click', handleToggle);
            
            const logo = document.querySelector('.logo');
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', function() {
                if (window.currentSection !== 'home' && !window.transitioning) {
                    showFullLoadingScreen(function() {
                        returnToHome();
                    });
                }
            });
        }, 500);
    }, 7000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
