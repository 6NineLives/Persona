import { ProcessUserTurnResult } from "./types.js";
export interface PersonaEngineConfig {
    baseDir?: string;
}
export declare class PersonaEngine {
    private readonly loader;
    constructor(config?: PersonaEngineConfig);
    processUserTurn(userId: string, message: string, personaName: string): Promise<ProcessUserTurnResult>;
    harvestIdiomDelta(userId: string, personaName: string, term: string, context: string, sourceType?: "text" | "code"): Promise<void>;
    readDialectDelta(personaName: string): Promise<string>;
    private bumpInteractionContext;
    private mergeCandidates;
    private key;
}
