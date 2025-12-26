import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState } from '../types/game';
import { ROUND_DURATION } from '../constants/game';

export const useGameLoop = (gameState: GameState, onRoundEnd: () => void) => {
    const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (gameState === 'PLAYING') {
            setTimeLeft(ROUND_DURATION);
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
