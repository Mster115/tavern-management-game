import React from 'react';
import { useGame } from '../../../context/GameContext';
import { GoldCoin } from './GoldCoin';


export const HUD: React.FC = () => {
    const { night, totalGold, currentShiftGold, timeLeft, maxTime, scoreLogs } = useGame();

    return (
        <>
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-2 sm:p-4 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <div className="flex gap-3 sm:gap-6 items-center pointer-events-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-amber-500 uppercase tracking-widest">Night</span>
                        <span className="text-xl sm:text-2xl font-serif text-amber-100">{night}</span>
                    </div>
                    <div className="h-6 sm:h-8 w-[1px] bg-amber-800/50"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] sm:text-xs text-amber-500 uppercase tracking-widest">Treasury</span>
                        <span className="text-xl sm:text-2xl font-serif text-yellow-500 flex items-center gap-1 sm:gap-2">
                            {totalGold} <GoldCoin className="w-5 h-5 sm:w-6 sm:h-6" />
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end w-32 sm:w-48 pointer-events-auto">
                    <div className="flex justify-between w-full text-[10px] sm:text-xs text-amber-400 mb-1 uppercase tracking-wider font-bold">
                        <span>Shift Time</span>
                        <span className={timeLeft < 10 ? "text-red-500 animate-pulse" : ""}>
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </span>
                    </div>
                    <div className="w-full h-1.5 sm:h-2 bg-amber-950/50 rounded-full overflow-hidden border border-amber-900/30">
                        <div
                            className="h-full bg-gradient-to-r from-amber-700 to-amber-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Round Stats Corner */}
            <div className="absolute mb-10 bottom-4 left-4 sm:bottom-6 sm:left-6 pointer-events-none z-30 flex items-end gap-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-black/80 backdrop-blur-md rounded-full border-4 border-amber-600/50 shadow-2xl flex flex-col items-center justify-center group overflow-hidden">
                    {/* Ring highlight */}
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    <div className="absolute -inset-1 bg-gradient-to-tr from-amber-900/0 via-amber-500/20 to-amber-900/0 animate-spin-slow opacity-50" />

                    <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-amber-500/80 mb-1">Shift Gold</span>
                    <span className="text-2xl sm:text-4xl font-serif text-yellow-400 font-bold drop-shadow-lg tabular-nums">
                        {Math.floor(currentShiftGold)}
                    </span>
                    <div className="h-0.5 w-8 sm:w-12 bg-amber-800/50 my-1" />
                    {/* Mini log preview - just showing last action */}
                    {scoreLogs.length > 0 && (
                        <div key={scoreLogs[0].id} className="text-[8px] sm:text-[10px] text-amber-200/80 text-center px-4 animate-fadeIn whitespace-nowrap overflow-hidden text-ellipsis w-full">
                            <span className="font-bold">+{scoreLogs[0].gold}</span>
                            <span className="opacity-75 ml-1">
                                {scoreLogs[0].text}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
