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

    // Calculate dynamic limit based on night
    const angryLimit = DifficultyStrategy.getAngryLimit(night);

    // Hooks
    const endRound = useCallback(() => {
        setGameState('SHIFT_SUMMARY');
    }, []);

    // --- Actions (Defined early for hooks) ---
    const [angryPatronCount, setAngryPatronCount] = useState(0);
    const [gameOverReason, setGameOverReason] = useState<'LIMIT_REACHED' | 'ROYAL_SCANDAL' | null>(null);

    const registerAngryPatron = useCallback((type?: import('../types/game').PatronType) => {
        setAngryPatronCount(prev => {
            // Royal Riot Mechanic: 5% chance to instant fail
            if (type === 'ROYAL') {
                if (Math.random() < 0.05) {
                    setGameOverReason('ROYAL_SCANDAL');
                    setTimeout(() => setGameState('GAME_OVER'), 0);
                    return prev + 1;
                }
            }

            const newVal = prev + 1;
            // Use the current night's limit (accessed via closure if possible, but wait... 
            // registerAngryPatron depends on 'angryLimit' which depends on 'night'.
            // So we must add [angryLimit] to dependency array.
            if (newVal >= angryLimit) {
                setGameOverReason('LIMIT_REACHED');
                setTimeout(() => setGameState('GAME_OVER'), 0);
            }
            return newVal;
        });
    }, [angryLimit]);

    const [totalGold, setTotalGold] = useState(0);
    const [currentShiftGold, setCurrentShiftGold] = useState(0);
    const [patronsServed, setPatronsServed] = useState(0);
    const [scoreLogs, setScoreLogs] = useState<ScoreLog[]>([]);
    const [feedback, setFeedback] = useState('');

    const { timeLeft, setTimeLeft } = useGameLoop(gameState, endRound);

    // Pass feedback existence as paused state
    const {
        queue,
        activePatron,
        spawnPatron,
        resetSystem,
        clearActivePatron
    } = usePatronSystem(gameState, night, registerAngryPatron, !!feedback);

    // --- Actions ---

    const startRound = () => {
        setGameState('PLAYING');
        // Use DifficultyStrategy for centralized timing logic
        const duration = DifficultyStrategy.getShiftDuration(night);

        setMaxTime(duration);
        setTimeLeft(duration);
        setFeedback('');
    };

    const resetGame = useCallback(() => {
        setNight(1);
        setTotalGold(0);
        setGameState('START_SCREEN');
        setAngryPatronCount(0);
        resetSystem();
    }, [resetSystem]);

    const retryNight = useCallback(() => {
        setGameState('START_SCREEN');
        setAngryPatronCount(0);
        setTimeout(() => startShift(), 100);
    }, [night]);

    // Clear angry count at start of shift if we want it to be per-shift.
    // However, user said "game over -> night 1", implying a "run" based mechanic.
    // If we want it per shift, uncomment below:
    // useEffect(() => { if(gameState === 'SHIFT_INTRO') setAngryPatronCount(0); }, [gameState]);
    // BUT, "go back to night 1" implies a roguelike element. Let's keep it cumulative? 
    // Actually, "starts to be getting more and more hectic... round 5... need to be working perfectly"
    // implies it resets per night OR you have lives.
    // Let's do PER SHIFT limit to make later nights harder (as decay is faster).
    // Logic: In Night 1, it's easy. In Night 5, it's hard. If you fail Night 5, you lose the run.

    // Changing strategy: Reset angry count at start of shift.
    // So you have to "survive" the night.

    const startShift = () => {
        setGameState('SHIFT_INTRO');
        setCurrentShiftGold(0);
        setPatronsServed(0);
        setAngryPatronCount(0); // Reset for the night
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
        angryPatronCount,
        angryLimit,
        gameOverReason,
        queue,
        activePatron,
        scoreLogs,
        feedback,
        unlockedDrinks,
        startShift,
        nextNight,
        retryNight,
        resetGame,
        submitPour,
        spawnPatron,
        registerAngryPatron
    }), [
        gameState,
        night,
        timeLeft,
        maxTime,
        totalGold,
        currentShiftGold,
        patronsServed,
        angryPatronCount,
        angryLimit,
        queue,
        activePatron,
        gameOverReason,
        scoreLogs,
        feedback,
        // unlockedDrinks is derived from night, so it's stable if night is stable
        // functions are memoized/stable
        startShift,
        nextNight,
        retryNight,
        resetGame,
        submitPour,
        spawnPatron,
        registerAngryPatron
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
