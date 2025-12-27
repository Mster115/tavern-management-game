import React, { useState } from 'react';
import { BeerStation } from './BeerStation';
import { WineStation } from './WineStation';
import { useGame } from '../../../context/GameContext';
import type { DrinkType } from '../../../types/game';

export const Bar: React.FC = () => {
    const { unlockedDrinks } = useGame();
    const [activeStation, setActiveStation] = useState<DrinkType>('ALE');

    // Only allow switching to unlocked drinks
    const availableDrinks = unlockedDrinks;

    return (
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pointer-events-none">

            {/* Station Selector - Floating above bar */}
            {availableDrinks.length > 1 && (
                <div className="absolute right-4 bottom-32 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-40 z-50 flex gap-2 pointer-events-auto">
                    {availableDrinks.map(drink => (
                        <button
                            key={drink}
                            onClick={() => setActiveStation(drink)}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-xl transition-all border-2
                                ${activeStation === drink
                                    ? 'bg-amber-100 text-amber-900 border-amber-900 scale-110'
                                    : 'bg-black/50 text-amber-100/50 border-white/10 hover:bg-black/70'
                                }`}
                        >
                            {drink}
                        </button>
                    ))}
                </div>
            )}

            {/* 1. The Station (Mug/Glass) - Sits on top naturally */}
            <div className="z-30 mb-[-12px] pointer-events-auto min-h-[160px] flex items-end">
                {activeStation === 'ALE' && <BeerStation />}
                {activeStation === 'WINE' && <WineStation />}
            </div>

            {/* 2. Top Surface (The Counter) */}
            <div
                className="relative z-20 w-full max-w-4xl h-16 bg-[#3e2723] rounded-sm transform origin-bottom perspective-[100px] shadow-2xl flex items-center justify-center border-t border-white/5"
                style={{
                    background: 'linear-gradient(180deg, #5d4037 0%, #3e2723 100%)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
            >
                {/* Wood Grain Texture */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/0 via-black/20 to-black/0" />
            </div>

            {/* 3. Front Face (The Body) */}
            <div
                className="relative z-10 w-full max-w-4xl h-32 sm:h-48 bg-[#2d1b15] shadow-[0_-4px_10px_rgba(0,0,0,0.5)] flex flex-col items-center"
                style={{
                    background: 'repeating-linear-gradient(90deg, #2d1b15 0px, #2d1b15 48px, #1a0f0b 50px, #3e2723 52px)'
                }}
            >
                {/* Decorative horizontal beams */}
                <div className="w-full h-3 sm:h-4 bg-[#1a0f0b]/50 mt-4 sm:mt-8 backdrop-blur-sm" />
                <div className="w-full h-6 sm:h-8 bg-[#1a0f0b]/30 mt-12 sm:mt-16" />

                {/* Bottom fade for seamless screen edge */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
        </div>
    );
};
