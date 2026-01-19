/* ============================================
   FLOATING SQUARES BACKGROUND ANIMATION
   Generates random floating square boxes
   ============================================ */

class FloatingSquares {
    constructor() {
        this.container = document.querySelector('.floating-squares');
        if (!this.container) return;

        this.squareCount = 30; // Number of squares to generate
        this.init();
    }

    init() {
        // Don't initialize on mobile
        if (window.innerWidth <= 768) {
            console.log('📱 Mobile device detected - Floating squares disabled');
            return;
        }

        this.createSquares();
        console.log('◼️ Floating squares background initialized');
    }

    createSquares() {
        for (let i = 0; i < this.squareCount; i++) {
            const square = document.createElement('div');
            square.className = 'floating-square';
            
            // Random size between 15px and 50px
            const size = Math.random() * 35 + 15;
            square.style.width = `${size}px`;
            square.style.height = `${size}px`;
            
            // Random starting position
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight + window.innerHeight; // Start below viewport
            
            // Random ending position (move upward and slightly sideways)
            const endX = startX + (Math.random() * 200 - 100); // Move -100 to +100px horizontally
            const endY = -100 - Math.random() * 200; // End above viewport
            
            // Random duration between 10s and 25s
            const duration = Math.random() * 15 + 10;
            
            // Random delay between 0s and 10s
            const delay = Math.random() * 10;
            
            // Random rotation
            const rotate = Math.random() * 720 - 360; // -360 to 360 degrees
            
            // Set CSS variables for this square
            square.style.setProperty('--start-x', `${startX}px`);
            square.style.setProperty('--start-y', `${startY}px`);
            square.style.setProperty('--end-x', `${endX}px`);
            square.style.setProperty('--end-y', `${endY}px`);
            square.style.setProperty('--float-duration', `${duration}s`);
            square.style.setProperty('--float-delay', `${delay}s`);
            square.style.setProperty('--rotate', `${rotate}deg`);
            
            this.container.appendChild(square);
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.floatingSquares = new FloatingSquares();
    });
} else {
    window.floatingSquares = new FloatingSquares();
}

// Export for manual initialization
window.FloatingSquares = FloatingSquares;
