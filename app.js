// Main application logic
window.activeIndex = 0;
window.isCarousel = false;
window.transitioning = false;
window.currentSection = 'home';

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

function showLoadingTransition(callback) {
    const loadingScreen = document.getElementById('loadingScreen');
    
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    loadingScreen.style.pointerEvents = 'all';
    loadingScreen.classList.add('transition');
    loadingScreen.classList.remove('fade-out');
    
    const logoBox = loadingScreen.querySelector('.loading-logo-box');
    const logoCornerTL = loadingScreen.querySelector('.loading-logo-corner-tl');
    const logoCornerBR = loadingScreen.querySelector('.loading-logo-corner-br');
    const logoDivider = loadingScreen.querySelector('.loading-logo-divider');
    const logoLetters = loadingScreen.querySelectorAll('.loading-logo-letter');
    const logoName = loadingScreen.querySelector('.loading-logo-name');
    
    logoCornerTL.style.opacity = '0';
    logoCornerBR.style.opacity = '0';
    logoDivider.style.opacity = '0';
    logoLetters[0].style.opacity = '0';
    logoLetters[1].style.opacity = '0';
    logoName.style.opacity = '0';
    
    setTimeout(function() {
        logoCornerTL.style.opacity = '1';
        logoCornerBR.style.opacity = '1';
        logoDivider.style.opacity = '1';
        logoLetters[0].style.opacity = '1';
        logoLetters[1].style.opacity = '1';
        
        setTimeout(function() {
            logoName.style.opacity = '1';
            logoName.style.clipPath = 'inset(0 0 0 0)';
            
            setTimeout(function() {
                logoName.style.clipPath = 'inset(0 100% 0 0)';
                logoName.style.opacity = '0';
                
                setTimeout(function() {
                    logoLetters[0].style.opacity = '0';
                    logoLetters[1].style.opacity = '0';
                    logoCornerTL.style.opacity = '0';
                    logoCornerBR.style.opacity = '0';
                    logoDivider.style.opacity = '0';
                    
                    setTimeout(function() {
                        loadingScreen.style.opacity = '0';
                        
                        setTimeout(function() {
                            loadingScreen.style.display = 'none';
                            loadingScreen.style.visibility = 'hidden';
                            loadingScreen.style.pointerEvents = 'none';
                            loadingScreen.classList.remove('transition');
                            if (callback) callback();
                        }, 1000);
                    }, 300);
                }, 1000);
            }, 1500);
        }, 500);
    }, 100);
}

function handleToggle() {
    if (window.transitioning || window.menuOpen) return;
    
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
                    showLoadingTransition(function() {
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
