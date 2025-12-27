export type GameState = 'START_SCREEN' | 'SHIFT_INTRO' | 'PLAYING' | 'SHIFT_SUMMARY' | 'GAME_OVER';

export type PatronType = 'PEASANT' | 'KNIGHT' | 'NOBLE' | 'WIZARD' | 'ROYAL';
export type DrinkType = 'ALE' | 'WINE';

export interface Patron {
    id: number;
    name: string;
    type: PatronType;
    desiredDrink: DrinkType;
    displayName: string;
    arrivalTime: number;
    patience: number;
    patienceMultiplier: number; // 0.5 = fast decay, 1.5 = slow decay
    goldMultiplier: number;     // 1.0 = normal, 2.0 = rich
    sprite?: string;            // Deprecated, keeping for fallback
    status: 'waiting' | 'active' | 'angry' | 'leaving';
}

export interface ScoreLog {
    id: number;
    gold: number;
    text: string;
    subText?: string;
    baseVal?: number;
    tipVal?: number;
}

export interface GameContextType {
    gameState: GameState;
    night: number;
    timeLeft: number;
    maxTime: number;
    totalGold: number;
    currentShiftGold: number;
    patronsServed: number;
    angryPatronCount: number;
    angryLimit: number; // Dynamic limit based on night
    queue: Patron[];
    activePatron: Patron | null;
    scoreLogs: ScoreLog[];
    feedback: string;
    unlockedDrinks: DrinkType[];

    // Actions
    startShift: () => void;
    nextNight: () => void;
    retryNight: () => void;
    resetGame: () => void;
    submitPour: (accuracyMetric: number, drinkType: import('./game').DrinkType) => void;
    spawnPatron: () => void;
    registerAngryPatron: () => void;
}
