
import React, { useState, useRef, useEffect } from 'react';
import { 
  FaRegCommentDots as MessageIcon, 
  FaTimes as CloseIcon,
  FaExpand as MaximizeIcon,
  FaCompress as MinimizeIcon,
  FaPaperPlane as SendIcon,
  FaRobot as BotIcon,
  FaUser as UserIcon
} from 'react-icons/fa';
import { base_url } from '../utils/apiFetch';
import { useAuth } from '../utils/AuthContext';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatbotSystemProps {
  quizCompleted?: boolean;
  score?: number;
  totalQuestions?: number;
  userId?: string; // Add userId if needed for API
}

const Chatbot: React.FC<ChatbotSystemProps> = ({ 
  quizCompleted = false, 
  score = 0, 
  totalQuestions = 10,
  userId = ''
}) => {
  const { accessToken, isLoggedIn, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey there! I'm your AI tutor. How can I help you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchAIResponse = async (userMessage: string) => {
    if (!isLoggedIn || !accessToken) {
        logout();
        return "Your session has expired.";
    }
    try {
      const response = await fetch(`${base_url}/api/quiz/ai-tutor/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: userMessage,
          userId,
          quizData: {
            completed: quizCompleted,
            score,
            totalQuestions
          },
          conversationHistory: messages.slice(-5) 
        })
      });

      if (response.status === 401) { 
        logout();
        return "Your session has expired. Please log in again.";
      }

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "Sorry, I'm having trouble connecting to the AI tutor. Please try again later.";
    }
  };

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message) return;

    const userMessage: Message = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const botResponseText = await fetchAIResponse(message);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: getCurrentTime()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMaximized(false);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <>
      {/* Chat Interface */}
      <div className={`fixed transition-all duration-300 ${
        isOpen 
          ? `${isMaximized ? 'bottom-6 right-6 w-96 h-96' : 'bottom-24 right-6 w-80'} opacity-100 scale-100` 
          : 'bottom-24 right-6 w-80 opacity-0 scale-95 pointer-events-none'
      } bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50`}>
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BotIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">Digibot</div>
              <div className="text-xs text-purple-200 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={toggleMaximize}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              {isMaximized ? <MinimizeIcon className="w-4 h-4" /> : <MaximizeIcon className="w-4 h-4" />}
            </button>
            <button 
              onClick={toggleChat}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={`p-4 space-y-4 overflow-y-auto ${
          isMaximized ? 'h-80' : 'h-64'
        } scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
          {messages.map((message) => (
            <div key={message.id} className={`flex items-start space-x-2 ${
              message.isBot ? '' : 'justify-end'
            }`}>
              {message.isBot && (
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`rounded-lg px-3 py-2 max-w-xs ${
                message.isBot 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-900'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className={`text-xs mt-1 block ${
                  message.isBot ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </span>
              </div>
              {!message.isBot && (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-4 h-4 text-white" />
              </div>
              <div className="bg-purple-600 text-white rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input 
              ref={inputRef}
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..." 
              className="flex-1 text-base border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-purple-600 text-white rounded-lg p-2 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Bot Icon */}
      <div className={`fixed bottom-6 right-6 transition-all duration-300 ${
        isOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}>
        <div 
          onClick={toggleChat}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <MessageIcon className="w-6 h-6" />
          {/* Notification pulse */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;