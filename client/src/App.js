import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./component/Chat";

function App() {
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const joinRoom = (e) => {
    e.preventDefault();
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  return (
    <div className="App">
      <>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom} type="button">Join Room</button>
      </>
      {socket && <Chat socket={socket} userName={userName} room={room} />}
    </div>
  );
}

export default App;
