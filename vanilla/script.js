/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to ensure a function runs at most once per specified time
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Save data to localStorage safely
 * @param {string} key 
 * @param {*} value 
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
}

/**
 * Get data from localStorage safely
 * @param {string} key 
 * @returns {*}
 */
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('localStorage not available:', e);
        return null;
    }
}

// ============================================
// TAB FUNCTIONALITY
// ============================================

/**
 * Open a specific tab and save state
 * @param {Event} evt - Click event
 * @param {string} tabName - ID of the tab to open
 */
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    const tabBtns = document.getElementsByClassName('tab-btn');
    
    // Remove active class from all tabs
    Array.from(tabContents).forEach(tab => tab.classList.remove('active'));
    Array.from(tabBtns).forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        evt.currentTarget.classList.add('active');
        
        // Save active tab to localStorage
        saveToStorage('activeTab', tabName);
        
        // Update ARIA attributes
        evt.currentTarget.setAttribute('aria-selected', 'true');
        Array.from(tabBtns).forEach(btn => {
            if (btn !== evt.currentTarget) {
                btn.setAttribute('aria-selected', 'false');
            }
        });
    }
}

/**
 * Restore last active tab from localStorage
 */
function restoreActiveTab() {
    const activeTab = getFromStorage('activeTab');
    if (activeTab) {
        const tabButton = document.querySelector(`[onclick*="${activeTab}"]`);
        const tabContent = document.getElementById(activeTab);
        
        if (tabButton && tabContent) {
            // Remove all active classes first
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Activate saved tab
            tabButton.classList.add('active');
            tabButton.setAttribute('aria-selected', 'true');
            tabContent.classList.add('active');
        }
    }
}

/**
 * Add keyboard navigation to tabs
 */
function initTabKeyboardNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('keydown', (e) => {
            let targetIndex;
            
            // Arrow key navigation
            if (e.key === 'ArrowRight') {
                targetIndex = (index + 1) % tabBtns.length;
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                targetIndex = (index - 1 + tabBtns.length) % tabBtns.length;
                e.preventDefault();
            } else if (e.key === 'Home') {
                targetIndex = 0;
                e.preventDefault();
            } else if (e.key === 'End') {
                targetIndex = tabBtns.length - 1;
                e.preventDefault();
            }
            
            if (targetIndex !== undefined) {
                tabBtns[targetIndex].focus();
                tabBtns[targetIndex].click();
            }
        });
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

const updateScrollProgress = throttle(() => {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    scrollProgress.style.width = scrollPercentage + '%';
}, 16); // ~60fps

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

/**
 * Initialize smooth scroll for navigation links
 * Accounts for fixed header height
 */
function initSmoothScroll() {
    // Get header height for offset
    const getHeaderHeight = () => {
        const nav = document.querySelector('nav');
        return nav ? nav.offsetHeight : 0;
    };

    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for # alone
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                // Calculate position with header offset
                const headerHeight = getHeaderHeight();
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20; // 20px extra padding
                
                // Respect user's motion preferences
                const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
                
                // Smooth scroll to position
                window.scrollTo({
                    top: offsetPosition,
                    behavior: behavior
                });
                
                // Close mobile menu if open
                if (isMobile()) {
                    setTimeout(() => closeMenu(), 300);
                }
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
                
                // Set focus for accessibility (after scroll completes)
                setTimeout(() => {
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                    target.removeAttribute('tabindex');
                }, behavior === 'smooth' ? 800 : 0);
            }
        });
    });
    
    // Also handle hero buttons specifically
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = getHeaderHeight();
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                    });
                    
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });
}

// ============================================
// STATS ANIMATION
// ============================================

const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            animateNumber(statNumber);
            statsObserver.unobserve(statNumber);
        }
    });
}, observerOptions);

/**
 * Animate a number counting up
 * @param {HTMLElement} element - Element containing the number
 */
