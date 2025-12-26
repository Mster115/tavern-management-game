export type GameState = 'START_SCREEN' | 'SHIFT_INTRO' | 'PLAYING' | 'SHIFT_SUMMARY';

export type PatronType = 'PEASANT' | 'KNIGHT' | 'NOBLE' | 'WIZARD';

export interface Patron {
    id: number;
    name: string;
    type: PatronType;
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
}

export interface GameContextType {
    gameState: GameState;
    night: number;
    timeLeft: number;
    totalGold: number;
    currentShiftGold: number;
    patronsServed: number;
    queue: Patron[];
    activePatron: Patron | null;
    scoreLogs: ScoreLog[];
    feedback: string;

    // Actions
    startShift: () => void;
    nextNight: () => void;
    submitPour: (accuracyMetric: number) => void;
    spawnPatron: () => void;
}
