require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

console.log("LIVEKIT_API_KEY:", LIVEKIT_API_KEY);
console.log("LIVEKIT_API_SECRET:", LIVEKIT_API_SECRET);

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  console.error("ERROR: LIVEKIT_API_KEY or LIVEKIT_API_SECRET not set");
  process.exit(1);
}

app.get("/token", async (req, res) => {
  try {
    const roomName = "clinic-room";
    const identity = "user-" + Math.floor(Math.random() * 10000);

    const token = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      identity: identity,
    });

    const jwt = token.toJwt();

    console.log(`✓ Token generated for ${identity} in ${roomName}`);

    res.json({
      token: jwt,
      room: roomName,
      identity: identity,
    });

  } catch (error) {
    console.error("❌ Token generation error:", error);
    res.status(500).json({ error: "Token generation failed: " + error.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✓ Token server running on port ${PORT}`);
  console.log(`✓ Endpoints available at:`);
  console.log(`  - http://localhost:${PORT}/token`);
  console.log(`  - http://localhost:${PORT}/health`);
});