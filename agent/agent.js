// import dotenv from "dotenv";
// import { defineAgent, initializeLogger, cli, ServerOptions } from "@livekit/agents";
// import { fileURLToPath } from "url";

// dotenv.config({ path: "../.env" });

// initializeLogger({
//   pretty: true,
//   level: "info",
// });

// async function entry(ctx) {
//   console.log("Agent starting...");
//   console.log("Agent connected to room:", ctx.room.name);
  
//   // Connect to the room
//   await ctx.connect();
//   console.log("Agent successfully connected to:", ctx.room.name);
// }

// const agentDef = defineAgent({
//   entry: entry,
// });

// // Export for programmatic use
// export default agentDef;

// // Run the CLI
// cli.runApp(
//   new ServerOptions({
//     agent: fileURLToPath(import.meta.url),
//     agentName: "voice-agent",
//   })
// );

import dotenv from "dotenv";
import { defineAgent, initializeLogger, cli, ServerOptions } from "@livekit/agents";
import { fileURLToPath } from "url";

dotenv.config({ path: "../.env" });

initializeLogger({
  pretty: true,
  level: "info",
});

async function entry(ctx) {
  console.log("Agent starting...");
  console.log("Agent connected to room:", ctx.room.name);
  
  // Connect to the room
  await ctx.connect();
  console.log("Agent successfully connected to:", ctx.room.name);
}

const agentDef = defineAgent({
  entry,
});

export default agentDef;

cli.runApp(
  new ServerOptions({
    agent: fileURLToPath(import.meta.url),
    agentName: "voice-agent",
  })
);