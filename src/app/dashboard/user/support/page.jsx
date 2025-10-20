"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizontal, MessageCircle } from "lucide-react";
import { initSocket } from '@/app/hooks/socket/socket';

export default function UserChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [status, setStatus] = useState('waiting');
  const [adminTyping, setAdminTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, adminTyping]);

  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = initSocket(user.id, false);

    socketRef.current.on("new_message", (data) => {
      setMessages(prev => [...prev, data.message]);
      setStatus('answered');
    });

    socketRef.current.on("thread_updated", (data) => {
      if (data.thread) {
        setMessages(data.thread.messages || []);
        setStatus(data.thread.status || 'waiting');
        setThreadId(data.thread._id);
      }
    });

    // Admin typing indicators
    socketRef.current.on("admin_typing_start", (data) => {
      setAdminTyping(true);
    });

    socketRef.current.on("admin_typing_stop", (data) => {
      setAdminTyping(false);
    });

    fetchThread();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user?.id]);

  // Handle typing events
  const handleTyping = () => {
    if (!threadId) return;

    // Emit typing start
    socketRef.current.emit("user_typing_start", {
      threadId,
      userId: user.id
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("user_typing_stop", {
        threadId,
        userId: user.id
      });
    }, 1000);
  };

  const fetchThread = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/support/thread/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch thread");
      
      const data = await res.json();
      if (data.thread) {
        setThreadId(data.thread._id);
        setMessages(data.thread.messages || []);
        setStatus(data.thread.status || 'waiting');
      }
    } catch (err) {
      console.error("Error fetching thread:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !user?.id) return;

    const messageText = text.trim();
    setText("");

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketRef.current.emit("user_typing_stop", {
      threadId,
      userId: user.id
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/support/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          text: messageText,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await res.json();
      setMessages(data.thread.messages || []);
      setStatus(data.thread.status || 'waiting');

    } catch (err) {
      console.error("Error sending message:", err);
      setText(messageText);
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Now';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 border-border bg-card text-white">
      <CardHeader className="border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageCircle className="h-6 w-6" />
            Support Chat
          </CardTitle>
          <Badge variant={status === 'waiting' ? 'destructive' : 'secondary'} className="text-white">
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96 p-4 bg-background custom-scrollbar">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center mt-20 text-white/70">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-white/30" />
                <p className="text-lg font-semibold text-white">No messages yet</p>
                <p className="text-white/70">Start a conversation with our support team</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.sender === 'user'
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-white border border-border"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap text-white">{msg.text}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-white/80' : 'text-white'
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Admin Typing Indicator */}
            {adminTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-card text-white border border-border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-card p-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Input
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 bg-background border-border text-foreground placeholder-white/50"
            />
            <Button 
              type="submit" 
              disabled={!text.trim()}
              variant="primary"
            >
              <SendHorizontal size={18} />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}