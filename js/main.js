// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Highlight active navigation link
    highlightActiveNavLink();
    
    // Add scroll animation for elements
    addScrollAnimation();
    
    // Mobile navigation handling
    initMobileNavigation();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize image lightbox
    initImageLightbox();
    
    // Handle hero video optimization
    optimizeHeroVideo();
});

// Function to optimize hero video loading and playback
function optimizeHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (!heroVideo) return;
    
    // Lazy load the video
    window.addEventListener('load', function() {
        // After everything else has loaded, start playing the video
        setTimeout(function() {
            // If it's a responsive site and we're on mobile,
            // we might want to further delay or not load video on mobile
            if (window.innerWidth < 768 && navigator.connection && 
                (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g'))) {
                // If in data-saving mode or on slow connection, don't play video
                heroVideo.pause();
                heroVideo.removeAttribute('autoplay');
                return;
            }
            
            heroVideo.play().catch(e => {
                console.log('Auto-play was prevented:', e);
                // We can handle auto-play prevention here if needed
            });
        }, 1000); // Delay video start by 1 second to let other resources load first
    });
    
    // Pause video when not visible to save resources
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(e => console.log('Could not play video:', e));
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.1 }); // Trigger when at least 10% of the video is visible
        
        observer.observe(heroVideo);
    }
}

// Function to highlight the current page in the navigation
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}


// Function to add scroll animation
function addScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in');
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Function to handle mobile navigation
function initMobileNavigation() {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenuBtn) return;
    
    // Add click event to toggle menu
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Toggle aria-expanded attribute for accessibility
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        
        // Prevent body scrolling when menu is open
        document.body.classList.toggle('nav-open');
    });
    
    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Function to add smooth scrolling for anchor links
function initSmoothScrolling() {
    // Check if the browser supports smooth scrolling
    if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
    } else {
        // Polyfill for browsers that don't support smooth scrolling
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Skip if it's just a "#" link
                if (this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
}

// Function to initialize image lightbox functionality
function initImageLightbox() {
    // Create lightbox elements if they don't exist
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'lightbox-content';
        
        const lightboxImage = document.createElement('img');
        lightboxImage.className = 'lightbox-image';
        lightboxImage.alt = 'Expanded image';
        
        const lightboxCaption = document.createElement('div');
        lightboxCaption.className = 'lightbox-caption';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-lightbox';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'Close lightbox');
        
        lightboxContent.appendChild(closeButton);
        lightboxContent.appendChild(lightboxImage);
        lightboxContent.appendChild(lightboxCaption);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        // Add close functionality
        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.querySelector('.lightbox.active')) {
                closeLightbox();
            }
        });
    }
    
    // Find all project images and add click event
    const projectImages = document.querySelectorAll('.image-wrapper');
    projectImages.forEach(imageWrapper => {
        imageWrapper.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.nextElementSibling?.classList.contains('image-caption') 
                ? this.nextElementSibling.textContent 
                : img.alt;
            
            openLightbox(img.src, caption);
        });
    });
}

// Function to open the lightbox
function openLightbox(imageSrc, caption) {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    // Set image source and caption
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    
    // Activate lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to close the lightbox
function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}