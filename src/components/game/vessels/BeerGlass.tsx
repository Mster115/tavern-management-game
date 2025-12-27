import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrinkVesselProps {
    fillLevel: number; // 0 to 100
    targetLevel: number; // 0 to 100
    liquidColor?: string;
    foamColor?: string;
    showTarget?: boolean;
}

export const BeerGlass: React.FC<DrinkVesselProps> = ({
    fillLevel,
    targetLevel,
    liquidColor = 'bg-amber-500',
    foamColor = 'bg-amber-100',
    showTarget = true
}) => {
    // Generate bubbles
    const [bubbles, setBubbles] = useState<{ id: number; left: number; speed: number }[]>([]);

    useEffect(() => {
        if (fillLevel > 5) {
            const interval = setInterval(() => {
                const newBubble = {
                    id: Date.now(),
                    left: Math.random() * 80 + 10,
                    speed: Math.random() * 2 + 1
                };
                setBubbles(curr => [...curr.slice(-10), newBubble]);
            }, 300);
            return () => clearInterval(interval);
        } else {
            setBubbles([]);
        }
    }, [fillLevel]);

    const isTargetMet = Math.abs(fillLevel - targetLevel) < 5; // "Perfect" zone visualization

    return (
        <div className="relative group perspective-500">
            {/* Glass Container */}
            <div className={`
                relative w-36 h-52 
                border-x-4 border-b-[6px] border-slate-300/40 
                bg-slate-400/10 
                rounded-b-2xl rounded-t-sm
                overflow-hidden 
                backdrop-blur-[1px] 
                className="box-border"
                shadow-2xl
            `}>
                {/* Glass Reflection Highlight */}
                <div className="absolute top-0 left-2 w-4 h-full bg-gradient-to-b from-white/20 to-transparent z-30 pointer-events-none rounded-full blur-[1px]" />

                {/* Target Line */}
                {showTarget && (
                    <div
                        className="absolute w-full h-0.5 z-20 transition-all duration-300"
                        style={{ bottom: `${targetLevel}%` }}
                    >
                        <div className={`w-full border-t-2 border-dashed ${isTargetMet ? 'border-green-400' : 'border-red-500/50'}`} />
                        <span className={`absolute right-1 -top-4 text-[10px] font-bold px-1 tracking-widest bg-black/20 rounded ${isTargetMet ? 'text-green-400' : 'text-red-400'}`}>
                            {isTargetMet ? 'PERFECT' : 'POUR'}
                        </span>
                    </div>
                )}

                {/* Liquid Container */}
                <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-b-[10px]">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(fillLevel, 100)}%` }}
                        transition={{ duration: 0 }}
                        className={`absolute bottom-0 left-0 w-full ${liquidColor} opacity-90`}
                    >
                        {/* Bubbles */}
                        <AnimatePresence>
                            {bubbles.map(b => (
                                <motion.div
                                    key={b.id}
                                    initial={{ bottom: 0, opacity: 0 }}
                                    animate={{ bottom: "100%", opacity: 0.7 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: b.speed, ease: "linear" }}
                                    className="absolute w-1.5 h-1.5 bg-amber-200/40 rounded-full"
                                    style={{ left: `${b.left}%` }}
                                />
                            ))}
                        </AnimatePresence>

                        {/* Foam Head */}
                        {fillLevel > 0 && (
                            <motion.div
                                className={`absolute top-0 w-full ${foamColor}`}
                                style={{ height: fillLevel > 90 ? '15%' : '8%', top: fillLevel > 90 ? '-14%' : '-7%' }}
                            >
                                <div className="w-full h-full relative">
                                    {/* Foam texture/bubbles */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cGF0aCBkPSJNMCAwSDRWNEgwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4=')] opacity-50" />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Condensation/Frost Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none opacity-30" />
            </div>

            {/* Mug Handle */}
            <div className="absolute top-10 -right-10 w-14 h-28 border-[6px] border-slate-300/40 rounded-r-3xl border-l-0 z-[5] shadow-xl" />

            {/* Coaster/Shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/40 blur-md rounded-full -z-10" />
        </div>
    );
};
