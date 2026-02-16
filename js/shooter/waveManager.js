/**
 * WaveManager Class
 * Orchestrates enemy spawning and wave progression
 */

class WaveManager {
    constructor(level) {
        this.level = level;
        this.enemies = [];
        this.activeWave = false;
        this.waveComplete = false;
    }

    /**
     * Start a new wave
     */
    startWave() {
        this.enemies = [];
        this.activeWave = true;
        this.waveComplete = false;

        const enemyCount = this.calculateEnemyCount();
        const positions = this.selectSpawnPositions(enemyCount);

        // Spawn enemies at selected positions
        positions.forEach(pos => {
            this.enemies.push(new Enemy(pos.x, pos.y, this.level));
        });
    }

    /**
     * Calculate number of enemies for current level
     */
    calculateEnemyCount() {
        const count = Math.floor(
            CONFIG.WAVES.BASE_ENEMIES + (this.level * CONFIG.WAVES.ENEMIES_PER_LEVEL)
        );
        return Math.min(count, CONFIG.WAVES.MAX_ENEMIES_PER_WAVE);
    }

    /**
     * Select random spawn positions without overlap
     */
    selectSpawnPositions(count) {
        const available = [...CONFIG.WAVES.SPAWN_POSITIONS];
        const selected = [];

        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            selected.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }

        return selected;
    }

    /**
     * Update all enemies in wave
     */
    update(deltaTime) {
        if (!this.activeWave) return { bullets: [] };

        const newBullets = [];

        // Update each enemy
        this.enemies.forEach(enemy => {
            const result = enemy.update(deltaTime);

            // Collect bullets to spawn
            if (result && result.shootBullet) {
                newBullets.push(this.createBulletFromEnemy(enemy));
            }
        });

        // Remove dead enemies
        this.enemies = this.enemies.filter(enemy => !enemy.shouldRemove());

        // Check if wave is complete
        if (this.enemies.length === 0) {
            this.waveComplete = true;
            this.activeWave = false;
        }

        return { bullets: newBullets };
    }

    /**
     * Create bullet from enemy position toward player
     */
    createBulletFromEnemy(enemy) {
        const bulletX = enemy.x + enemy.width / 2;
        const bulletY = enemy.y + enemy.height / 2;
        const playerX = CONFIG.CANVAS_WIDTH / 2;
        const playerY = CONFIG.CANVAS_HEIGHT - 50;

        return new Bullet(bulletX, bulletY, playerX, playerY);
    }

    /**
     * Draw all enemies
     */
    draw(ctx) {
        this.enemies.forEach(enemy => enemy.draw(ctx));
    }

    /**
     * Handle click/touch on position
     * Returns score earned
     */
    handleClick(x, y) {
        for (let enemy of this.enemies) {
            if (enemy.containsPoint(x, y)) {
                const killed = enemy.takeDamage(1);
                if (killed) {
                    return CONFIG.GAME.POINTS_PER_ENEMY;
                }
                return 0; // Hit but not killed
            }
        }
        return 0; // Missed
    }

    /**
     * Check if wave is complete
     */
    isComplete() {
        return this.waveComplete;
    }

    /**
     * Get remaining enemy count
     */
    getRemainingEnemies() {
        return this.enemies.filter(e => e.isAlive()).length;
    }

    /**
     * Advance to next level
     */
    nextLevel() {
        this.level++;
    }
}
