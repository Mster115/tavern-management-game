import React from 'react';
import { motion } from 'framer-motion';
import { PatronAvatar } from './PatronAvatar';
import type { Patron } from '../../../types/game';

interface PatronVisualProps {
    patron: Patron;
    isAngry?: boolean;
    variant?: 'full' | 'icon';
}

export const PatronVisualComponent: React.FC<PatronVisualProps> = ({ patron, isAngry, variant = 'full' }) => {
    const { type } = patron;

    // Animation variants
    const float = {
        animate: {
            y: [0, -5, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    const shake = {
        animate: {
            x: isAngry ? [-2, 2, -2] : 0,
            transition: {
                duration: 0.2,
                repeat: Infinity
            }
        }
    };

    if (variant === 'icon') {
        return (
            <div className={`relative ${isAngry ? 'grayscale-0' : 'grayscale-[0.2]'}`}>
                <PatronAvatar type={type} isAngry={isAngry} className="w-8 h-8" />
            </div>
        );
    }

    return (
        <motion.div
            className={`transition-colors duration-500`}
            {...(isAngry ? shake : float)} // Only float if not angry, or both? Let's just shake if angry.
        >
            <div className="relative flex flex-col items-center">
                {/* Main Figure */}
                <div className="relative w-64 h-64 drop-shadow-2xl">
                    <PatronAvatar type={type} isAngry={isAngry} className="w-full h-full" />
                </div>
            </div>
        </motion.div>
    );
};

export const PatronVisual = React.memo(PatronVisualComponent);
