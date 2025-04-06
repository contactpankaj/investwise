console.log("index.js loaded")

const messageContainer = document.getElementById('messageContainer');
const userMessageInput = document.getElementById('userMessage');
const sendButton = document.getElementById('sendBtn');

//Chatbot start message
const botMessage = {
  message: "Hello, I'm ChatBot! Ask me anything!",
  direction: 'incoming',
  sender: "Bot",
  sentTime: "just now"
};

let messages = [];
messages.push(botMessage);

  const systemMessage = {
    role: "system",
    content: "You are a knowledgeable AI assistant specializing in location-based guidance. Provide details on zip codes, landmarks, and nearby amenities such as restaurants, transit options, and attractions. Keep the responses concise and brief."
  };

  appendMessage(botMessage)
  
  let isTyping = false;
  
  
  
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
    console.log("before call to GROQ")

    appendMessage(newMessage)
    userMessageInput.value = '';
    
    await processMessageToGroq(messages);
  }

  function appendMessage(msg) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(msg.sender === 'Bot' ? 'chatbot-message' : 'user-message');
    messageElement.innerHTML = `
      <textarea readonly>${msg.message}</textarea>
    `;

    const textarea = messageElement.querySelector('textarea');
    // autoResizeTextarea(textarea);

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  function autoResizeTextarea(textarea) {
    // Set initial height to auto to get the natural height
    const prevHeight = textarea.style.height;
  
    
    const newHeight = textarea.scrollHeight + 'px';
    // Check if content is overflowing
    if (prevHeight !== newHeight) {
      textarea.style.height = 'auto';
      console.log("height adjusting code")
      textarea.style.height = newHeight;
    } else {
      console.log("height NOT adjusting code")
    }
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
  
  // Process message with Groq API 
  async function processMessageToGroq(chatMessages) {
  
    let formattedMessages = [
      systemMessage,
      ...chatMessages.map((messageObject) => ({
        role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
        content: messageObject.message
      }))
    ];
    console.log("calling GROQ")
  
    try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: formattedMessages })
        });

        const data = await response.json();

        const botReply = {
            message: data.reply,
            direction: 'incoming',
            sender: "Bot",
            sentTime: "just now"
        };

        messages.push(botReply)
        appendMessage(botReply)

        console.log("after calling GROQ")
        console.log(messages)
        
    } catch (error) {
        console.error("Error contacting chatbot API:", error);
    }
  }
  