"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MoreVertical, ChatBubbleLeftRight, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatModal = ({ open, onClose, riderName, riderVehicle }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "rider",
            text: "Hello! I'm on my way to pick you up.",
            time: "2:30 PM",
        },
        {
            id: 2,
            sender: "user",
            text: "Great! How long will it take?",
            time: "2:31 PM",
        },
        {
            id: 3,
            sender: "rider",
            text: "I'll be there in about 5 minutes.",
            time: "2:31 PM",
        },
    ]);

    // Send message
    const handleSend = () => {
        if (!message.trim()) return;

        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

        const newMessage = {
            id: messages.length + 1,
            sender: "user",
            text: message,
            time: timeString,
        };

        setMessages([...messages, newMessage]);
        setMessage("");

        // Simulate rider response after 2 seconds
        setTimeout(() => {
            const riderResponse = {
                id: messages.length + 2,
                sender: "rider",
                text: "Got it! See you soon.",
                time: timeString,
            };
            setMessages((prev) => [...prev, riderResponse]);
        }, 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md h-[600px] p-0 gap-0 flex flex-col z-[9999]">
                {/* Header */}
                <DialogHeader className="p-4 border-b border-border bg-gradient-to-r from-primary to-accent text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-border">
                                <AvatarFallback className="bg-white text-primary font-bold text-lg">
                                    {riderName?.charAt(0) || "R"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-white text-lg font-bold">
                                    {riderName || "Rider"}
                                </DialogTitle>
                                <p className="text-xs text-white/80">
                                    • Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mr-5">
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                                <Phone className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4 bg-gradient-to-br from-card to-background">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] ${msg.sender === "user"
                                            ? "bg-gradient-to-r from-primary to-accent text-white"
                                            : "bg-card border border-border text-foreground"
                                        } rounded-2xl px-4 py-3 shadow-md`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"
                                            }`}
                                    >
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-background">
                    <div className="flex items-center gap-2">
                        <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 h-11 rounded-full border-border focus-visible:ring-primary"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className="h-11 w-11 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 p-0"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChatModal;

