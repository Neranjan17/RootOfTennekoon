/**
 * Snowfall Animation
 * Creates falling square pixel snowflakes on a canvas element
 * 
 * Usage:
 * const snowfall = new SnowfallAnimation('canvasId', options);
 * snowfall.start();
 */

class SnowfallAnimation {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Default options
        this.options = {
            numFlakes: options.numFlakes || 150,
            color: options.color || '#4A90E2', // Blue color
            minSize: options.minSize || 0.5,
            maxSize: options.maxSize || 2,
            minSpeed: options.minSpeed || 1,
            maxSpeed: options.maxSpeed || 3,
            minOpacity: options.minOpacity || 0.5,
            maxOpacity: options.maxOpacity || 1,
            glowEffect: options.glowEffect !== false // default true
        };
        
        this.snowflakes = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Create snowflakes
        for (let i = 0; i < this.options.numFlakes; i++) {
            this.snowflakes.push(this.createSnowflake());
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    createSnowflake() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.canvas.height,
            radius: Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize,
            speed: Math.random() * (this.options.maxSpeed - this.options.minSpeed) + this.options.minSpeed,
            drift: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * (this.options.maxOpacity - this.options.minOpacity) + this.options.minOpacity
        };
    }
    
    updateSnowflake(flake) {
        flake.y += flake.speed;
        flake.x += flake.drift;
        
        // Reset if snowflake goes below canvas
        if (flake.y > this.canvas.height) {
            flake.y = -10;
            flake.x = Math.random() * this.canvas.width;
        }
        
        // Wrap around horizontally
        if (flake.x > this.canvas.width) {
            flake.x = 0;
        } else if (flake.x < 0) {
            flake.x = this.canvas.width;
        }
    }
    
    drawSnowflake(flake) {
        // Convert hex color to RGB
        const r = parseInt(this.options.color.slice(1, 3), 16);
        const g = parseInt(this.options.color.slice(3, 5), 16);
        const b = parseInt(this.options.color.slice(5, 7), 16);
        
        // Draw square pixel
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${flake.opacity})`;
        this.ctx.fillRect(flake.x, flake.y, flake.radius * 2, flake.radius * 2);
        
        // Add glow effect
        if (this.options.glowEffect) {
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${flake.opacity * 0.2})`;
            this.ctx.fillRect(flake.x - 2, flake.y - 2, flake.radius * 2 + 4, flake.radius * 2 + 4);
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.snowflakes.forEach(flake => {
            this.updateSnowflake(flake);
            this.drawSnowflake(flake);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.init);
        this.snowflakes = [];
    }
}

export default SnowfallAnimation;
