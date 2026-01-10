/* ============================================
   WEBGL ATMOSPHERIC BACKGROUND
   Performance-optimized Three.js ambient effects
   ============================================ */

class WebGLAtmosphere {
    constructor() {
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.isInitialized = false;
        this.isSupported = this.checkWebGLSupport();
        this.frameCount = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = 0;

        // Performance settings
        this.particleCount = this.getParticleCount();
        this.quality = this.getQualityLevel();

        if (this.isSupported) {
            this.init();
        } else {
            this.createFallback();
        }
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    getParticleCount() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 4;

        if (isMobile || isLowEnd) return 50;
        return window.innerWidth > 1920 ? 150 : 100;
    }

    getQualityLevel() {
        const pixelRatio = window.devicePixelRatio || 1;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) return 'low';
        if (pixelRatio > 2) return 'high';
        return 'medium';
    }

    init() {
        this.canvas = document.getElementById('webgl-atmosphere');
        if (!this.canvas) {
            console.warn('WebGL canvas not found');
            return;
        }

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupParticles();
        this.setupLights();
        this.bindEvents();
        this.startRenderLoop();

        this.isInitialized = true;
        console.log('🌌 WebGL atmospheric background initialized');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x050505, 5, 15);

        // Ambient background gradient
        const bgGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        const bgMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec2 u_resolution;
                uniform float u_time;
                
                void main() {
                    vec2 st = gl_FragCoord.xy / u_resolution.xy;
                    
                    // Radial gradient from center
                    vec2 center = vec2(0.5, 0.4);
                    float dist = distance(st, center);
                    
                    // Blue glow colors  
                    vec3 emberCore = vec3(0.12, 0.22, 0.54);  // #1e3a8a (dark blue)
                    vec3 emberGlow = vec3(0.38, 0.51, 0.96);  // #60a5fa (light blue)
                    vec3 voidColor = vec3(0.02, 0.02, 0.02); // #050505
                    
                    // Animated glow
                    float pulse = sin(u_time * 0.5) * 0.1 + 0.9;
                    float glow = exp(-dist * 3.0) * 0.3 * pulse;
                    
                    vec3 color = mix(voidColor, emberGlow, glow);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            uniforms: {
                u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                u_time: { value: 0 }
            }
        });

        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        this.scene.add(bgMesh);
        this.bgMaterial = bgMaterial;
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: false,
            antialias: this.quality !== 'low',
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.quality === 'high' ? Math.min(window.devicePixelRatio, 2) : 1);
        this.renderer.setClearColor(0x050505);

        // Performance optimizations
        this.renderer.shadowMap.enabled = false;
        this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    }

    setupParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const colors = new Float32Array(this.particleCount * 3);

        // Initialize particle attributes
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Random positions in a large sphere
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            // Gentle floating velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = Math.random() * 0.01 + 0.005;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

            // Varying sizes
            sizes[i] = Math.random() * 0.03 + 0.01;

            // Ember color variations
            const isEmber = Math.random() < 0.7;
            if (isEmber) {
                colors[i3] = 1.0;     // Red
                colors[i3 + 1] = 0.42 + Math.random() * 0.23; // Green (orange range)
                colors[i3 + 2] = 0.28; // Blue
            } else {
                colors[i3] = 1.0;     // Red
                colors[i3 + 1] = 0.65; // Green (amber)
                colors[i3 + 2] = 0.15; // Blue
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Particle shader material
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.8;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupLights() {
        // Minimal lighting for performance
        const ambientLight = new THREE.AmbientLight(0xff6b47, 0.1);
        this.scene.add(ambientLight);
    }

    bindEvents() {
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
        document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });

        // Visibility API for performance
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    handleMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    handleResize() {
        if (!this.isInitialized) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        if (this.bgMaterial) {
            this.bgMaterial.uniforms.u_resolution.value.set(width, height);
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    updateParticles(deltaTime) {
        if (!this.particles) return;

        const positions = this.particles.geometry.attributes.position;
        const velocities = this.particles.geometry.attributes.velocity;

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;

            // Apply velocities
            positions.array[i3] += velocities.array[i3] * deltaTime;
            positions.array[i3 + 1] += velocities.array[i3 + 1] * deltaTime;
            positions.array[i3 + 2] += velocities.array[i3 + 2] * deltaTime;

            // Wrap particles around the scene
            if (positions.array[i3 + 1] > 10) {
                positions.array[i3 + 1] = -10;
                positions.array[i3] = (Math.random() - 0.5) * 20;
                positions.array[i3 + 2] = (Math.random() - 0.5) * 20;
            }
        }

        positions.needsUpdate = true;

        // Subtle mouse interaction
        if (this.mouse.x !== 0 || this.mouse.y !== 0) {
            this.particles.rotation.y += (this.mouse.x * 0.1 - this.particles.rotation.y) * 0.05;
            this.particles.rotation.x += (this.mouse.y * 0.1 - this.particles.rotation.x) * 0.05;
        }
    }

    render() {
        if (!this.isInitialized || !this.renderer) return;

        const deltaTime = this.time * 0.016; // Approximate 60fps
        this.time++;

        // Update background shader
        if (this.bgMaterial) {
            this.bgMaterial.uniforms.u_time.value = this.time * 0.01;
        }

        this.updateParticles(deltaTime);
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        // Centralized update method
    }

    startRenderLoop() {
        const animate = (currentTime) => {
            requestAnimationFrame(animate);

            // Frame rate limiting
            if (currentTime - this.lastFrameTime >= this.frameInterval) {
                this.render();
                this.lastFrameTime = currentTime;
                this.frameCount++;
            }
        };
        animate(0);
    }

    createFallback() {
        const canvas = document.getElementById('webgl-atmosphere');
        if (!canvas) return;

        canvas.style.background = `
            radial-gradient(ellipse at center, 
                rgba(30, 58, 138, 0.1) 0%, 
                rgba(96, 165, 250, 0.05) 30%, 
                #050505 70%
            )
        `;

        console.log('🎨 WebGL not supported, using CSS fallback');
    }

    pause() {
        // Reduce update frequency when not visible
        this.isRunning = false;
    }

    resume() {
        this.isRunning = true;
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);

        console.log('🌌 WebGL atmosphere destroyed');
    }

    // Public API
    setIntensity(intensity) {
        if (this.bgMaterial) {
            this.bgMaterial.uniforms.u_intensity = { value: intensity };
        }
    }

    getStats() {
        return {
            particleCount: this.particleCount,
            quality: this.quality,
            isSupported: this.isSupported,
            isInitialized: this.isInitialized
        };
    }
}

// Auto-initialize or export for manual initialization
if (typeof window !== 'undefined') {
    window.WebGLAtmosphere = WebGLAtmosphere;
}
