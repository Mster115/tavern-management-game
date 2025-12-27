import React from 'react';
import { useGame } from '../../../context/GameContext';
import { MAX_PATIENCE } from '../../../constants/game';
import { PatronAvatar } from './PatronAvatar';
import { motion, AnimatePresence } from 'framer-motion';

export const QueueLineup: React.FC = () => {
    const { queue } = useGame();

    // Show more people now that they spread out
    const visibleQueue = queue.slice(0, 6);

    return (
        // Filling the Bar:
        // Positioned in center background.
        <div className="absolute inset-x-0 bottom-44 sm:bottom-56 h-64 flex items-end justify-center z-0 pointer-events-none perspective-[600px]">
            <AnimatePresence mode='popLayout'>
                {visibleQueue.map((patron, index) => {
                    const isAngry = patron.status === 'angry';
                    const patiencePercent = (patron.patience / MAX_PATIENCE) * 100;

                    // Logic for alternating sides
                    // Index 0 -> Left (closest)
                    // Index 1 -> Right (closest)
                    const isLeft = index % 2 === 0;
                    const layer = Math.floor(index / 2); // 0, 0, 1, 1, 2, 2

                    // Tighter spacing, closer to center (Overlapping active patron slightly)
                    const baseOffset = 95;
                    const spacing = 50;

                    const direction = isLeft ? -1 : 1;
                    const xPosition = (baseOffset + (layer * spacing)) * direction;

                    // Patience Status States
                    const isCritical = patiencePercent < 25; // Red !
                    const isConcerned = patiencePercent < 50 && !isCritical; // Yellow ?

                    return (
                        <motion.div
                            key={patron.id}
                            layout
                            initial={{ opacity: 0, x: isLeft ? -200 : 200, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                x: xPosition,
                                y: -5 * layer,
                                scale: 0.95 - (layer * 0.04), // Increased base scale to 0.95
                                zIndex: 50 - index,
                                filter: `brightness(${1 - (layer * 0.1)}) blur(${layer * 0.5}px)`
                            }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            className="absolute bottom-0 flex flex-col items-center group origin-bottom"
                        >
                            {/* Mood/Patience Indicator - Centered above head */}
                            <AnimatePresence>
                                {(isCritical || isConcerned || isAngry) && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0, y: 10 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className={`absolute -top-12 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm z-30
                                            ${isCritical || isAngry ? 'bg-red-500 border-red-700 animate-pulse' : 'bg-amber-400 border-amber-600'}
                                        `}
                                    >
                                        <span className="text-white font-bold text-lg leading-none font-serif">
                                            {isAngry ? '!!' : isCritical ? '!' : '?'}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Avatar */}
                            <div className={`filter drop-shadow-xl ${isAngry ? 'grayscale-[0.5]' : ''}`}>
                                <PatronAvatar
                                    type={patron.type}
                                    isAngry={isAngry}
                                    className="w-24 h-24 sm:w-32 sm:h-32"
                                />
                            </div>

                        </motion.div>
                    );
                })}
            </AnimatePresence>


        </div>
    );
};
