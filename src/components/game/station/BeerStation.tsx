import React from 'react';
import { BeerGlass } from '../vessels/BeerGlass';
import { useGame } from '../../../context/GameContext';
import { TARGET_POUR_LEVEL } from '../../../constants/game';
import { usePourMechanic } from '../../../hooks/usePourMechanic';

export const BeerStation: React.FC = () => {
    const { gameState, activePatron, feedback, submitPour } = useGame();

    const { fillLevel, isPouring, startPouring, stopPouring } = usePourMechanic({
        isAllowed: gameState === 'PLAYING' && !!activePatron && !feedback,
        onSubmit: submitPour,
        resetTrigger: activePatron?.id
    });

    if (!gameState) return null;

    const handleStart = (e: React.SyntheticEvent) => {
        // Prevent default only for touch to avoid scrolling/selection while pouring
        if (e.type === 'touchstart') e.preventDefault();
        startPouring();
    };

    const handleEnd = (e: React.SyntheticEvent) => {
        if (e.type === 'touchend') e.preventDefault();
        stopPouring();
    };

    return (
        <div
            className="relative cursor-pointer select-none touch-none"
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={stopPouring}
            onTouchEnd={handleEnd}
        >
            <BeerGlass fillLevel={fillLevel} targetLevel={TARGET_POUR_LEVEL} />

            {/* Hint */}
            {!isPouring && fillLevel === 0 && activePatron && (
                <div className="absolute -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 animate-pulse text-amber-200/80 text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase whitespace-nowrap z-50 pointer-events-none">
                    Hold to Fill
                </div>
            )}
        </div>
    );
};
