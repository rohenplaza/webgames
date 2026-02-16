/**
 * Game Configuration
 * Central place for all game constants and settings
 */

const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,

    // Player settings
    PLAYER: {
        WIDTH: 80,
        HEIGHT: 60,
        SPEED: 7,
        COLOR: '#FFD700',
        START_X: 360,
        START_Y: 520
    },

    // Falling object settings
    OBJECTS: {
        STAR: {
            WIDTH: 30,
            HEIGHT: 30,
            COLOR: '#FFD700',
            POINTS: 10,
            HEALTH_RESTORE: 15, // Health restored when catching a star
            HEALTH_PENALTY_MISSED: 20, // Health lost when missing a star
            SPAWN_CHANCE: 0.7 // 70% chance to spawn a star
        },
        METEOR: {
            WIDTH: 35,
            HEIGHT: 35,
            COLOR: '#FF4444',
            DAMAGE: 1,
            SPAWN_CHANCE: 0.3 // 30% chance to spawn a meteor
        },
        INITIAL_SPEED: 2,
        SPEED_INCREASE_PER_LEVEL: 0.5,
        SPAWN_RATE: 60 // frames between spawns (lower = faster spawning)
    },

    // Game mechanics
    GAME: {
        INITIAL_LIVES: 3,
        POINTS_PER_LEVEL: 100,
        FPS: 60,
        MAX_HEALTH: 100,
        INITIAL_HEALTH: 100
    },

    // Visual effects
    EFFECTS: {
        STAR_GLOW: '#FFF8DC',
        METEOR_GLOW: '#FF6666'
    }
};
