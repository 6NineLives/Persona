import path from "node:path";
import { MarkdownLoader } from "../parser/markdownLoader.js";
function sanitizeId(value) {
    const safe = value.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
    return safe.length > 0 ? safe : "default";
}
function validationPasses(item, minOccurrences) {
    if (item.totalOccurrences < minOccurrences)
        return false;
    const normalized = item.term.trim();
    if (normalized.length < 3 || normalized.length > 64)
        return false;
    if (!/[A-Za-z]/.test(normalized))
        return false;
    return true;
}
export async function runEvolutionCycle(config = {}) {
    const loader = new MarkdownLoader(config.baseDir ? { baseDir: config.baseDir } : {});
    const minOccurrences = config.minOccurrences ?? 2;
    const profilePaths = await loader.listProfilePaths();
    const profiles = [];
    for (const profilePath of profilePaths) {
        const content = await loader.readOrCreateProfile(profilePath, "unknown");
        profiles.push({ path: profilePath, state: content });
    }
    const aggregated = new Map();
    for (const profile of profiles) {
        for (const candidate of profile.state.unmappedCandidates) {
            const key = `${candidate.personaName.toLowerCase()}::${candidate.term.toLowerCase()}`;
            const existing = aggregated.get(key);
            if (!existing) {
                aggregated.set(key, {
                    personaName: candidate.personaName,
                    term: candidate.term,
                    context: candidate.context,
                    sourceType: candidate.sourceType,
                    totalOccurrences: candidate.occurrences
                });
                continue;
            }
            existing.totalOccurrences += candidate.occurrences;
        }
    }
    const accepted = [...aggregated.values()].filter((item) => validationPasses(item, minOccurrences));
    const acceptedKeySet = new Set(accepted.map((item) => `${item.personaName.toLowerCase()}::${item.term.toLowerCase()}`));
    for (const acceptedItem of accepted) {
        const dialectPath = path.join(config.baseDir ?? process.cwd(), "data", "personas", sanitizeId(acceptedItem.personaName), "DIALECT_DELTA.md");
        const line = `- term: ${acceptedItem.term} | sourceType: ${acceptedItem.sourceType} | recurrence: ${acceptedItem.totalOccurrences} | context: ${acceptedItem.context}`;
        await loader.appendToDialectDelta(dialectPath, `## Accepted Term\n${line}`);
    }
    for (const profile of profiles) {
        profile.state.unmappedCandidates = profile.state.unmappedCandidates.filter((item) => !acceptedKeySet.has(`${item.personaName.toLowerCase()}::${item.term.toLowerCase()}`));
        profile.state.updatedAt = new Date().toISOString();
        await loader.writeProfile(profile.path, profile.state);
    }
    return {
        acceptedCount: accepted.length,
        scannedProfiles: profiles.length
    };
}
//# sourceMappingURL=evolution.js.map