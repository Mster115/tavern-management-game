import { MAX_SPAWN_INTERVAL, MIN_SPAWN_INTERVAL } from "../constants/game";

export const DifficultyStrategy = {
    /**
     * Calculates the duration of the shift in seconds based on the night number.
     * Formula: Starts at 45s, increases by 20s per night, capped at 120s.
     */
    getShiftDuration: (night: number): number => {
        return Math.min(120, 45 + (night - 1) * 20);
    },

    /**
     * Calculates the spawn interval for patrons.
     * Decreases as the nights progress (patrons appear faster).
     */
    getSpawnInterval: (night: number): number => {
        const reduction = (night - 1) * 1000;
        const base = MAX_SPAWN_INTERVAL - reduction;
        // Add randomness: +/- 1000ms
        const randomness = Math.random() * 2000 - 1000;
        return Math.max(MIN_SPAWN_INTERVAL, base + randomness);
    },

    /**
     * Calculates the patience decay per second.
     * Can optionally scale with night number if desired.
     */
    getPatienceDecay: (baseDecay: number, multiplier: number = 1): number => {
        return baseDecay / multiplier;
    }
};
