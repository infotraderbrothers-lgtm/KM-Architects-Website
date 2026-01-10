// Section page management

function initSections() {
    window.currentSection = 'home';
}

function navigateToSection(sectionName) {
    window.currentSection = sectionName;
    
    const container = document.querySelector('.container');
    const sectionPage = document.getElementById('sectionPage');
    const mainImageContainer = document.getElementById('mainImageContainer');
    const content = document.getElementById('content');
    const toggleBtn = document.getElementById('toggleBtn');
    
    mainImageContainer.style.display = 'none';
    content.style.display = 'none';
    toggleBtn.style.display = 'none';
    
    sectionPage.style.display = 'block';
    sectionPage.innerHTML = '';
    
    const sectionData = sectionsData[sectionName];
    
    if (sectionName === 'portfolio') {
        createPortfolioSection(sectionPage, sectionData);
    } else {
        createStandardSection(sectionPage, sectionData);
    }
    
    sectionPage.scrollTop = 0;
    
    container.classList.add('visible');
}

function createStandardSection(container, data) {
    const heroSection = document.createElement('div');
    heroSection.className = 'section-hero';
    heroSection.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'' + data.heroImage + '\')';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'section-hero-content';
    heroContent.innerHTML = '<div class="page-category">' + data.category + '</div><div class="page-subtitle">' + data.topSubtitle + '</div><h1 class="main-title">' + data.title + '</h1><p class="page-description">' + data.description + '</p>';
    
    heroSection.appendChild(heroContent);
    container.appendChild(heroSection);
    
    const contentSection = document.createElement('div');
    contentSection.className = 'section-content';
    
    data.contentBlocks.forEach(function(block) {
        if (block.type === 'text') {
            const textBlock = document.createElement('div');
            textBlock.className = 'content-block text-block';
            textBlock.innerHTML = '<h2>' + block.heading + '</h2><p>' + block.text + '</p>';
            contentSection.appendChild(textBlock);
        } else if (block.type === 'image') {
            const imageBlock = document.createElement('div');
            imageBlock.className = 'content-block image-block';
            imageBlock.innerHTML = '<img src="' + block.image + '" alt="' + block.alt + '">' + (block.caption ? '<p class="image-caption">' + block.caption + '</p>' : '');
            contentSection.appendChild(imageBlock);
        } else if (block.type === 'list') {
            const listBlock = document.createElement('div');
            listBlock.className = 'content-block list-block';
            const listItems = block.items.map(function(item) { return '<li>' + item + '</li>'; }).join('');
            listBlock.innerHTML = '<h2>' + block.heading + '</h2><ul>' + listItems + '</ul>';
            contentSection.appendChild(listBlock);
        } else if (block.type === 'grid') {
            const gridBlock = document.createElement('div');
            gridBlock.className = 'content-block grid-block';
            const gridItems = block.items.map(function(item) { 
                return '<div class="grid-item"><img src="' + item.image + '" alt="' + item.title + '"><h3>' + item.title + '</h3><p>' + item.description + '</p></div>'; 
            }).join('');
            gridBlock.innerHTML = '<h2>' + block.heading + '</h2><div class="grid-container">' + gridItems + '</div>';
            contentSection.appendChild(gridBlock);
        }
    });
    
    container.appendChild(contentSection);
    
    const navFooter = document.createElement('div');
    navFooter.className = 'section-nav-footer';
    navFooter.style.backgroundImage = 'url(\'' + data.nextImage + '\')';
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-footer-overlay';
    
    const navText = document.createElement('div');
    navText.className = 'nav-footer-text';
    navText.textContent = 'Next: ' + data.nextSection;
    
    navOverlay.appendChild(navText);
    navFooter.appendChild(navOverlay);
    
    navFooter.addEventListener('click', function() {
        showLoadingTransition(function() {
            navigateToSection(data.nextSectionKey);
        });
    });
    
    container.appendChild(navFooter);
}

function createPortfolioSection(container, data) {
    const heroSection = document.createElement('div');
    heroSection.className = 'section-hero';
    heroSection.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'' + data.heroImage + '\')';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'section-hero-content';
    heroContent.innerHTML = '<div class="page-category">' + data.category + '</div><div class="page-subtitle">' + data.topSubtitle + '</div><h1 class="main-title">' + data.title + '</h1><p class="page-description">' + data.description + '</p>';
    
    heroSection.appendChild(heroContent);
    container.appendChild(heroSection);
    
    const portfolioSection = document.createElement('div');
    portfolioSection.className = 'portfolio-carousel-section';
    
    portfolioSection.innerHTML = '<div class="portfolio-carousel-wrapper"><div class="portfolio-carousel-container"><div class="portfolio-carousel-stage" id="portfolioCarouselStage"></div></div><div class="portfolio-toggle-buttons"><button class="portfolio-toggle-btn active" data-type="commercial">Commercial</button><button class="portfolio-toggle-btn" data-type="residential">Residential</button></div></div>';
    
    container.appendChild(portfolioSection);
    
    initPortfolioCarousel();
    
    const navFooter = document.createElement('div');
    navFooter.className = 'section-nav-footer';
    navFooter.style.backgroundImage = 'url(\'' + data.nextImage + '\')';
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-footer-overlay';
    
    const navText = document.createElement('div');
    navText.className = 'nav-footer-text';
    navText.textContent = 'Next: ' + data.nextSection;
    
    navOverlay.appendChild(navText);
    navFooter.appendChild(navOverlay);
    
    navFooter.addEventListener('click', function() {
        showLoadingTransition(function() {
            navigateToSection(data.nextSectionKey);
        });
    });
    
    container.appendChild(navFooter);
}

