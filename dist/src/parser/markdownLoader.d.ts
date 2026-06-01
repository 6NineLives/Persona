import { UserProfileState } from "../runtime/types.js";
export declare class PersonaFileNotFoundError extends Error {
    constructor(filePath: string);
}
export interface LoaderConfig {
    baseDir?: string;
}
export interface PathSet {
    personaDir: string;
    personaCorePath: string;
    dialectDeltaPath: string;
    profilesDir: string;
    profilePath: string;
}
export declare class MarkdownLoader {
    private readonly baseDir;
    private readonly personasDir;
    private readonly profilesDir;
    constructor(config?: LoaderConfig);
    buildPaths(personaName: string, userId: string): PathSet;
    listProfilePaths(): Promise<string[]>;
    readRequiredPersonaCore(personaPath: string): Promise<string>;
    readOrCreateDialectDelta(dialectPath: string, personaName: string): Promise<string>;
    readOrCreateProfile(profilePath: string, userId: string): Promise<UserProfileState>;
    writeProfile(profilePath: string, state: UserProfileState): Promise<void>;
    appendToDialectDelta(dialectPath: string, appendContent: string): Promise<void>;
    ensureDir(dirPath: string): Promise<void>;
    atomicWrite(filePath: string, content: string): Promise<void>;
    parseProfile(markdown: string, userIdFallback: string): UserProfileState;
    serializeProfile(state: UserProfileState): string;
    private defaultProfile;
    private parseCandidates;
    private captureValue;
    private captureSection;
    private renderDialectTemplate;
    private normalizePathSegment;
    private normalizeNewlines;
    private ensureReadable;
    private exists;
}
