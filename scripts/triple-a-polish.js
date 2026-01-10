/* ============================================
   TRIPLE-A GAMING POLISH - INTERACTIVE ENHANCEMENTS
   Lead Creative Director Implementation
   ============================================ */

class TripleAPolish {
    constructor() {
        this.emberCursor = null;
        this.intersectionObserver = null;
        this.proximityElements = [];
        this.ambientParticles = [];
        this.isInitialized = false;

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.setupProximityDetection();
        this.setupScrollRevealAnimations();
        this.setupAmbientParticles();
        this.setupAdvancedInteractions();
        this.setupMobileMenu(); // New Mobile Menu Logic
        this.setupPerformanceOptimizations();

        this.isInitialized = true;
        console.log('🎮 Triple-A Polish System Initialized');
    }

    /* ============================================
       TORCH PROXIMITY LIGHTING SYSTEM
       ============================================ */

    setupProximityDetection() {
        this.proximityElements = document.querySelectorAll('.torch-reveal, .proximity-glow');

        if (!this.proximityElements.length) return;

        // Listen for ember cursor updates
        document.addEventListener('mousemove', this.handleCursorProximity.bind(this));

        // Enhanced hover effects with proximity calculation
        this.proximityElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('ember-proximity');
                this.addProximityGlow(element);
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('ember-proximity');
                this.removeProximityGlow(element);
            });
        });
    }

    handleCursorProximity(e) {
        const cursor = { x: e.clientX, y: e.clientY };
        const proximityThreshold = 120;

        this.proximityElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };

            const distance = Math.sqrt(
                Math.pow(cursor.x - elementCenter.x, 2) +
                Math.pow(cursor.y - elementCenter.y, 2)
            );

            if (distance < proximityThreshold) {
                const intensity = 1 - (distance / proximityThreshold);
                this.applyProximityEffect(element, intensity);
            } else {
                this.removeProximityEffect(element);
            }
        });
    }

    applyProximityEffect(element, intensity) {
        element.style.setProperty('--proximity-intensity', intensity);
        element.classList.add('ember-proximity');

        // Dynamic lighting based on distance
        const lightIntensity = intensity * 0.3;
        element.style.filter = `brightness(${1 + lightIntensity}) contrast(${1 + lightIntensity * 0.5})`;
    }

    removeProximityEffect(element) {
        element.style.removeProperty('--proximity-intensity');
        element.classList.remove('ember-proximity');
        element.style.filter = '';
    }

    addProximityGlow(element) {
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        element.style.transform = 'translateZ(0) scale(1.02)';
    }

    removeProximityGlow(element) {
        element.style.transform = 'translateZ(0) scale(1)';
    }

    /* ============================================
       SCROLL REVEAL ANIMATION SYSTEM
       ============================================ */

    setupScrollRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-stagger');

        if (!revealElements.length) return;

        // Enhanced Intersection Observer with sophisticated timing
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Staggered reveal with premium easing
                    setTimeout(() => {
                        entry.target.classList.add('in-view');
                        this.addRevealGlow(entry.target);
                    }, this.getStaggerDelay(entry.target));
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        revealElements.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    getStaggerDelay(element) {
        const siblings = Array.from(element.parentElement.children);
        const index = siblings.indexOf(element);
        return index * 150; // 150ms stagger
    }

    addRevealGlow(element) {
        // Removed automatic boxShadow/textShadow to prevent weird borders on containers
    }

    /* ============================================
       AMBIENT PARTICLE SYSTEM
       ============================================ */

    setupAmbientParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'ambient-particles-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        document.body.appendChild(particleContainer);

        // Create ambient particles with varying properties
        for (let i = 0; i < 20; i++) {
            this.createAmbientParticle(particleContainer, i);
        }
    }

    createAmbientParticle(container, index) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';

        // Randomize particle properties
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.3 + 0.1;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * duration;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(${Math.random() > 0.5 ? '30, 58, 138' : '96, 165, 250'}, ${opacity}); /* Changed from red/orange to dark blue/light blue */
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            animation: ambient-float ${duration}s linear infinite;
            animation-delay: -${delay}s;
            pointer-events: none;
        `;

        container.appendChild(particle);
        this.ambientParticles.push(particle);
    }

    /* ============================================
       ADVANCED MICRO-INTERACTIONS
       ============================================ */

    setupAdvancedInteractions() {
        // Enhanced button click feedback
        this.setupButtonFeedback();

        // Dynamic chromatic aberration
        this.setupChromaticAberration();

        // Cinematic depth of field
        this.setupDepthOfField();
    }

    /* ============================================
       MOBILE NAVIGATION SYSTEM
       ============================================ */

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileOverlay = document.querySelector('.mobile-nav-overlay');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        const closeButton = document.querySelector('.mobile-nav-close');

        if (!mobileToggle || !mobileOverlay) return;

        const toggleMenu = (isActive) => {
            mobileToggle.classList.toggle('active', isActive);
            mobileOverlay.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
            mobileToggle.setAttribute('aria-expanded', isActive);
        };

        mobileToggle.addEventListener('click', () => {
            const isActive = !mobileToggle.classList.contains('active');
            toggleMenu(isActive);
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });
    }

    setupButtonFeedback() {
        const buttons = document.querySelectorAll('.cta-primary, .btn-wishlist, .btn-trailer');

        buttons.forEach(button => {
            button.addEventListener('mousedown', (e) => {
                this.createRippleEffect(e, button);
                this.addClickTransform(button);
            });

            button.addEventListener('mouseup', () => {
                this.removeClickTransform(button);
            });

            button.addEventListener('mouseleave', () => {
                this.removeClickTransform(button);
            });
        });
    }

    createRippleEffect(e, button) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-expand 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            pointer-events: none;
            z-index: 1;
        `;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    addClickTransform(button) {
        button.style.transform = 'translateY(-1px) scale(0.98)';
        button.style.transition = 'all 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
    }

    removeClickTransform(button) {
        button.style.transform = '';
        button.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    setupChromaticAberration() {
        const chromaticElements = document.querySelectorAll('.chromatic-aberration');

        chromaticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.activateChromaticAberration(element);
            });

            element.addEventListener('mouseleave', () => {
                this.deactivateChromaticAberration(element);
            });
        });
    }

    activateChromaticAberration(element) {
        element.style.filter = 'drop-shadow(1px 0 0 rgba(255, 0, 0, 0.1)) drop-shadow(-1px 0 0 rgba(0, 255, 255, 0.1))';
    }

    deactivateChromaticAberration(element) {
        element.style.filter = '';
    }

    setupDepthOfField() {
        const depthElements = document.querySelectorAll('.depth-blur');

        document.addEventListener('mousemove', (e) => {
            depthElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const distance = this.getDistanceFromCenter(e, rect);
                const maxDistance = Math.max(window.innerWidth, window.innerHeight);
                const blurAmount = (distance / maxDistance) * 1.5;

                element.style.filter = `blur(${Math.min(blurAmount, 1)}px)`;
            });
        });
    }

    getDistanceFromCenter(mouseEvent, rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return Math.sqrt(
            Math.pow(mouseEvent.clientX - centerX, 2) +
            Math.pow(mouseEvent.clientY - centerY, 2)
        );
    }

    /* ============================================
       PERFORMANCE OPTIMIZATIONS
       ============================================ */

    setupPerformanceOptimizations() {
        // Throttled scroll and mouse events
        this.throttle = this.createThrottle();

        // Disable heavy effects on mobile/low-end devices
        if (this.isLowEndDevice()) {
            this.enablePerformanceMode();
        }

        // Page visibility optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    createThrottle() {
        let lastRun = 0;
        return (fn, limit = 16) => { // 60fps limit
            return function (...args) {
                if (Date.now() - lastRun >= limit) {
                    fn.apply(this, args);
                    lastRun = Date.now();
                }
            };
        };
    }

    isLowEndDevice() {
        return navigator.hardwareConcurrency <= 4 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    enablePerformanceMode() {
        document.body.classList.add('performance-mode');
        this.ambientParticles.forEach(particle => particle.remove());
        this.ambientParticles = [];
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    /* ============================================
       PUBLIC API & CLEANUP
       ============================================ */

    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }

        this.ambientParticles.forEach(particle => particle.remove());
        document.querySelector('.ambient-particles-container')?.remove();

        console.log('🎮 Triple-A Polish System Destroyed');
    }

    // Public methods for external control
    setProximityThreshold(threshold) {
        this.proximityThreshold = threshold;
    }

    enableCinematicMode() {
        document.body.classList.add('cinematic-mode');
    }

    disableCinematicMode() {
        document.body.classList.remove('cinematic-mode');
    }
}

// Add required CSS animations
const polishStyles = document.createElement('style');
polishStyles.textContent = `
    @keyframes ripple-expand {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    .performance-mode .ambient-particle,
    .performance-mode .chromatic-aberration::before,
    .performance-mode .chromatic-aberration::after {
        display: none !important;
    }
    
    .cinematic-mode {
        filter: contrast(1.1) saturate(1.2);
    }
`;
document.head.appendChild(polishStyles);

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tripleAPolish = new TripleAPolish();
    });
} else {
    window.tripleAPolish = new TripleAPolish();
}

// Export for manual initialization
window.TripleAPolish = TripleAPolish;