let portfolioRotation = 0;
let portfolioTargetRotation = 0;
let portfolioRotationVelocity = 0;
let portfolioActiveIndex = 0;
let currentPortfolioType = 'commercial';

function initPortfolioCarousel() {
    createPortfolioCards('commercial');
    
    const toggleButtons = document.querySelectorAll('.portfolio-toggle-btn');
    toggleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (type !== currentPortfolioType) {
                switchPortfolioType(type);
            }
        });
    });
    
    animatePortfolioCarousel();
}

function createPortfolioCards(type) {
    const stage = document.getElementById('portfolioCarouselStage');
    if (!stage) return;
    
    const projects = portfolioProjects[type];
    stage.innerHTML = '';
    
    projects.forEach(function(project, index) {
        const card = document.createElement('div');
        card.className = 'portfolio-carousel-card';
        card.style.backgroundImage = 'url(' + project.image + ')';
        
        const label = document.createElement('div');
        label.className = 'portfolio-carousel-label';
        label.innerHTML = '<div class="portfolio-label-title">' + project.title + '</div><div class="portfolio-label-subtitle">' + project.location + '</div>';
        
        card.appendChild(label);
        stage.appendChild(card);
    });
    
    portfolioActiveIndex = 0;
    portfolioRotation = 0;
    portfolioTargetRotation = 0;
    updatePortfolioCarousel();
}

function switchPortfolioType(type) {
    const stage = document.getElementById('portfolioCarouselStage');
    const cards = stage.querySelectorAll('.portfolio-carousel-card');
    const buttons = document.querySelectorAll('.portfolio-toggle-btn');
    
    buttons.forEach(function(btn) {
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    cards.forEach(function(card) {
        card.style.transition = 'transform 2s ease, opacity 2s ease';
        card.style.transform = 'translateX(-100%)';
        card.style.opacity = '0';
    });
    
    setTimeout(function() {
        currentPortfolioType = type;
        createPortfolioCards(type);
        
        const newCards = stage.querySelectorAll('.portfolio-carousel-card');
        newCards.forEach(function(card) {
            card.style.transition = 'none';
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
        });
        
        setTimeout(function() {
            newCards.forEach(function(card) {
                card.style.transition = 'transform 2s ease, opacity 2s ease';
                card.style.transform = '';
                card.style.opacity = '';
            });
        }, 50);
    }, 2000);
}

function updatePortfolioCarousel() {
    const stage = document.getElementById('portfolioCarouselStage');
    if (!stage) return;
    
    const cards = stage.children;
    const totalCards = cards.length;
    if (totalCards === 0) return;
    
    const anglePerCard = 360 / totalCards;
    const radius = 600;
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        
        let relativeIndex = i - portfolioActiveIndex;
        if (relativeIndex < 0) relativeIndex += totalCards;
        
        const angle = (relativeIndex * anglePerCard) * (Math.PI / 180);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;
        
        const depthFactor = (z + radius) / (radius * 2);
        const baseOpacity = 0.3 + (depthFactor * 0.7);
        
        const isActive = i === portfolioActiveIndex;
        
        card.style.transform = 'translateX(' + x + 'px) translateZ(' + z + 'px)';
        card.style.opacity = baseOpacity;
        card.style.zIndex = Math.round(z);
        card.style.filter = isActive ? 'brightness(1.3)' : 'brightness(0.7)';
        
        const label = card.querySelector('.portfolio-carousel-label');
        if (isActive) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    }
}

function animatePortfolioCarousel() {
    updatePortfolioCarousel();
    requestAnimationFrame(animatePortfolioCarousel);
}

function returnToHome() {
    window.currentSection = 'home';
    
    const sectionPage = document.getElementById('sectionPage');
    const mainImageContainer = document.getElementById('mainImageContainer');
    const content = document.getElementById('content');
    const toggleBtn = document.getElementById('toggleBtn');
    const container = document.querySelector('.container');
    
    sectionPage.style.display = 'none';
    sectionPage.innerHTML = '';
    
    mainImageContainer.style.display = 'block';
    content.style.display = 'flex';
    toggleBtn.style.display = 'block';
    
    if (window.isCarousel) {
        handleToggle();
    }
    
    container.classList.add('visible');
}
