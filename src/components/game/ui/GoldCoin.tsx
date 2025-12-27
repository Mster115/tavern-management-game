import React from 'react';

interface GoldCoinProps {
    className?: string;
}

export const GoldCoin: React.FC<GoldCoinProps> = ({ className = "w-6 h-6" }) => {
    return (
        <svg
            viewBox="0 0 32 32"
            className={`drop-shadow-sm ${className}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer Ring/Edge */}
            <circle cx="16" cy="16" r="15" className="fill-yellow-600" />

            {/* Main Face */}
            <circle cx="16" cy="16" r="13" className="fill-yellow-400" />

            {/* Inner Highlight/Rim */}
            <circle cx="16" cy="16" r="11" className="fill-transparent stroke-yellow-200" strokeWidth="1.5" opacity="0.6" />

            {/* Shine/Reflection */}
            <path
                d="M10 10 Q 16 4 22 10"
                className="fill-transparent stroke-white"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
            />

            {/* Symbol ($ sign or similar generic currency symbol, embossed look) */}
            <text
                x="16"
                y="21"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                className="fill-yellow-600"
                style={{ fontFamily: 'serif' }}
            >
                $
            </text>
            <text
                x="15.5"
                y="20.5"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                className="fill-yellow-100"
                style={{ fontFamily: 'serif' }}
            >
                $
            </text>
        </svg>
    );
};
