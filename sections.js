// Section page management

function initSections() {
    window.currentSection = 'home';
}

function navigateToSection(sectionName) {
    window.currentSection = sectionName;
    
    const sectionPage = document.getElementById('sectionPage');
    const mainImageContainer = document.getElementById('mainImageContainer');
    const content = document.getElementById('content');
    const toggleBtn = document.getElementById('toggleBtn');
    const carouselView = document.getElementById('carouselView');
    const header = document.getElementById('header');
    
    mainImageContainer.style.display = 'none';
    content.style.display = 'none';
    carouselView.style.opacity = '0';
    carouselView.style.pointerEvents = 'none';
    
    header.style.position = 'fixed';
    header.style.opacity = '0';
    
    sectionPage.style.display = 'block';
    sectionPage.innerHTML = '';
    
    const sectionData = sectionsData[sectionName];
    
    if (sectionName === 'portfolio') {
        createPortfolioSection(sectionPage, sectionData);
    } else if (sectionName === 'contact') {
        createContactSection(sectionPage, sectionData);
    } else {
        createStandardSection(sectionPage, sectionData);
    }
    
    sectionPage.scrollTop = 0;
    
    setTimeout(function() {
        sectionPage.classList.add('active');
        toggleBtn.style.display = 'block';
        
        setTimeout(function() {
            header.style.opacity = '1';
        }, 300);
    }, 50);
}

function createStandardSection(container, data) {
    const heroSection = document.createElement('div');
    heroSection.className = 'section-hero';
    heroSection.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'' + data.heroImage + '\')';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'text-layer';
    heroContent.style.position = 'absolute';
    heroContent.style.bottom = '4rem';
    heroContent.style.left = '4rem';
    heroContent.innerHTML = '<div class="page-category">' + data.category + '</div><div class="page-subtitle">' + data.topSubtitle + '</div><h1 class="main-title">' + data.title + '</h1><p class="page-description">' + data.description + '</p><button class="action-btn read-more-btn"><span class="action-btn-text">Read More</span><div class="action-btn-fill"></div></button>';
    
    heroSection.appendChild(heroContent);
    container.appendChild(heroSection);
    
    const contentSection = document.createElement('div');
    contentSection.className = 'section-content';
    contentSection.id = 'sectionContent';
    
    data.contentBlocks.forEach(function(block) {
        if (block.type === 'text') {
            const textBlock = document.createElement('div');
            textBlock.className = 'content-block text-block';
            textBlock.innerHTML = '<h2>' + block.heading + '</h2><p>' + block.text + '</p>';
            contentSection.appendChild(textBlock);
        } else if (block.type === 'image') {
            const imageBlock = document.createElement('div');
            imageBlock.className = 'content-block image-block';
            const img = document.createElement('img');
            img.src = block.image;
            img.alt = block.alt;
            img.style.width = '100%';
            img.style.maxWidth = '1200px';
            img.style.height = '500px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '10px';
            img.style.margin = '3rem 0';
            imageBlock.appendChild(img);
            if (block.caption) {
                const caption = document.createElement('p');
                caption.className = 'image-caption';
                caption.textContent = block.caption;
                caption.style.textAlign = 'center';
                caption.style.marginTop = '1rem';
                caption.style.fontStyle = 'italic';
                caption.style.opacity = '0.8';
                imageBlock.appendChild(caption);
            }
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
            gridBlock.innerHTML = '<h2>' + block.heading + '</h2>';
            
            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            gridContainer.style.gap = '2rem';
            gridContainer.style.marginTop = '2rem';
            
            block.items.forEach(function(item) {
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';
                
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.title;
                img.style.width = '100%';
                img.style.height = '200px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '5px';
                img.style.marginBottom = '1rem';
                
                const title = document.createElement('h3');
                title.textContent = item.title;
                title.style.fontSize = '1.2rem';
                title.style.marginBottom = '0.5rem';
                
                const desc = document.createElement('p');
                desc.textContent = item.description;
                desc.style.fontSize = '0.9rem';
                desc.style.opacity = '0.8';
                
                gridItem.appendChild(img);
                gridItem.appendChild(title);
                gridItem.appendChild(desc);
                gridContainer.appendChild(gridItem);
            });
            
            gridBlock.appendChild(gridContainer);
            contentSection.appendChild(gridBlock);
        }
    });
    
    container.appendChild(contentSection);
    
    const navFooter = document.createElement('div');
    navFooter.className = 'next-section-link';
    navFooter.style.backgroundImage = 'url(\'' + data.nextImage + '\')';
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'next-section-overlay';
    
    const navText = document.createElement('div');
    navText.className = 'next-section-text';
    navText.textContent = 'Next: ' + data.nextSection;
    
    navOverlay.appendChild(navText);
    navFooter.appendChild(navOverlay);
    
    navFooter.addEventListener('click', function() {
        const sectionPage = document.getElementById('sectionPage');
        sectionPage.classList.remove('active');
        setTimeout(function() {
            showFullLoadingScreen(function() {
                navigateToSection(data.nextSectionKey);
            });
        }, 500);
    });
    
    container.appendChild(navFooter);
    
    setTimeout(function() {
        const readMoreBtn = container.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function() {
                const header = document.getElementById('header');
                const headerHeight = header.offsetHeight;
                const contentSection = document.getElementById('sectionContent');
                const sectionPage = document.getElementById('sectionPage');
                const targetPosition = contentSection.offsetTop - headerHeight;
                
                sectionPage.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        }
    }, 100);
}

