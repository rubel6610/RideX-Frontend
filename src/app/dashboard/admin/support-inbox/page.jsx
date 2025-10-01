"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "@/app/hooks/socket/socket";
import { useAuth } from "@/app/hooks/AuthProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user: admin } = useAuth();

  // Join admin socket room
  useEffect(() => {
    if (!admin?._id) return;
    socket.emit("joinRoom", admin.id);

    socket.on("receiveMessage", (msg) => {
      // Only show messages for selected user
      if (selectedUser && (msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id)) {
        setMessages((prev) => [...prev, msg]);
      }

      // Update unread count for other users
      if (!selectedUser || msg.senderId !== selectedUser._id) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === msg.senderId
              ? { ...u, unreadCount: (u.unreadCount || 0) + 1 }
              : u
          )
        );
      }
    });

    return () => socket.off("receiveMessage");
  }, [admin.id, selectedUser]);

  // Fetch users who sent messages
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/messaged")
      .then((res) => {
        // Initialize unreadCount
        const usersWithUnread = res.data.map((u) => ({ ...u, unreadCount: 0 }));
        setUsers(usersWithUnread);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get("http://localhost:5000/api/messages", { params: { userId: selectedUser._id } })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    // Reset unread count when user is selected
    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? { ...u, unreadCount: 0 } : u
      )
    );
  }, [selectedUser]);

  // Send message
  const sendMessage = async () => {
    if (!text || !selectedUser) return;

    try {
      const res = await axios.post("http://localhost:5000/api/messages/reply", {
        message: text,
        adminId: admin.id,
        userId: selectedUser._id,
      });

      setMessages((prev) => [...prev, res.data.message]);
      setText("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send message");
    }
  };

  return (
    <div className="flex gap-4">
      {/* Users List */}
      <Card className="w-64 h-[400px] overflow-auto">
        <CardContent>
          <h3 className="font-bold mb-2">Users</h3>
          {users.map((u) => (
            <Button
              key={u._id}
              variant={selectedUser?._id === u._id ? "default" : "outline"}
              className="mb-1 w-full flex justify-between items-center"
              onClick={() => setSelectedUser(u)}
            >
              {u.fullName}
              {u.unreadCount > 0 && (
                <span className="bg-red-500 text-white px-2 rounded text-xs">
                  {u.unreadCount}
                </span>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Chat Panel */}
      {selectedUser && (
        <Card className="flex-1">
          <CardContent>
            <h3 className="font-bold mb-2">Chat with {selectedUser.fullName}</h3>
            <ScrollArea className="h-64 mb-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 my-1 rounded max-w-[70%] ${
                    msg.senderId === admin.id
                      ? "bg-blue-200 text-right ml-auto"
                      : "bg-gray-200 text-left"
                  }`}
                >
                  <b>{msg.userName}</b>: {msg.message}
                </div>
              ))}
            </ScrollArea>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
