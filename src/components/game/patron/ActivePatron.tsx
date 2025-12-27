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
        <div className="absolute top-[45%] sm:top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px] pointer-events-none z-0 flex items-center justify-center">
            {activePatron && (
                <div className="relative w-full h-full animate-fadeIn flex items-center justify-center">
                    <div className={`relative flex flex-col items-center ${feedback ? 'scale-110 transition-transform duration-300' : ''}`}>

                        {/* Patience Meter - Moved into flow above name tag */}
                        <div className="mb-2 w-32 sm:w-48 h-1.5 sm:h-2 bg-gray-900/50 rounded-full border border-white/10 overflow-hidden z-20">
                            <div
                                className={`h-full transition-all duration-1000 ease-linear ${patiencePercent > 50 ? 'bg-green-500' :
                                    patiencePercent > 20 ? 'bg-amber-500' : 'bg-red-600'
                                    }`}
                                style={{ width: `${patiencePercent}%` }}
                            />
                        </div>

                        {/* Name Tag */}
                        <div className="mb-2 sm:mb-4 text-center z-10">
                            <div className={`text-xl sm:text-2xl font-serif font-bold ${isAngry ? 'text-red-400' : 'text-amber-100'}`}>
                                {activePatron.displayName}
                            </div>
                            <div className="text-xs sm:text-sm font-serif text-amber-500/60 uppercase tracking-widest">
                                {activePatron.type}
                            </div>
                        </div>

                        <PatronVisual patron={activePatron} isAngry={isAngry} />
                    </div>



                    {(feedback || isAngry) && (
                        <div className={`absolute top-8 sm:top-16 right-[-20px] sm:right-0 animate-bounce z-50 ${isAngry ? 'scale-110' : ''}`}>
                            <div className={`bg-white text-black px-4 py-2 sm:px-6 sm:py-3 rounded-2xl rounded-bl-none shadow-xl border-2 max-w-[150px] sm:max-w-[200px] text-center ${isAngry ? 'border-red-600 bg-red-50' : 'border-black'}`}>
                                <p className={`font-bold font-serif text-sm sm:text-lg leading-tight ${isAngry ? 'text-red-700' : ''}`}>
                                    {isAngry ? "I'm out!" : feedback}
                                </p>
                                {showGold && latestLog && !isAngry && (
                                    <div className="flex flex-col items-center w-full">
                                        <p className="text-green-600 font-bold text-base sm:text-xl drop-shadow-sm">+{latestLog?.gold}</p>

                                        {(latestLog?.tipVal !== undefined && latestLog?.tipVal !== 0) && (
                                            <div className="w-full mt-1 pt-1 border-t border-gray-200/50 flex flex-col gap-0.5 px-1 sm:px-2">
                                                <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-600 font-serif">
                                                    <span>Brew:</span>
                                                    <span>{latestLog.baseVal}</span>
                                                </div>
                                                <div className="flex justify-between text-[8px] sm:text-[10px] text-green-600 font-serif font-bold">
                                                    <span>Tip:</span>
                                                    <span>{latestLog.tipVal > 0 ? '+' : ''}{latestLog.tipVal}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!activePatron && !queue.length && (
                <div className="absolute top-[25%] -translate-y-1/2 text-center w-full">
                    <p className="text-amber-100/80 italic font-serif text-2xl drop-shadow-lg">The tavern is quiet...</p>
                </div>
            )}
        </div>
    );
};