function createContactSection(container, data) {
    const heroSection = document.createElement('div');
    heroSection.className = 'section-hero';
    heroSection.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'' + data.heroImage + '\')';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'text-layer';
    heroContent.style.position = 'absolute';
    heroContent.style.bottom = '4rem';
    heroContent.style.left = '4rem';
    heroContent.innerHTML = '<div class="page-category">' + data.category + '</div><div class="page-subtitle">' + data.topSubtitle + '</div><h1 class="main-title">' + data.title + '</h1><p class="page-description">' + data.description + '</p><button class="action-btn read-more-btn"><span class="action-btn-text">Read More</span><div class="action-btn-fill"></div></button>';
    
    heroSection.appendChild(heroContent);
    container.appendChild(heroSection);
    
    const contentSection = document.createElement('div');
    contentSection.className = 'section-content';
    contentSection.id = 'sectionContent';
    
    data.contentBlocks.forEach(function(block) {
        if (block.type === 'text') {
            const textBlock = document.createElement('div');
            textBlock.className = 'content-block text-block';
            textBlock.innerHTML = '<h2>' + block.heading + '</h2><p>' + block.text + '</p>';
            contentSection.appendChild(textBlock);
        } else if (block.type === 'grid') {
            const gridBlock = document.createElement('div');
            gridBlock.className = 'content-block grid-block';
            gridBlock.innerHTML = '<h2>' + block.heading + '</h2>';
            
            const gridContainer = document.createElement('div');
            gridContainer.style.display = 'grid';
            gridContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            gridContainer.style.gap = '2rem';
            gridContainer.style.marginTop = '2rem';
            
            block.items.forEach(function(item) {
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';
                
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.title;
                img.style.width = '100%';
                img.style.height = '200px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '5px';
                img.style.marginBottom = '1rem';
                
                const title = document.createElement('h3');
                title.textContent = item.title;
                title.style.fontSize = '1.2rem';
                title.style.marginBottom = '0.5rem';
                
                const desc = document.createElement('p');
                desc.textContent = item.description;
                desc.style.fontSize = '0.9rem';
                desc.style.opacity = '0.8';
                
                gridItem.appendChild(img);
                gridItem.appendChild(title);
                gridItem.appendChild(desc);
                gridContainer.appendChild(gridItem);
            });
            
            gridBlock.appendChild(gridContainer);
            contentSection.appendChild(gridBlock);
        } else if (block.type === 'image') {
            const imageBlock = document.createElement('div');
            imageBlock.className = 'content-block image-block';
            const img = document.createElement('img');
            img.src = block.image;
            img.alt = block.alt;
            img.style.width = '100%';
            img.style.maxWidth = '1200px';
            img.style.height = '500px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '10px';
            img.style.margin = '3rem 0';
            imageBlock.appendChild(img);
            if (block.caption) {
                const caption = document.createElement('p');
                caption.className = 'image-caption';
                caption.textContent = block.caption;
                caption.style.textAlign = 'center';
                caption.style.marginTop = '1rem';
                caption.style.fontStyle = 'italic';
                caption.style.opacity = '0.8';
                imageBlock.appendChild(caption);
            }
            contentSection.appendChild(imageBlock);
        }
    });
    
    const formSection = document.createElement('div');
    formSection.className = 'contact-form-section';
    formSection.innerHTML = '<h2>Get In Touch</h2><form class="contact-form" id="contactForm"><div class="form-group"><label for="name">Name</label><input type="text" id="name" name="name" required></div><div class="form-group"><label for="email">Email</label><input type="email" id="email" name="email" required></div><div class="form-group"><label for="phone">Phone</label><input type="tel" id="phone" name="phone" required></div><div class="form-group"><label for="message">Message</label><textarea id="message" name="message" rows="6" required></textarea></div><div class="form-checkbox"><input type="checkbox" id="privacy" name="privacy" required><label for="privacy">I understand that my data will be stored in accordance with the privacy policy</label></div><button type="submit" class="form-submit-btn"><span>Submit</span><div class="action-btn-fill"></div></button></form>';
    
    contentSection.appendChild(formSection);
    container.appendChild(contentSection);
    
    const navFooter = document.createElement('div');
    navFooter.className = 'next-section-link';
    navFooter.style.backgroundImage = 'url(\'' + data.nextImage + '\')';
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'next-section-overlay';
    
    const navText = document.createElement('div');
    navText.className = 'next-section-text';
    navText.textContent = 'Next: ' + data.nextSection;
    
    navOverlay.appendChild(navText);
    navFooter.appendChild(navOverlay);
    
    navFooter.addEventListener('click', function() {
        const sectionPage = document.getElementById('sectionPage');
        sectionPage.classList.remove('active');
        setTimeout(function() {
            showFullLoadingScreen(function() {
                navigateToSection(data.nextSectionKey);
            });
        }, 500);
    });
    
    container.appendChild(navFooter);
    
    setTimeout(function() {
        const readMoreBtn = container.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function() {
                const header = document.getElementById('header');
                const headerHeight = header.offsetHeight;
                const contentSection = document.getElementById('sectionContent');
                const sectionPage = document.getElementById('sectionPage');
                const targetPosition = contentSection.offsetTop - headerHeight;
                
                sectionPage.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        }
        
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                form.reset();
            });
        }
    }, 100);
}
function createPortfolioSection(container, data) {
    const heroSection = document.createElement('div');
    heroSection.className = 'section-hero';
    heroSection.style.backgroundImage = 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(\'' + data.heroImage + '\')';
    
    const heroContent = document.createElement('div');
    heroContent.className = 'text-layer';
    heroContent.style.position = 'absolute';
    heroContent.style.bottom = '4rem';
    heroContent.style.left = '4rem';
    heroContent.innerHTML = '<div class="page-category">' + data.category + '</div><div class="page-subtitle">' + data.topSubtitle + '</div><h1 class="main-title">' + data.title + '</h1><p class="page-description">' + data.description + '</p><button class="action-btn read-more-btn"><span class="action-btn-text">Read More</span><div class="action-btn-fill"></div></button>';
    
    heroSection.appendChild(heroContent);
    container.appendChild(heroSection);
    
    const portfolioSection = document.createElement('div');
    portfolioSection.className = 'portfolio-carousel-section';
    portfolioSection.id = 'sectionContent';
    portfolioSection.style.background = '#000';
    portfolioSection.style.padding = '4rem 0 6rem 0';
    portfolioSection.style.minHeight = '100vh';
    portfolioSection.style.display = 'flex';
    portfolioSection.style.flexDirection = 'column';
    portfolioSection.style.alignItems = 'center';
    
    portfolioSection.innerHTML = '<div class="portfolio-carousel-wrapper"><div class="portfolio-carousel-container"><div class="portfolio-carousel-stage" id="portfolioCarouselStage"></div></div></div><div class="portfolio-scroll-bar" id="portfolioScrollBar"></div><div class="portfolio-toggle-buttons"><button class="portfolio-toggle-btn active" data-type="commercial">Commercial</button><button class="portfolio-toggle-btn" data-type="residential">Residential</button></div>';
    
    container.appendChild(portfolioSection);
    
    setTimeout(function() {
        initPortfolioCarousel();
        
        const readMoreBtn = container.querySelector('.read-more-btn');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function() {
                const header = document.getElementById('header');
                const headerHeight = header.offsetHeight;
                const contentSection = document.getElementById('sectionContent');
                const sectionPage = document.getElementById('sectionPage');
                const targetPosition = contentSection.offsetTop - headerHeight;
                
                sectionPage.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        }
    }, 100);
    
    const navFooter = document.createElement('div');
    navFooter.className = 'next-section-link';
    navFooter.style.backgroundImage = 'url(\'' + data.nextImage + '\')';
    
    const navOverlay = document.createElement('div');
    navOverlay.className = 'next-section-overlay';
    
    const navText = document.createElement('div');
    navText.className = 'next-section-text';
    navText.textContent = 'Next: ' + data.nextSection;
    
    navOverlay.appendChild(navText);
    navFooter.appendChild(navOverlay);
    
    navFooter.addEventListener('click', function() {
        const sectionPage = document.getElementById('sectionPage');
        sectionPage.classList.remove('active');
        setTimeout(function() {
            showFullLoadingScreen(function() {
                navigateToSection(data.nextSectionKey);
            });
        }, 500);
    });
    
    container.appendChild(navFooter);
}

let portfolioRotation = 0;
let portfolioTargetRotation = 0;
let portfolioRotationVelocity = 0;
let portfolioActiveIndex = 0;
let currentPortfolioType = 'commercial';
let portfolioScrolling = false;

function initPortfolioCarousel() {
    createPortfolioCards('commercial');
    
    const toggleButtons = document.querySelectorAll('.portfolio-toggle-btn');
    for (let i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (type !== currentPortfolioType) {
                switchPortfolioType(type);
            }
        });
    }
    
    const scrollBar = document.getElementById('portfolioScrollBar');
    if (scrollBar) {
        scrollBar.addEventListener('mouseenter', function() {
            portfolioScrolling = true;
            scrollBar.classList.add('active');
        });
        
        scrollBar.addEventListener('mouseleave', function() {
            portfolioScrolling = false;
            scrollBar.classList.remove('active');
        });
        
        scrollBar.addEventListener('wheel', function(e) {
            if (portfolioScrolling) {
                e.preventDefault();
                const maxSpeed = 2;
                const scrollDelta = Math.max(-maxSpeed, Math.min(maxSpeed, e.deltaY * 0.08));
                portfolioRotationVelocity += scrollDelta;
                portfolioRotationVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, portfolioRotationVelocity));
            }
        });
    }
    
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
        card.style.opacity = '1';
        
        const overlay = document.createElement('div');
        overlay.className = 'portfolio-card-overlay';
        
        const label = document.createElement('div');
        label.className = 'portfolio-card-label';
        label.innerHTML = '<div class="portfolio-card-title">' + project.title + '</div><div class="portfolio-card-location">' + project.location + '</div>';
        
        overlay.appendChild(label);
        card.appendChild(overlay);
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
    
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-type') === type) {
            buttons[i].classList.add('active');
        } else {
            buttons[i].classList.remove('active');
        }
    }
    
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transition = 'transform 2s ease, opacity 2s ease';
        cards[i].style.transform = 'translateX(-100%)';
        cards[i].style.opacity = '0';
    }
    
    setTimeout(function() {
        currentPortfolioType = type;
        createPortfolioCards(type);
        
        const newCards = stage.querySelectorAll('.portfolio-carousel-card');
        for (let i = 0; i < newCards.length; i++) {
            newCards[i].style.transition = 'none';
            newCards[i].style.transform = 'translateX(100%)';
            newCards[i].style.opacity = '0';
        }
        
        setTimeout(function() {
            for (let i = 0; i < newCards.length; i++) {
                newCards[i].style.transition = 'transform 2s ease, opacity 2s ease';
                newCards[i].style.transform = '';
                newCards[i].style.opacity = '1';
            }
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
    const normalizedRotation = ((portfolioRotation % 360) + 360) % 360;
    const newActiveIndex = Math.round(normalizedRotation / anglePerCard) % totalCards;
    
    if (newActiveIndex !== portfolioActiveIndex) {
        portfolioActiveIndex = newActiveIndex;
    }
    
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
        if (!card.style.transition || card.style.transition === 'none') {
            card.style.opacity = baseOpacity;
        }
        card.style.zIndex = Math.round(z);
        card.style.filter = isActive ? 'brightness(1.3)' : 'brightness(0.7)';
    }
}

function animatePortfolioCarousel() {
    portfolioTargetRotation += portfolioRotationVelocity;
    portfolioRotation += (portfolioTargetRotation - portfolioRotation) * 0.15;
    portfolioRotationVelocity *= 0.88;
    
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
    const header = document.getElementById('header');
    
    sectionPage.classList.remove('active');
    header.style.position = 'fixed';
    
    setTimeout(function() {
        sectionPage.style.display = 'none';
        sectionPage.innerHTML = '';
        
        mainImageContainer.style.display = 'block';
        content.style.display = 'flex';
        toggleBtn.style.display = 'block';
        
        if (window.isCarousel) {
            handleToggle();
        }
        
        container.classList.add('visible');
    }, 500);
}
