import React, { useState, useRef, useEffect } from "react"; // ✅ useRef, useEffect import করো
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/chatbot`,
        {
          method: "POST",
          body: JSON.stringify({ message: input }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      const botReply = {
        sender: "bot",
        text: data?.reply || "Sorry, I didn't understand that.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) setMessages([]);
  };

  // ✅ Auto scroll when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">RideX Assistant</h2>
              <p className="text-xs opacity-80">
                Ask me anything about RideX
              </p>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">Hello! I'm your RideX assistant.</p>
                <p className="text-sm mt-1">
                  Ask me about rides, payments, or anything else.
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>Try asking:</p>
                  <p className="mt-1">• "How do I book a ride?"</p>
                  <p>• "What are your vehicle options?"</p>
                  <p>• "How does payment work?"</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`my-2 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start my-2">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            {/* ✅ Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2 p-3 border-t border-gray-200">
            <input
              className="flex-1 border-2 text-black border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`bg-primary text-white rounded-full px-4 py-2 ${
                loading || !input.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;