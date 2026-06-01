export interface EvolutionRunResult {
    acceptedCount: number;
    scannedProfiles: number;
}
export interface EvolutionConfig {
    baseDir?: string;
    minOccurrences?: number;
}
export declare function runEvolutionCycle(config?: EvolutionConfig): Promise<EvolutionRunResult>;
