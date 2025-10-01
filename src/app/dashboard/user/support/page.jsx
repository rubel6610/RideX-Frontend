"use client"
import React, { useEffect, useState } from "react";
import socket from "@/app/hooks/socket/socket";
import { useAuth } from "@/app/hooks/AuthProvider";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from "lucide-react";

export default function UserChat() {
  const {user}=useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const adminRole = "admin";
  useEffect(() => {
    socket.emit("joinRoom", user.id);

    socket.on("receiveMessage", (msg) => {
      if (msg.senderId === user.id || msg.receiverRole === adminRole) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // return () => socket.off("receiveMessage");
  }, [user?.id]);

useEffect(() => {
  if (!user?.id) return;

  fetch(`http://localhost:5000/api/messages?userId=${user.id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    })
    .then((data) => setMessages(data))
    .catch((err) => console.error(err));
}, [user?.id]);

const sendMessage = async () => {
  if (!text) return;

  try {
    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        senderId: user.id,
      }),
    });

    if (!res.ok) throw new Error("Failed to send message");

    setText("");
  } catch (err) {
    console.error(err);
  }
};


  return (
   <Card className="w-full max-w-md mx-auto mt-6 shadow-lg rounded-2xl border border-border">
  <CardContent className="p-4">
    <h3 className="text-xl font-semibold mb-3 text-center text-primary">
      💬 Live Chat
    </h3>

    {/* Messages Area */}
    <ScrollArea className="h-64 mb-3 pr-2">
      {messages.length === 0 && (
        <p className="text-gray-400 text-center mt-20">No messages yet...</p>
      )}

      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-[60%] p-2 my-1 rounded-lg text-sm shadow-sm ${
            msg.senderId === user.id
              ? "bg-blue-500 text-white ml-auto text-right rounded-br-none"
              : "bg-gray-100 text-gray-800 mr-auto text-left rounded-bl-none"
          }`}
        >
          {msg.message}
        </div>
      ))}
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
      />
      <Button type="submit" className="px-3">
        <SendHorizonal size={18} />
      </Button>
    </form>
  </CardContent>
</Card>
  );
}
