import React, { useState } from "react";
import { Room } from "livekit-client";

function App() {
  const [room, setRoom] = useState(null);

  const startCall = async () => {
    console.log("Starting call...");  
    try {
      const res = await fetch("http://localhost:4000/token");
      const data = await res.json();

      const token = data.token;

      const room = new Room();

      await room.connect(
        "wss://voice-ai-agent-illgnzo4.livekit.cloud",
        token
      );

      console.log("Connected to room");

      await room.localParticipant.enableCameraAndMicrophone();

      setRoom(room);

    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>AI Clinic Receptionist</h1>

      <button onClick={startCall}>
        Start Voice Call
      </button>

      {room && <p>Connected to LiveKit Room</p>}
    </div>
  );
}

export default App;