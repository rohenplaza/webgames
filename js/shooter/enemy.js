/**
 * Enemy Class
 * Handles enemy behavior with state machine
 * States: spawning → idle → aiming → shooting → (repeat or dying → dead)
 */

class Enemy {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.targetY = y; // Final position after popup
        this.startY = y + 150; // Start below visible position
        this.width = CONFIG.ENEMY.WIDTH;
        this.height = CONFIG.ENEMY.HEIGHT;
        this.health = CONFIG.ENEMY.HEALTH + Math.floor(level / 5); // Tougher every 5 levels
        this.maxHealth = this.health;
        this.level = level;

        // State machine
        this.state = 'spawning'; // spawning, idle, aiming, shooting, dying, dead
        this.stateTimer = 0;

        // Random offset so enemies don't all fire at the same time
        this.idleDelayOffset = Math.random() * CONFIG.ENEMY.IDLE_DELAY_VARIANCE;

        // Grace period - first attack is delayed
        this.firstIdle = true;

        // Animation
        this.animationProgress = 0; // 0-1 for various animations

        // Combat
        this.hasShot = false;
        this.damageTaken = false;
        this.damageFlashTimer = 0;
    }

    /**
     * Update enemy state and animations
     */
    update(deltaTime) {
        this.stateTimer += deltaTime;

        switch(this.state) {
            case 'spawning':
                this.updateSpawning();
                break;
            case 'idle':
                this.updateIdle();
                break;
            case 'aiming':
                this.updateAiming();
                break;
            case 'shooting':
                return this.updateShooting();
            case 'dying':
                this.updateDying();
                break;
        }

        // Update damage flash
        if (this.damageFlashTimer > 0) {
            this.damageFlashTimer -= deltaTime;
        }

        return null;
    }

    /**
     * Popup animation
     */
    updateSpawning() {
        this.animationProgress = Math.min(1, this.stateTimer / CONFIG.ENEMY.POPUP_DURATION);
        // Ease-out animation
        const eased = 1 - Math.pow(1 - this.animationProgress, 3);
        this.y = this.startY + (this.targetY - this.startY) * eased;

        if (this.animationProgress >= 1) {
            this.state = 'idle';
            this.stateTimer = 0;
        }
    }

    /**
     * Idle state - waiting before aiming
     */
    updateIdle() {
        const baseAimDelay = Math.max(
            CONFIG.ENEMY.AIM_DELAY - (this.level * CONFIG.WAVES.AIM_DELAY_REDUCTION_PER_LEVEL),
            CONFIG.WAVES.MIN_AIM_DELAY
        );

        // Add random offset so enemies don't all fire at once
        let aimDelay = baseAimDelay + this.idleDelayOffset;

        // Add initial grace period for first attack only
        if (this.firstIdle) {
            aimDelay += CONFIG.ENEMY.INITIAL_GRACE_PERIOD;
        }

        if (this.stateTimer >= aimDelay) {
            this.state = 'aiming';
            this.stateTimer = 0;
            this.animationProgress = 0;
            this.firstIdle = false; // Grace period only applies to first attack
        }
    }

    /**
     * Aiming animation (visual telegraph)
     */
    updateAiming() {
        this.animationProgress = Math.min(1, this.stateTimer / CONFIG.ENEMY.AIMING_DURATION);

        if (this.animationProgress >= 1) {
            this.state = 'shooting';
            this.stateTimer = 0;
            this.animationProgress = 0;
        }
    }

    /**
     * Shooting animation and bullet spawn
     */
    updateShooting() {
        if (!this.hasShot) {
            this.hasShot = true;
            return { shootBullet: true }; // Signal to game engine to spawn bullet
        }

        this.animationProgress = Math.min(1, this.stateTimer / CONFIG.ENEMY.SHOOT_ANIMATION_DURATION);

        if (this.animationProgress >= 1) {
            this.state = 'idle';
            this.stateTimer = 0;
            this.hasShot = false;
        }

        return null;
    }

    /**
     * Death animation
     */
    updateDying() {
        this.animationProgress = Math.min(1, this.stateTimer / CONFIG.ENEMY.DEATH_ANIMATION_DURATION);

        if (this.animationProgress >= 1) {
            this.state = 'dead';
        }
    }

    /**
     * Draw enemy with current state
     */
    draw(ctx) {
        if (this.state === 'dead') return;

        ctx.save();

        // Apply death fade
        if (this.state === 'dying') {
            ctx.globalAlpha = 1 - this.animationProgress;
        }

        // Aiming glow effect (warning indicator)
        if (this.state === 'aiming') {
            // Pulsing glow
            const pulseIntensity = 0.5 + 0.5 * Math.sin(this.stateTimer / 100);

            // Outer glow
            ctx.shadowColor = CONFIG.ENEMY.COLORS.AIMING_GLOW;
            ctx.shadowBlur = 20 * pulseIntensity;
            ctx.fillStyle = CONFIG.ENEMY.COLORS.AIMING_GLOW;
            ctx.globalAlpha = 0.3 * pulseIntensity;
            ctx.fillRect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);

            // Reset for body drawing
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Damage flash
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = CONFIG.ENEMY.COLORS.DAMAGE_FLASH;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        // Enemy body (simple silhouette)
        ctx.fillStyle = CONFIG.ENEMY.COLORS.BODY;

        // Head
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 20, 15, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillRect(this.x + 20, this.y + 35, 40, 50);

        // Arms (animated during aiming/shooting)
        if (this.state === 'aiming' || this.state === 'shooting') {
            // Raised arms (aiming pose)
            ctx.fillRect(this.x + 10, this.y + 40, 15, 30);
            ctx.fillRect(this.x + 55, this.y + 40, 15, 30);

            // Weapon indicator
            ctx.fillStyle = CONFIG.ENEMY.COLORS.HIGHLIGHT;
            ctx.fillRect(this.x + 35, this.y + 35, 10, 20);
        } else {
            // Arms down
            ctx.fillRect(this.x + 10, this.y + 50, 15, 30);
            ctx.fillRect(this.x + 55, this.y + 50, 15, 30);
        }

        // Muzzle flash during shooting
        if (this.state === 'shooting' && this.stateTimer < CONFIG.EFFECTS.MUZZLE_FLASH_DURATION) {
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + 40, 10, 0, Math.PI * 2);
            ctx.fill();
        }

        // Health bar (if damaged)
        if (this.health < this.maxHealth) {
            const healthPercent = this.health / this.maxHealth;
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = healthPercent > 0.5 ? '#4ade80' : '#ef4444';
            ctx.fillRect(this.x, this.y - 10, this.width * healthPercent, 5);
        }

        ctx.restore();
    }

    /**
     * Take damage from player click
     */
    takeDamage(damage = 1) {
        this.health -= damage;
        this.damageFlashTimer = CONFIG.EFFECTS.HIT_INDICATOR_DURATION;

        if (this.health <= 0) {
            this.state = 'dying';
            this.stateTimer = 0;
            this.animationProgress = 0;
            return true; // Enemy killed
        }
        return false;
    }

    /**
     * Check if point (click/touch) hits enemy
     */
    containsPoint(x, y) {
        if (this.state === 'dead' || this.state === 'dying') return false;

        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }

    /**
     * Check if enemy is alive and active
     */
    isAlive() {
        return this.state !== 'dead' && this.state !== 'dying';
    }

    /**
     * Check if enemy is ready to be removed
     */
    shouldRemove() {
        return this.state === 'dead';
    }
}
