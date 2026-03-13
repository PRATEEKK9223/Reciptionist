import React, { useState } from "react";
import { Room, createLocalAudioTrack } from "livekit-client";
import "./App.css";

function App() {
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState("Ready to start call");
  const [error, setError] = useState(null);

  const startCall = async () => {
    console.log("Starting call...");
    setStatus("Getting token...");
    setError(null);

    try {
      // Get token from token-server
      const res = await fetch("http://localhost:4000/token");
      if (!res.ok) {
        throw new Error(`Token request failed: ${res.status}`);
      }
      
      const data = await res.json();
      const token = data.token;
      const roomName = data.room;

      console.log("Token received for room:", roomName);
      setStatus(`Connecting to room: ${roomName}...`);

      // Create and connect room
      const newRoom = new Room({
        audio: true,
        video: false,
      });

      newRoom.on("disconnected", () => {
        console.log("Disconnected from room");
        setRoom(null);
        setStatus("Disconnected");
      });

      newRoom.on("participantConnected", (participant) => {
        console.log("Participant connected:", participant.identity);
      });

      newRoom.on("participantDisconnected", (participant) => {
        console.log("Participant disconnected:", participant.identity);
      });

      await newRoom.connect(
        "wss://voice-ai-agent-illgnzo4.livekit.cloud",
        token
      );

      console.log("Connected to room:", roomName);
      setStatus(`Connected to ${roomName}`);

      // Create and publish audio track
      setStatus("Publishing microphone...");
      const track = await createLocalAudioTrack();
      await newRoom.localParticipant.publishTrack(track);

      console.log("Microphone published");
      setStatus("Call started - Microphone active");
      setRoom(newRoom);

    } catch (error) {
      console.error("Connection failed:", error);
      setError(`Error: ${error.message}`);
      setStatus("Failed to start call");
    }
  };

  const endCall = async () => {
    if (room) {
      await room.disconnect();
      setRoom(null);
      setStatus("Call ended");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>AI Clinic Receptionist</h1>
      
      <div style={{ 
        padding: "20px", 
        margin: "20px auto", 
        maxWidth: "400px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <p><strong>Status:</strong> {status}</p>
        {error && <p style={{ color: "red" }}><strong>Error:</strong> {error}</p>}
      </div>

      <button 
        onClick={startCall}
        disabled={room !== null}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginRight: "10px",
          backgroundColor: room ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: room ? "not-allowed" : "pointer",
        }}
      >
        Start Voice Call
      </button>

      <button 
        onClick={endCall}
        disabled={room === null}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: room ? "#f44336" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: room ? "pointer" : "not-allowed",
        }}
      >
        End Call
      </button>

      {room && <p style={{ marginTop: "20px", color: "green" }}>✓ Connected to LiveKit Room</p>}
    </div>
  );
}

export default App;