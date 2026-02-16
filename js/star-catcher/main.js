/**
 * Main Game Initialization
 * Sets up the game and handles user input
 */

// Get canvas and create game engine
const canvas = document.getElementById('gameCanvas');
const game = new GameEngine(canvas);

// UI Elements
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const gameOverScreen = document.getElementById('gameOver');

/**
 * Keyboard Controls
 */
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    KeyA: false,
    KeyD: false
};

document.addEventListener('keydown', (e) => {
    if (e.code in keys) {
        keys[e.code] = true;
        e.preventDefault();

        // Update player movement
        if (keys.ArrowLeft || keys.KeyA) {
            game.player.movingLeft = true;
        }
        if (keys.ArrowRight || keys.KeyD) {
            game.player.movingRight = true;
        }
    }

    // Pause with Space or P
    if ((e.code === 'Space' || e.code === 'KeyP') && game.gameRunning) {
        game.togglePause();
        updatePauseButton();
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) {
        keys[e.code] = false;

        // Update player movement
        if (!keys.ArrowLeft && !keys.KeyA) {
            game.player.movingLeft = false;
        }
        if (!keys.ArrowRight && !keys.KeyD) {
            game.player.movingRight = false;
        }
    }
});

/**
 * Touch Controls for Mobile
 */
let touchActive = false;

canvas.addEventListener('touchstart', handleTouch, { passive: false });
canvas.addEventListener('touchmove', handleTouch, { passive: false });
canvas.addEventListener('touchend', () => {
    touchActive = false;
    game.player.movingLeft = false;
    game.player.movingRight = false;
}, { passive: false });

function handleTouch(e) {
    if (!game.gameRunning || game.gamePaused) return;

    e.preventDefault(); // Prevent scrolling
    touchActive = true;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;

    // Get touch position in canvas coordinates
    const touchX = (touch.clientX - rect.left) * scaleX;

    // Get player center
    const playerCenterX = game.player.x + game.player.width / 2;

    // Move player toward touch position
    const threshold = 20; // Dead zone to prevent jittering

    if (touchX < playerCenterX - threshold) {
        game.player.movingLeft = true;
        game.player.movingRight = false;
    } else if (touchX > playerCenterX + threshold) {
        game.player.movingRight = true;
        game.player.movingLeft = false;
    } else {
        game.player.movingLeft = false;
        game.player.movingRight = false;
    }
}

/**
 * Button Event Listeners
 */
startBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    game.start();
});

pauseBtn.addEventListener('click', () => {
    game.togglePause();
    updatePauseButton();
});

restartBtn.addEventListener('click', () => {
    game.stop();
    gameOverScreen.classList.add('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    game.reset();
});

playAgainBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    game.start();
});

/**
 * Update pause button text
 */
function updatePauseButton() {
    pauseBtn.textContent = game.gamePaused ? 'Resume' : 'Pause';
}

/**
 * Initialize the game display
 */
window.addEventListener('load', () => {
    game.draw();
    console.log('Star Catcher Game Loaded!');
    console.log('Press Start to begin playing');
});
