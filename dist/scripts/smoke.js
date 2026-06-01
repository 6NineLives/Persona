import { PersonaEngine, runEvolutionCycle } from "../src/index.js";
async function run() {
    const engine = new PersonaEngine({ baseDir: process.cwd() });
    const turn = await engine.processUserTurn("dev_project_1", "Create a new login button and make it slay with frosted glass UI.", "frontend-react-architect");
    if (!turn.systemInstruction.includes("## Tier 1 Core Persona")) {
        throw new Error("Compiler output missing Tier 1 section");
    }
    if (!turn.systemInstruction.includes("## Tier 2 Dialect Delta")) {
        throw new Error("Compiler output missing Tier 2 section");
    }
    if (!turn.systemInstruction.includes("## Tier 3 User State")) {
        throw new Error("Compiler output missing Tier 3 section");
    }
    await engine.harvestIdiomDelta("dev_project_1", "frontend-react-architect", "frosted_glass", "manual smoke insert", "code");
    const evolution = await runEvolutionCycle({ baseDir: process.cwd(), minOccurrences: 1 });
    if (evolution.scannedProfiles < 1) {
        throw new Error("Evolution did not scan profile files");
    }
    const delta = await engine.readDialectDelta("frontend-react-architect");
    if (!delta.includes("## Accepted Term") || !delta.includes("term:")) {
        throw new Error("Expected accepted dialect entries in DIALECT_DELTA");
    }
    console.error("[smoke] pass", {
        candidateCount: turn.profileMetadata.candidateCount,
        evolution
    });
}
run().catch((error) => {
    console.error("[smoke] fail", error);
    process.exitCode = 1;
});
//# sourceMappingURL=smoke.js.map