/**
 * SharpShooterEngine Class
 * Main game loop and state management
 */

class SharpShooterEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game state (similar to Star Catcher)
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.level = 1;
        this.health = CONFIG.GAME.INITIAL_HEALTH;
        this.gameRunning = false;
        this.gamePaused = false;
        this.frameCount = 0;
        this.lastFrameTime = 0;

        // Game objects
        this.waveManager = new WaveManager(this.level);
        this.bullets = []; // Enemy bullets
        this.inputHandler = new InputHandler(canvas, this);

        // Animation
        this.animationId = null;

        // Background
        this.backgroundStars = this.generateStars(50);

        // Wave completion banner
        this.showingWaveBanner = false;
        this.waveBannerTimer = 0;
    }

    /**
     * Generate background stars (reused pattern)
     */
    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * CONFIG.CANVAS_WIDTH,
                y: Math.random() * CONFIG.BACKGROUND.HORIZON_Y,
                size: Math.random() * 2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
        return stars;
    }

    /**
     * Start game (reused pattern)
     */
    start() {
        this.reset();
        this.gameRunning = true;
        this.gamePaused = false;
        this.waveManager.startWave();
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    /**
     * Reset game (reused pattern)
     */
    reset() {
        this.score = 0;
        this.lives = CONFIG.GAME.INITIAL_LIVES;
        this.level = 1;
        this.health = CONFIG.GAME.INITIAL_HEALTH;
        this.frameCount = 0;
        this.bullets = [];
        this.waveManager = new WaveManager(this.level);
        this.showingWaveBanner = false;
        this.updateUI();
    }

    /**
     * Pause/Resume (reused pattern)
     */
    togglePause() {
        this.gamePaused = !this.gamePaused;
        if (!this.gamePaused) {
            this.lastFrameTime = performance.now();
            this.gameLoop();
        }
    }

    /**
     * Main game loop (reused pattern with deltaTime)
     */
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.draw();

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        this.frameCount++;

        // Update wave completion banner
        if (this.showingWaveBanner) {
            this.waveBannerTimer -= deltaTime;
            if (this.waveBannerTimer <= 0) {
                this.showingWaveBanner = false;
                this.startNextWave();
            }
            return; // Pause gameplay during banner
        }

        // Update wave and enemies
        const { bullets: newBullets } = this.waveManager.update(deltaTime);
        this.bullets.push(...newBullets);

        // Update bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();

            // Check player hit
            if (bullet.checkPlayerHit()) {
                this.health -= CONFIG.ENEMY.DAMAGE;
                this.bullets.splice(i, 1);

                // Check if health depleted
                if (this.health <= 0) {
                    this.health = CONFIG.GAME.INITIAL_HEALTH;
                    this.lives -= 1;
                }
            }
            // Remove off-screen bullets
            else if (bullet.isOffScreen()) {
                this.bullets.splice(i, 1);
            }
        }

        // Check wave completion
        if (this.waveManager.isComplete()) {
            this.showWaveCompleteBanner();
        }

        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }

        this.updateUI();
    }

    /**
     * Handle player shot (click/touch)
     */
    handleShot(x, y) {
        const pointsEarned = this.waveManager.handleClick(x, y);
        this.score += pointsEarned;
    }

    /**
     * Show wave complete banner
     */
    showWaveCompleteBanner() {
        this.showingWaveBanner = true;
        this.waveBannerTimer = 2000; // 2 seconds
    }

    /**
     * Start next wave
     */
    startNextWave() {
        // Advance level after each wave completion
        this.level++;
        this.waveManager.level = this.level;
        this.waveManager.startWave();
    }

    /**
     * Draw everything
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = CONFIG.BACKGROUND.SKY_COLOR;
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        // Draw ground
        this.ctx.fillStyle = CONFIG.BACKGROUND.GROUND_COLOR;
        this.ctx.fillRect(0, CONFIG.BACKGROUND.HORIZON_Y, CONFIG.CANVAS_WIDTH,
                         CONFIG.CANVAS_HEIGHT - CONFIG.BACKGROUND.HORIZON_Y);

        // Draw background stars
        this.drawBackgroundStars();

        // Draw horizon line
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, CONFIG.BACKGROUND.HORIZON_Y);
        this.ctx.lineTo(CONFIG.CANVAS_WIDTH, CONFIG.BACKGROUND.HORIZON_Y);
        this.ctx.stroke();

        // Draw enemies
        this.waveManager.draw(this.ctx);

        // Draw bullets
        this.bullets.forEach(bullet => bullet.draw(this.ctx));

        // Draw crosshair (center of screen)
        this.drawCrosshair();

        // Draw wave banner if active
        if (this.showingWaveBanner) {
            this.drawWaveBanner();
        }

        // Draw pause overlay if paused
        if (this.gamePaused) {
            this.drawPauseOverlay();
        }
    }

    /**
     * Draw background stars (reused pattern)
     */
    drawBackgroundStars() {
        this.backgroundStars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    /**
     * Draw crosshair
     */
    drawCrosshair() {
        const centerX = CONFIG.CANVAS_WIDTH / 2;
        const centerY = CONFIG.CANVAS_HEIGHT / 2;
        const size = CONFIG.EFFECTS.CROSSHAIR_SIZE;

        this.ctx.strokeStyle = CONFIG.EFFECTS.CROSSHAIR_COLOR;
        this.ctx.lineWidth = 2;

        // Circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        this.ctx.stroke();

        // Cross lines
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - size, centerY);
        this.ctx.lineTo(centerX - size / 2, centerY);
        this.ctx.moveTo(centerX + size / 2, centerY);
        this.ctx.lineTo(centerX + size, centerY);
        this.ctx.moveTo(centerX, centerY - size);
        this.ctx.lineTo(centerX, centerY - size / 2);
        this.ctx.moveTo(centerX, centerY + size / 2);
        this.ctx.lineTo(centerX, centerY + size);
        this.ctx.stroke();
    }

    /**
     * Draw wave complete banner
     */
    drawWaveBanner() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('WAVE COMPLETE!', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 - 30);

        this.ctx.font = '28px Arial';
        this.ctx.fillText(`Next: Level ${this.level + 1}`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 20);
    }

    /**
     * Draw pause overlay (reused pattern)
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
     * Update UI (reused pattern from Star Catcher)
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

        // Update health bar color
        healthBar.classList.remove('low', 'critical');
        if (healthPercent <= 25) {
            healthBar.classList.add('critical');
        } else if (healthPercent <= 50) {
            healthBar.classList.add('low');
        }

        // Update enemies remaining
        document.getElementById('enemiesRemaining').textContent = this.waveManager.getRemainingEnemies();
    }

    /**
     * Game over (reused pattern)
     */
    gameOver() {
        this.gameRunning = false;
        cancelAnimationFrame(this.animationId);

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.remove('hidden');
        document.getElementById('pauseBtn').disabled = true;
    }

    /**
     * Stop game (reused pattern)
     */
    stop() {
        this.gameRunning = false;
        this.gamePaused = false;
        cancelAnimationFrame(this.animationId);
    }
}
