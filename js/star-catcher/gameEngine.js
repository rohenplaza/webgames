/**
 * GameEngine Class
 * Main game loop and state management
 */

class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game state
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.level = 1;
        this.health = CONFIG.GAME.INITIAL_HEALTH;
        this.gameRunning = false;
        this.gamePaused = false;
        this.frameCount = 0;

        // Game objects
        this.player = new Player(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y);
        this.fallingObjects = [];

        // Animation frame
        this.animationId = null;

        // Stars background
        this.stars = this.generateStars(100);
    }

    /**
     * Generate background stars
     */
    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * CONFIG.CANVAS_WIDTH,
                y: Math.random() * CONFIG.CANVAS_HEIGHT,
                size: Math.random() * 2,
                opacity: Math.random()
            });
        }
        return stars;
    }

    /**
     * Start the game
     */
    start() {
        this.reset();
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameLoop();
    }

    /**
     * Pause/Resume the game
     */
    togglePause() {
        this.gamePaused = !this.gamePaused;
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }

    /**
     * Reset game state
     */
    reset() {
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.level = 1;
        this.health = CONFIG.GAME.INITIAL_HEALTH;
        this.frameCount = 0;
        this.fallingObjects = [];
        this.player.reset();
        this.updateUI();
    }

    /**
     * Main game loop
     */
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update game state
     */
    update() {
        this.frameCount++;

        // Update player
        this.player.update();

        // Spawn new objects
        const spawnRate = CONFIG.OBJECTS.SPAWN_RATE - (this.level * 5);
        if (this.frameCount % Math.max(spawnRate, 20) === 0) {
            this.spawnObject();
        }

        // Update falling objects
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            obj.update();

            // Check collision
            if (obj.checkCollision(this.player)) {
                this.handleCollision(obj);
                this.fallingObjects.splice(i, 1);
            }
            // Remove if off screen
            else if (obj.isOffScreen()) {
                // Lose health if a star was missed
                if (obj.type === 'star') {
                    this.health -= CONFIG.OBJECTS.STAR.HEALTH_PENALTY_MISSED;

                    // Check if health depleted
                    if (this.health <= 0) {
                        this.health = CONFIG.GAME.INITIAL_HEALTH;
                        this.lives -= 1;
                    }
                }
                this.fallingObjects.splice(i, 1);
            }
        }

        // Update level
        const newLevel = Math.floor(this.score / CONFIG.GAME.POINTS_PER_LEVEL) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
        }

        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }

        this.updateUI();
    }

    /**
     * Spawn a new falling object
     */
    spawnObject() {
        const x = Math.random() * (CONFIG.CANVAS_WIDTH - 50);
        const type = Math.random() < CONFIG.OBJECTS.STAR.SPAWN_CHANCE ? 'star' : 'meteor';
        const speed = CONFIG.OBJECTS.INITIAL_SPEED + (this.level - 1) * CONFIG.OBJECTS.SPEED_INCREASE_PER_LEVEL;

        this.fallingObjects.push(new FallingObject(x, type, speed));
    }

    /**
     * Handle collision with object
     */
    handleCollision(obj) {
        if (obj.type === 'star') {
            this.score += obj.points;
            // Restore health but don't exceed max
            this.health = Math.min(this.health + CONFIG.OBJECTS.STAR.HEALTH_RESTORE, CONFIG.GAME.MAX_HEALTH);
        } else {
            this.lives -= obj.damage;
        }
    }

    /**
     * Draw everything
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Draw background stars
        this.drawBackgroundStars();

        // Draw falling objects
        this.fallingObjects.forEach(obj => obj.draw(this.ctx));

        // Draw player
        this.player.draw(this.ctx);

        // Draw pause overlay if paused
        if (this.gamePaused) {
            this.drawPauseOverlay();
        }
    }

    /**
     * Draw background stars
     */
    drawBackgroundStars() {
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    /**
     * Draw pause overlay
     */
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2);
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;

        // Update health bar
        const healthPercent = Math.max(0, (this.health / CONFIG.GAME.MAX_HEALTH) * 100);
        const healthBar = document.getElementById('healthBar');
        healthBar.style.width = healthPercent + '%';
        document.getElementById('healthPercent').textContent = Math.round(healthPercent) + '%';

        // Update health bar color based on level
        healthBar.classList.remove('low', 'critical');
        if (healthPercent <= 25) {
            healthBar.classList.add('critical');
        } else if (healthPercent <= 50) {
            healthBar.classList.add('low');
        }
    }

    /**
     * Game over
     */
    gameOver() {
        this.gameRunning = false;
        cancelAnimationFrame(this.animationId);

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
        document.getElementById('pauseBtn').disabled = true;
    }

    /**
     * Stop the game
     */
    stop() {
        this.gameRunning = false;
        this.gamePaused = false;
        cancelAnimationFrame(this.animationId);
    }
}
