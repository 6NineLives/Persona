export type CandidateSourceType = "text" | "code";
export interface CandidateTerm {
    term: string;
    context: string;
    personaName: string;
    firstSeenAt: string;
    occurrences: number;
    sourceType: CandidateSourceType;
}
export interface PersonaDocuments {
    personaCore: string;
    dialectDelta: string;
    userProfile: string;
}
export interface ProfileMetadata {
    userId: string;
    personaName: string;
    updatedAt: string;
    candidateCount: number;
}
export interface ProcessUserTurnResult {
    systemInstruction: string;
    profileMetadata: ProfileMetadata;
}
export interface UserProfileState {
    userId: string;
    personaName: string;
    updatedAt: string;
    interactionContext: string[];
    unmappedCandidates: CandidateTerm[];
}
