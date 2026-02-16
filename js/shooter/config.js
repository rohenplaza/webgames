/**
 * Sharp Shooter Game Configuration
 * Central place for all game constants and settings
 */

const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Game mechanics
    GAME: {
        INITIAL_LIVES: 3,
        MAX_HEALTH: 100,
        INITIAL_HEALTH: 100,
        POINTS_PER_ENEMY: 10,
        POINTS_PER_LEVEL: 100,
        FPS: 60
    },

    // Enemy settings
    ENEMY: {
        WIDTH: 80,
        HEIGHT: 100,
        HEALTH: 1, // One-hit kill for early levels
        DAMAGE: 10, // Damage to player when enemy shoots

        // Timing
        POPUP_DURATION: 400, // ms to fully appear
        AIM_DELAY: 3000, // ms before enemy starts aiming (increased for easier gameplay)
        AIMING_DURATION: 1200, // ms for aiming animation (warning time)
        SHOOT_ANIMATION_DURATION: 200, // ms
        DEATH_ANIMATION_DURATION: 300, // ms
        INITIAL_GRACE_PERIOD: 1500, // ms grace period at start of wave before enemies can shoot

        // Appearance
        COLORS: {
            BODY: '#4A4A4A',
            HIGHLIGHT: '#666666',
            DAMAGE_FLASH: '#FF0000',
            AIMING_GLOW: '#FF6600' // Orange glow when aiming
        },

        // Timing randomization
        IDLE_DELAY_VARIANCE: 2000 // Random offset in ms to stagger enemy attacks (0-2000ms between enemies)
    },

    // Bullet settings (enemy bullets)
    BULLET: {
        WIDTH: 8,
        HEIGHT: 12,
        SPEED: 5,
        COLOR: '#FF4444',
        GLOW: '#FF6666'
    },

    // Wave/spawn system
    WAVES: {
        BASE_ENEMIES: 2,
        ENEMIES_PER_LEVEL: 1.5,
        MAX_ENEMIES_PER_WAVE: 12,

        // Spawn positions (grid-based)
        SPAWN_POSITIONS: [
            { x: 100, y: 400 },  // Bottom left
            { x: 250, y: 400 },  // Bottom center-left
            { x: 400, y: 400 },  // Bottom center
            { x: 550, y: 400 },  // Bottom center-right
            { x: 700, y: 400 },  // Bottom right
            { x: 150, y: 250 },  // Mid left
            { x: 350, y: 250 },  // Mid center-left
            { x: 450, y: 250 },  // Mid center-right
            { x: 650, y: 250 },  // Mid right
            { x: 300, y: 100 },  // Top left
            { x: 500, y: 100 },  // Top center
            { x: 700, y: 100 },  // Top right
        ],

        // Difficulty scaling
        AIM_DELAY_REDUCTION_PER_LEVEL: 100, // ms faster each level
        MIN_AIM_DELAY: 500, // Minimum delay (level cap)
    },

    // Visual effects
    EFFECTS: {
        MUZZLE_FLASH_DURATION: 100, // ms
        HIT_INDICATOR_DURATION: 200, // ms
        CROSSHAIR_SIZE: 40,
        CROSSHAIR_COLOR: 'rgba(255, 0, 0, 0.7)',
    },

    // Background (first-person perspective)
    BACKGROUND: {
        SKY_COLOR: '#87CEEB',
        GROUND_COLOR: '#8B7355',
        HORIZON_Y: 200, // y-coordinate of horizon line
    }
};
