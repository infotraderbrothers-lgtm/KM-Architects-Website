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
    
    const logoBox = loadingScreen.querySelector('.loading-logo-box');
    const logoLetters = loadingScreen.querySelector('.loading-logo-letters');
    const logoName = loadingScreen.querySelector('.loading-logo-name');
    const logoLine = loadingScreen.querySelector('.loading-logo-line');
    
    logoBox.style.animation = 'none';
    logoLetters.style.animation = 'none';
    logoName.style.animation = 'none';
    
    logoBox.offsetHeight;
    
    logoBox.style.animation = 'expandBox 2s ease-out forwards';
    logoLetters.style.animation = 'fadeInLetters 1s ease-out 1.5s forwards';
    logoName.style.animation = 'fadeInName 1s ease-out 2.5s forwards';
    
    setTimeout(function() {
        logoName.style.animation = 'fadeOutName 0.8s ease-out forwards';
        
        setTimeout(function() {
            logoLetters.style.animation = 'fadeOutLetters 0.8s ease-out forwards';
            logoLine.style.animation = 'fadeOutLine 0.8s ease-out forwards';
            logoBox.style.animation = 'fadeOutBox 0.8s ease-out forwards';
            
            setTimeout(function() {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 1s ease';
                
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                    loadingScreen.style.transition = '';
                    if (callback) callback();
                }, 1000);
            }, 300);
        }, 800);
    }, 3500);
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
        const logoName = loadingScreen.querySelector('.loading-logo-name');
        logoName.style.animation = 'fadeOutName 0.8s ease-out forwards';
        
        setTimeout(function() {
            const logoLetters = loadingScreen.querySelector('.loading-logo-letters');
            const logoLine = loadingScreen.querySelector('.loading-logo-line');
            const logoBox = loadingScreen.querySelector('.loading-logo-box');
            
            logoLetters.style.animation = 'fadeOutLetters 0.8s ease-out forwards';
            logoLine.style.animation = 'fadeOutLine 0.8s ease-out forwards';
            logoBox.style.animation = 'fadeOutBox 0.8s ease-out forwards';
            
            setTimeout(function() {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 1s ease';
                
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
            }, 300);
        }, 800);
    }, 3500);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
