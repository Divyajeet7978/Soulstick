/* ============================================
   SCROLL SYNCHRONIZATION - LENIS INTEGRATION
   Advanced smooth scrolling with WebGL sync
   ============================================ */

class ScrollSync {
    constructor() {
        this.lenis = null;
        this.scrollCallbacks = new Map();
        this.isInitialized = false;
        this.scrollProgress = 0;
        this.scrollDirection = 'down';
        this.lastScrollY = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;

        this.init();
    }

    async init() {
        // Wait for Lenis to be available
        await this.waitForDependencies();

        if (!window.Lenis) {
            console.warn('Lenis not available, using fallback scroll');
            this.setupFallback();
            return;
        }

        this.setupLenis();
        this.bindScrollEvents();
        this.setupScrollTriggers();

        this.isInitialized = true;
        console.log('📜 Scroll synchronization initialized');
    }

    async waitForDependencies() {
        return new Promise((resolve) => {
            const checkDependencies = () => {
                if (window.Lenis && window.gsap) {
                    resolve();
                } else {
                    setTimeout(checkDependencies, 100);
                }
            };
            checkDependencies();
        });
    }

    setupLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false, // Disable on touch devices for better performance
            touchMultiplier: 2,
            wheelMultiplier: 1,
            infinite: false
        });

        // Integrate with GSAP
        if (window.gsap && gsap.ticker) {
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    bindScrollEvents() {
        if (!this.lenis) return;

        this.lenis.on('scroll', this.handleScroll.bind(this));

        // Additional scroll events
        window.addEventListener('scroll', this.handleNativeScroll.bind(this), { passive: true });
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });

        // Touch events for mobile
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        window.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleScroll(e) {
        this.scrollProgress = e.progress;
        this.scrollDirection = e.direction > 0 ? 'down' : 'up';
        this.isScrolling = true;

        // Clear existing timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        // Set scroll end timeout
        this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
            this.onScrollEnd();
        }, 150);

        // Execute scroll callbacks
        this.scrollCallbacks.forEach((callback, id) => {
            try {
                callback(e);
            } catch (error) {
                console.warn(`Scroll callback ${id} failed:`, error);
            }
        });

        // Sync with WebGL if available
        this.syncWithWebGL(e);

        // Update CSS custom properties
        document.documentElement.style.setProperty('--scroll-progress', this.scrollProgress);
        document.documentElement.style.setProperty('--scroll-direction', this.scrollDirection === 'down' ? '1' : '-1');
    }

    handleNativeScroll() {
        // Fallback for when Lenis isn't available
        if (this.lenis) return;

        const scrollY = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

        this.scrollProgress = scrollY / documentHeight;
        this.scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = scrollY;

        // Update CSS custom properties
        document.documentElement.style.setProperty('--scroll-progress', this.scrollProgress);
        document.documentElement.style.setProperty('--scroll-direction', this.scrollDirection === 'down' ? '1' : '-1');
    }

    handleWheel(e) {
        // Custom wheel handling for better control
        if (this.lenis && Math.abs(e.deltaY) > 10) {
            e.preventDefault();
        }
    }

    handleTouchStart() {
        // Prepare for touch scrolling
        document.body.classList.add('touch-scrolling');
    }

    handleTouchEnd() {
        // Clean up touch scrolling
        setTimeout(() => {
            document.body.classList.remove('touch-scrolling');
        }, 100);
    }

    onScrollEnd() {
        // Emit scroll end event
        document.dispatchEvent(new CustomEvent('scrollEnd', {
            detail: {
                progress: this.scrollProgress,
                direction: this.scrollDirection
            }
        }));
    }

    syncWithWebGL(scrollData) {
        // Sync scroll with WebGL atmosphere
        if (window.webglAtmosphere && window.webglAtmosphere.isInitialized) {
            const intensity = 0.5 + (this.scrollProgress * 0.5);
            window.webglAtmosphere.setIntensity(intensity);
        }

        // Sync with ember cursor
        if (window.emberCursor) {
            const revealRadius = 150 + (this.scrollProgress * 100);
            window.emberCursor.setRevealRadius(revealRadius);
        }
    }

    setupScrollTriggers() {
        if (!window.gsap || !gsap.ScrollTrigger) {
            console.warn('GSAP ScrollTrigger not available');
            return;
        }

        // Register GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Refresh ScrollTrigger when Lenis updates
        if (this.lenis) {
            this.lenis.on('scroll', ScrollTrigger.update);
        }

        this.setupSectionAnimations();
        this.setupParallaxEffects();
        this.setupRevealAnimations();
    }

    setupSectionAnimations() {
        // Hero section animation
        gsap.fromTo('.hero-title .title-line', {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Hero subtitle animation
        gsap.fromTo('.hero-subtitle', {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.hero-subtitle',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // CTA button animation
        gsap.fromTo('.cta-primary', {
            y: 30,
            opacity: 0,
            scale: 0.9
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.hero-cta',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    setupParallaxEffects() {
        // Game artwork parallax
        gsap.to('.game-visual', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.featured-game',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });

        // Floating embers parallax
        gsap.to('.floating-embers .ember', {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // Value cards stagger
        gsap.fromTo('.value-card', {
            y: 60,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.values-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    setupRevealAnimations() {
        // Section titles
        gsap.fromTo('.section-title', {
            y: 40,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.section-title',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Game features
        gsap.fromTo('.feature', {
            x: -30,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.game-features',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Contact elements
        gsap.fromTo('.contact-link', {
            x: -20,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-methods',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    setupFallback() {
        // Basic scroll detection without Lenis
        window.addEventListener('scroll', this.handleNativeScroll.bind(this), { passive: true });

        // Basic CSS-only animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });

        // Observe elements that should animate
        document.querySelectorAll('.reveal-up, .reveal-fade, .value-card, .feature').forEach(el => {
            observer.observe(el);
        });

        console.log('📜 Fallback scroll system initialized');
    }

    // Public API
    scrollTo(target, options = {}) {
        if (this.lenis) {
            this.lenis.scrollTo(target, {
                duration: options.duration || 1.2,
                easing: options.easing,
                immediate: options.immediate || false,
                ...options
            });
        } else {
            // Fallback smooth scroll
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    scrollToTop() {
        this.scrollTo(0, { duration: 1.5 });
    }

    addScrollCallback(id, callback) {
        this.scrollCallbacks.set(id, callback);
    }

    removeScrollCallback(id) {
        this.scrollCallbacks.delete(id);
    }

    getScrollProgress() {
        return this.scrollProgress;
    }

    getScrollDirection() {
        return this.scrollDirection;
    }

    pause() {
        if (this.lenis) {
            this.lenis.stop();
        }
    }

    resume() {
        if (this.lenis) {
            this.lenis.start();
        }
    }

    destroy() {
        if (this.lenis) {
            this.lenis.destroy();
        }

        if (window.gsap && gsap.ScrollTrigger) {
            ScrollTrigger.killAll();
        }

        this.scrollCallbacks.clear();

        window.removeEventListener('scroll', this.handleNativeScroll);
        window.removeEventListener('wheel', this.handleWheel);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchend', this.handleTouchEnd);

        console.log('📜 Scroll sync destroyed');
    }
}

// CSS for fallback animations
const scrollStyles = document.createElement('style');
scrollStyles.textContent = `
    .reveal-up,
    .reveal-fade,
    .value-card,
    .feature {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .reveal-up.visible,
    .reveal-fade.visible,
    .value-card.visible,
    .feature.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(scrollStyles);

// Export for global access
window.ScrollSync = ScrollSync;
