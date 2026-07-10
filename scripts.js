document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       Sticky Navbar & Active Section Link
       ========================================== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Navigation Highlight (Only for single page hash links if present)
        if (sections.length > 0) {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120; // offset for sticky header
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (currentSectionId) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${currentSectionId}` || href === `index.html#${currentSectionId}`) {
                        link.classList.add('active');
                    } else if (href.startsWith('#') || href.includes('index.html#')) {
                        link.classList.remove('active');
                    }
                });
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load

    // Highlight active link based on current page URL pathname
    const highlightActiveLink = () => {
        const currentPath = window.location.pathname.toLowerCase();
        let matched = false;

        navLinks.forEach(link => {
            const href = link.getAttribute('href').toLowerCase();
            
            // Remove active first
            link.classList.remove('active');

            if (href && !href.startsWith('#')) {
                // If current path matches href name
                if (currentPath.endsWith(href) || (currentPath.includes(href) && href !== 'index.html')) {
                    link.classList.add('active');
                    matched = true;
                }
            }
        });

        // Default to Home if no active link matched (and we are on root or index.html)
        if (!matched && (currentPath.endsWith('/') || currentPath.includes('index.html') || currentPath === '')) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href').toLowerCase();
                if (href === 'index.html' || href === '#home') {
                    link.classList.add('active');
                }
            });
        }
    };
    highlightActiveLink();

    /* ==========================================
       Mobile Navigation Menu
       ========================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');

    const toggleMenu = () => {
        navMenu.classList.toggle('open');
        hamburgerLines.forEach(line => line.classList.toggle('open'));
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        hamburgerLines.forEach(line => line.classList.remove('open'));
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ==========================================
       Intersection Observer for Scroll Reveals
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================
       Statistics Count-up Animation
       ========================================== */
    const statCards = document.querySelectorAll('.stat-card');
    let statsAnimated = false;

    const animateCounters = () => {
        statCards.forEach(card => {
            const numberNode = card.querySelector('.stat-number');
            const targetVal = parseInt(card.getAttribute('data-stat-target'), 10);
            const suffix = card.getAttribute('data-stat-suffix') || '';
            let currentVal = 0;
            const duration = 1800; // Animation duration in milliseconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                currentVal = Math.floor(easeProgress * targetVal);

                if (targetVal >= 1000) {
                    // Format with commas for large numbers
                    numberNode.textContent = currentVal.toLocaleString() + suffix;
                } else {
                    numberNode.textContent = currentVal + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    if (targetVal >= 1000) {
                        numberNode.textContent = targetVal.toLocaleString() + suffix;
                    } else {
                        numberNode.textContent = targetVal + suffix;
                    }
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    // Watch stats section specifically
    const statsSection = document.querySelector('.about-stats-container');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateCounters();
                    statsAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    /* ==========================================
       Google Reviews Carousel Slider
       ========================================== */
    const track = document.getElementById('carousel-track');
    const cards = Array.from(track.children);
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    let currentIndex = 0;
    let cardsVisible = 3;
    let gap = 24;

    const updateCarouselLayout = () => {
        const width = window.innerWidth;
        if (width <= 768) {
            cardsVisible = 1;
        } else if (width <= 1024) {
            cardsVisible = 2;
        } else {
            cardsVisible = 3;
        }
        
        // Reposition track
        moveToSlide(currentIndex);
        setupDots();
    };

    const getMaxIndex = () => {
        return cards.length - cardsVisible;
    };

    const moveToSlide = (index) => {
        if (index < 0) index = 0;
        const maxIndex = getMaxIndex();
        if (index > maxIndex) index = maxIndex;
        
        currentIndex = index;
        
        const cardWidth = cards[0].getBoundingClientRect().width;
        const amountToMove = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${amountToMove}px)`;
        
        // Update nav state
        prevBtn.style.opacity = currentIndex === 0 ? '0.4' : '1';
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.4' : '1';

        // Update active dot
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            // Account for multiple cards visible on screen by grouping dots
            if (idx === currentIndex) {
                dot.classList.add('active');
            }
        });
    };

    const setupDots = () => {
        dotsContainer.innerHTML = '';
        const maxIndex = getMaxIndex();
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsContainer.appendChild(dot);
        }
    };

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            moveToSlide(currentIndex + 1);
        }
    });

    // Touch Swipe Gestures
    let startX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const diffX = e.touches[0].clientX - startX;
        
        if (Math.abs(diffX) > 50) { // Threshold
            if (diffX > 0 && currentIndex > 0) {
                moveToSlide(currentIndex - 1);
                isSwiping = false;
            } else if (diffX < 0 && currentIndex < getMaxIndex()) {
                moveToSlide(currentIndex + 1);
                isSwiping = false;
            }
        }
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isSwiping = false;
    });

    // Initialize layout and resize events
    window.addEventListener('resize', updateCarouselLayout);
    updateCarouselLayout();

    /* ==========================================
       "Read More" Expand Review Logic
       ========================================== */
    const expandButtons = document.querySelectorAll('.review-expand-btn');
    expandButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.closest('.review-body-text');
            if (parent) {
                parent.classList.add('is-expanded');
                // Re-adjust carousel since height might change
                moveToSlide(currentIndex);
            }
        });
    });

    /* ==========================================
       WhatsApp Tooltip Timer
       ========================================== */
    const whatsappTooltip = document.getElementById('whatsapp-tooltip');
    if (whatsappTooltip) {
        setTimeout(() => {
            whatsappTooltip.style.opacity = '0';
        }, 5000);
    }

    /* ==========================================
       FAQ Accordion Expand/Collapse Toggle
       ========================================== */
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const isOpen = accordion.classList.contains('open');
            
            // Close other accordions in the same container
            const allAccordions = accordion.parentElement.querySelectorAll('.faq-accordion');
            allAccordions.forEach(item => {
                item.classList.remove('open');
                const content = item.querySelector('.faq-content');
                if (content) content.style.maxHeight = null;
            });
            
            if (!isOpen) {
                accordion.classList.add('open');
                const content = accordion.querySelector('.faq-content');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});
