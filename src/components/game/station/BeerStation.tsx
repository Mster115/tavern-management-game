import React from 'react';
import { BeerGlass } from '../vessels/BeerGlass';
import { useGame } from '../../../context/GameContext';
import { TARGET_POUR_LEVEL } from '../../../constants/game';
import { usePourMechanic } from '../../../hooks/usePourMechanic';

export const BeerStation: React.FC = () => {
    const { gameState, activePatron, feedback, submitPour } = useGame();

    const { fillLevel, isPouring } = usePourMechanic({
        isAllowed: gameState === 'PLAYING' && !!activePatron && !feedback,
        onSubmit: submitPour,
        resetTrigger: activePatron?.id
    });

    if (!gameState) return null;

    return (
        <div className="relative">
            <BeerGlass fillLevel={fillLevel} targetLevel={TARGET_POUR_LEVEL} />

            {/* Hint */}
            {!isPouring && fillLevel === 0 && activePatron && (
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 animate-pulse text-amber-200/80 text-xs tracking-[0.2em] font-bold uppercase whitespace-nowrap z-50 pointer-events-none">
                    Hold Space
                </div>
            )}
        </div>
    );
};
