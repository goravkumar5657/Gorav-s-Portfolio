// Theme Management for Gorav Soni Portfolio
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.applyTheme(this.currentTheme);
        
        // Add event listener to theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        
        // Add theme transition class to body
        document.body.classList.add('theme-transition');
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }
    
    setStoredTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.warn('Could not save theme to localStorage:', e);
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.animateToggle();
    }
    
    applyTheme(theme) {
        this.currentTheme = theme;
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme icon
        this.updateThemeIcon(theme);
        
        // Save to localStorage
        this.setStoredTheme(theme);
        
        // Dispatch custom event
        this.dispatchThemeChange(theme);
        
        // Add smooth transition effect
        this.addTransitionEffect();
    }
    
    updateThemeIcon(theme) {
        if (!this.themeIcon) return;
        
        // Add animation class
        this.themeIcon.classList.add('animate-rotate');
        
        setTimeout(() => {
            if (theme === 'dark') {
                this.themeIcon.className = 'fas fa-moon';
            } else {
                this.themeIcon.className = 'fas fa-sun';
            }
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.themeIcon.classList.remove('animate-rotate');
            }, 300);
        }, 150);
    }
    
    animateToggle() {
        if (!this.themeToggle) return;
        
        // Add ripple effect
        this.themeToggle.classList.add('animate-pulse');
        
        setTimeout(() => {
            this.themeToggle.classList.remove('animate-pulse');
        }, 600);
    }
    
    addTransitionEffect() {
        // Create a smooth transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'dark' ? '#111827' : '#ffffff'};
            opacity: 0;
            z-index: 9999;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        `;
        
        document.body.appendChild(overlay);
        
        // Trigger transition
        requestAnimationFrame(() => {
            overlay.style.opacity = '0.1';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            }, 50);
        });
    }
    
    dispatchThemeChange(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme }
        });
        
        document.dispatchEvent(event);
    }
    
    // Method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Method to check if dark theme is active
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
    
    // Method to force a specific theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
}

// Enhanced theme utilities
class ThemeUtils {
    static getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    static addThemeAwareElement(element, lightClass, darkClass) {
        const updateElementTheme = (theme) => {
            element.classList.remove(lightClass, darkClass);
            element.classList.add(theme === 'dark' ? darkClass : lightClass);
        };
        
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            updateElementTheme(e.detail.theme);
        });
        
        // Set initial theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        updateElementTheme(currentTheme);
    }
    
    static createThemeButton(lightIcon = 'fas fa-sun', darkIcon = 'fas fa-moon') {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        
        const icon = document.createElement('i');
        icon.className = lightIcon;
        button.appendChild(icon);
        
        button.addEventListener('click', () => {
            if (window.themeManager) {
                window.themeManager.toggleTheme();
            }
        });
        
        return button;
    }
}

// Auto-initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ThemeUtils };
}
