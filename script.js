// Tab functionality
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    const tabBtns = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Scroll progress bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Close settings panel when clicking outside
document.addEventListener('click', (e) => {
    // Removed settings panel logic
});

// Add animation to stats numbers on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            animateNumber(statNumber);
            observer.unobserve(statNumber);
        }
    });
}, observerOptions);

function animateNumber(element) {
    const text = element.textContent;
    
    // Check if it's a number we can animate
    if (text.includes('+')) {
        const target = parseInt(text.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = text;
                clearInterval(timer);
            } else {
                const formattedNumber = Math.floor(current).toLocaleString('pt-BR');
                element.textContent = formattedNumber + '+';
            }
        }, 16);
    }
}

// Observe all stat numbers
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
});

// Add parallax effect to hero image
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroImage.style.transform = `translateY(${rate}px) rotate(3deg)`;
    }
});

// Gallery item click to expand (optional feature)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // You can add a lightbox functionality here if needed
        console.log('Gallery item clicked');
    });
});

// Video play button functionality
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.play-button');
    const video = document.querySelector('.video-frame video');
    const videoOverlay = document.querySelector('.video-overlay');

    if (playButton && video && videoOverlay) {
        playButton.addEventListener('click', () => {
            video.play();
            videoOverlay.style.opacity = '0';
            videoOverlay.style.pointerEvents = 'none';
        });

        // Show overlay when video is paused
        video.addEventListener('pause', () => {
            if (video.currentTime > 0 && !video.ended) {
                videoOverlay.style.opacity = '1';
                videoOverlay.style.pointerEvents = 'auto';
            }
        });

        // Hide overlay when video is playing
        video.addEventListener('play', () => {
            videoOverlay.style.opacity = '0';
            videoOverlay.style.pointerEvents = 'none';
        });

        // Show overlay when video ends
        video.addEventListener('ended', () => {
            videoOverlay.style.opacity = '1';
            videoOverlay.style.pointerEvents = 'auto';
        });
    }
});