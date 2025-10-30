"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/components/Shared/socket/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendHorizontal, Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const BACKEND = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function AdminSupport() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userTyping, setUserTyping] = useState(false);
  const adminId = user?.role === "admin" ? user.id : null;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fixed scrolling function - only scrolls chat area
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, 50);
  };

  useEffect(() => {
    async function loadThreads() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND}/support/admin/threads`);
        const data = await res.json();
        setThreads(data.threads || []);
      } catch (error) {
        console.error("Failed to load threads:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (adminId) {
      loadThreads();

      socketRef.current = initSocket(adminId, true);

      // Socket event listeners
      socketRef.current.on("new_support_thread", (thread) => {
        setThreads(prev => {
          const existingIndex = prev.findIndex(t => t.userId === thread.userId);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = thread;
            return updated;
          }
          return [thread, ...prev];
        });
      });

      socketRef.current.on("thread_updated", (data) => {
        setThreads(prev => prev.map(t => 
          t._id === data.thread._id ? data.thread : t
        ));
        if (activeThread && activeThread._id === data.thread._id) {
          setActiveThread(data.thread);
        }
      });

      socketRef.current.on("new_message", (data) => {
        console.log("New message received:", data);
        
        if (activeThread && activeThread._id === data.threadId) {
          setActiveThread(prev => ({
            ...prev,
            messages: [...(prev.messages || []), data.message],
            lastMessage: data.message.text,
            updatedAt: new Date()
          }));
          scrollToBottom();
        }

        setThreads(prev => prev.map(thread => {
          if (thread._id === data.threadId) {
            const updatedThread = {
              ...thread,
              lastMessage: data.message.text,
              updatedAt: new Date(),
              messages: [...(thread.messages || []), data.message]
            };
            
            if (activeThread && activeThread._id === data.threadId) {
              setActiveThread(updatedThread);
            }
            
            return updatedThread;
          }
          return thread;
        }));

        if (data.message.sender === 'user') {
          toast.info('New message from user', {
            description: data.message.text.substring(0, 50) + '...',
            duration: 5000,
          });
        }
      });

      // Typing indicators
      socketRef.current.on("user_typing_start", (data) => {
        if (activeThread && activeThread._id === data.threadId) {
          setUserTyping(true);
          scrollToBottom(); // Scroll when typing starts
        }
      });

      socketRef.current.on("user_typing_stop", (data) => {
        if (activeThread && activeThread._id === data.threadId) {
          setUserTyping(false);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [adminId, activeThread]);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, userTyping]);

  const handleTyping = () => {
    if (!activeThread) return;

    // Emit typing start
    socketRef.current.emit("admin_typing_start", {
      threadId: activeThread._id,
      adminId
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("admin_typing_stop", {
        threadId: activeThread._id,
        adminId
      });
    }, 1000);
  };

  const openThread = async (thread) => {
    try {
      // Fetch the latest messages for this thread
      const res = await fetch(`${BACKEND}/support/thread/${thread.userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.thread) {
          const updatedThread = {
            ...data.thread,
            unreadCount: 0
          };
          
          setActiveThread(updatedThread);
          // Update the thread in the list as well
          setThreads(prev => prev.map(t => 
            t.userId === thread.userId ? updatedThread : t
          ));
        } else {
          setActiveThread(thread);
        }
      }
    } catch (error) {
      setActiveThread(thread);
    }

    // Mark as read
    if (thread.unreadCount > 0) {
      try {
        await fetch(`${BACKEND}/support/admin/mark-read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ threadId: thread._id }),
        });
        setThreads(prev => prev.map(t => 
          t._id === thread._id ? { ...t, unreadCount: 0 } : t
        ));
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    scrollToBottom(); // Scroll when opening thread
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const messageText = replyText.trim();
    
    // Create optimistic message immediately
    const optimisticMessage = {
      _id: `optimistic-${Date.now()}`,
      sender: 'admin',
      adminId,
      text: messageText,
      createdAt: new Date(),
      isOptimistic: true
    };

    // Update UI immediately with optimistic message
    setActiveThread(prev => ({
      ...prev,
      messages: [...(prev.messages || []), optimisticMessage],
      lastMessage: messageText,
      updatedAt: new Date()
    }));

    setThreads(prev => prev.map(t => 
      t._id === activeThread._id 
        ? {
            ...t,
            lastMessage: messageText,
            updatedAt: new Date(),
            messages: [...(t.messages || []), optimisticMessage]
          }
        : t
    ));

    setReplyText("");
    scrollToBottom(); // Scroll after sending message

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketRef.current.emit("admin_typing_stop", {
      threadId: activeThread._id,
      adminId
    });

    try {
      const res = await fetch(`${BACKEND}/support/admin/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: activeThread._id,
          adminId,
          text: messageText,
        }),
      });

      if (!res.ok) throw new Error('Failed to send reply');

      const data = await res.json();
      
      // Replace optimistic message with real one
      setActiveThread(data.thread);
      setThreads(prev =>
        prev.map(t => t._id === data.thread._id ? data.thread : t)
      );

    } catch (error) {
      console.error("Error sending reply:", error);
      // Remove optimistic message on error
      setActiveThread(prev => ({
        ...prev,
        messages: (prev.messages || []).filter(m => !m.isOptimistic)
      }));
      setThreads(prev => prev.map(t => 
        t._id === activeThread._id 
          ? {
              ...t,
              messages: (t.messages || []).filter(m => !m.isOptimistic)
            }
          : t
      ));
      setReplyText(messageText);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getLastMessage = (thread) => {
    return thread.lastMessage || (thread.messages && thread.messages[thread.messages.length - 1]?.text) || "No messages yet";
  };

  const formatMessageTime = (dateString) => {
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
    <div className="md:flex h-[calc(100vh-100px)] bg-background ">
      <Card className="w-96 m-4 flex flex-col border-border bg-card">
        <CardHeader className="border-b border-border bg-card">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Support Inbox
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 custom-scrollbar">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-white/70">Loading threads...</div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-white/70">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-white/30" />
                <p>No support threads yet</p>
              </div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread._id}
                  className={`p-4 border-b border-border cursor-pointer transition-all ${
                    activeThread?._id === thread._id 
                      ? 'bg-accent' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => openThread(thread)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      {thread.userPhoto ? (
                        <img 
                          src={thread.userPhoto} 
                          alt={thread.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(thread.userName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-white">
                          {thread.userName}
                        </span>
                        <Badge 
                          variant={thread.status === 'waiting' ? 'destructive' : 'secondary'}
                          className="text-xs text-white"
                        >
                          {thread.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70 truncate">
                        {getLastMessage(thread)}
                      </p>
                      {thread.unreadCount > 0 && (
                        <div className="flex justify-end mt-1">
                          <Badge className="bg-red-500 text-white text-xs px-2 py-0">
                            {thread.unreadCount} new
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 m-4 flex flex-col border-border bg-card border">
        {!activeThread ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/70">
            <MessageCircle className="h-16 w-16 mb-4 text-white/30" />
            <h3 className="text-lg font-semibold mb-2 text-white">Select a conversation</h3>
            <p className="text-white/70">Choose a thread from the sidebar to start chatting</p>
          </div>
        ) : (
          <>
            <CardHeader className="border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="border border-border">
                  {activeThread.userPhoto ? (
                    <img 
                      src={activeThread.userPhoto} 
                      alt={activeThread.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(activeThread.userName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-white">
                    {activeThread.userName}
                  </CardTitle>
                  <p className="text-sm text-white/70">
                    Last updated {formatTime(activeThread.updatedAt)}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* Fixed ScrollArea with proper ref and styling */}
            <ScrollArea 
              ref={scrollAreaRef}
              className="flex-1 custom-scrollbar"
            >
              <div className="p-4 min-h-full">
                <div className="space-y-4">
                  {(activeThread.messages || []).map((message, index) => (
                    <div
                      key={message._id || index}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender === 'admin'
                            ? 'bg-primary text-white'
                            : 'bg-gray-700 text-white border border-border'
                        } ${message.isOptimistic ? 'opacity-70' : ''}`}
                      >
                        <p className="text-sm whitespace-pre-wrap text-white">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'admin' ? 'text-white/80' : 'text-white/70'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                          {message.isOptimistic && ' • Sending...'}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* User Typing Indicator */}
                  {userTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] rounded-lg px-4 py-2 bg-card text-white border border-border">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-xs text-white/70">User is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-card p-4">
              <form onSubmit={sendReply} className="flex gap-2">
                <Input
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    handleTyping();
                  }}
                  className="flex-1 bg-background border-border text-white placeholder-white/50"
                />
                <Button 
                  type="submit" 
                  disabled={!replyText.trim()}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}