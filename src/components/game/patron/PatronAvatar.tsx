import React from 'react';
import type { PatronType } from '../../../types/game';

interface PatronAvatarProps {
    type: PatronType;
    isAngry?: boolean;
    className?: string;
}

export const PatronAvatar: React.FC<PatronAvatarProps> = ({ type, isAngry, className = "" }) => {
    // Advanced Colors & Gradients based on Type
    const getTheme = () => {
        switch (type) {
            case 'PEASANT':
                return {
                    skin: '#eecfa1',
                    tunic: 'url(#tunicPeasant)',
                    hair: '#5d4037',
                    hat: '#6d4c41',
                    detail: '#4e342e'
                };
            case 'KNIGHT':
                return {
                    skin: '#ffe0b2',
                    tunic: 'url(#armorKnight)',
                    hair: '#37474f',
                    hat: 'url(#helmetKnight)',
                    detail: '#546e7a'
                };
            case 'NOBLE':
                return {
                    skin: '#fff9c4',
                    tunic: 'url(#tunicNoble)',
                    hair: '#fafafa',
                    hat: 'url(#crownNoble)',
                    detail: '#ffd700'
                };
            case 'WIZARD':
                return {
                    skin: '#e1bee7',
                    tunic: 'url(#robeWizard)',
                    hair: '#eeeeee',
                    hat: 'url(#hatWizard)',
                    detail: '#7e57c2'
                };
            case 'ROYAL':
                return {
                    skin: '#fff0f5',
                    tunic: 'url(#tunicRoyal)',
                    hair: '#fdd835', // Golden hair
                    hat: 'url(#crownRoyal)',
                    detail: '#ff6f00'
                };
            default:
                return { skin: '#aaaaaa', tunic: '#555555', hair: '#000000', hat: '#333333', detail: '#000' };
        }
    };

    const theme = getTheme();

    const faceExpression = isAngry ? (
        // Angry Face
        <g transform="translate(0, 2)">
            <path d="M35,48 L45,52" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" /> {/* Left Brow */}
            <path d="M65,48 L55,52" stroke="#3e2723" strokeWidth="3" strokeLinecap="round" /> {/* Right Brow */}
            <circle cx="40" cy="58" r="3" fill="#3e2723" />
            <circle cx="60" cy="58" r="3" fill="#3e2723" />
            <path d="M42,75 Q50,70 58,75" stroke="#3e2723" strokeWidth="2" fill="none" /> {/* Frown */}
        </g>
    ) : (
        // Happy/Neutral Face
        <g>
            <circle cx="40" cy="55" r="3" fill="#3e2723" />
            <circle cx="60" cy="55" r="3" fill="#3e2723" />
            <ellipse cx="40" cy="58" rx="3" ry="1" fill="#000000" opacity="0.1" />
            <ellipse cx="60" cy="58" rx="3" ry="1" fill="#000000" opacity="0.1" />
            <path d="M42,70 Q50,76 58,70" stroke="#3e2723" strokeWidth="2" fill="none" strokeLinecap="round" /> {/* Smile */}
        </g>
    );

    const renderPeasant = () => (
        <g filter="url(#shadow)">
            {/* Body/Tunic */}
            <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />

            {/* Simple Hood/Cowl - improved shape */}
            <path d="M18,50 Q18,28 50,22 Q82,28 82,50 L82,72 Q78,68 72,65 L28,65 Q22,68 18,72 Z" fill={theme.hat} stroke={theme.detail} strokeWidth="1" />
            
            {/* Hood shadow/depth */}
            <ellipse cx="50" cy="50" rx="32" ry="38" fill="#000" opacity="0.1" />

            {/* Head */}
            <circle cx="50" cy="50" r="28" fill={theme.skin} />

            {/* Messy peasant hair */}
            <path d="M24,42 Q22,32 30,28 Q38,25 50,24 Q62,25 70,28 Q78,32 76,42 L72,38 Q65,35 50,34 Q35,35 28,38 Z" fill={theme.hair} />
            
            {/* Hair strands for texture */}
            <path d="M30,28 Q35,26 40,28" stroke={theme.detail} strokeWidth="0.5" fill="none" opacity="0.3" />
            <path d="M50,24 Q55,23 60,25" stroke={theme.detail} strokeWidth="0.5" fill="none" opacity="0.3" />
            <path d="M60,28 Q65,26 70,28" stroke={theme.detail} strokeWidth="0.5" fill="none" opacity="0.3" />

            {/* Face */}
            {faceExpression}

            {/* Simple cloth headband - refined */}
            <ellipse cx="50" cy="36" rx="29" ry="4" fill={theme.hat} opacity="0.9" />
            <path d="M21,36 Q50,38 79,36" stroke={theme.detail} strokeWidth="0.3" fill="none" opacity="0.4" />
        </g>
    );

    const renderKnight = () => (
        <g filter="url(#shadow)">
            {/* Body/Armor */}
            <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />

            {/* Pauldrons (Shoulders) */}
            <ellipse cx="30" cy="60" rx="12" ry="15" fill="url(#armorKnight)" stroke={theme.detail} strokeWidth="0.5" />
            <ellipse cx="70" cy="60" rx="12" ry="15" fill="url(#armorKnight)" stroke={theme.detail} strokeWidth="0.5" />

            {/* Helmet with Visor & Plume */}
            <g filter="url(#dropShadow)">
                {/* Plume */}
                <path d="M40,15 Q50,0 60,15 L50,30 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.5" />

                {/* Helmet Dome */}
                <path d="M25,35 Q50,5 75,35" fill="url(#helmetKnight)" stroke="#37474f" strokeWidth="1" />

                {/* Helmet Faceplate/Visor */}
                <path d="M25,35 L25,65 Q50,80 75,65 L75,35 Q50,45 25,35" fill="url(#helmetKnight)" stroke="#37474f" strokeWidth="1" />

                {/* Breathing Holes/Slits - horizontal visor slit */}
                <path d="M30,50 L70,50" stroke="#263238" strokeWidth="2" strokeLinecap="round" />
                <path d="M32,56 L68,56" stroke="#263238" strokeWidth="1.5" strokeLinecap="round" />

                {/* Small breathing holes */}
                <circle cx="35" cy="62" r="1" fill="#263238" />
                <circle cx="42" cy="62" r="1" fill="#263238" />
                <circle cx="58" cy="62" r="1" fill="#263238" />
                <circle cx="65" cy="62" r="1" fill="#263238" />
            </g>
        </g>
    );

    const renderNoble = () => (
        <g filter="url(#shadow)">
            {/* Hair (Behind Face) */}
            <path d="M20,50 Q20,20 50,20 Q80,20 80,50 L80,60 L20,60 Z" fill={theme.hair} />

            {/* Body/Tunic */}
            <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />

            {/* Ruffled Collar */}
            <g filter="url(#dropShadow)">
                <path d="M30,80 Q35,88 40,80 Q45,88 50,80 Q55,88 60,80 Q65,88 70,80" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>

            {/* Head */}
            <circle cx="50" cy="50" r="30" fill={theme.skin} />

            {/* Face */}
            {faceExpression}

            {/* Crown - rendered last to be on top */}
            <g filter="url(#dropShadow)">
                <path d="M28,38 L28,25 L38,32 L50,20 L62,32 L72,25 L72,38 Z" fill="url(#crownNoble)" stroke="#fbc02d" strokeWidth="1" />
                <circle cx="50" cy="20" r="3" fill="#ef4444" />
                <circle cx="28" cy="25" r="2" fill="#3b82f6" />
                <circle cx="72" cy="25" r="2" fill="#3b82f6" />
            </g>
        </g>
    );

    const renderWizard = () => (
        <g filter="url(#shadow)">
            {/* Body/Robes with more dramatic folds */}
            <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />
            
            {/* Robe details - mystical patterns */}
            <path d="M30,70 Q50,75 70,70" stroke="#9575cd" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M28,90 Q50,95 72,90" stroke="#9575cd" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="50" cy="80" r="2" fill="#9575cd" opacity="0.4" />

            {/* Head */}
            <circle cx="50" cy="50" r="30" fill={theme.skin} />

            {/* Face (without beard covering it) */}
            {faceExpression}

            {/* Wizard Hat & Beard */}
            <g filter="url(#dropShadow)">
                {/* Hat Brim with slight curve */}
                <ellipse cx="50" cy="35" rx="38" ry="8" fill="#512da8" />
                <ellipse cx="50" cy="33" rx="38" ry="3" fill="#673ab7" opacity="0.6" />

                {/* Hat Cone with slight bend */}
                <path d="M30,35 Q48,-28 52,-30 Q56,-28 70,35" fill="url(#hatWizard)" stroke="#4527a0" strokeWidth="1" />

                {/* Stars and moons on hat */}
                <text x="45" y="8" fill="#ffd700" fontSize="10" style={{ textShadow: '0 0 3px rgba(255,215,0,0.8)' }}>★</text>
                <text x="55" y="22" fill="#e1bee7" fontSize="7">☾</text>
                <text x="38" y="18" fill="#ffd700" fontSize="5">★</text>

                {/* Bushy beard with more detail */}
                <path d="M35,65 Q30,73 32,80 Q35,87 42,88 Q46,90 50,90 Q54,90 58,88 Q65,87 68,80 Q70,73 65,65 L62,70 L58,68 L54,70 L50,72 L46,70 L42,68 L38,70 Z" fill={theme.hair} stroke={theme.detail} strokeWidth="0.5" opacity="0.95" />
                
                {/* Beard texture */}
                <path d="M40,75 Q45,78 50,78" stroke="#fff" strokeWidth="0.3" opacity="0.2" />
                <path d="M42,82 Q48,84 54,82" stroke="#fff" strokeWidth="0.3" opacity="0.2" />
            </g>
        </g>
    );

    const renderRoyal = () => (
        <g filter="url(#shadow)">
            {/* Royal Mantle/Cape logic */}
            <path d="M15,120 L20,60 Q50,40 80,60 L85,120 Z" fill="#b71c1c" stroke="#ffeb3b" strokeWidth="2" />

            {/* Inner Tunic */}
            <path d="M25,120 L28,80 Q50,70 72,80 L75,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />

            {/* Ermine Collar (White fur with spots) */}
            <path d="M20,60 Q50,40 80,60 L75,80 Q50,70 25,80 Z" fill="#ffffff" stroke="#ddd" strokeWidth="1" />
            {/* Spots */}
            <circle cx="30" cy="65" r="1.5" fill="#000" />
            <circle cx="50" cy="55" r="1.5" fill="#000" />
            <circle cx="70" cy="65" r="1.5" fill="#000" />

            {/* Head */}
            <circle cx="50" cy="50" r="30" fill={theme.skin} />

            {/* Face */}
            {faceExpression}

            {/* Huge Fancy Crown */}
            <g filter="url(#dropShadow)">
                <path d="M25,35 L25,50 L75,50 L75,35 L62,10 L50,35 L38,10 Z" fill="url(#crownRoyal)" stroke="#ff6f00" strokeWidth="1.5" />
                <circle cx="38" cy="10" r="4" fill="#d50000" stroke="#fff" strokeWidth="1" />
                <circle cx="62" cy="10" r="4" fill="#d50000" stroke="#fff" strokeWidth="1" />
                <circle cx="50" cy="35" r="5" fill="#2962ff" stroke="#fff" strokeWidth="1" />
            </g>
        </g>
    );

    return (
        <svg viewBox="0 -35 100 155" className={className} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
                </filter>
                <filter id="dropShadow" x="-20%" y="-10%" width="140%" height="150%">
                    <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
                </filter>

                {/* Peasant Pattern */}
                <linearGradient id="tunicPeasant" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#8d6e63" />
                    <stop offset="50%" stopColor="#a1887f" />
                    <stop offset="100%" stopColor="#8d6e63" />
                </linearGradient>

                {/* Knight Armor */}
                <linearGradient id="armorKnight" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#cfd8dc" />
                    <stop offset="50%" stopColor="#b0bec5" />
                    <stop offset="100%" stopColor="#90a4ae" />
                </linearGradient>
                <linearGradient id="helmetKnight" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#eceff1" />
                    <stop offset="100%" stopColor="#cfd8dc" />
                </linearGradient>

                {/* Noble Silk */}
                <linearGradient id="tunicNoble" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7b1fa2" />
                    <stop offset="50%" stopColor="#9c27b0" />
                    <stop offset="100%" stopColor="#7b1fa2" />
                </linearGradient>
                <linearGradient id="crownNoble" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#fbc02d" />
                </linearGradient>

                {/* Royal Purple & Gold */}
                <linearGradient id="tunicRoyal" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4a148c" />
                    <stop offset="50%" stopColor="#7b1fa2" />
                    <stop offset="100%" stopColor="#4a148c" />
                </linearGradient>
                <linearGradient id="crownRoyal" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffab00" />
                    <stop offset="50%" stopColor="#ffea00" />
                    <stop offset="100%" stopColor="#ffab00" />
                </linearGradient>

                {/* Wizard Robes */}
                <linearGradient id="robeWizard" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#311b92" />
                    <stop offset="50%" stopColor="#4527a0" />
                    <stop offset="100%" stopColor="#311b92" />
                </linearGradient>
                <linearGradient id="hatWizard" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#4527a0" />
                    <stop offset="50%" stopColor="#512da8" />
                    <stop offset="100%" stopColor="#4527a0" />
                </linearGradient>
            </defs>

            {type === 'PEASANT' && renderPeasant()}
            {type === 'KNIGHT' && renderKnight()}
            {type === 'NOBLE' && renderNoble()}
            {type === 'WIZARD' && renderWizard()}
            {type === 'ROYAL' && renderRoyal()}
            {!['PEASANT', 'KNIGHT', 'NOBLE', 'WIZARD', 'ROYAL'].includes(type) && (
                <g filter="url(#shadow)">
                    <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill={theme.skin} />
                    {faceExpression}
                </g>
            )}
        </svg>
    );
};