import React from 'react';

interface ShiftIntroProps {
    night: number;
}

export const ShiftIntro: React.FC<ShiftIntroProps> = ({ night }) => {
    return (
        <div className="animate-pulse flex flex-col items-center px-4">
            <h2 className="text-6xl md:text-8xl text-amber-100 font-bold mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] text-center">Night {night}</h2>
            <p className="text-amber-500 text-lg md:text-2xl tracking-[0.3em] md:tracking-[0.5em] uppercase text-center">Patrons Incoming</p>
        </div>
    );
};
