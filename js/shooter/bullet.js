/**
 * Bullet Class
 * Enemy projectiles that move toward player
 */

class Bullet {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.BULLET.WIDTH;
        this.height = CONFIG.BULLET.HEIGHT;
        this.speed = CONFIG.BULLET.SPEED;

        // Calculate direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.velocityX = (dx / distance) * this.speed;
        this.velocityY = (dy / distance) * this.speed;

        // Visual
        this.rotation = Math.atan2(dy, dx);
    }

    /**
     * Update bullet position
     */
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    /**
     * Draw bullet
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Glow effect
        ctx.shadowColor = CONFIG.BULLET.GLOW;
        ctx.shadowBlur = 10;

        // Bullet body
        ctx.fillStyle = CONFIG.BULLET.COLOR;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Tip highlight
        ctx.fillStyle = '#FFAA00';
        ctx.fillRect(this.width / 2 - 3, -this.height / 2, 3, this.height);

        ctx.restore();
    }

    /**
     * Check if bullet is off screen
     */
    isOffScreen() {
        return (
            this.x < -50 ||
            this.x > CONFIG.CANVAS_WIDTH + 50 ||
            this.y < -50 ||
            this.y > CONFIG.CANVAS_HEIGHT + 50
        );
    }

    /**
     * Check collision with player (center bottom of screen)
     */
    checkPlayerHit() {
        // Player "position" is bottom center
        const playerX = CONFIG.CANVAS_WIDTH / 2;
        const playerY = CONFIG.CANVAS_HEIGHT - 50;
        const hitRadius = 30;

        const dx = this.x - playerX;
        const dy = this.y - playerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < hitRadius;
    }
}
