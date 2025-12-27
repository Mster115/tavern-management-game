import React, { useState, useEffect } from 'react';
import { WineGlass } from '../vessels/WineGlass';
import { useGame } from '../../../context/GameContext';
import { usePourMechanic } from '../../../hooks/usePourMechanic';

// Wine target level is usually lower than beer (half glass)
const WINE_TARGET_LEVEL = 50;
const UNCORK_CLICKS_REQUIRED = 3;

export const WineStation: React.FC = () => {
    const { gameState, activePatron, feedback, submitPour } = useGame();
    const [corksRemoved, setCorksRemoved] = useState(0);

    const [justOpened, setJustOpened] = useState(false);

    const isBottleOpen = corksRemoved >= UNCORK_CLICKS_REQUIRED;

    // Reset bottle state when patron changes
    useEffect(() => {
        if (!activePatron) {
            setCorksRemoved(0);
            setJustOpened(false);
        }
    }, [activePatron?.id]);

    // Cooldown after opening to prevent accidental immediate pour
    useEffect(() => {
        if (isBottleOpen) {
            setJustOpened(true);
            const timer = setTimeout(() => setJustOpened(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isBottleOpen]);

    const { fillLevel, isPouring, startPouring, stopPouring } = usePourMechanic({
        isAllowed: gameState === 'PLAYING' && !!activePatron && !feedback && isBottleOpen && !justOpened,
        onSubmit: (err) => submitPour(err, 'WINE'),
        resetTrigger: activePatron?.id,
        targetLevel: WINE_TARGET_LEVEL
    });

    const handleInteraction = (e: React.SyntheticEvent) => {
        // Prevent default for touch
        if (e.type === 'touchstart') e.preventDefault();

        if (!isBottleOpen) {
            setCorksRemoved(prev => prev + 1);
        } else if (!justOpened) {
            startPouring();
        }
    };

    const handleEnd = (e: React.SyntheticEvent) => {
        if (e.type === 'touchend') e.preventDefault();
        stopPouring();
    };

    return (
        <div
            className="relative cursor-pointer select-none touch-none flex flex-col items-center"
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleInteraction}
            onTouchStart={handleInteraction}
            onMouseUp={handleEnd}
            onMouseLeave={stopPouring}
            onTouchEnd={handleEnd}
        >
            {/* 1. Bottle State (Uncorking) */}
            {!isBottleOpen ? (
                <div className="relative w-16 h-40 flex flex-col items-center justify-end animate-bounce-short">
                    {/* Visual helper for uncorking - Responsive positioning */}
                    {activePatron && (
                        <div className={`
                            absolute z-50 flex flex-col items-center animate-pulse
                            top-[-5rem] left-1/2 -translate-x-1/2
                            sm:top-8 sm:left-auto sm:-right-32 sm:translate-x-0
                        `}>
                            <div className="bg-black/80 px-3 py-2 rounded-lg border border-red-900/50 text-center shadow-xl backdrop-blur-sm whitespace-nowrap">
                                <span className="text-red-300 font-bold text-xs uppercase tracking-wider block mb-0.5">Uncork!</span>
                                <span className="text-amber-200 font-bold text-sm block">
                                    {corksRemoved} / {UNCORK_CLICKS_REQUIRED}
                                </span>
                            </div>
                            {/* Arrow - Hidden on mobile, shown on desktop */}
                            <div className="hidden sm:block w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-red-900/50 absolute top-1/2 -left-2 -translate-y-1/2" />
                            {/* Arrow - Shown on mobile (pointing down) */}
                            <div className="sm:hidden w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-red-900/50 mt-1" />
                        </div>
                    )}

                    {/* Bottle Visual - Use a group wrapper for scaling effect */}
                    <div className="relative group-active:scale-95 transition-transform flex flex-col items-center">
                        {/* Cork (moves up) */}
                        <div className={`z-20 w-4 h-5 bg-amber-300/80 rounded-sm border border-amber-700 transition-all duration-200 mb-[-4px]
                             ${corksRemoved === 1 ? '-translate-y-2 rotate-2' : corksRemoved === 2 ? '-translate-y-6 rotate-12' : 'translate-y-0'}
                        `} />

                        {/* Neck */}
                        <div className="z-10 w-6 h-12 bg-green-900/90 border-x border-white/10 relative -mb-2">
                            <div className="absolute top-0 w-full h-1 bg-black/20" /> {/* Lip shadow */}
                        </div>

                        {/* Shoulders -> Body */}
                        <div className="relative w-16 h-32 bg-green-900/80 rounded-t-[2rem] rounded-b-md shadow-inner border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                            {/* Label */}
                            <div className="w-12 h-16 bg-amber-100/90 rounded-sm flex items-center justify-center border border-amber-900 shadow-md">
                                <div className="text-[8px] text-center text-amber-900 leading-tight font-serif p-1 border-2 border-amber-900/20 m-1 h-full flex flex-col justify-center">
                                    <span className="font-bold block tracking-widest border-b border-amber-900 mb-1">CUVÉE</span>
                                    Château<br />De<br />Code
                                </div>
                            </div>

                            {/* Glass Reflection */}
                            <div className="absolute top-4 right-2 w-2 h-24 bg-white/5 rounded-full blur-[1px] -rotate-12" />
                        </div>
                    </div>
                </div>
            ) : (
                /* 2. Glass State (Pouring) */
                <WineGlass fillLevel={fillLevel} targetLevel={WINE_TARGET_LEVEL} />
            )}

            {/* Hint only if open */}
            {!isPouring && fillLevel === 0 && activePatron && isBottleOpen && (
                <div className="absolute mb-4 -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 animate-pulse text-red-200/80 text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase whitespace-nowrap z-50 pointer-events-none">
                    Hold to Pour
                </div>
            )}
        </div>
    );
};
