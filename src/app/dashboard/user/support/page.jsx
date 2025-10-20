"use client"
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from "lucide-react";
import { getSocket, initSocket } from '@/app/hooks/socket/socket';

export default function UserChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Initialize socket
    const socketInstance = initSocket(user.id, false);
    setSocket(socketInstance);

    // Join user room
    socketInstance.emit("join", `user_${user.id}`);

    // Socket event listeners
    socketInstance.on("support_reply", (msg) => {
      setMessages(prev => [...prev, {
        sender: 'admin',
        text: msg.text,
        createdAt: msg.createdAt || new Date()
      }]);
    });

    socketInstance.on("message_sent_ack", (data) => {
      setThreadId(data.threadId);
      // Remove the optimistic message and add the confirmed one
      setMessages(prev => {
        const filtered = prev.filter(m => !m.isOptimistic);
        return [...filtered, {
          sender: 'user',
          text: data.text,
          createdAt: data.createdAt || new Date()
        }];
      });
    });

    // Fetch existing thread
    fetchThread();

    return () => {
      socketInstance.off("support_reply");
      socketInstance.off("message_sent_ack");
    };
  }, [user?.id]);

  const fetchThread = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/support/thread/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch thread");
      
      const data = await res.json();
      if (data.thread) {
        setThreadId(data.thread._id);
        setMessages(data.thread.messages || []);
      }
    } catch (err) {
      console.error("Error fetching thread:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !user?.id || isSending) return;

    setIsSending(true);
    const messageText = text.trim();

    // Optimistically add message to UI immediately
    const optimisticMessage = {
      sender: 'user',
      text: messageText,
      createdAt: new Date(),
      isOptimistic: true // Flag to identify optimistic messages
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setText("");

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
      if (data.thread) {
        setThreadId(data.thread._id);
      }

      // The socket event will handle the final message update
      // If socket event doesn't fire, we can fall back to API response
      setTimeout(() => {
        // Check if our optimistic message is still there (socket didn't handle it)
        setMessages(prev => {
          const hasOptimistic = prev.some(m => m.isOptimistic);
          if (hasOptimistic) {
            // Replace optimistic messages with confirmed ones from API
            const filtered = prev.filter(m => !m.isOptimistic);
            const confirmedMessages = data.thread?.messages || [];
            return [...filtered, ...confirmedMessages.slice(-1)]; // Add last message from API
          }
          return prev;
        });
      }, 2000); // Fallback after 2 seconds

    } catch (err) {
      console.error("Error sending message:", err);
      
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => !m.isOptimistic));
      
      // Optionally show error toast to user
      alert("Failed to send message: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="w-full max-w-md mx-auto mt-6 shadow-lg rounded-2xl border border-border">
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-3 text-center text-primary">
          💬 Support Chat
        </h3>

        {/* Messages Area */}
        <ScrollArea className="h-64 mb-3 pr-2">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center mt-20">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] p-3 my-2 rounded-lg text-sm shadow-sm transition-all ${
                  msg.sender === 'user'
                    ? "bg-blue-500 text-white ml-auto text-right rounded-br-none"
                    : "bg-gray-100 text-gray-800 mr-auto text-left rounded-bl-none"
                } ${msg.isOptimistic ? 'opacity-70' : ''}`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {msg.sender === 'user' ? 'You' : 'Support'} • {formatTime(msg.createdAt)}
                  {msg.isOptimistic && ' • Sending...'}
                </div>
                <div>{msg.text}</div>
              </div>
            ))
          )}
        </ScrollArea>

        {/* Input + Button */}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            className="px-3"
            disabled={!text.trim() || isSending}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendHorizontal size={18} />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
