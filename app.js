// Main application logic
window.activeIndex = 0;
window.isCarousel = false;
window.transitioning = false;
window.currentSection = 'home'; // Track current section

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
    const container = document.querySelector('.container');
    
    // Show loading screen
    loadingScreen.style.display = 'flex';
    loadingScreen.classList.remove('fade-out');
    loadingScreen.classList.add('active');
    
    // Restart KM animation
    const logoBox = loadingScreen.querySelector('.loading-logo-box');
    const logoLetters = loadingScreen.querySelector('.loading-logo-letters');
    const logoName = loadingScreen.querySelector('.loading-logo-name');
    
    logoBox.style.animation = 'none';
    logoLetters.style.animation = 'none';
    logoName.style.animation = 'none';
    
    setTimeout(() => {
        logoBox.style.animation = 'expandBox 2s ease-out forwards';
        logoLetters.style.animation = 'fadeInLetters 1s ease-out 1.5s forwards';
        logoName.style.animation = 'fadeInName 1s ease-out 2.5s forwards';
    }, 10);
    
    // Fade out after animations complete with 0.3s delay
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loadingScreen.classList.remove('active');
            if (callback) callback();
        }, 1000);
    }, 3800); // 3.5s animations + 0.3s delay
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
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(function() {
        loadingScreen.classList.add('fade-out');
        
        setTimeout(function() {
            loadingScreen.style.display = 'none';
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
                
                // Logo click handler
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
        }, 1000);
    }, 3800); // 3.5s animations + 0.3s delay
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
