// Game Loop
// Game Loop
// ROUND_DURATION is now dynamic in GameContext
export const MIN_SPAWN_INTERVAL = 6000; // Was 3000
export const MAX_SPAWN_INTERVAL = 12000; // Was 8000

// Patron Logic
export const MAX_PATIENCE = 100; // Using a 0-100 scale for better UI granularity
export const DECAY_PER_SEC = 1; // Slower decay for Round 1
export const BAR_PATIENCE_BOOST = 15; // One-time boost when reaching the bar

// Scoring
export const TOLERANCE = 5;

// Beer Pouring
export const TARGET_POUR_LEVEL = 80;
export const POUR_FILL_RATE = 0.8;
