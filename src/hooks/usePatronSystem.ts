import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Patron } from '../types/game';
import {
    MAX_PATIENCE,
    DECAY_PER_SEC,
    BAR_PATIENCE_BOOST
} from '../constants/game';
import { generatePatron } from '../utils/patronGenerator';
import { DifficultyStrategy } from '../strategies/difficulty';

export const usePatronSystem = (gameState: GameState, night: number, onPatronAngry: (type: import('../types/game').PatronType) => void, isPaused: boolean = false) => {
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

    const spawnPatron = useCallback((isInitial = false) => {
        if (!isInitial && (gameStateRef.current !== 'PLAYING')) return; // Removed isPaused check for spawning? Or should we stop spawning too? Probably let spawn timer run, but maybe pause logic? Let's keep simple.

        const newPatron = generatePatron(night);
        setQueue(prev => [...prev, newPatron]);

        const nextInterval = DifficultyStrategy.getSpawnInterval(night);
        spawnerRef.current = setTimeout(() => spawnPatron(false), nextInterval);
    }, [night]);

    // Patience and Leaving Logic Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const interval = setInterval(() => {
            // Update Queue Patience (ALWAYS runs, even during feedback)
            setQueue(prev => prev.map(p => {
                if (p.status === 'leaving') return p;

                const baseDecay = DifficultyStrategy.getPatienceDecay(DECAY_PER_SEC, p.patienceMultiplier, night);
                const newPatience = Math.max(0, p.patience - baseDecay);
                const nextStatus = newPatience === 0 ? 'angry' : p.status;

                if (nextStatus === 'angry' && p.status !== 'angry') {
                    onPatronAngry(p.type);
                }

                return { ...p, patience: newPatience, status: nextStatus as any };
            }));

            // Update Active Patron Patience (PAUSED during feedback)
            if (!isPaused) {
                setActivePatron(prev => {
                    if (!prev || prev.status === 'leaving') return prev;

                    // Active patrons also lose patience while waiting for their drink
                    const baseDecay = DifficultyStrategy.getPatienceDecay(DECAY_PER_SEC, prev.patienceMultiplier, night);
                    const newPatience = Math.max(0, prev.patience - baseDecay);
                    const nextStatus = newPatience === 0 ? 'angry' : prev.status;

                    if (nextStatus === 'angry' && prev.status !== 'angry') {
                        onPatronAngry(prev.type);
                    }

                    return { ...prev, patience: newPatience, status: nextStatus as any };
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, isPaused, night]);

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