function animateNumber(element) {
    const text = element.textContent;
    
    // Check if it's a number we can animate
    if (text.includes('+')) {
        const target = parseInt(text.replace(/\D/g, ''));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const fps = 60;
        const frames = duration / (1000 / fps);
        const increment = target / frames;
        let current = 0;
        let frameCount = 0;
        
        const animate = () => {
            frameCount++;
            current += increment;
            
            if (frameCount >= frames) {
                element.textContent = text;
            } else {
                const formattedNumber = Math.floor(current).toLocaleString('pt-BR');
                element.textContent = formattedNumber + '+';
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

/**
 * Initialize stats number observers
 */
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

const updateParallax = throttle(() => {
    // Skip parallax if user prefers reduced motion
    if (prefersReducedMotion()) return;
    
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;
    
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    // Use transform for better performance
    heroImage.style.transform = `translate3d(0, ${rate}px, 0) rotate(3deg)`;
}, 16); // ~60fps

// ============================================
// GALLERY FUNCTIONALITY
// ============================================

/**
 * Create and show lightbox for gallery items
 * @param {string} imageSrc - Source of the image
 * @param {string} imageAlt - Alt text for the image
 */
function showLightbox(imageSrc, imageAlt = '') {
    // Check if lightbox already exists
    let lightbox = document.getElementById('lightbox');
    
    if (!lightbox) {
        // Create lightbox
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Add styles if not already present
        if (!document.getElementById('lightbox-styles')) {
            const style = document.createElement('style');
            style.id = 'lightbox-styles';
            style.textContent = `
                .lightbox {
                    display: none;
                    position: fixed;
                    z-index: 9999;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.95);
                    animation: fadeIn 0.3s ease;
                }
                .lightbox.active {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .lightbox-image {
                    max-width: 100%;
                    max-height: 85vh;
                    object-fit: contain;
                    animation: zoomIn 0.3s ease;
                }
                .lightbox-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: white;
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .lightbox-close:hover {
                    color: #ccc;
                }
                .lightbox-caption {
                    color: white;
                    text-align: center;
                    padding: 15px;
                    font-size: 16px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close lightbox on click
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => closeLightbox());
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
    
    // Update and show lightbox
    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    
    img.src = imageSrc;
    img.alt = imageAlt;
    caption.textContent = imageAlt;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close the lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize gallery item click handlers
 */
function initGallery() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                showLightbox(img.src, img.alt || '');
            }
        });
        
        // Make gallery items keyboard accessible
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Abrir imagem em tela cheia');
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const img = item.querySelector('img');
                if (img) {
                    showLightbox(img.src, img.alt || '');
                }
            }
        });
    });
}

// ============================================
// VIDEO FUNCTIONALITY
// ============================================

/**
 * Toggle video overlay visibility
 * @param {boolean} show - Whether to show the overlay
 * @param {HTMLElement} overlay - The overlay element
 */
function toggleVideoOverlay(show, overlay) {
    if (!overlay) return;
    
    overlay.style.opacity = show ? '1' : '0';
    overlay.style.pointerEvents = show ? 'auto' : 'none';
}

/**
 * Initialize video player functionality
 */
function initVideoPlayer() {
    const playButton = document.querySelector('.play-button');
    const video = document.querySelector('.video-frame video');
    const videoOverlay = document.querySelector('.video-overlay');

    if (!playButton || !video || !videoOverlay) return;

    // Play button click handler
    playButton.addEventListener('click', () => {
        video.play().catch(e => console.warn('Video play failed:', e));
        toggleVideoOverlay(false, videoOverlay);
    });

    // Video event handlers
    video.addEventListener('pause', () => {
        if (video.currentTime > 0 && !video.ended) {
            toggleVideoOverlay(true, videoOverlay);
        }
    });

    video.addEventListener('play', () => {
        toggleVideoOverlay(false, videoOverlay);
    });

    video.addEventListener('ended', () => {
        toggleVideoOverlay(true, videoOverlay);
        video.currentTime = 0; // Reset to beginning
    });
    
    // Keyboard accessibility for play button
    playButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playButton.click();
        }
    });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    // Restore saved tab state
    restoreActiveTab();
    
    // Initialize keyboard navigation for tabs
    initTabKeyboardNavigation();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize stats animation
    initStatsAnimation();
    
    // Initialize gallery
    initGallery();
    
    // Initialize video player
    initVideoPlayer();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Add scroll event listeners
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', updateParallax);
    
    console.log('✅ All features initialized successfully');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPOSE GLOBAL FUNCTIONS
// ============================================

// Make openTab available globally for inline onclick handlers
window.openTab = openTab;
// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

/**
 * Initialize mobile navigation menu
 */
function initMobileMenu() {
    // Create hamburger button if it doesn't exist
    let navToggle = document.querySelector('.nav-toggle');
    
    if (!navToggle) {
        const nav = document.querySelector('nav');
        const logo = document.querySelector('.logo');
        
        if (nav && logo) {
            navToggle = document.createElement('button');
            navToggle.className = 'nav-toggle';
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            
            nav.appendChild(navToggle);
        }
    }
    
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    // Toggle menu on button click
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            navToggle.focus();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 768) {
                closeMenu();
            }
        }, 250);
    });
}

/**
 * Toggle mobile menu open/closed
 */
function toggleMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    const isActive = navLinks.classList.contains('active');
    
    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
}

/**
 * Open mobile menu
 */
function openMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.classList.add('active');
    navLinks.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Focus first link for accessibility
    const firstLink = navLinks.querySelector('a');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 300);
    }
}

/**
 * Close mobile menu
 */
function closeMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!navToggle || !navLinks) return;
    
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// ============================================
// RESPONSIVE IMAGE OPTIMIZATION
// ============================================

/**
 * Add responsive image loading based on viewport
 */
function optimizeImages() {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach(img => {
        // Add loading="lazy" if not already present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Mark as optimized
        img.setAttribute('data-optimized', 'true');
    });
}

// ============================================
// TOUCH GESTURES FOR MOBILE
// ============================================

/**
 * Add swipe gesture support for mobile menu
 */
function initSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;
        const navLinks = document.querySelector('.nav-links');
        
        if (!navLinks) return;
        
        // Swipe left to close menu (when menu is on right side)
        if (swipeDistance < -swipeThreshold && navLinks.classList.contains('active')) {
            closeMenu();
        }
        
        // Swipe right from edge to open menu
        if (swipeDistance > swipeThreshold && touchStartX < 50 && !navLinks.classList.contains('active')) {
            openMenu();
        }
    }
}

// ============================================
// RESPONSIVE UTILITIES
// ============================================

/**
 * Check if device is mobile
 */
function isMobile() {
    return window.innerWidth < 768;
}

/**
 * Check if device is tablet
 */
function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is desktop
 */
function isDesktop() {
    return window.innerWidth >= 1024;
}

/**
 * Get current breakpoint
 */
function getCurrentBreakpoint() {
    if (isMobile()) return 'mobile';
    if (isTablet()) return 'tablet';
    return 'desktop';
}

/**
 * Adjust layout based on device orientation
 */
function handleOrientationChange() {
    const currentBreakpoint = getCurrentBreakpoint();
    
    // Log for debugging
    console.log(`Orientation changed: ${currentBreakpoint}`);
    
    // Close mobile menu on orientation change
    if (isMobile()) {
        closeMenu();
    }
    
    // Trigger custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('breakpointChange', {
        detail: { breakpoint: currentBreakpoint }
    }));
}

// ============================================
// VIEWPORT HEIGHT FIX FOR MOBILE
// ============================================

/**
 * Fix viewport height on mobile browsers
 * Mobile browsers have dynamic URL bars that affect viewport height
 */
function setMobileViewportHeight() {
    // Get actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Monitor scroll performance and disable heavy animations on low-end devices
 */
function optimizePerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    
    function measureFPS() {
        const currentTime = performance.now();
        frameCount++;
        
        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // If FPS drops below 30, reduce animations
            if (fps < 30) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    // Only monitor on mobile
    if (isMobile()) {
        requestAnimationFrame(measureFPS);
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all responsive functionality
 */
function initResponsive() {
    // Mobile menu
    initMobileMenu();
    
    // Image optimization
    optimizeImages();
    
    // Swipe gestures
    initSwipeGestures();
    
    // Viewport height fix
    setMobileViewportHeight();
    window.addEventListener('resize', setMobileViewportHeight);
    window.addEventListener('orientationchange', setMobileViewportHeight);
    
    // Orientation change handler
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Performance optimization
    optimizePerformance();
    
    console.log('✅ Responsive features initialized');
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResponsive);
} else {
    initResponsive();
}

// ============================================
// EXPOSE UTILITIES GLOBALLY
// ============================================

window.mobileMenu = {
    toggle: toggleMenu,
    open: openMenu,
    close: closeMenu,
    isMobile,
    isTablet,
    isDesktop,
    getCurrentBreakpoint
};
