import React from 'react';
import { GoldCoin } from '../ui/GoldCoin';

interface ShiftSummaryProps {
    night: number;
    patronsServed: number;
    currentShiftGold: number;
    onNextNight: () => void;
}

export const ShiftSummary: React.FC<ShiftSummaryProps> = ({ night, patronsServed, currentShiftGold, onNextNight }) => {
    return (
        <div className="bg-[#1a120b] p-6 md:p-10 rounded-lg border-4 border-amber-700 shadow-2xl w-full max-w-sm md:max-w-lg relative overflow-hidden font-serif mx-4">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-900 via-amber-500 to-amber-900 opacity-50"></div>

            <h2 className="text-3xl md:text-4xl text-amber-100 mb-6 md:mb-8 pb-3 md:pb-4 border-b-2 border-amber-900/50">Shift Report</h2>

            <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 text-base md:text-lg">
                <div className="flex justify-between items-center bg-black/30 p-3 md:p-4 rounded text-amber-200">
                    <span>Patrons Served</span>
                    <span className="font-bold text-xl md:text-2xl text-white">{patronsServed}</span>
                </div>
                <div className="flex justify-between items-center bg-black/30 p-3 md:p-4 rounded text-amber-200">
                    <span>Gold Earned</span>
                    <span className="font-bold text-xl md:text-2xl text-yellow-400 drop-shadow-sm flex items-center gap-2">
                        +{currentShiftGold} <span className="text-lg md:text-xl"><GoldCoin className="w-5 h-5 md:w-6 md:h-6" /></span>
                    </span>
                </div>
            </div>

            <button
                onClick={onNextNight}
                className="w-full py-3 md:py-4 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold rounded border-2 border-amber-500/30 shadow-lg transition-colors text-lg md:text-xl uppercase tracking-wider"
            >
                Start Night {night + 1}
            </button>
        </div>
    );
};
