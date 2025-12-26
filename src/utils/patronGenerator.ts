import type { Patron, PatronType } from '../types/game';
import { MAX_PATIENCE } from '../constants/game';

const NAMES: Record<PatronType, string[]> = {
    PEASANT: ["Olaf", "Gunnar", "Helga", "Sigrid", "Bjorn", "Astrid", "Leif", "Inga"],
    KNIGHT: ["Sir Gallahad", "Dame Lancelot", "Sir Gawain", "Dame Brienne", "Sir Percival", "Dame Eowyn"],
    NOBLE: ["Lord Blackwood", "Lady Stark", "Baron Von Hein", "Countess Dracula", "Duke Leto", "Duchess Satine"],
    WIZARD: ["Merlin", "Gandalf", "Radagast", "Morgana", "Dumbledore", "Saruman"]
};

const RATES: Record<PatronType, number> = {
    PEASANT: 0.5,
    KNIGHT: 0.25,
    NOBLE: 0.15,
    WIZARD: 0.1
};

export const SPAWN_RATES = RATES;

export const generatePatron = (night: number = 1): Patron => {
    const rand = Math.random();

    // Adjust spawn rates based on night
    // As nights progress, Nobles and Wizards become more common
    let rates = { ...SPAWN_RATES };
    if (night > 1) {
        const difficultyMod = Math.min((night - 1) * 0.05, 0.3); // Cap at 30% shift
        rates.PEASANT = Math.max(0.1, RATES.PEASANT - difficultyMod);
        rates.KNIGHT = RATES.KNIGHT; // Stay roughly same
        rates.NOBLE = Math.min(0.35, RATES.NOBLE + (difficultyMod * 0.6));
        rates.WIZARD = Math.min(0.25, RATES.WIZARD + (difficultyMod * 0.4));
    }

    let type: PatronType = 'PEASANT';
    let cumulative = 0;

    for (const [t, rate] of Object.entries(rates)) {
        cumulative += rate;
        if (rand < cumulative) {
            type = t as PatronType;
            break;
        }
    }

    const nameList = NAMES[type];
    const name = nameList[Math.floor(Math.random() * nameList.length)];

    let patienceMultiplier = 1.0;
    let goldMultiplier = 1.0;

    switch (type) {
        case 'PEASANT':
            patienceMultiplier = 1.0;
            goldMultiplier = 1.0;
            break;
        case 'KNIGHT':
            patienceMultiplier = 1.2;
            goldMultiplier = 1.5;
            break;
        case 'NOBLE':
            patienceMultiplier = 0.8;
            goldMultiplier = 3.0;
            break;
        case 'WIZARD':
            patienceMultiplier = 0.5;
            goldMultiplier = 5.0;
            break;
    }

    // Difficulty scaling: global patience reduction per night
    // 5% faster patience decay per night, capped at 50% faster
    const difficultyPatienceMod = Math.max(0.5, 1 - ((night - 1) * 0.05));
    patienceMultiplier *= difficultyPatienceMod;

    return {
        id: Date.now(),
        name,
        type,
        displayName: `${type === 'KNIGHT' || type === 'NOBLE' ? '' : 'The '}${type} ${name}`,
        arrivalTime: Date.now(),
        patience: MAX_PATIENCE,
        patienceMultiplier,
        goldMultiplier,
        status: 'waiting'
    };
};
