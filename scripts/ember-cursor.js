/* ============================================
   EMBER CURSOR SYSTEM - TWEAKED FOR THEME SUPPORT
   Advanced cursor trail with physics simulation
   Optimized with Object Pooling & CSS Variables
   ============================================ */

class EmberCursor {
    constructor() {
        this.cursor = null;
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 }; // Track delta for velocity
        this.isActive = false;

        // Configuration
        this.maxParticles = 50;
        this.particleLife = 0.8;

        // Data Pool (Physics State)
        this.pool = [];
        this.poolIndex = 0;

        // Loop vars
        this.rafId = null;
        this.cursorScale = 1;

        // Bind methods once
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouch = this.handleTouch.bind(this);

        this.init();
    }

    init() {
        this.createCursor();
        this.initPool(); // Initialize DOM and Data
        this.bindEvents();
        this.startAnimationLoop();

        console.log('🔥 Ember cursor initialized with theme support');
    }

    createCursor() {
        this.cursor = document.getElementById('ember-cursor');
        if (!this.cursor) return;

        // Initial state
        this.cursor.style.position = 'fixed';
        this.cursor.style.top = '0';
        this.cursor.style.left = '0';
        this.cursor.style.transform = 'translate3d(-100px, -100px, 0)';
        this.cursor.style.pointerEvents = 'none';
        this.cursor.style.zIndex = '10000';
        this.cursor.style.willChange = 'transform';
        this.cursor.classList.add('optimized-cursor');
    }

    initPool() {
        for (let i = 0; i < this.maxParticles; i++) {
            // Create DOM
            const div = document.createElement('div');
            // Use external CSS class for theme-aware styles (background, blend-mode)
            div.className = 'ember-trail-particle';
            document.body.appendChild(div);

            // Create State
            this.pool.push({
                element: div,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                life: 0, // 0 = dead, 1 = fresh
                active: false
            });
        }
    }

    bindEvents() {
        const opts = { passive: true };
        document.addEventListener('mousemove', this.handleMouseMove, opts);
        document.addEventListener('mouseenter', () => this.activate(), opts);
        document.addEventListener('mouseleave', () => this.deactivate(), opts);

        document.addEventListener('touchstart', this.handleTouch, opts);
        document.addEventListener('touchmove', this.handleTouch, { passive: false });
        document.addEventListener('touchend', () => this.deactivate(), opts);

        document.addEventListener('mousedown', () => this.scaleCursor(0.8));
        document.addEventListener('mouseup', () => this.scaleCursor(1));
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        if (!this.isActive) this.activate();
    }

    handleTouch(e) {
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
            if (!this.isActive) this.activate();
        }
    }

    activate() {
        this.isActive = true;
        if (this.cursor) this.cursor.classList.add('active');
        document.body.style.cursor = 'none';

        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;
    }

    deactivate() {
        this.isActive = false;
        if (this.cursor) this.cursor.classList.remove('active');
        document.body.style.cursor = '';
    }

    scaleCursor(scale) {
        this.cursorScale = scale;
    }

    spawnParticle() {
        const dx = this.mouse.x - this.lastMouse.x;
        const dy = this.mouse.y - this.lastMouse.y;

        const p = this.pool[this.poolIndex];
        this.poolIndex = (this.poolIndex + 1) % this.maxParticles;

        p.active = true;
        p.life = 1.0;
        p.x = this.mouse.x;
        p.y = this.mouse.y;

        // Random drift + movement momentum
        p.vx = (dx * 0.1) + (Math.random() - 0.5) * 2;
        p.vy = (dy * 0.1) + (Math.random() - 0.5) * 2;

        // Reset Visuals
        p.element.style.opacity = '1';
        p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(1)`;
    }

    startAnimationLoop() {
        const animate = () => {
            this.rafId = requestAnimationFrame(animate);
            if (!this.isActive) return;

            this.spawnParticle();
            this.updateParticles();
            this.renderCursor();

            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
        };
        this.rafId = requestAnimationFrame(animate);
    }

    updateParticles() {
        const decay = 1.0 / (this.particleLife * 60);

        for (let i = 0; i < this.maxParticles; i++) {
            const p = this.pool[i];
            if (!p.active) continue;

            p.life -= decay;

            if (p.life <= 0) {
                p.active = false;
                p.element.style.opacity = '0';
                p.element.style.transform = 'translate3d(-500px, -500px, 0)';
                continue;
            }

            // Physics
            p.x += p.vx;
            p.y += p.vy;

            p.vx *= 0.9; // Drag
            p.vy *= 0.9;
            p.vy -= 0.5; // Rise

            // Render
            // We NO LONGER touch background/boxShadow here. 
            // We primarily fade Size and Opacity.
            // The color is handled by the CSS Variable in .ember-trail-particle

            const currentSize = 0.5 + p.life * 0.6; // Scale down slightly as it dies

            // Use translate(-50%, -50%) to center particle at p.x, p.y
            p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${currentSize})`;

            // Nonlinear fade out looks best
            p.element.style.opacity = (p.life * p.life).toFixed(2);
        }
    }

    renderCursor() {
        if (this.cursor) {
            this.cursor.style.transform =
                `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%) scale(${this.cursorScale})`;
        }
    }

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.pool.forEach(p => p.element.remove());
        console.log('🔥 Ember cursor destroyed');
    }
}

window.EmberCursor = EmberCursor;
