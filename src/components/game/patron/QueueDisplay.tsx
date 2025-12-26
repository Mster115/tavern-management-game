import React from 'react';
import { useGame } from '../../../context/GameContext';
import { MAX_PATIENCE } from '../../../constants/game';
import { PatronVisual } from './PatronVisual';

export const QueueDisplay: React.FC = () => {
    const { queue } = useGame();

    return (
        <div className="absolute right-4 top-24 flex flex-col gap-2 z-30 w-48 font-sans">
            {/* Header */}
            {queue.length > 0 && (
                <div className="text-right pr-2">
                    <span className="text-xs uppercase text-amber-500 font-bold tracking-widest bg-black/60 px-2 py-1 rounded border border-amber-900/30">
                        Lineup ({queue.length})
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1 pb-4">
                {queue.map((p) => {
                    const patiencePercent = (p.patience / MAX_PATIENCE) * 100;
                    const isAngry = p.status === 'angry';

                    return (
                        <div key={p.id} className={`bg-black/80 backdrop-blur-md border border-amber-800/60 p-3 rounded-md flex flex-col gap-2 shadow-lg animate-slideInRight relative overflow-hidden group transition-all duration-300 ${isAngry ? 'border-red-600 shadow-red-900/40 translate-x-1' : ''}`}>
                            {/* Card Content */}
                            <div className="flex justify-between items-center text-amber-100 mb-1">
                                <div className="flex items-center gap-2">
                                    <PatronVisual patron={p} variant="icon" isAngry={isAngry} />
                                    <span className={`font-bold text-sm tracking-wide ${isAngry ? 'text-red-500' : ''}`}>{isAngry ? 'Hmph!' : p.name}</span>
                                </div>
                                <span className="text-[10px] text-amber-500/60 font-mono">#{p.id.toString().slice(-3)}</span>
                            </div>

                            {/* Meter Container */}
                            <div className="w-full h-1.5 bg-gray-900/80 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-linear ${patiencePercent > 50 ? 'bg-green-500' :
                                        patiencePercent > 20 ? 'bg-amber-500' : 'bg-red-600'
                                        }`}
                                    style={{
                                        width: `${patiencePercent}%`
                                    }}
                                />
                            </div>

                            {/* Angry state info */}
                            {isAngry && (
                                <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center animate-pulse">
                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Leaving!</span>
                                </div>
                            )}

                            {/* Hover Info */}
                            {!isAngry && (
                                <div className="absolute inset-0 bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="text-xs text-amber-500 font-bold uppercase">Waiting...</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
