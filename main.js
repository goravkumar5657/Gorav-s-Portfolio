// Main JavaScript for Gorav Soni Portfolio
class PortfolioApp {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'home';
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        // Initialize all components
        this.initNavigation();
        this.initSmoothScrolling();
        this.initMobileMenu();
        this.initContactForm();
        this.initScrollSpy();
        this.initKeyboardNavigation();
        this.initLazyLoading();
        this.initServiceWorker();
        
        this.isInitialized = true;
        
        // Dispatch app ready event
        document.dispatchEvent(new CustomEvent('portfolioReady'));
    }
    
    // Navigation System
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetSection = link.getAttribute('data-section');
                const targetElement = document.getElementById(targetSection);
                
                if (targetElement) {
                    this.scrollToSection(targetElement);
                    this.updateActiveNavLink(link);
                    this.closeMobileMenu();
                }
            });
        });
        
        // Handle brand link
        const brandLink = document.querySelector('.brand-link');
        if (brandLink) {
            brandLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
                this.updateActiveNavLink(document.querySelector('.nav-link[data-section="home"]'));
                this.closeMobileMenu();
            });
        }
    }
    
    // Smooth Scrolling
    initSmoothScrolling() {
        // Handle all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') {
                    e.preventDefault();
                    this.scrollToTop();
                    return;
                }
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    this.scrollToSection(targetElement);
                }
            });
        });
    }
    
    scrollToSection(element, offset = 70) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Mobile Menu
    initMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            this.isMenuOpen = !this.isMenuOpen;
            
            navMenu.classList.toggle('active', this.isMenuOpen);
            navToggle.classList.toggle('active', this.isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
            
            // Animate hamburger icon
            this.animateHamburger(navToggle, this.isMenuOpen);
        }
    }
    
    closeMobileMenu() {
        if (!this.isMenuOpen) return;
        
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            this.isMenuOpen = false;
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            this.animateHamburger(navToggle, false);
        }
    }
    
    animateHamburger(toggle, isOpen) {
        const spans = toggle.querySelectorAll('span');
        
        if (spans.length >= 3) {
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }
    
    // Contact Form
    initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            // Check if form uses FormSubmit (has action attribute)
            const isFormSubmit = contactForm.hasAttribute('action') && contactForm.getAttribute('action').includes('formsubmit.co');
            
            if (isFormSubmit) {
                // For FormSubmit, we'll add validation and animations but let the form submit naturally
                contactForm.addEventListener('submit', (e) => {
                    if (!this.validateForm(contactForm)) {
                        e.preventDefault();
                        this.showFormMessage('error', 'Please fill in all required fields correctly.');
                        return;
                    }
                    
                    // Show loading state
                    this.showFormLoadingState(contactForm);
                });
            } else {
                // For custom handling (fallback)
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmission(contactForm);
                });
            }
            
            // Real-time validation and animations
            const formInputs = contactForm.querySelectorAll('input, textarea');
            formInputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
                input.addEventListener('focus', () => this.animateFormField(input, 'focus'));
                input.addEventListener('blur', () => this.animateFormField(input, 'blur'));
            });
            
            // Initialize form animations
            this.initFormAnimations();
        }
    }
    
    async handleFormSubmission(form) {
        const submitButton = form.querySelector('.form-submit');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span><div class="loading-dots"><span></span><span></span><span></span></div>';
        submitButton.disabled = true;
        
        try {
            // Validate form
            if (!this.validateForm(form)) {
                throw new Error('Please fill in all required fields correctly.');
            }
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate form submission (replace with actual endpoint)
            await this.submitFormData(data);
            
            // Show success message
            this.showFormMessage('success', 'Thank you! Your message has been sent successfully.');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage('error', error.message || 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    async submitFormData(data) {
        // Simulate API call - replace with actual form handler
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (data.email && data.name && data.message) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Missing required fields'));
                }
            }, 2000);
        });
    }
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        // Name validation
        else if (field.name === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            }
        }
        // Message validation
        else if (field.name === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long.';
            }
        }
        
        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }
    
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');
        
        if (message) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
            field.classList.add('error');
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.classList.remove('error');
        }
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        field.classList.remove('error');
    }
    
    showFormMessage(type, message) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        const form = document.querySelector('.contact-form');
        form.appendChild(messageElement);
        
        // Add animation
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('hide');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 5000);
    }
    
    showFormLoadingState(form) {
        const submitButton = form.querySelector('.form-submit');
        if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = `
                <span>Sending...</span>
                <div class="loading-spinner"></div>
            `;
            submitButton.disabled = true;
            submitButton.classList.add('loading');
        }
    }
    
    animateFormField(field, action) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        if (action === 'focus') {
            formGroup.classList.add('focused');
            field.classList.add('animate-scale-in');
        } else if (action === 'blur') {
            if (!field.value.trim()) {
                formGroup.classList.remove('focused');
            }
            field.classList.remove('animate-scale-in');
        }
    }
    
    // Enhanced form animations
    initFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach((group, index) => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                // Check if input has value on load
                if (input.value.trim()) {
                    group.classList.add('focused');
                }
                
                // Add stagger animation on load
                setTimeout(() => {
                    group.classList.add('animate-fade-in-up');
                }, index * 100);
            }
        });
        
        // Animate submit button
        const submitButton = document.querySelector('.form-submit');
        if (submitButton) {
            setTimeout(() => {
                submitButton.classList.add('animate-fade-in-up');
            }, formGroups.length * 100);
        }
    }
    
    // Scroll Spy for Navigation
    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        
        const scrollSpyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.currentSection = sectionId;
                    
                    // Update active nav link
                    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                    if (activeLink) {
                        this.updateActiveNavLink(activeLink);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-70px 0px -70px 0px'
        });
        
        sections.forEach(section => {
            scrollSpyObserver.observe(section);
        });
    }
    
    updateActiveNavLink(activeLink) {
        // Remove active class from all links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Keyboard Navigation
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navigation shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'h':
                        e.preventDefault();
                        this.navigateToSection('home');
                        break;
                    case 'a':
                        e.preventDefault();
                        this.navigateToSection('about');
                        break;
                    case 's':
                        e.preventDefault();
                        this.navigateToSection('skills');
                        break;
                    case 'p':
                        e.preventDefault();
                        this.navigateToSection('projects');
                        break;
                    case 'c':
                        e.preventDefault();
                        this.navigateToSection('contact');
                        break;
                }
            }
            
            // Theme toggle shortcut
            if (e.key === 'T' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (window.themeManager) {
                    window.themeManager.toggleTheme();
                }
            }
        });
    }
    
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            this.scrollToSection(section);
        }
    }
    
    // Lazy Loading
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.setAttribute('src', src);
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Service Worker for PWA support
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered successfully:', registration.scope);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    }
    
    // Utility methods
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
    }
    
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
        }
    }
    
    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                
                // Send to analytics if needed
                if (window.gtag) {
                    gtag('event', 'page_load_time', {
                        value: Math.round(loadTime),
                        custom_parameter: 'portfolio_performance'
                    });
                }
            });
        }
    }
    
    // Error handling
    initErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
            
            // Send to error tracking service if needed
            if (window.Sentry) {
                Sentry.captureException(e.error);
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            
            if (window.Sentry) {
                Sentry.captureException(e.reason);
            }
        });
    }
    
    // Public API methods
    getCurrentSection() {
        return this.currentSection;
    }
    
    isMenuOpen() {
        return this.isMenuOpen;
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners and cleanup
        this.isInitialized = false;
    }
}

// CSS for form validation and messages
const formStyles = `
    .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: "⚠";
        font-size: 0.75rem;
    }
    
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444;
        background-color: rgba(239, 68, 68, 0.05);
    }
    
    .form-message {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        animation: slideInUp 0.3s ease-out;
    }
    
    .form-message-success {
        background-color: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #059669;
    }
    
    .form-message-error {
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #dc2626;
    }
    
    .loading-dots {
        display: inline-flex;
        gap: 4px;
    }
    
    .loading-dots span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
        animation: loadingDots 1.4s ease-in-out infinite both;
    }
    
    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes loadingDots {
        0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;

// Inject form styles
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);

// Initialize the application
window.portfolioApp = new PortfolioApp();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
