import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { PatronAvatar } from '../patron/PatronAvatar';
import type { PatronType } from '../../../types/game';

interface GameOverScreenProps {
    night: number;
    totalGold: number;
    patronsServed: number;
    angryCount: number;
    limit: number;
    onReset: () => void;
}

const RIOTERS: { type: PatronType, x: string, y: string, delay: number, duration: number }[] = [
    { type: 'PEASANT', x: '10%', y: '20%', delay: 0, duration: 2 },
    { type: 'KNIGHT', x: '80%', y: '15%', delay: 0.5, duration: 2.5 },
    { type: 'NOBLE', x: '20%', y: '70%', delay: 1, duration: 2.2 },
    { type: 'WIZARD', x: '70%', y: '60%', delay: 1.5, duration: 2.8 },
    { type: 'PEASANT', x: '50%', y: '80%', delay: 0.2, duration: 2.1 },
    { type: 'KNIGHT', x: '15%', y: '40%', delay: 0.7, duration: 2.4 },
    { type: 'NOBLE', x: '85%', y: '30%', delay: 1.2, duration: 2.6 },
];

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ night, totalGold, patronsServed, angryCount, limit, onReset }) => {
    const [shake, setShake] = useState(false);

    useEffect(() => {
        // Trigger initial shake effect
        setShake(true);
        const timer = setTimeout(() => setShake(false), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 max-w-md w-full relative overflow-hidden h-[600px] w-full max-w-4xl rounded-xl">
            {/* Background Chaos Effect */}
            <div className={`absolute inset-0 bg-red-900/40 pointer-events-none ${shake ? 'animate-pulse' : ''}`} />

            {/* Rioters Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                {RIOTERS.map((rioter, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-32 h-32"
                        style={{ left: rioter.x, top: rioter.y }}
                        animate={{
                            x: [0, -20, 20, -10, 0],
                            y: [0, -10, 10, -5, 0],
                            rotate: [0, -5, 5, -3, 0],
                            scale: [1, 1.1, 0.9, 1]
                        }}
                        transition={{
                            duration: rioter.duration,
                            repeat: Infinity,
                            delay: rioter.delay,
                            ease: "easeInOut"
                        }}
                    >
                        <PatronAvatar type={rioter.type} isAngry={true} />
                        {/* Angry Symbols */}
                        <motion.div
                            className="absolute -top-4 -right-4 text-4xl"
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: rioter.delay }}
                        >
                            💢
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center z-10 ${shake ? 'animate-bounce-short' : ''} bg-black/80 p-8 rounded-2xl border-4 border-red-900 shadow-2xl backdrop-blur-md`}
            >
                <div className="mb-6">
                    <h2 className="text-6xl font-black text-red-500 tracking-widest uppercase drop-shadow-[0_0_25px_rgba(239,68,68,0.8)] transform -rotate-2 stroke-black text-stroke-2">
                        RIOT!
                    </h2>
                    <p className="text-amber-200 mt-2 text-xl italic font-serif">The tavern has fallen to chaos!</p>
                </div>

                <div className="bg-red-950/50 p-6 rounded-lg border-2 border-red-800/50 mb-8 w-full">
                    <div className="grid grid-cols-2 gap-6 text-left">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-red-300">Nights Survived</span>
                            <span className="text-3xl text-amber-100 font-bold">{night - 1}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-red-300">Total Gold</span>
                            <span className="text-3xl text-yellow-400 font-bold">{totalGold}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <span className="text-xs uppercase tracking-wider text-red-300">Patrons Served</span>
                            <span className="text-2xl text-amber-100">{patronsServed}</span>
                        </div>
                        <div className="flex flex-col col-span-2 border-t border-red-800/30 pt-4">
                            <span className="text-xs uppercase tracking-wider text-red-300">Cause of Riot</span>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl text-red-500 font-black">{angryCount}</span>
                                <span className="text-sm text-red-300 uppercase tracking-widest">Angry Patrons</span>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReset}
                    className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded shadow-[0_0_20px_rgba(220,38,38,0.6)] border-2 border-red-400 overflow-hidden w-full"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-wide">
                        Try Again
                        <span className="group-hover:translate-x-1 transition-transform">↺</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.button>
            </motion.div>
        </div>
    );
};
