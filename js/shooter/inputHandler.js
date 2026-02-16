/**
 * InputHandler Class
 * Unified touch and mouse input handling
 */

class InputHandler {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.gameEngine = gameEngine;
        this.touchActive = false;

        this.setupEventListeners();
    }

    /**
     * Setup both mouse and touch events
     */
    setupEventListeners() {
        // Mouse events (desktop)
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Touch events (mobile)
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });

        // Prevent context menu on long press
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Handle mouse click
     */
    handleClick(e) {
        if (!this.gameEngine.gameRunning || this.gameEngine.gamePaused) return;

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        this.gameEngine.handleShot(x, y);
    }

    /**
     * Handle touch event
     */
    handleTouch(e) {
        if (!this.gameEngine.gameRunning || this.gameEngine.gamePaused) return;

        e.preventDefault(); // Prevent scrolling

        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        this.gameEngine.handleShot(x, y);

        // Optional: Haptic feedback
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }

    /**
     * Get canvas-relative coordinates
     */
    getCanvasCoordinates(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }
}
