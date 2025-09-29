"use client";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import socket from "@/app/hooks/socket/socket";
import { useAuth } from "@/app/hooks/AuthProvider";

export default function LiveChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
    const {user}=useAuth();
    
  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/messages");
        const data = await res.json();
        setChat(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    // Socket.IO listener
    socket.on("sendMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("sendMessage");
    };
  }, []);

  // Send message
  const sendMessage = async () => {
    if (message.trim() === "") return;

    
    const msgData = { message, userId:user.id };

    try {
      // Send via API (MongoDB save + socket broadcast)
      await fetch("http://localhost:5000/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            💬 Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {/* Chat messages */}
          <ScrollArea className="h-64 border rounded-md p-2 mb-3">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`p-2 my-1 rounded-md ${
                  c.senderId === user.id
                    ? "bg-blue-500 text-white ml-auto w-fit"
                    : "bg-gray-200 text-black mr-auto w-fit"
                }`}
              >
                <p className="text-sm ">
                  <b className="">{c.senderId === user.id ? "You" : c.userName}:</b>{" "}
                  {c.message}
                </p>
              </div>
            ))}
          </ScrollArea>

          {/* Input + Send button */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
