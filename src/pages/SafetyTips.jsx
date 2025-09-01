import React, { useState } from "react";

export default function SafetyTips() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI Safety Assistant. I'm here to help you with safety advice and guidance. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "What to do if I feel unsafe?",
    "How to stay safe while walking alone?",
    "What should I do in an emergency?",
    "How to protect myself online?",
    "Tips for safe travel"
  ];

  const safetyTips = [
    {
      category: "Walking Alone",
      tips: [
        "Stay in well-lit areas",
        "Walk confidently and be aware of your surroundings",
        "Keep your phone accessible but not visible",
        "Trust your instincts - if something feels wrong, change your route"
      ]
    },
    {
      category: "Public Transportation",
      tips: [
        "Sit near the driver or conductor",
        "Stay alert and avoid falling asleep",
        "Keep your belongings close to you",
        "Have emergency contacts on speed dial"
      ]
    },
    {
      category: "Online Safety",
      tips: [
        "Never share personal information with strangers",
        "Use strong, unique passwords",
        "Enable two-factor authentication",
        "Be cautious of suspicious links and requests"
      ]
    }
  ];

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("unsafe") || lowerMessage.includes("feel unsafe")) {
      return "If you feel unsafe, immediately move to a well-lit, populated area. Call a trusted contact or emergency services. Trust your instincts - if something feels wrong, it probably is. Consider using your SOS button if you're in immediate danger.";
    } else if (lowerMessage.includes("walking") || lowerMessage.includes("alone")) {
      return "When walking alone: stay in well-lit areas, walk confidently, keep your phone accessible, avoid headphones, and trust your instincts. Consider sharing your location with a trusted contact.";
    } else if (lowerMessage.includes("emergency")) {
      return "In an emergency: 1) Stay calm, 2) Assess the situation, 3) Move to safety if possible, 4) Use your SOS button, 5) Call emergency services, 6) Contact trusted people. Your safety is the priority.";
    } else if (lowerMessage.includes("online") || lowerMessage.includes("internet")) {
      return "For online safety: use strong passwords, enable 2FA, never share personal info with strangers, be cautious of suspicious links, and regularly update your privacy settings.";
    } else if (lowerMessage.includes("travel")) {
      return "Travel safely by: researching your destination, sharing your itinerary with trusted contacts, staying in safe accommodations, being aware of local customs, and keeping emergency contacts handy.";
    } else {
      return "I'm here to help with safety advice. You can ask me about walking alone, public transportation, online safety, travel tips, or any other safety concerns. What specific situation would you like advice on?";
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            AI Safety Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get instant safety advice and guidance from your AI companion
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="card h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Questions */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                  placeholder="Ask me anything about safety..."
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => sendMessage(inputMessage)}
                  className="btn-primary px-6"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Safety Tips Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Safety Tips
              </h3>
              <div className="space-y-4">
                {safetyTips.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-purple-600 dark:text-purple-400 mb-2">
                      {category.category}
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Resources */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Emergency Resources
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200">
                  🚨 Emergency Services: 911
                </button>
                <button className="w-full text-left p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
                  📍 Share Location
                </button>
                <button className="w-full text-left p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200">
                  📞 Call Trusted Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
