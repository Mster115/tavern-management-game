import React, { createContext, useContext, useState, useCallback } from 'react';
import type { GameState, ScoreLog, GameContextType } from '../types/game';
import { usePatronSystem } from '../hooks/usePatronSystem';
import { useGameLoop } from '../hooks/useGameLoop';

import { DifficultyStrategy } from '../strategies/difficulty';
import { ScoringStrategy } from '../strategies/scoring';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- State ---
    const [gameState, setGameState] = useState<GameState>('START_SCREEN');
    const [night, setNight] = useState(1);
    const [maxTime, setMaxTime] = useState(45); // Default start time

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
        // Use DifficultyStrategy for centralized timing logic
        const duration = DifficultyStrategy.getShiftDuration(night);

        setMaxTime(duration);
        setTimeLeft(duration);
        setFeedback('');
    };

    const startShift = () => {
        setGameState('SHIFT_INTRO');
        setCurrentShiftGold(0);
        setPatronsServed(0);
        setScoreLogs([]);
        setFeedback('');
        resetSystem();

        // Calculate duration early for display purposes if needed, 
        // effectively pre-loading the Next Night's duration
        const nextDuration = DifficultyStrategy.getShiftDuration(night);
        setMaxTime(nextDuration);

        setTimeout(() => {
            startRound();
        }, 3000);
    };

    const nextNight = () => {
        setNight(prev => prev + 1);
        startShift();
    };

    // Scoring Logic
    const submitPour = useCallback((error: number, drinkType: import('../types/game').DrinkType) => {
        if (!activePatron || feedback) return;

        // Use ScoringStrategy
        const result = ScoringStrategy.calculatePourScore(error, activePatron, drinkType);

        setTotalGold(prev => prev + result.finalGold);
        setCurrentShiftGold(prev => prev + result.finalGold);
        setPatronsServed(prev => prev + 1);
        setFeedback(result.feedbackText);

        const multiplierPercent = Math.round(result.patienceMultiplier * 100);

        setScoreLogs(prev => [{
            id: Date.now(),
            gold: result.finalGold,
            text: result.feedbackText,
            baseVal: result.baseGold,
            tipVal: result.tipVal,
            subText: result.patienceMultiplier < 0.9 ? `${multiplierPercent}% Patience` : undefined
        }, ...prev]);

        // Clear patron after delay
        setTimeout(() => {
            if (gameState === 'PLAYING') {
                clearActivePatron();
                setFeedback('');
            }
        }, 1500);

    }, [activePatron, gameState, clearActivePatron, feedback]);

    // Unlocked Drinks Logic
    // Derived from night, no need for separate state unless we add a shop later
    const unlockedDrinks: import('../types/game').DrinkType[] = ['ALE'];
    if (night >= 2) unlockedDrinks.push('WINE');

    const value = React.useMemo(() => ({
        gameState,
        night,
        timeLeft,
        maxTime,
        totalGold,
        currentShiftGold,
        patronsServed,
        queue,
        activePatron,
        scoreLogs,
        feedback,
        unlockedDrinks,
        startShift,
        nextNight,
        submitPour,
        spawnPatron
    }), [
        gameState,
        night,
        timeLeft,
        maxTime,
        totalGold,
        currentShiftGold,
        patronsServed,
        queue,
        activePatron,
        scoreLogs,
        feedback,
        // unlockedDrinks is derived from night, so it's stable if night is stable
        // functions are memoized/stable
        startShift,
        nextNight,
        submitPour,
        spawnPatron
    ]);

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
