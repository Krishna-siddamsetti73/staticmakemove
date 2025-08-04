import React, { useState, useEffect } from "react";

const ChatBot: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setShowChat(!showChat);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://127.0.0.1:5000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply || "No reply received." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: `Error connecting to server. ${error}` }]);
    }

    setInput("");
  };

  return (
    <>
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "50px",
          padding: "12px 20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {showChat ? "Close" : "Chat"}
      </button>

      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "90vw",
            maxWidth: "350px",
            height: "60vh",
            maxHeight: "450px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 999,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px",
              borderBottom: "1px solid #eee",
              backgroundColor: "#dc2626",
              color: "white",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Make A Move Assistant
          </div>

          {/* Chat content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              background: "linear-gradient(to bottom, #dc2626, #2563eb)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
                  padding: "8px 12px",
                  borderRadius: "16px",
                  marginLeft: msg.sender === "user" ? "auto" : "0",
                  marginBottom: "10px",
                  maxWidth: "80%",
                  fontSize: "14px",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #eee",
              backgroundColor: "#fff",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "14px",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
