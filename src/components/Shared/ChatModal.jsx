"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MoreVertical, Phone, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initSocket, getSocket } from "@/components/Shared/socket/socket";
import { useAuth } from "@/app/hooks/AuthProvider";
import { toast } from "sonner";

const ChatModal = ({ open, onClose, riderName, riderVehicle, rideId, riderId }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [rideStatus, setRideStatus] = useState(null);
    const socketRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Determine user type (user or rider)
    const userType = user?.role === "rider" ? "rider" : "user";
    const currentUserId = userType === "rider" ? (riderId || user?.id) : user?.id;

    // Fetch existing chat messages and ride status
    useEffect(() => {
        if (!rideId || !open) return;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${rideId}/chat`
                );
                const data = await res.json();
                
                if (data.success) {
                    setMessages(data.messages || []);
                    setRideStatus(data.rideInfo?.status);
                }
            } catch (error) {
                console.error("Error fetching chat messages:", error);
                toast.error("Failed to load chat messages");
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [rideId, open]);

    // Check if chat is allowed based on ride status
    const isChatAllowed = rideStatus === 'accepted' || rideStatus === 'pending';

    // Initialize socket connection and join ride chat room
    useEffect(() => {
        if (!open || !rideId || !currentUserId) return;

        // Initialize socket
        socketRef.current = initSocket(currentUserId, user?.role === "admin");

        // Join the ride-specific chat room
        socketRef.current.emit("join_ride_chat", {
            rideId,
            userId: currentUserId,
            userType,
        });

        // Listen for incoming messages
        socketRef.current.on("receive_ride_message", (data) => {
            if (data.rideId === rideId) {
                setMessages((prev) => [...prev, data.message]);
                scrollToBottom();
            }
        });

        // Listen for typing indicators
        socketRef.current.on("ride_typing_start", (data) => {
            if (data.rideId === rideId && data.userId !== currentUserId) {
                setIsTyping(true);
            }
        });

        socketRef.current.on("ride_typing_stop", (data) => {
            if (data.rideId === rideId && data.userId !== currentUserId) {
                setIsTyping(false);
            }
        });

        // Cleanup on unmount or when modal closes
        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leave_ride_chat", {
                    rideId,
                    userId: currentUserId,
                    userType,
                });
                socketRef.current.off("receive_ride_message");
                socketRef.current.off("ride_typing_start");
                socketRef.current.off("ride_typing_stop");
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [open, rideId, currentUserId, userType, user?.role]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]"
                );
                if (viewport) {
                    viewport.scrollTop = viewport.scrollHeight;
                }
            }
        }, 100);
    };

    // Handle typing indicator
    const handleTyping = () => {
        if (!socketRef.current || !rideId) return;

        // Emit typing start
        socketRef.current.emit("ride_typing_start", {
            rideId,
            userId: currentUserId,
            userType,
        });

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit("ride_typing_stop", {
                rideId,
                userId: currentUserId,
                userType,
            });
        }, 1000);
    };

    // Send message
    const handleSend = async () => {
        if (!message.trim() || !socketRef.current || !rideId || !currentUserId) return;

        const messageText = message.trim();
        setMessage("");
        setSending(true);

        // Stop typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        socketRef.current.emit("ride_typing_stop", {
            rideId,
            userId: currentUserId,
            userType,
        });

        try {
            // Emit message via socket
            socketRef.current.emit("send_ride_message", {
                rideId,
                senderId: currentUserId,
                senderType: userType,
                message: messageText,
                timestamp: new Date().toISOString(),
            });

            // Listen for errors
            socketRef.current.once("message_error", (error) => {
                console.error("Error sending message:", error);
                toast.error("Failed to send message");
                setMessage(messageText); // Restore message on error
            });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            setMessage(messageText);
        } finally {
            setSending(false);
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "Now";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md h-[600px] p-0 gap-0 flex flex-col z-[9999]">
                {/* Header */}
                <DialogHeader className="p-4 border-b border-border bg-gradient-to-r from-primary to-accent text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-white">
                                <AvatarFallback className="bg-white text-primary font-bold text-lg">
                                    {riderName?.charAt(0) || "P"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-white text-lg font-bold">
                                    {riderName || (userType === "rider" ? "Passenger" : "Rider")}
                                </DialogTitle>
                                <p className="text-xs text-white/80">
                                    {riderVehicle || "• Online"}
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
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-gradient-to-br from-card to-background">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p className="text-sm">No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isSentByMe = msg.senderType === userType;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[75%] ${
                                                    isSentByMe
                                                        ? "bg-gradient-to-r from-primary to-accent text-white"
                                                        : "bg-card border border-border text-foreground"
                                                } rounded-2xl px-4 py-3 shadow-md`}
                                            >
                                                <p className="text-sm">{msg.text}</p>
                                                <p
                                                    className={`text-xs mt-1 ${
                                                        isSentByMe ? "text-white/70" : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {formatTime(msg.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-md">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                            <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-background">
                    {isChatAllowed ? (
                        <div className="flex items-center gap-2">
                            <Input
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    handleTyping();
                                }}
                                onKeyPress={(e) => e.key === "Enter" && !sending && handleSend()}
                                placeholder="Type your message..."
                                className="flex-1 h-11 rounded-full border-border focus-visible:ring-primary"
                                disabled={sending || loading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!message.trim() || sending || loading}
                                className="h-11 w-11 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 p-0"
                            >
                                {sending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">
                                {rideStatus === 'completed' && '✅ Ride completed - Chat is no longer available'}
                                {rideStatus === 'cancelled' && '❌ Ride cancelled - Chat is not available'}
                                {rideStatus === 'rejected' && '❌ Ride rejected - Chat is not available'}
                                {!rideStatus && 'Chat is not available for this ride'}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ChatModal;

