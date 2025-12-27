import React from 'react';
import { motion } from 'framer-motion';

interface WineGlassProps {
    fillLevel: number; // 0 to 100
    targetLevel?: number; // Visualization of where to stop
}

export const WineGlass: React.FC<WineGlassProps> = ({ fillLevel, targetLevel }) => {
    // Wine is usually red
    const liquidColor = 'bg-red-800';

    const isTargetMet = targetLevel ? Math.abs(fillLevel - targetLevel) < 5 : false;

    return (
        <div className="relative w-16 h-40 flex items-center justify-center">
            {/* Glass Shape (Bowl) */}
            <div className="absolute top-0 w-16 h-20 border-2 border-white/40 border-t-0 rounded-b-[3rem] overflow-hidden bg-white/5 backdrop-blur-sm z-10">
                {/* Liquid */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(fillLevel, 100)}%` }}
                    transition={{ duration: 0 }}
                    className={`absolute bottom-0 left-0 w-full ${liquidColor}`}
                >
                    {/* Surface tension / movement */}
                    <div className="absolute top-0 w-full h-1 bg-white/20 animate-pulse" />
                </motion.div>

                {/* Target Line */}
                {targetLevel && (
                    <div
                        className="absolute w-full h-0.5 z-20 transition-all duration-300"
                        style={{ bottom: `${targetLevel}%` }}
                    >
                        <div className={`w-full border-t-2 border-dashed ${isTargetMet ? 'border-green-400' : 'border-red-500/50'}`} />
                        {/* Indicator Text */}
                        <span className={`absolute right-0 -top-4 text-[8px] font-bold px-1 tracking-widest bg-black/40 rounded ${isTargetMet ? 'text-green-400' : 'text-red-400/70'}`}>
                            {isTargetMet ? 'PERFECT' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Stem */}
            <div className="absolute top-20 w-1.5 h-20 bg-white/30" />

            {/* Base */}
            <div className="absolute bottom-0 w-12 h-1 bg-white/30 rounded-full" />
        </div>
    );
};
