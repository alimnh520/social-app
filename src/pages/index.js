"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function LiveChat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {

    async function userMessage() {
      try {
        const response = await fetch('/api/message', { method: "GET" });
        const data = await response.json();
        setSaveMessage(data.message);
      } catch (error) {
        console.log(error);
      }
    }
    userMessage();

    fetch("/api/socket"); // socket initialize

    socket = io({ path: "/api/socket_io" });

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => socket.disconnect();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
  };

  return (
    <div className="p-6 space-y-4">
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border px-4 py-2 rounded"
          placeholder="Type your message..."
        />
        <button className="ml-2 px-4 py-2 bg-pink-500 text-white rounded">Send</button>
      </form>

      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-100 text-black px-4 py-2 rounded shadow">
            {msg.text} <span className="text-xs text-gray-500">({msg.time})</span>
          </div>
        ))}
        {/* {saveMessage && saveMessage.slice().reverse().map((msg, i) => (
          <div key={i} className="bg-gray-100 px-4 py-2 rounded shadow">
            {msg.text} <span className="text-xs text-gray-500">({msg.time})</span>
          </div>
        ))} */}
      </div>
    </div>
  );
}
