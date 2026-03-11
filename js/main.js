// Language Toggle Functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'da'; // Default to Danish
        this.elements = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadSavedLanguage();
        this.updateLanguage();
    }

    cacheElements() {
        // Cache all elements with language data attributes
        this.elements = document.querySelectorAll('[data-da][data-en]');
        this.langButtons = document.querySelectorAll('.lang-btn');
        this.htmlElement = document.documentElement;
    }

    bindEvents() {
        // Language button clicks
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    this.smoothScroll(targetId);
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            this.handleHeaderScroll();
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['da', 'en'].includes(savedLang)) {
            this.currentLang = savedLang;
        }
    }

    setLanguage(lang) {
        if (['da', 'en'].includes(lang)) {
            this.currentLang = lang;
            localStorage.setItem('preferredLanguage', lang);
            this.updateLanguage();
            this.updateLanguageButtons();
            this.updateHTMLLang();
        }
    }

    updateLanguage() {
        this.elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    updateLanguageButtons() {
        this.langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    updateHTMLLang() {
        this.htmlElement.setAttribute('lang', this.currentLang);
    }

    smoothScroll(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleHeaderScroll() {
        const header = document.getElementById('header');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = '0 2px 10px var(--shadow-light)';
        }
    }

    toggleMobileMenu() {
        const nav = document.getElementById('nav');
        nav.classList.toggle('mobile-active');
        
        // Update hamburger icon
        const toggle = document.getElementById('mobile-menu-toggle');
        const icon = toggle.querySelector('i');
        if (nav.classList.contains('mobile-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}

// Intersection Observer for Animations
class ScrollAnimator {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupObserver();
            this.observeElements();
        }
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observeElements() {
        const elementsToAnimate = document.querySelectorAll(
            '.competency-card, .project-card, .education-card, .timeline-item'
        );

        elementsToAnimate.forEach(element => {
            element.classList.add('animate-on-scroll');
            this.observer.observe(element);
        });
    }
}

// Floating Contact Manager
class FloatingContact {
    constructor() {
        this.floatingButtons = document.querySelectorAll('.floating-btn');
        this.init();
    }

    init() {
        // Add click tracking for contact buttons
        this.floatingButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackContactClick(btn);
            });
        });

        // Show/hide floating buttons based on scroll
        this.handleFloatingButtonsVisibility();
    }

    trackContactClick(button) {
        const contactType = button.classList.contains('phone') ? 'phone' :
                          button.classList.contains('email') ? 'email' :
                          button.classList.contains('linkedin') ? 'linkedin' : 'unknown';
        
        // You could add analytics tracking here
        console.log(`Contact clicked: ${contactType}`);
    }

    handleFloatingButtonsVisibility() {
        let lastScrollY = window.scrollY;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const floatingContact = document.querySelector('.floating-contact');
                
                if (currentScrollY > 300) {
                    floatingContact.classList.add('visible');
                } else {
                    floatingContact.classList.remove('visible');
                }
                
                lastScrollY = currentScrollY;
            }, 100);
        });
    }
}

// Typing Animation for Hero Title
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-title');
        this.originalText = this.element.textContent;
        this.isTyping = false;
        this.init();
    }

    init() {
        // Only run animation once on page load
        if (this.element && !this.isTyping) {
            this.typeText();
        }
    }

    typeText() {
        this.isTyping = true;
        this.element.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < this.originalText.length) {
                this.element.textContent += this.originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                this.isTyping = false;
            }
        }, 50);
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language manager
    const languageManager = new LanguageManager();
    
    // Initialize scroll animations
    const scrollAnimator = new ScrollAnimator();
    
    // Initialize floating contact
    const floatingContact = new FloatingContact();
    
    // Initialize typing animation (optional - can be disabled for better performance)
    // const typingAnimation = new TypingAnimation();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .floating-contact {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .floating-contact.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .nav.mobile-active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--white);
            box-shadow: 0 10px 30px var(--shadow-medium);
            padding: 1rem 0;
        }
        
        .nav.mobile-active .nav-list {
            flex-direction: column;
            gap: 1rem;
        }
        
        @media (min-width: 768px) {
            .nav.mobile-active {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// Utility functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export for potential external use
window.LanguageManager = LanguageManager;
window.Utils = Utils;