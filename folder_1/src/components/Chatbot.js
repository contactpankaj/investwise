import React from "react";
import Groq from "groq-sdk";
import { useState } from "react";

const API_KEY = "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";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
const systemMessage = {
  role: "system",
  content:
    "You are a knowledgeable AI assistant specializing in location-based guidance. Provide details on zip codes, landmarks, and nearby amenities such as restaurants, transit options, and attractions. Keep the responses concise and brief.",
};

const Chatbot = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatBot! Ask me anything!",
      sentTime: "just now",
      sender: "Bot",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToGroq(newMessages);
  };

  async function processMessageToGroq(chatMessages) {
    let apiMessages = [
      systemMessage,
      ...chatMessages.map((messageObject) => ({
        role: messageObject.sender === "Bot" ? "assistant" : "user",
        content: messageObject.message,
      })),
    ];

    const apiRequestBody = {
      model: "llama-3.3-70b-versatile",
      messages: apiMessages,
      temperature: 1,
      max_completion_tokens: 30,
      top_p: 1,
      stream: true,
      stop: null,
    };

    try {
      const chatCompletion = await groq.chat.completions.create(apiRequestBody);
      let responseMessage = "";

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        responseMessage += content;
      }

      setMessages([
        ...chatMessages,
        { message: responseMessage, sender: "Bot" },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching response from Groq API:", error);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 className="text-xl font-bold mb-2">Chatbot</h2>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Message List */}
        <div
          className="message-list"
          style={{ padding: "10px", overflowY: "auto", flexGrow: 1 }}
        >
          {messages.map((message, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  message.sender === "Bot" ? "flex-start" : "flex-end",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#e0f0ff",
                  padding: "10px 15px",
                  borderRadius: "12px",
                  width: "80%",
                  textAlign: "left",
                  wordBreak: "break-word",
                }}
              >
                <p style={{ margin: 0 }}>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Typing Indicator */}
        {isTyping && <div>ChatBot is typing...</div>}
      </div>

      {/* Message Input */}
      <div style={{ marginTop: "auto", padding: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Type message here"
            onKeyPress={(e) => e.key === "Enter" && handleSend(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector("#chat-input");
              if (input) handleSend(input.value);
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "4px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
