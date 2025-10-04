"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/app/hooks/socket/socket";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";

const BACKEND = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";

export default function SupportPage() {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!currentUserId) return;
    const socket = initSocket();

    // Register user on socket
    socket.emit("register_user", currentUserId);

    // Handle admin reply
    socket.on("support_reply", (payload) => {
      if (thread && String(payload.threadId) !== String(thread._id)) return;
      setMessages((prev) => [
        ...prev,
        { sender: "admin", text: payload.text, createdAt: payload.createdAt },
      ]);
      setIsWaiting(false);
    });

    // Handle user message acknowledgment
    socket.on("message_sent_ack", (payload) => {
      if (thread && String(payload.threadId) !== String(thread._id)) return;
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: payload.text, createdAt: payload.createdAt },
      ]);
    });

    return () => {
      socket.off("support_reply");
      socket.off("message_sent_ack");
    };
  }, [currentUserId, thread]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || isWaiting) return;

    const res = await fetch(`${BACKEND}/support/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUserId, text }),
    });

    const data = await res.json();

    setThread(data.thread);
    setMessages(data.thread.messages || []);
    setText("");
    setIsWaiting(true);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Support Chat</h2>

      <div className="border rounded p-4 h-80 overflow-auto mb-4">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">
            No messages yet — send a support message.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 ${m.sender === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded text-white ${
                m.sender === "user" ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              <div className="text-sm">{m.text}</div>
            </div>
            <div className="text-xs mt-1 text-gray-600">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          className="flex-1 border rounded p-2"
          placeholder={isWaiting ? "Waiting for admin reply…" : "Write your message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isWaiting}
        />
        <Button variant="primary"
          disabled={isWaiting || !text.trim()}
        >
          Send
        </Button>
      </form>

      {isWaiting && (
        <div className="mt-2 text-sm text-yellow-600">
          Waiting for admin reply…
        </div>
      )}
    </div>
  );
}
