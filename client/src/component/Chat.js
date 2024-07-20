import React, { useEffect, useState } from "react";

const Chat = ({ socket, room, userName }) => {
  const [text, setText] = useState("");
  const [chat, setChat] = useState([]);
  const [selfChat, setSelfChat] = useState([]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (text !== "") {
      const messageData = {
        room: room,
        userName: userName,
        message: text,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };
      await socket.emit("send_message", messageData);
      setSelfChat((prev) => [...prev, text]);
      setText("");
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  console.log({ selfChat, text });
  return (
    <div>
      <p>Live Chat</p>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Chat"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
      <div style={{ display: "flex", justifyContent: "between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
        <p style={{ fontWeight: "bold" }}>{chat?.[0]?.userName}</p>
        <div>
          {chat.map((chatItem, index) => (
            <p key={index}>{chatItem.message}</p>
          ))}
        </div></div>
        <div>
          {selfChat.map((chatItem, index) => (
            <p key={index}>{chatItem}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
