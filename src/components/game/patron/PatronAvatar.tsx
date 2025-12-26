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
            
            {/* Simple Hood/Cowl behind head */}
            <path d="M20,45 Q20,25 50,20 Q80,25 80,45 L80,70 Q75,65 70,62 L30,62 Q25,65 20,70 Z" fill={theme.hat} stroke={theme.detail} strokeWidth="1" />
            
            {/* Head */}
            <circle cx="50" cy="50" r="28" fill={theme.skin} />
            
            {/* Simple hair visible */}
            <path d="M25,40 Q25,28 50,25 Q75,28 75,40" fill={theme.hair} />
            
            {/* Face */}
            {faceExpression}
            
            {/* Simple cloth band/headband */}
            <ellipse cx="50" cy="35" rx="30" ry="5" fill={theme.hat} opacity="0.8" />
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
            {/* Body/Robes */}
            <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />
            
            {/* Head */}
            <circle cx="50" cy="50" r="30" fill={theme.skin} />
            
            {/* Face (without beard covering it) */}
            {faceExpression}
            
            {/* Wizard Hat & Beard */}
            <g filter="url(#dropShadow)">
                {/* Hat Brim */}
                <ellipse cx="50" cy="35" rx="38" ry="8" fill="#512da8" />
                
                {/* Hat Cone */}
                <path d="M30,35 Q50,-30 70,35" fill="url(#hatWizard)" stroke="#4527a0" strokeWidth="1" />
                
                {/* Stars on hat */}
                <text x="45" y="10" fill="#ffd700" fontSize="10">★</text>
                <text x="55" y="25" fill="#ffd700" fontSize="6">★</text>
                
                {/* Beard - rendered last to cover lower face */}
                <path d="M35,65 Q30,75 35,80 Q40,85 50,85 Q60,85 65,80 Q70,75 65,65 L60,70 L55,68 L50,70 L45,68 L40,70 Z" fill={theme.hair} />
            </g>
        </g>
    );

    return (
        <svg viewBox="0 0 100 120" className={className} xmlns="http://www.w3.org/2000/svg">
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
            {!['PEASANT', 'KNIGHT', 'NOBLE', 'WIZARD'].includes(type) && (
                <g filter="url(#shadow)">
                    <path d="M20,120 L25,80 Q20,60 30,50 L70,50 Q80,60 75,80 L80,120 Z" fill={theme.tunic} stroke={theme.detail} strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill={theme.skin} />
                    {faceExpression}
                </g>
            )}
        </svg>
    );
};