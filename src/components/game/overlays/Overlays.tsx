import React from 'react';
import { useGame } from '../../../context/GameContext';
import { StartScreen } from './StartScreen';
import { ShiftIntro } from './ShiftIntro';
import { ShiftSummary } from './ShiftSummary';
import { GameOverScreen } from './GameOverScreen';

export const Overlays: React.FC = () => {
    const { gameState, night, totalGold, patronsServed, currentShiftGold, startShift, nextNight, resetGame, angryPatronCount, gameOverReason } = useGame();

    if (gameState === 'PLAYING') return null;

    return (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-center animate-fadeIn font-serif px-4">
            {gameState !== 'GAME_OVER' && (
                <h1 className="text-4xl md:text-6xl text-amber-500 mb-4 tracking-widest drop-shadow-md">
                    Ye Olde<br className="md:hidden" /> Golden Hearth
                </h1>
            )}

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

            {gameState === 'GAME_OVER' && (
                <GameOverScreen
                    night={night}
                    totalGold={totalGold}
                    patronsServed={patronsServed}
                    angryCount={angryPatronCount}
                    reason={gameOverReason}
                    onReset={resetGame}
                />
            )}
        </div>
    );
};
