import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { PersonaEngine } from "../../runtime/engine.js";

const engine = new PersonaEngine();

const server = new McpServer({
  name: "persona-local-first",
  version: "0.1.0"
});

server.prompt(
  "get_adaptive_persona",
  {
    userId: z.string().min(1),
    userMessage: z.string().min(1),
    personaName: z.string().min(1)
  },
  async ({ userId, userMessage, personaName }) => {
    const result = await engine.processUserTurn(userId, userMessage, personaName);
    return {
      messages: [
        {
          role: "assistant",
          content: {
            type: "text",
            text: result.systemInstruction
          }
        }
      ]
    };
  }
);

server.tool(
  "harvest_idiom_delta",
  {
    userId: z.string().min(1),
    personaName: z.string().min(1),
    term: z.string().min(1),
    context: z.string().default("manual"),
    sourceType: z.enum(["text", "code"]).default("text")
  },
  async ({ userId, personaName, term, context, sourceType }) => {
    await engine.harvestIdiomDelta(userId, personaName, term, context, sourceType);
    return {
      content: [
        {
          type: "text",
          text: `Queued term "${term}" for persona "${personaName}".`
        }
      ]
    };
  }
);

server.resource(
  "persona-archetype-delta",
  new ResourceTemplate("persona://archetypes/{personaName}", { list: undefined }),
  {
    description: "Reads local persona DIALECT_DELTA.md by persona name",
    mimeType: "text/markdown"
  },
  async (uri, variables) => {
    const personaName = String(variables.personaName ?? "");
    const rawDelta = await engine.readDialectDelta(personaName);
    return {
      contents: [
        {
          uri: uri.toString(),
          mimeType: "text/markdown",
          text: rawDelta
        }
      ]
    };
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  console.error("[persona-mcp] starting stdio server");
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error("[persona-mcp] fatal", error);
  process.exitCode = 1;
});
