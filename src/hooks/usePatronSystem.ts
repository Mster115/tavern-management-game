import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Patron } from '../types/game';
import {
    MAX_PATIENCE,
    MIN_SPAWN_INTERVAL,
    MAX_SPAWN_INTERVAL,
    DECAY_PER_SEC,
    BAR_PATIENCE_BOOST
} from '../constants/game';
import { generatePatron } from '../utils/patronGenerator';

export const usePatronSystem = (gameState: GameState, night: number) => {
    const [queue, setQueue] = useState<Patron[]>([]);
    const [activePatron, setActivePatron] = useState<Patron | null>(null);
    const spawnerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const gameStateRef = useRef(gameState);

    useEffect(() => {
        gameStateRef.current = gameState;
        if (gameState !== 'PLAYING') {
            if (spawnerRef.current) clearTimeout(spawnerRef.current);
        }
    }, [gameState]);

    const getSpawnRate = useCallback(() => {
        const reduction = (night - 1) * 1000;
        const base = MAX_SPAWN_INTERVAL - reduction;
        const randomness = Math.random() * 2000 - 1000;
        return Math.max(MIN_SPAWN_INTERVAL, base + randomness);
    }, [night]);

    const spawnPatron = useCallback((isInitial = false) => {
        if (!isInitial && gameStateRef.current !== 'PLAYING') return;

        const newPatron = generatePatron(night);
        setQueue(prev => [...prev, newPatron]);

        const nextInterval = getSpawnRate();
        spawnerRef.current = setTimeout(() => spawnPatron(false), nextInterval);
    }, [getSpawnRate, night]);

    // Patience and Leaving Logic Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const interval = setInterval(() => {
            // Update Queue Patience
            setQueue(prev => prev.map(p => {
                if (p.status === 'leaving') return p;

                const decay = DECAY_PER_SEC / (p.patienceMultiplier || 1);
                const newPatience = Math.max(0, p.patience - decay);
                const nextStatus = newPatience === 0 ? 'angry' : p.status;

                return { ...p, patience: newPatience, status: nextStatus as any };
            }));

            // Update Active Patron Patience
            setActivePatron(prev => {
                if (!prev || prev.status === 'leaving') return prev;

                // Active patrons also lose patience while waiting for their drink
                const decay = DECAY_PER_SEC / (prev.patienceMultiplier || 1);
                const newPatience = Math.max(0, prev.patience - decay);
                const nextStatus = newPatience === 0 ? 'angry' : prev.status;

                return { ...prev, patience: newPatience, status: nextStatus as any };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState]);

    // Handle Departure (when status is angry)
    useEffect(() => {
        const departingFromQueue = queue.find(p => p.status === 'angry');
        if (departingFromQueue) {
            setTimeout(() => {
                setQueue(prev => prev.filter(p => p.id !== departingFromQueue.id));
            }, 1500);
        }

        if (activePatron?.status === 'angry') {
            const idToClear = activePatron.id;
            setTimeout(() => {
                setActivePatron(current => {
                    if (current?.id === idToClear && current.status === 'angry') {
                        return null;
                    }
                    return current;
                });
            }, 1500);
        }
    }, [queue, activePatron]);

    // Initial spawn trigger
    useEffect(() => {
        if (gameState === 'PLAYING' && queue.length === 0 && !activePatron) {
            const initialDelay = Math.random() * 2000 + 500;
            const timeout = setTimeout(() => {
                spawnPatron(true);
            }, initialDelay);
            return () => clearTimeout(timeout);
        }
    }, [gameState, spawnPatron, activePatron, queue.length]);

    // Move Queue -> Active
    useEffect(() => {
        if (gameState === 'PLAYING' && !activePatron && queue.length > 0) {
            const rawNext = queue[0];
            // One-time patience boost when getting to the bar!
            const next: Patron = {
                ...rawNext,
                status: 'active',
                patience: Math.min(MAX_PATIENCE, rawNext.patience + BAR_PATIENCE_BOOST)
            };
            setQueue(prev => prev.slice(1));
            setActivePatron(next);
        }
    }, [queue, activePatron, gameState]);

    const resetSystem = useCallback(() => {
        setQueue([]);
        setActivePatron(null);
        if (spawnerRef.current) clearTimeout(spawnerRef.current);
    }, []);

    const clearActivePatron = useCallback(() => {
        setActivePatron(null);
    }, []);

    return {
        queue,
        activePatron,
        spawnPatron,
        resetSystem,
        clearActivePatron
    };
};
