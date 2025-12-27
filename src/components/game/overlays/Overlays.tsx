import React from 'react';
import { useGame } from '../../../context/GameContext';
import { StartScreen } from './StartScreen';
import { ShiftIntro } from './ShiftIntro';
import { ShiftSummary } from './ShiftSummary';

export const Overlays: React.FC = () => {
    const { gameState, night, totalGold, patronsServed, currentShiftGold, startShift, nextNight } = useGame();

    if (gameState === 'PLAYING') return null;

    return (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-center animate-fadeIn font-serif">
            <h1 className="text-6xl text-amber-500 mb-4 tracking-widest drop-shadow-md">The Golden Hearth</h1>

            {gameState === 'START_SCREEN' && (
                <StartScreen
                    night={night}
                    totalGold={totalGold}
                    onStart={startShift}
                />
            )}

            {gameState === 'SHIFT_INTRO' && (
                <ShiftIntro night={night} />
            )}

            {gameState === 'SHIFT_SUMMARY' && (
                <ShiftSummary
                    night={night}
                    patronsServed={patronsServed}
                    currentShiftGold={currentShiftGold}
                    onNextNight={nextNight}
                />
            )}
        </div>
    );
};
