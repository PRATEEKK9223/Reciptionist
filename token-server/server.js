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

app.get("/token", async (req, res) => {
  try {
    const roomName = "clinic-room";
    const identity = "user-" + Math.floor(Math.random() * 10000);

    const token = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        identity: identity,
      }
    );

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const jwt = await token.toJwt();

    res.json({
      token: jwt,
      room: roomName,
      identity: identity,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Token generation failed" });
  }
});

app.listen(4000, () => {
  console.log("Token server running on port 4000");
});