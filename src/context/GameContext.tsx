import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GameState, ScoreLog, GameContextType } from '../types/game';
import {
    ROUND_DURATION,
    TOLERANCE,
    MAX_PATIENCE
} from '../constants/game';
import { usePatronSystem } from '../hooks/usePatronSystem';
import { useGameLoop } from '../hooks/useGameLoop';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State ---
    const [gameState, setGameState] = useState<GameState>('START_SCREEN');
    const [night, setNight] = useState(1);

    // Hooks
    const endRound = useCallback(() => {
        setGameState('SHIFT_SUMMARY');
    }, []);

    const { timeLeft, setTimeLeft } = useGameLoop(gameState, endRound);
    const {
        queue,
        activePatron,
        spawnPatron,
        resetSystem,
        clearActivePatron
    } = usePatronSystem(gameState, night);

    const [totalGold, setTotalGold] = useState(0);
    const [currentShiftGold, setCurrentShiftGold] = useState(0);
    const [patronsServed, setPatronsServed] = useState(0);
    const [scoreLogs, setScoreLogs] = useState<ScoreLog[]>([]);
    const [feedback, setFeedback] = useState('');

    // --- Actions ---

    const startRound = () => {
        setGameState('PLAYING');
        setTimeLeft(ROUND_DURATION);
        setFeedback('');
        // spawnPatron() is now handled by effect in usePatronSystem
    };

    const startShift = () => {
        setGameState('SHIFT_INTRO');
        setCurrentShiftGold(0);
        setPatronsServed(0);
        setScoreLogs([]);
        setFeedback('');
        resetSystem();

        setTimeout(() => {
            startRound();
        }, 3000);
    };

    const nextNight = () => {
        setNight(prev => prev + 1);
        startShift();
    };

    // Scoring Logic
    const submitPour = useCallback((error: number) => {
        if (!activePatron || feedback) return;

        // Base Reward based on Pour Quality
        let baseGold = 0;
        let baseText = "";

        if (error <= 1) {
            baseGold = 50;
            baseText = "Perfect Pour!";
        } else if (error <= TOLERANCE) {
            baseGold = 35;
            baseText = "Tasty!";
        } else if (error <= TOLERANCE * 2) {
            baseGold = 15;
            baseText = "Meh.";
        } else {
            baseGold = 5;
            baseText = "Yuck.";
        }

        // Multiplier based on Patience (0.5 to 1.0)
        // Even at 0 patience, you get 50% of the value.
        const patienceRatio = activePatron.patience / MAX_PATIENCE;
        const patienceMultiplier = 0.5 + (0.5 * patienceRatio);

        const finalGold = Math.floor(baseGold * patienceMultiplier);

        setTotalGold(prev => prev + finalGold);
        setCurrentShiftGold(prev => prev + finalGold);
        setPatronsServed(prev => prev + 1);
        setFeedback(`${baseText}`);

        const multiplierPercent = Math.round(patienceMultiplier * 100);

        setScoreLogs(prev => [{
            id: Date.now(),
            gold: finalGold,
            text: baseText,
            subText: patienceMultiplier < 0.9 ? `${multiplierPercent}% Patience` : undefined
        }, ...prev]);

        // Clear patron after delay
        setTimeout(() => {
            if (gameState === 'PLAYING') {
                clearActivePatron();
                setFeedback('');
            }
        }, 1500);

    }, [activePatron, gameState, clearActivePatron]);

    const value = {
        gameState,
        night,
        timeLeft,
        totalGold,
        currentShiftGold,
        patronsServed,
        queue,
        activePatron,
        scoreLogs,
        feedback,
        startShift,
        nextNight,
        submitPour,
        spawnPatron
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
