/* ============================================
   SOULSTICK INTERACTIVE - MAIN APPLICATION
   Triple-A Gaming Studio Website Experience
   ============================================ */

class SoulstickApp {
    constructor() {
        this.isInitialized = false;
        this.loadingScreen = null;
        this.emberCursor = null;
        this.webglAtmosphere = null;
        this.scrollSync = null;
        this.startTime = performance.now();
        this.isDebugMode = false;

        // System states
        this.systems = {
            webgl: false,
            cursor: false,
            scroll: false,
            audio: false
        };

        // Performance monitoring
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionDelay: 0
        };

        this.init();
    }

    async init() {
        console.log('🎮 Initializing Soulstick Interactive Experience...');

        // CHECK THEME PREFERENCE IMMEDIATELY (Before Render)
        // This prevents flash of wrong theme
        this.initTheme();

        // Show loading screen
        this.showLoadingScreen();

        // Initialize systems in optimal order
        await this.initializeSystems();

        // Setup interactions
        this.setupInteractions();

        // Setup performance monitoring
        this.setupPerformanceMonitoring();

        // Hide loading screen and reveal content
        await this.startExperience();

        // Mark as initialized
        this.isInitialized = true;
        this.metrics.loadTime = performance.now() - this.startTime;

        console.log(`✨ Soulstick Experience ready in ${Math.round(this.metrics.loadTime)}ms`);
    }

    initTheme() {
        const savedTheme = localStorage.getItem('soulstick-theme');
        // Default is dark (handled by CSS defaults), only apply light if saved
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    showLoadingScreen() {
        this.loadingScreen = document.getElementById('loading-overlay');
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '1';
            this.loadingScreen.style.pointerEvents = 'auto';
        }
    }

    async initializeSystems() {
        const systems = [];

        // Initialize WebGL atmosphere (background)
        systems.push(this.initializeWebGL());

        // Initialize ember cursor system
        systems.push(this.initializeEmberCursor());

        // Initialize scroll synchronization
        systems.push(this.initializeScrollSync());

        // Initialize audio system (DISABLED)
        // systems.push(this.initializeAudio());
        this.systems.audio = false; // Audio disabled but logic preserved

        // Wait for all systems to initialize
        try {
            await Promise.allSettled(systems);
        } catch (error) {
            console.warn('Some systems failed to initialize:', error);
        }

        // Check system status
        this.checkSystemHealth();
    }

    async initializeWebGL() {
        return new Promise((resolve) => {
            try {
                this.webglAtmosphere = new WebGLAtmosphere();
                this.systems.webgl = true;
                window.webglAtmosphere = this.webglAtmosphere;
                console.log('🌌 WebGL atmosphere initialized');
                resolve();
            } catch (error) {
                console.warn('WebGL initialization failed:', error);
                this.systems.webgl = false;
                resolve();
            }
        });
    }

    async initializeEmberCursor() {
        return new Promise((resolve) => {
            try {
                this.emberCursor = new EmberCursor();
                this.systems.cursor = true;
                window.emberCursor = this.emberCursor;
                console.log('🔥 Ember cursor initialized');
                resolve();
            } catch (error) {
                console.warn('Ember cursor initialization failed:', error);
                this.systems.cursor = false;
                resolve();
            }
        });
    }

    async initializeScrollSync() {
        return new Promise((resolve) => {
            try {
                this.scrollSync = new ScrollSync();
                this.systems.scroll = true;
                window.scrollSync = this.scrollSync;
                console.log('📜 Scroll sync initialized');
                resolve();
            } catch (error) {
                console.warn('Scroll sync initialization failed:', error);
                this.systems.scroll = false;
                resolve();
            }
        });
    }

    async initializeAudio() {
        // AUDIO DISABLED - Logic preserved but not executed
        return new Promise((resolve) => {
            try {
                // this.setupAudioContext(); // Disabled
                this.systems.audio = false; // Permanently disabled
                console.log('🔇 Audio system disabled (logic preserved)');
                resolve();
            } catch (error) {
                console.warn('Audio initialization failed:', error);
                this.systems.audio = false;
                resolve();
            }
        });
    }

    setupAudioContext() {
        // DISABLED - Initialize Web Audio API for ambient sounds
        // Logic preserved but not executed
        return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // Create ambient soundscape (optional enhancement)
            this.createAmbientSound();
        } catch (error) {
            console.warn('Audio context creation failed:', error);
        }
    }

    createAmbientSound() {
        if (!this.audioContext) return;

        // Create subtle ambient drone
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(55, this.audioContext.currentTime); // Low A

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);

        this.ambientOscillator = oscillator;
        this.ambientGain = gainNode;
    }

    setupInteractions() {
        this.setupNavigationClicks();
        this.setupThemeToggle(); // NEW: Light/Dark Mode
        this.setupMagneticElements();
        this.setupScrollToLinks();
        this.setupFormSubmissions();
        this.setupKeyboardShortcuts();
        this.setupMobileOptimizations();
    }

    setupThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');

        // Initial Icon State
        const currentTheme = localStorage.getItem('soulstick-theme') || 'dark';
        this.updateThemeIcon(currentTheme === 'light');

        if (!toggleBtn) return; // Guard clause if button not in DOM yet

        toggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';

            // Toggle Attribute
            if (newTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }

            // Save Preference
            localStorage.setItem('soulstick-theme', newTheme);

            // Update UI
            this.updateThemeIcon(newTheme === 'light');

            // Feedback
            const themeName = newTheme === 'light' ? 'Light' : 'Dark';
            this.showNotification(`${themeName} Mode Activated`, 'info');
        });
    }

    updateThemeIcon(isLight) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        // Update Icon Content (Sun vs Moon)
        if (isLight) {
            // Moon Icon for Light Mode (to switch to Dark)
            // Or usually the icon represents the CURRENT state or TARGET state?
            // Let's show the "Moon" when in Light mode (click to go Dark)
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        } else {
            // Sun Icon for Dark Mode (click to go Light)
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        }
    }

    setupNavigationClicks() {
        // Smooth scroll navigation
        document.querySelectorAll('[data-scroll-to]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const target = element.getAttribute('data-scroll-to');
                if (this.scrollSync) {
                    this.scrollSync.scrollTo(target);
                }

                // Pulse cursor effect
                if (this.emberCursor) {
                    this.emberCursor.pulseEffect();
                }
            });
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    if (this.scrollSync) {
                        this.scrollSync.scrollTo(href);
                    }
                }
            });
        });
    }

    setupMagneticElements() {
        // Add magnetic class to interactive elements
        document.querySelectorAll('button, .nav-link, .contact-link').forEach(element => {
            element.classList.add('magnetic-element');
        });
    }

    setupScrollToLinks() {
        // Auto-scroll to sections on load if hash is present
        if (window.location.hash) {
            setTimeout(() => {
                if (this.scrollSync) {
                    this.scrollSync.scrollTo(window.location.hash);
                }
            }, 1000);
        }
    }

    setupFormSubmissions() {
        // Newsletter signup form
        const signupForm = document.querySelector('.signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleNewsletterSignup.bind(this));
        }
    }

    handleNewsletterSignup(e) {
        e.preventDefault();
        const email = e.target.querySelector('.email-input').value;

        if (this.validateEmail(email)) {
            // Show success feedback
            this.showNotification('Thank you for subscribing! 🔥', 'success');
            e.target.reset();

            // Pulse cursor
            if (this.emberCursor) {
                this.emberCursor.pulseEffect();
            }
        } else {
            this.showNotification('Please enter a valid email address', 'error');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Debug mode toggle (Ctrl + D)
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.toggleDebugMode();
            }

            // Scroll to top (Home key)
            if (e.key === 'Home') {
                e.preventDefault();
                if (this.scrollSync) {
                    this.scrollSync.scrollToTop();
                }
            }

            // Audio toggle (Ctrl + M)
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggleAudio();
            }
        });
    }

    setupMobileOptimizations() {
        // Detect mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            document.body.classList.add('mobile-device');

            // Disable hover effects on mobile
            document.body.classList.add('no-hover');

            // Reduce particle count for performance
            if (this.webglAtmosphere) {
                this.webglAtmosphere.particleCount = Math.min(this.webglAtmosphere.particleCount, 100);
            }

            // Simplify animations
            document.documentElement.style.setProperty('--animation-speed', '0.5');
        }

        // Handle orientation changes
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    handleOrientationChange() {
        setTimeout(() => {
            this.handleResize();
        }, 500);
    }

    handleResize() {
        // Resize all systems
        if (this.webglAtmosphere && this.webglAtmosphere.handleResize) {
            this.webglAtmosphere.handleResize();
        }

        // Update cursor system
        if (this.emberCursor) {
            // Cursor system auto-handles resize
        }

        // Refresh scroll triggers
        if (window.gsap && gsap.ScrollTrigger) {
            gsap.ScrollTrigger.refresh();
        }
    }

    async startExperience() {
        return new Promise((resolve) => {
            // Start ambient audio if user has interacted (DISABLED)
            // this.startAmbientAudioOnInteraction();

            // Fade out loading screen
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('fade-out');

                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    resolve();
                }, 750);
            } else {
                resolve();
            }

            // Trigger page entrance animation
            document.body.classList.add('page-loaded');
        });
    }

    startAmbientAudioOnInteraction() {
        // DISABLED - Audio interaction logic preserved but not executed
        return;
        const startAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            if (this.ambientOscillator && !this.audioStarted) {
                this.ambientOscillator.start();
                this.audioStarted = true;
            }

            // Remove listeners after first interaction
            document.removeEventListener('click', startAudio);
            document.removeEventListener('touchstart', startAudio);
            document.removeEventListener('keydown', startAudio);
        };

        document.addEventListener('click', startAudio, { once: true });
        document.addEventListener('touchstart', startAudio, { once: true });
        document.addEventListener('keydown', startAudio, { once: true });
    }

    checkSystemHealth() {
        const healthScore = Object.values(this.systems).filter(Boolean).length / Object.keys(this.systems).length;

        console.log(`🔧 System Health: ${Math.round(healthScore * 100)}%`);

        // Log individual system status
        Object.entries(this.systems).forEach(([system, status]) => {
            console.log(`  ${status ? '✅' : '❌'} ${system}: ${status ? 'Ready' : 'Failed'}`);
        });

        // Show degraded experience warning if needed
        if (healthScore < 0.75) {
            this.showNotification('Some features may be limited due to system performance', 'warning');
        }

        return healthScore;
    }

    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let performanceModeEnabled = false;

        const measurePerformance = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 2000) { // Check every 2 seconds instead of 1
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

                if (fps < 30 && !performanceModeEnabled) {
                    console.warn(`⚠️ Low FPS detected: ${fps}`);
                    this.enablePerformanceMode();
                    performanceModeEnabled = true;

                    // Stop monitoring after enabling performance mode to prevent loops
                    return;
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            if (!performanceModeEnabled) {
                requestAnimationFrame(measurePerformance);
            }
        };

        // Delay initial monitoring to allow startup
        setTimeout(() => {
            requestAnimationFrame(measurePerformance);
        }, 3000);
    }

    enablePerformanceMode() {
        console.log('🚀 Enabling performance mode...');

        // Reduce particle count more aggressively
        if (this.webglAtmosphere) {
            this.webglAtmosphere.particleCount = Math.floor(this.webglAtmosphere.particleCount * 0.3);
            this.webglAtmosphere.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
        }

        // Reduce animation complexity
        document.body.classList.add('performance-mode');

        // Disable heavy visual effects
        document.documentElement.style.setProperty('--enable-blur', '0');
        document.documentElement.style.setProperty('--enable-3d-transforms', '0');

        // Disable ember cursor trail to save performance
        if (this.emberCursor) {
            this.emberCursor.maxTrailLength = 5;
        }
    }

    // Utility functions
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

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--surface-primary);
            color: var(--text-primary);
            padding: var(--space-4) var(--space-6);
            border-radius: 8px;
            border-left: 4px solid var(--${type === 'success' ? 'amber' : type === 'error' ? 'magma' : 'text-secondary'});
            backdrop-filter: blur(10px);
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
        document.body.classList.toggle('debug-mode', this.isDebugMode);

        console.log(`🔍 Debug mode: ${this.isDebugMode ? 'ON' : 'OFF'}`);

        if (this.isDebugMode) {
            this.showDebugInfo();
        } else {
            this.hideDebugInfo();
        }
    }

    showDebugInfo() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10002;
            max-width: 300px;
        `;

        const updateDebugInfo = () => {
            debugPanel.innerHTML = `
                <h4>Debug Info</h4>
                <p>Load Time: ${Math.round(this.metrics.loadTime)}ms</p>
                <p>WebGL: ${this.systems.webgl ? '✅' : '❌'}</p>
                <p>Cursor: ${this.systems.cursor ? '✅' : '❌'}</p>
                <p>Scroll: ${this.systems.scroll ? '✅' : '❌'}</p>
                <p>Audio: ${this.systems.audio ? '✅' : '❌'}</p>
                <p>Scroll Progress: ${this.scrollSync ? Math.round(this.scrollSync.getScrollProgress() * 100) : 0}%</p>
                <p>Mouse: ${this.emberCursor ? Math.round(this.emberCursor.getMousePosition().x) : 0}, ${this.emberCursor ? Math.round(this.emberCursor.getMousePosition().y) : 0}</p>
            `;
        };

        updateDebugInfo();
        document.body.appendChild(debugPanel);

        // Update debug info every second
        this.debugInterval = setInterval(updateDebugInfo, 1000);
    }

    hideDebugInfo() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.remove();
        }

        if (this.debugInterval) {
            clearInterval(this.debugInterval);
        }
    }

    toggleAudio() {
        // DISABLED - Audio toggle logic preserved but not executed
        this.showNotification('Audio system disabled 🔇', 'info');
        return;
        if (!this.audioContext) return;

        if (this.audioContext.state === 'running') {
            this.audioContext.suspend();
            this.showNotification('Audio paused 🔇', 'info');
        } else {
            this.audioContext.resume();
            this.showNotification('Audio resumed 🔊', 'info');
        }
    }

    // Public API
    getSystemStatus() {
        return {
            isInitialized: this.isInitialized,
            systems: this.systems,
            metrics: this.metrics,
            isDebugMode: this.isDebugMode
        };
    }

    // Cleanup
    destroy() {
        if (this.emberCursor) {
            this.emberCursor.destroy();
        }

        if (this.webglAtmosphere) {
            this.webglAtmosphere.destroy();
        }

        if (this.scrollSync) {
            this.scrollSync.destroy();
        }

        if (this.audioContext) {
            this.audioContext.close();
        }

        if (this.debugInterval) {
            clearInterval(this.debugInterval);
        }

        console.log('🎮 Soulstick app destroyed');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.soulstickApp = new SoulstickApp();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.soulstickApp) {
        if (document.hidden) {
            // Pause systems when page is hidden
            if (window.soulstickApp.webglAtmosphere) {
                window.soulstickApp.webglAtmosphere.pause();
            }
            if (window.soulstickApp.scrollSync) {
                window.soulstickApp.scrollSync.pause();
            }
        } else {
            // Resume systems when page is visible
            if (window.soulstickApp.webglAtmosphere) {
                window.soulstickApp.webglAtmosphere.resume();
            }
            if (window.soulstickApp.scrollSync) {
                window.soulstickApp.scrollSync.resume();
            }
        }
    }
});

// Export for global access
window.SoulstickApp = SoulstickApp;
