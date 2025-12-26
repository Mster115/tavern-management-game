import React from 'react';
import { useGame } from '../../../context/GameContext';
import { MAX_PATIENCE } from '../../../constants/game';
import { PatronAvatar } from './PatronAvatar';
import { motion, AnimatePresence } from 'framer-motion';

export const QueueLineup: React.FC = () => {
    const { queue } = useGame();

    // Limit visible queue to 4 to avoid screen clutter
    const visibleQueue = queue.slice(0, 4);

    return (
        <div className="absolute right-8 bottom-32 h-32 flex flex-row items-end z-40 pointer-events-none">
            <AnimatePresence mode='popLayout'>
                {visibleQueue.map((patron, index) => {
                    // Calculate offset for perspective/lineup effect
                    const isAngry = patron.status === 'angry';

                    return (
                        <motion.div
                            key={patron.id}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 - (index * 0.05) }}
                            exit={{ opacity: 0, x: -20, scale: 0.8 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            className="relative -ml-6 first:ml-0 flex flex-col items-center group origin-bottom-left"
                            style={{
                                zIndex: 10 - index,
                            }}
                        >
                            {/* Speech bubble for angry patrons */}
                            {isAngry && (
                                <div className="absolute -top-8 right-0 bg-white border border-red-500 rounded-lg px-2 py-1 shadow-sm animate-bounce z-30">
                                    <span className="text-red-600 text-[10px] font-bold">!!!</span>
                                </div>
                            )}

                            {/* Patience Bar */}
                            <div className="absolute -top-4 w-16 h-2 bg-gray-800 rounded-full border border-black/50 overflow-hidden z-20">
                                <motion.div
                                    className="h-full rounded-full"
                                    initial={{ width: '100%' }}
                                    animate={{
                                        width: `${(patron.patience / MAX_PATIENCE) * 100}%`,
                                        backgroundColor: patron.patience > 60 ? '#22c55e' : patron.patience > 30 ? '#eab308' : '#ef4444'
                                    }}
                                    transition={{ duration: 0.5 }} // Smooth updates
                                />
                            </div>

                            {/* Critical Patience Pulse Overlay */}
                            {patron.patience < 20 && (
                                <motion.div
                                    className="absolute -top-4 w-16 h-2 bg-red-500 rounded-full z-10"
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}

                            {/* Avatar */}
                            <div className={`filter drop-shadow-lg ${isAngry ? 'brightness-75' : ''}`}>
                                <PatronAvatar
                                    type={patron.type}
                                    isAngry={isAngry}
                                    className="w-24 h-24"
                                />
                            </div>

                            {/* Minimal Name Tag on Hover or Always? Let's hide it unless stuck */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 bg-black/50 text-amber-100 text-[10px] px-2 rounded-full whitespace-nowrap backdrop-blur-sm">
                                {patron.displayName}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {queue.length > 4 && (
                <div className="absolute right-0 -bottom-6 bg-[#3e2723] text-amber-100 border-2 border-amber-600 rounded-lg px-3 py-1 shadow-lg flex items-center gap-1 z-20">
                    <span className="text-xs uppercase font-bold text-amber-500/80 tracking-wider">Queue</span>
                    <span className="text-lg font-bold">+{queue.length - 4}</span>
                </div>
            )}
        </div>
    );
};
