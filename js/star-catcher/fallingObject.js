/**
 * FallingObject Class
 * Handles falling stars and meteors
 */

class FallingObject {
    constructor(x, type, speed) {
        this.x = x;
        this.y = -50;
        this.type = type; // 'star' or 'meteor'
        this.speed = speed;
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.1 - 0.05;

        // Set properties based on type
        if (type === 'star') {
            this.width = CONFIG.OBJECTS.STAR.WIDTH;
            this.height = CONFIG.OBJECTS.STAR.HEIGHT;
            this.color = CONFIG.OBJECTS.STAR.COLOR;
            this.points = CONFIG.OBJECTS.STAR.POINTS;
        } else {
            this.width = CONFIG.OBJECTS.METEOR.WIDTH;
            this.height = CONFIG.OBJECTS.METEOR.HEIGHT;
            this.color = CONFIG.OBJECTS.METEOR.COLOR;
            this.damage = CONFIG.OBJECTS.METEOR.DAMAGE;
        }
    }

    /**
     * Update object position
     */
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    /**
     * Draw the object on the canvas
     */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        if (this.type === 'star') {
            this.drawStar(ctx);
        } else {
            this.drawMeteor(ctx);
        }

        ctx.restore();
    }

    /**
     * Draw a star shape
     */
    drawStar(ctx) {
        const spikes = 5;
        const outerRadius = this.width / 2;
        const innerRadius = outerRadius / 2;

        // Glow effect
        ctx.shadowColor = CONFIG.EFFECTS.STAR_GLOW;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.shadowBlur = 0;
    }

    /**
     * Draw a meteor shape
     */
    drawMeteor(ctx) {
        const radius = this.width / 2;

        // Glow effect
        ctx.shadowColor = CONFIG.EFFECTS.METEOR_GLOW;
        ctx.shadowBlur = 15;

        // Main meteor body
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Crater details
        ctx.fillStyle = '#CC0000';
        ctx.beginPath();
        ctx.arc(-5, -5, radius / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(5, 3, radius / 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    /**
     * Check if object is off screen
     */
    isOffScreen() {
        return this.y > CONFIG.CANVAS_HEIGHT;
    }

    /**
     * Check collision with player
     */
    checkCollision(player) {
        const playerBounds = player.getBounds();
        const objectCenterX = this.x + this.width / 2;
        const objectCenterY = this.y + this.height / 2;

        return (
            objectCenterX > playerBounds.left &&
            objectCenterX < playerBounds.right &&
            objectCenterY > playerBounds.top &&
            objectCenterY < playerBounds.bottom
        );
    }
}
