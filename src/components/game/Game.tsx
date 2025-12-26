import React from 'react';
import { GameProvider } from '../../context/GameContext';
import { Bar } from './station/Bar';
import { ActivePatron } from './patron/PatronView';
import { QueueLineup } from './patron/QueueLineup';
import { HUD } from './ui/HUD';
import { Overlays } from './overlays/Overlays';

const GameLayer: React.FC = () => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0f0a05] select-none font-sans text-amber-50">
            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[60s] ease-linear transform scale-110"
                style={{ backgroundImage: "url('/tavern_bg.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none mix-blend-multiply" />

            {/* Game UI Layers */}
            <div className="relative z-10 w-full h-full flex flex-col">
                <HUD />

                {/* Main Interactive Area */}
                <div className="flex-1 relative flex items-center justify-center">
                    <QueueLineup />
                    <ActivePatron />
                </div>

                {/* Bar Component (Includes Station) */}
                <Bar />
            </div>

            {/* Overlays (Start/End Screens) */}
            <Overlays />
        </div>
    );
};

export const Game: React.FC = () => {
    return (
        <GameProvider>
            <GameLayer />
        </GameProvider>
    );
};
