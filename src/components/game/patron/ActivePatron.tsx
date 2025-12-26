import React from 'react';
import { useGame } from '../../../context/GameContext';
import { MAX_PATIENCE } from '../../../constants/game';
import { PatronVisual } from './PatronVisual';

export const ActivePatron: React.FC = () => {
    const { activePatron, feedback, queue, scoreLogs } = useGame();

    // To replicate the +Gold text, let's grab the latest log if it's very fresh (< 2s)
    const latestLog = scoreLogs.length > 0 ? scoreLogs[0] : null;
    const isFresh = latestLog && (Date.now() - latestLog.id < 2000);
    const showGold = isFresh && feedback;

    const isAngry = activePatron?.status === 'angry';
    const patiencePercent = activePatron ? (activePatron.patience / MAX_PATIENCE) * 100 : 0;

    return (
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0 flex items-center justify-center">
            {activePatron && (
                <div className="relative w-full h-full animate-fadeIn flex items-center justify-center">
                    <div className={`relative flex flex-col items-center ${feedback ? 'scale-110 transition-transform duration-300' : ''}`}>
                        <PatronVisual patron={activePatron} isAngry={isAngry} />

                        {/* Name Tag - Moved Below */}
                        <div className="mt-4 text-center">
                            <div className={`text-2xl font-serif font-bold ${isAngry ? 'text-red-400' : 'text-amber-100'}`}>
                                {activePatron.displayName}
                            </div>
                            <div className="text-sm font-serif text-amber-500/60 uppercase tracking-widest">
                                {activePatron.type}
                            </div>
                        </div>
                    </div>

                    {/* Patience Meter above head */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gray-900/50 rounded-full border border-white/10 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ease-linear ${patiencePercent > 50 ? 'bg-green-500' :
                                patiencePercent > 20 ? 'bg-amber-500' : 'bg-red-600'
                                }`}
                            style={{ width: `${patiencePercent}%` }}
                        />
                    </div>

                    {(feedback || isAngry) && (
                        <div className={`absolute top-16 right-0 animate-bounce z-50 ${isAngry ? 'scale-110' : ''}`}>
                            <div className={`bg-white text-black px-6 py-3 rounded-2xl rounded-bl-none shadow-xl border-2 max-w-[200px] text-center ${isAngry ? 'border-red-600 bg-red-50' : 'border-black'}`}>
                                <p className={`font-bold font-serif text-lg leading-tight ${isAngry ? 'text-red-700' : ''}`}>
                                    {isAngry ? "I'm out of here! Terribly slow service!" : feedback}
                                </p>
                                {showGold && latestLog && !isAngry && (
                                    <p className="text-green-600 font-bold mt-1 text-sm">+{latestLog?.gold} Gold</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!activePatron && !queue.length && (
                <div className="text-center opacity-50">
                    <p className="text-amber-200/50 italic font-serif text-2xl">The tavern is quiet...</p>
                </div>
            )}
        </div>
    );
};
