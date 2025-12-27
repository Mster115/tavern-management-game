import { MAX_PATIENCE, TOLERANCE } from "../constants/game";
import type { Patron } from "../types/game";

export interface ScoreResult {
    finalGold: number;
    baseGold: number;
    tipVal: number;
    feedbackText: string;
    patienceMultiplier: number;
}

export const ScoringStrategy = {
    /**
     * seamless scoring logic refactored from GameContext.
     */
    calculatePourScore: (error: number, activePatron: Patron): ScoreResult => {
        // 1. Determine Base Reward & Text
        let baseGold = 0;
        let baseText = "";

        if (error <= 1) {
            baseGold = 25;
            baseText = "Perfect Pour!";
        } else if (error <= TOLERANCE) {
            baseGold = 18;
            baseText = "Tasty!";
        } else if (error <= TOLERANCE * 2) {
            baseGold = 8;
            baseText = "Meh.";
        } else {
            baseGold = 2;
            baseText = "Yuck.";
        }

        // 2. Calculate Multipliers
        // Multiplier based on Patience (0.8 to 1.2)
        const patienceRatio = activePatron.patience / MAX_PATIENCE;
        const patienceMultiplier = 0.8 + (0.4 * patienceRatio);

        // Patron Wealth Multiplier
        const patronMultiplier = activePatron.goldMultiplier || 1.0;

        // 3. Calculate Final Gold
        // Formula: Base * Patience * Wealth
        const finalGold = Math.floor(baseGold * patienceMultiplier * patronMultiplier);

        // 4. Calculate Tip (Difference between final and base)
        const tipVal = finalGold - baseGold;

        return {
            finalGold,
            baseGold,
            tipVal,
            feedbackText: baseText,
            patienceMultiplier
        };
    }
};
