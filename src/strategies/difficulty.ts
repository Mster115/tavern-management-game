
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
        // Base: 5000ms. Reduction: 400ms per night. min 1500ms.
        // Night 1: ~4000-6000ms
        // Night 5: ~2400-4400ms
        const reduction = (night - 1) * 400;
        const base = 5000 - reduction;
        // Add randomness: +/- 1000ms
        const randomness = Math.random() * 2000 - 1000;
        return Math.max(1500, base + randomness);
    },

    /**
     * Calculates the patience decay per second.
     * Can optionally scale with night number if desired.
     */
    getPatienceDecay: (baseDecay: number, multiplier: number = 1, night: number = 1): number => {
        // Base difficulty multiplier: Starts at 1.0, +0.4 per night. No Cap.
        // Night 1: 1.0
        // Night 2: 1.4
        // Night 5: 2.6 (Over double speed)
        // Night 10: 4.6 (Insane)
        const difficultyMultiplier = 1 + ((night - 1) * 0.4);

        // Final decay = Base * Difficulty / PatronMultiplier (higher patron mult = slower decay)
        return (baseDecay * difficultyMultiplier) / multiplier;
    },

    /**
     * Calculates acceptable angry patron limit per shift.
     * Scales UP with difficulty to prevent instant game overs in chaos levels.
     */
    getAngryLimit: (night: number): number => {
        // Night 1: 3
        // Night 5: 3 + 2.4 = 5.4 -> 5
        // Night 10: 3 + 5.4 = 8.4 -> 8
        // Scaled to reach 8 by night 10, capped at 8.
        return Math.min(8, Math.floor(3 + (night - 1) * 0.6));
    }
};
