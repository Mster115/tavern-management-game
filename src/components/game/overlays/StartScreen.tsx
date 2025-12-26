import React from 'react';

interface StartScreenProps {
    night: number;
    totalGold: number;
    onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ night, totalGold, onStart }) => {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-amber-200/80 text-xl italic mb-6">Open for business...</p>
            <button
                onClick={onStart}
                className="px-10 py-4 bg-gradient-to-br from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 font-bold rounded-sm border-4 border-amber-950 shadow-[0_0_30px_rgba(245,158,11,0.2),inset_0_0_20px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 text-2xl uppercase tracking-widest relative overflow-hidden"
            >
                Start Night {night}
            </button>
            <div className="text-amber-500/50 mt-4 text-sm font-sans">Total Gold Stashed: {totalGold}</div>
        </div>
    );
};
