import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState } from '../types/game';

export const useGameLoop = (gameState: GameState, onRoundEnd: () => void) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (gameState === 'PLAYING') {
            // Duration is set by the controller (GameContext) before or during this state transition
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        stopTimer();
                        onRoundEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            stopTimer();
        }

        return () => stopTimer();
    }, [gameState, onRoundEnd, stopTimer]);

    return {
        timeLeft,
        setTimeLeft,
        stopTimer
    };
};
