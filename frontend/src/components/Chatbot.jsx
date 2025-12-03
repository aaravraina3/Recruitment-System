import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello fellow student! ﹏﹏𓊝﹏﹏ I'm Generate's recruitment assistant. I can help you learn about our club culture, application tips, and our past projects. What sparks your interest little husky?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage = {
    id: Date.now(),
    text: inputMessage,
    isBot: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsLoading(true);

    try {
      // Use relative path if proxied, or get from env. 
      // Assuming backend runs on port 8000 and we are on 3000, we need full URL if no proxy.
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const API_ENDPOINT = `${API_URL}/api/chat`; 
      
      const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: inputMessage,
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const botResponseText = data.response || data.message || data.reply || data.text;
    
    const botMessage = {
      id: Date.now() + 1,
      text: botResponseText,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, botMessage]);
    
  } catch (error) {
    console.error('Error calling chatbot API:', error);
    const errorMessage = {
      id: Date.now() + 1,
      text: "Sorry, I'm having trouble connecting right now. Please try again later! 🔄",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const suggestions = [
    { icon: '✨', text: 'Application Tips', message: 'What are some tips for my Generate application?' },
    { icon: '🚀', text: 'Past Projects', message: 'Tell me about Generate\'s past projects' },
    { icon: '🎯', text: 'Club Culture', message: 'What is Generate\'s club culture like?' }
  ];

  return (
    <>
      <button 
        className={`chat-float-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <div className="chat-btn-content">
            <span className="chat-icon">.✦ ݁˖</span>
            <span className="chat-pulse"></span>
          </div>
        )}
      </button>
      {isOpen && (
        <div className="chatbot-container">
          <div className="chat-header-gradient">
            <div className="chat-header-content">
              <div className="bot-avatar-large">
                <div className="avatar-icon">•ᴗ•</div>
              </div>
              <div className="header-text">
                <h3 className="chat-title-large">Generate Assistant</h3>
                <p className="chat-status-large">
                  <span className="status-indicator"></span> Online
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button className="header-btn" onClick={() => window.open('https://generatenu.com', '_blank')}>
                <span>↗</span>
              </button>
              <button className="header-btn" onClick={toggleChat}>
                <span>✕</span>
              </button>
            </div>
          </div>
          <div className="chat-body">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`chat-message ${message.isBot ? 'bot-message' : 'user-message'}`}
              >
                {message.isBot && (
                  <div className="bot-avatar-small">•ᴗ•</div>
                )}
                <div className="message-wrapper">
                  <div className="message-bubble-modern">
                    <p>{message.text}</p>
                  </div>
                  <span className="message-timestamp">{message.timestamp}</span>
                </div>
                {!message.isBot && (
                  <div className="user-avatar-small">🐺</div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message bot-message">
                <div className="bot-avatar-small">•ᴗ•</div>
                <div className="message-wrapper">
                  <div className="message-bubble-modern typing-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {messages.length <= 1 && (
            <div className="suggestions-container">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn-modern"
                  onClick={() => handleSuggestionClick(suggestion.message)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <span className="suggestion-text">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}
          <div className="chat-input-area">
            <div className="input-wrapper-modern">
              <textarea
                className="chat-input-modern"
                placeholder="Ask me anything about Generate..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="1"
              />
              <button 
                className="send-btn-modern"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <span className="send-arrow">➤</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;