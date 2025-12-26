import React from 'react';
import { BeerStation } from './BeerStation';

export const Bar: React.FC = () => {
    return (
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pointer-events-none">

            {/* 1. The Station (Mug) - Sits on top naturally */}
            <div className="z-30 mb-[-12px] pointer-events-auto">
                <BeerStation />
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
                className="relative z-10 w-full max-w-4xl h-48 bg-[#2d1b15] shadow-[0_-4px_10px_rgba(0,0,0,0.5)] flex flex-col items-center"
                style={{
                    background: 'repeating-linear-gradient(90deg, #2d1b15 0px, #2d1b15 48px, #1a0f0b 50px, #3e2723 52px)'
                }}
            >
                {/* Decorative horizontal beams */}
                <div className="w-full h-4 bg-[#1a0f0b]/50 mt-8 backdrop-blur-sm" />
                <div className="w-full h-8 bg-[#1a0f0b]/30 mt-16" />

                {/* Bottom fade for seamless screen edge */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
        </div>
    );
};
