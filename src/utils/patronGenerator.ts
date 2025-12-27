import type { Patron, PatronType } from '../types/game';
import { MAX_PATIENCE } from '../constants/game';

const NAMES: Record<PatronType, string[]> = {
    PEASANT: ["Olaf", "Gunnar", "Helga", "Sigrid", "Bjorn", "Astrid", "Leif", "Inga"],
    KNIGHT: ["Sir Gallahad", "Dame Lancelot", "Sir Gawain", "Dame Brienne", "Sir Percival", "Dame Eowyn"],
    NOBLE: ["Lord Blackwood", "Lady Stark", "Baron Von Hein", "Countess Dracula", "Duke Leto", "Duchess Satine"],
    WIZARD: ["Merlin", "Gandalf", "Radagast", "Morgana", "Dumbledore", "Saruman"],
    ROYAL: ["King Arthur", "Queen Guinevere", "Prince Charming", "Princess Zelda", "Emperor Kuzco", "Queen Elizabeth"]
};

// --- Weights System ---

// Helper for weighted selection
function selectWeighted<T>(items: { item: T; weight: number }[]): T {
    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    const rand = Math.random() * totalWeight;
    let current = 0;
    for (const i of items) {
        current += i.weight;
        if (rand < current) return i.item;
    }
    return items[items.length - 1].item;
}

// 1. Patron Type Weights (Base vs Late Game)
// "Late Game" targets roughly Night 5+
const TYPE_WEIGHTS_BASE: Record<PatronType, number> = {
    PEASANT: 100,
    KNIGHT: 10,
    NOBLE: 5,
    WIZARD: 2,
    ROYAL: 0 // No royals on night 1
};

const TYPE_WEIGHTS_LATE: Record<PatronType, number> = {
    PEASANT: 40,
    KNIGHT: 40,
    NOBLE: 30,
    WIZARD: 20,
    ROYAL: 10
};

// 2. Tipping Tier Weights per Class
// Val = Gold Multiplier
const TIPPING_WEIGHTS: Record<PatronType, { val: number; weight: number }[]> = {
    PEASANT: [
        { val: 0.8, weight: 20 }, // Cheap
        { val: 1.0, weight: 70 }, // Normal
        { val: 1.2, weight: 10 }  // Small Tip
    ],
    KNIGHT: [
        { val: 1.2, weight: 30 },
        { val: 1.5, weight: 50 },
        { val: 1.8, weight: 20 }  // Tip
    ],
    NOBLE: [
        { val: 2.5, weight: 40 },
        { val: 3.0, weight: 40 },
        { val: 4.5, weight: 20 }  // Big Tip
    ],
    WIZARD: [
        { val: 2.0, weight: 20 },
        { val: 3.5, weight: 50 },
        { val: 6.0, weight: 30 }  // Magic Tip
    ],
    ROYAL: [
        { val: 5.0, weight: 60 },
        { val: 10.0, weight: 40 } // Royal Treasury
    ]
};

export const generatePatron = (night: number = 1): Patron => {
    // 1. Calculate Current Weights based on Night progress
    // Interpolate between Base (Night 1) and Late (Night 5)
    // progress: 0.0 (Night 1) -> 1.0 (Night 5+)
    const progress = Math.min(1, (night - 1) / 4);

    const currentTypeWeights = Object.keys(TYPE_WEIGHTS_BASE).map(key => {
        const type = key as PatronType;
        const start = TYPE_WEIGHTS_BASE[type];
        const end = TYPE_WEIGHTS_LATE[type];
        const currentWeight = start + (end - start) * progress;
        return { item: type, weight: currentWeight };
    });

    // 2. Select Type
    const type = selectWeighted(currentTypeWeights);

    // 3. Select Details
    const nameList = NAMES[type] || NAMES.PEASANT;
    const name = nameList[Math.floor(Math.random() * nameList.length)];

    // 4. Select Gold Multiplier from Tipping Table
    const tippingOptions = TIPPING_WEIGHTS[type].map(t => ({ item: t.val, weight: t.weight }));
    const goldMultiplier = selectWeighted(tippingOptions);

    // 5. Patience Calculation (Difficulty Scaling)
    let patienceMultiplier = 1.0;
    switch (type) {
        case 'PEASANT': patienceMultiplier = 1.0; break;
        case 'KNIGHT': patienceMultiplier = 1.2; break; // Knights endure more
        case 'NOBLE': patienceMultiplier = 0.8; break;
        case 'WIZARD': patienceMultiplier = 0.6; break; // Wizards are impatient
        case 'ROYAL': patienceMultiplier = 0.5; break; // Royals want it NOW
    }

    // Global Patience Decay Scaling (5% faster per night, max 50%)
    const difficultyMod = Math.max(0.5, 1 - ((night - 1) * 0.05));
    patienceMultiplier *= difficultyMod;

    return {
        id: Date.now(),
        name,
        type,
        displayName: `${name}`,
        arrivalTime: Date.now(),
        patience: MAX_PATIENCE,
        patienceMultiplier,
        goldMultiplier,
        status: 'waiting'
    };
};
