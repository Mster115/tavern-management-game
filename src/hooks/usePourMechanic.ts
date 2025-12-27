import { useState, useEffect, useCallback, useRef } from 'react';
import { POUR_FILL_RATE, TARGET_POUR_LEVEL } from '../constants/game';

interface UsePourMechanicProps {
    isAllowed: boolean;
    onSubmit: (error: number) => void;
    resetTrigger?: any;
}

export const usePourMechanic = ({ isAllowed, onSubmit, resetTrigger }: UsePourMechanicProps) => {
    const [fillLevel, setFillLevel] = useState(0);
    const [isPouring, setIsPouring] = useState(false);

    const requestRef = useRef<number | null>(null);
    const fillLevelRef = useRef(0);
    const lastTimeRef = useRef<number>(0);

    const resetPour = useCallback(() => {
        setFillLevel(0);
        fillLevelRef.current = 0;
        lastTimeRef.current = 0;
        setIsPouring(false);
    }, []);

    // Reset when trigger changes (e.g. new patron)
    useEffect(() => {
        resetPour();
    }, [resetTrigger, resetPour]);

    const animatePour = useCallback((time: number) => {
        if (isPouring) {
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = time;
            }

            const deltaTime = time - lastTimeRef.current;
            lastTimeRef.current = time;

            // Normalize fill rate per second (delta is in ms)
            // If POUR_FILL_RATE was designed for 60fps, we multiply by (delta / 16.67) or adjust the constant.
            // Assuming POUR_FILL_RATE is "amount per frame at 60fps", we can convert:
            // amount_per_ms = POUR_FILL_RATE / 16.667
            const fillAmount = (deltaTime / 16.667) * POUR_FILL_RATE;

            setFillLevel(prev => {
                const next = prev >= 100 ? 100 : prev + fillAmount;
                fillLevelRef.current = next;
                return next;
            });
            requestRef.current = requestAnimationFrame(animatePour);
        }
    }, [isPouring]);

    useEffect(() => {
        if (isPouring) {
            lastTimeRef.current = 0; // Reset time on start
            requestRef.current = requestAnimationFrame(animatePour);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPouring, animatePour]);

    const startPouring = useCallback(() => {
        if (isAllowed) {
            setIsPouring(true);
        }
    }, [isAllowed]);

    const stopPouring = useCallback(() => {
        if (isPouring) {
            setIsPouring(false);
            const error = Math.abs(fillLevelRef.current - TARGET_POUR_LEVEL);
            onSubmit(error);
        }
    }, [isPouring, onSubmit]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat) startPouring();
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') stopPouring();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [startPouring, stopPouring]);

    return {
        fillLevel,
        isPouring,
        resetPour,
        startPouring,
        stopPouring
    };
};
