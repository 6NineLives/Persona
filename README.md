# Persona (Local-First)

Persona is a local-first, Markdown-driven identity engine for AI agents.

It lets you decouple base model intelligence from behavioral or architectural identity by loading persona files from disk:

- Tier 1: `PERSONA.md` (source of truth)
- Tier 2: `DIALECT_DELTA.md` (evolving archetype)
- Tier 3: `user_{id}_state.md` (user/project profile state)

## Features

- Local-only runtime with no network dependency in core engine
- Direct TypeScript SDK (`PersonaEngine`)
- MCP stdio server for IDE/agent integration
- Evolution pipeline for recurring idioms and slang promotion
- Atomic markdown persistence for state updates

## Project Structure

```text
src/
  parser/
    markdownLoader.ts
    compiler.ts
  runtime/
    engine.ts
    detector.ts
    evolution.ts
    types.ts
  interfaces/
    mcp/
      stdioServer.ts
  index.ts

data/
  personas/
    <personaName>/
      PERSONA.md
      DIALECT_DELTA.md
  profiles/
    user_<id>_state.md
```

## Requirements

- Node.js 20+
- npm

## Install

```bash
npm install
```

## Build and Verify

```bash
npm run typecheck
npm run build
npm run smoke
```

## Interface 1: Direct SDK Usage

```ts
import { PersonaEngine } from "./src/index.js";

const engine = new PersonaEngine({ baseDir: process.cwd() });

const result = await engine.processUserTurn(
  "dev_project_1",
  "Create a new login button.",
  "frontend-react-architect"
);

console.log(result.systemInstruction);
console.log(result.profileMetadata);
```

### Engine API

- `processUserTurn(userId, message, personaName)`  
  Loads Tier 1/2/3, detects unmapped terms, updates profile state, compiles final protocol.
- `harvestIdiomDelta(userId, personaName, term, context, sourceType?)`  
  Manual candidate ingestion for later evolution.
- `readDialectDelta(personaName)`  
  Reads local `DIALECT_DELTA.md`.

## Interface 2: MCP Stdio Server

Build first:

```bash
npm run build
```

Run stdio server:

```bash
npm run mcp:stdio
```

The server exposes:

- Prompt: `get_adaptive_persona`
  - args: `userId`, `userMessage`, `personaName`
  - returns compiled persona protocol text
- Tool: `harvest_idiom_delta`
  - args: `userId`, `personaName`, `term`, `context`, `sourceType`
  - queues manual idiom candidates
- Resource: `persona://archetypes/{personaName}`
  - returns raw `DIALECT_DELTA.md`

Note: non-protocol diagnostics are written to `stderr` (`console.error`), preserving `stdout` for JSON-RPC transport.

## Drop-In Persona Onboarding

To add a new persona:

1. Create `data/personas/<personaName>/PERSONA.md`
2. Optionally add `data/personas/<personaName>/DIALECT_DELTA.md` (it auto-creates if missing)
3. Call `processUserTurn(..., "<personaName>")`

## Evolution Pipeline

Use `runEvolutionCycle()` to aggregate recurring unmapped candidates from profile files and promote validated entries into persona delta files.

```ts
import { runEvolutionCycle } from "./src/index.js";

const report = await runEvolutionCycle({ baseDir: process.cwd(), minOccurrences: 2 });
console.log(report);
```

## Data Notes

- Profile files are created lazily in `data/profiles/`
- Candidate idioms are deduplicated by persona + normalized term
- Writes are atomic (`tmp -> rename`) to reduce corruption risk

## Scripts

- `npm run typecheck` - TypeScript validation (`tsc --noEmit`)
- `npm run build` - compile to `dist/`
- `npm run smoke` - local integration smoke checks
- `npm run mcp:stdio` - launch MCP stdio server
