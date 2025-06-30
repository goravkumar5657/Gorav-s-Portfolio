// Premium Animations for Gorav Soni Portfolio
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        }
        
        // Initialize custom animations
        this.initScrollAnimations();
        this.initTypingAnimations();
        this.initProgressBars();
        this.initCounters();
        this.initHoverEffects();
        this.initLoadingAnimation();
        this.initScrollIndicator();
        this.initParticleEffects();
        
        this.isInitialized = true;
    }
    
    // Typing Animation for Hero Section
    initTypingAnimations() {
        const typedName = document.getElementById('typed-name');
        const typedSubtitle = document.getElementById('typed-subtitle');
        
        if (typedName) {
            this.typeText(typedName, 'Gorav Soni', 100);
        }
        
        if (typedSubtitle) {
            setTimeout(() => {
                this.typeText(typedSubtitle, 'Premium Frontend Developer', 80);
            }, 1000);
        }
    }
    
    typeText(element, text, speed = 100) {
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        element.style.animation = 'blink-caret 0.75s step-end infinite';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                // Remove cursor after typing
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 1000);
            }
        }, speed);
        
        return timer;
    }
    
    // Scroll-based Animations
    initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        // Create observer for reveal animations
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Add reveal elements
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        revealElements.forEach(el => revealObserver.observe(el));
        
        this.observers.set('reveal', revealObserver);
    }
    
    // Animated Progress Bars
    initProgressBars() {
        if (!('IntersectionObserver' in window)) return;
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('data-width') || '0';
                    
                    setTimeout(() => {
                        progressBar.style.width = targetWidth + '%';
                        progressBar.classList.add('progress-animate');
                    }, 300);
                    
                    progressObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });
        
        const progressBars = document.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => progressObserver.observe(bar));
        
        this.observers.set('progress', progressObserver);
    }
    
    // Animated Counters
    initCounters() {
        if (!('IntersectionObserver' in window)) return;
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count') || '0');
                    
                    this.animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => counterObserver.observe(counter));
        
        this.observers.set('counter', counterObserver);
    }
    
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
        
        return timer;
    }
    
    // Enhanced Hover Effects
    initHoverEffects() {
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            this.addHoverEffect(card, 'hover-lift');
        });
        
        // Buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            this.addRippleEffect(btn);
            this.addMagneticEffect(btn);
        });
        
        // Tech icons
        const techIcons = document.querySelectorAll('.tech-icon');
        techIcons.forEach(icon => {
            this.addHoverEffect(icon, 'hover-bounce');
        });
        
        // Social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            this.addHoverEffect(link, 'hover-scale');
        });
    }
    
    addHoverEffect(element, className) {
        element.classList.add(className);
    }
    
    addRippleEffect(element) {
        element.classList.add('btn-ripple');
        
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
    
    addMagneticEffect(element) {
        element.classList.add('btn-magnetic');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }
    
    // Page Loading Animation
    initLoadingAnimation() {
        const loader = document.getElementById('page-loader');
        if (!loader) return;
        
        // Hide loader after page loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                
                // Remove loader from DOM after animation
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 500);
                
                // Trigger entrance animations
                this.triggerEntranceAnimations();
            }, 500);
        });
    }
    
    triggerEntranceAnimations() {
        // Animate hero section elements
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent) {
            heroContent.classList.add('animate-fade-in-up');
        }
        
        if (heroImage) {
            setTimeout(() => {
                heroImage.classList.add('animate-fade-in-right');
            }, 200);
        }
        
        // Animate navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('animate-fade-in-down');
        }
    }
    
    // Scroll Progress Indicator
    initScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<div class="scroll-progress"></div>';
        
        document.body.appendChild(indicator);
        
        const progress = indicator.querySelector('.scroll-progress');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const maxHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrolled / maxHeight) * 100;
            
            progress.style.width = scrollPercent + '%';
        });
    }
    
    // Particle Effects
    initParticleEffects() {
        const particleContainer = document.querySelector('.hero-particles');
        if (!particleContainer) return;
        
        this.createParticles(particleContainer, 20);
    }
    
    createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${6 + Math.random() * 4}s;
            `;
            
            container.appendChild(particle);
        }
    }
    
    // Text Reveal Animation
    initTextReveal(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.animationDelay = `${index * 0.1}s`;
            element.appendChild(span);
        });
        
        element.classList.add('text-reveal');
    }
    
    // Form Animations
    initFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        group.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    group.classList.add('focused');
                }
            }
        });
    }
    
    // Navigation Link Animation
    initNavAnimation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.classList.add('animate-pulse');
            });
            
            link.addEventListener('mouseleave', () => {
                link.classList.remove('animate-pulse');
            });
        });
    }
    
    // Stagger Animation Helper
    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }
    
    // Cleanup observers
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animations.clear();
    }
    
    // Public method to trigger custom animations
    animate(element, animationClass, duration = null) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;
        
        element.classList.add(animationClass);
        
        if (duration) {
            setTimeout(() => {
                element.classList.remove(animationClass);
            }, duration);
        }
    }
    
    // Method to refresh AOS animations
    refreshAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}

// Utility functions for animations
const AnimationUtils = {
    // Add CSS class with animation
    addAnimationClass(element, className, duration = null) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;
        
        element.classList.add(className);
        
        if (duration) {
            setTimeout(() => {
                element.classList.remove(className);
            }, duration);
        }
    },
    
    // Wait for animation to complete
    waitForAnimation(element, animationName) {
        return new Promise(resolve => {
            const onAnimationEnd = () => {
                element.removeEventListener('animationend', onAnimationEnd);
                resolve();
            };
            
            element.addEventListener('animationend', onAnimationEnd);
        });
    },
    
    // Check if reduced motion is preferred
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Safe animation execution
    safeAnimate(callback) {
        if (!this.prefersReducedMotion()) {
            callback();
        }
    }
};

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Re-initialize animations when AOS is available
document.addEventListener('aos:init', () => {
    if (window.animationController) {
        window.animationController.refreshAOS();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnimationController, AnimationUtils };
}
