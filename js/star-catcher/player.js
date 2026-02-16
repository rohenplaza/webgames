/**
 * Player Class
 * Handles player movement and rendering
 */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.speed = CONFIG.PLAYER.SPEED;
        this.color = CONFIG.PLAYER.COLOR;

        // Movement state
        this.movingLeft = false;
        this.movingRight = false;
    }

    /**
     * Update player position based on movement state
     */
    update() {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x < CONFIG.CANVAS_WIDTH - this.width) {
            this.x += this.speed;
        }
    }

    /**
     * Draw the player (basket) on the canvas
     */
    draw(ctx) {
        // Draw basket
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 3;

        // Basket bottom
        ctx.fillRect(this.x, this.y + 40, this.width, 20);
        ctx.strokeRect(this.x, this.y + 40, this.width, 20);

        // Basket sides
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 40);
        ctx.lineTo(this.x + 10, this.y);
        ctx.lineTo(this.x + 10, this.y + 40);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + 40);
        ctx.lineTo(this.x + this.width - 10, this.y);
        ctx.lineTo(this.x + this.width - 10, this.y + 40);
        ctx.fill();
        ctx.stroke();

        // Basket pattern
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 2;
        for (let i = 20; i < this.width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y + 10);
            ctx.lineTo(this.x + i, this.y + 50);
            ctx.stroke();
        }
    }

    /**
     * Reset player to starting position
     */
    reset() {
        this.x = CONFIG.PLAYER.START_X;
        this.y = CONFIG.PLAYER.START_Y;
        this.movingLeft = false;
        this.movingRight = false;
    }

    /**
     * Get player bounding box for collision detection
     */
    getBounds() {
        return {
            left: this.x + 10,
            right: this.x + this.width - 10,
            top: this.y,
            bottom: this.y + this.height
        };
    }
}
