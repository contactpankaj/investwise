
import Groq from './node_modules/groq-sdk';
const API_KEY = "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";
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

console.log("index.js loaded")

let messages = [
    {
      message: "Hello, I'm ChatBot! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ];

  const systemMessage = {
    role: "system",
    content: "You are a knowledgeable AI assistant specializing in location-based guidance. Provide details on zip codes, landmarks, and nearby amenities such as restaurants, transit options, and attractions. Keep the responses concise and brief."
  };
  
  let isTyping = false;
  
  const messageContainer = document.getElementById('messageContainer');
  const userMessageInput = document.getElementById('userMessage');
  const sendButton = document.getElementById('sendBtn');
  
//   displayMessages();
  
  sendButton.addEventListener('click', () => {
    const userMessage = userMessageInput.value;
    if (userMessage.trim()) {
      handleSend(userMessage);
    }
  });
  
  async function handleSend(message) {
    // Create a new user message
    const newMessage = {
      message: message,
      direction: 'outgoing',
      sender: "user",
      sentTime: "just now"
    };
  
    // Add user message to messages array
    messages.push(newMessage);
  
    // Update the message container with new message
    // displayMessages();
    console.log(messages)
 
    userMessageInput.value = '';
  
    // Set typing state to true while processing response
    // isTyping = true;
    // displayMessages();
  
    // // Simulate processing and get the bot's response
    await processMessageToGroq(messages);
  }
  
  // Display all messages in the message container
  function displayMessages() {
    messageContainer.innerHTML = ''; // Clear previous messages
  
    messages.forEach(msg => {
      const messageElement = document.createElement('div');
      messageElement.classList.add(msg.sender === 'ChatGPT' ? 'chatbot-message' : 'user-message');
      messageElement.innerHTML = `
        <p>${msg.message}</p>
        <small>${msg.sentTime}</small>
      `;
      messageContainer.appendChild(messageElement);
    });
  
    // Scroll to the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
  
  // Process message with Groq API (or mock response for now)
  async function processMessageToGroq(chatMessages) {
  
    let apiMessages = [
      systemMessage,
      ...chatMessages.map((messageObject) => ({
        role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
        content: messageObject.message
      }))
    ];
  
    const apiRequestBody = {
      "model": "llama-3.3-70b-versatile",
      "messages": apiMessages,
      "temperature": 1,
      "max_completion_tokens": 1024,
      "top_p": 1,
      "stream": true,
      "stop": null
    };
  
    try {
      // Simulating Groq API response (replace with actual API call)
      console.log("calling groq now")
      const chatCompletion = await groq.chat.completions.create(apiRequestBody);
  
      let responseMessage = "";
  
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        responseMessage += content;
      }
  
      // Add ChatGPT's response message
      messages.push({
        message: responseMessage,
        sender: "ChatGPT",
        sentTime: "just now"
      });

      console.log(messages)
  
    //   isTyping = false;
    //   displayMessages();
  
    } catch (error) {
      console.error("Error fetching response from Groq API:", error);
    }
  }
  