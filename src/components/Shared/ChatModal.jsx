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
    const [connectionError, setConnectionError] = useState(false);
    const socketRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messageListenerAttached = useRef(false);

    const userType = user?.role === "rider" ? "rider" : "user";
    const currentUserId = userType === "rider" ? (riderId || user?.id) : user?.id;

    useEffect(() => {
        if (!rideId || !open) return;

        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/ride/${rideId}/chat`
                );
                
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
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

    const isChatAllowed = rideStatus === 'accepted' || rideStatus === 'pending';

    useEffect(() => {
        if (!open || !rideId || !currentUserId) {
            setConnectionError(false);
            return;
        }

        try {
            socketRef.current = initSocket(currentUserId, user?.role === "admin");

            if (!socketRef.current) {
                setConnectionError(true);
                toast.error("Failed to establish connection");
                return;
            }

            const handleConnect = () => {
                setConnectionError(false);
                socketRef.current.emit("join_ride_chat", {
                    rideId,
                    userId: currentUserId,
                    userType,
                });
            };

            const handleDisconnect = () => {
                setConnectionError(true);
            };

            const handleConnectError = (error) => {
                console.error("Chat connection error:", error);
                setConnectionError(true);
            };

            const handleReceiveMessage = (data) => {
                try {
                    if (data.rideId === rideId) {
                        setMessages((prev) => {
                            const exists = prev.some(msg => msg.id === data.message.id);
                            if (exists) return prev;
                            return [...prev, data.message];
                        });
                        scrollToBottom();
                        
                        if (data.message.senderType !== userType) {
                            toast.success("New message received", {
                                description: data.message.text.substring(0, 50) + "..."
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error handling received message:", error);
                }
            };

            const handleTypingStart = (data) => {
                if (data.rideId === rideId && data.userId !== currentUserId) {
                    setIsTyping(true);
                }
            };

            const handleTypingStop = (data) => {
                if (data.rideId === rideId && data.userId !== currentUserId) {
                    setIsTyping(false);
                }
            };

            if (socketRef.current.connected) {
                handleConnect();
            }

            socketRef.current.on("connect", handleConnect);
            socketRef.current.on("disconnect", handleDisconnect);
            socketRef.current.on("connect_error", handleConnectError);
            socketRef.current.on("receive_ride_message", handleReceiveMessage);
            socketRef.current.on("ride_typing_start", handleTypingStart);
            socketRef.current.on("ride_typing_stop", handleTypingStop);

            messageListenerAttached.current = true;

            return () => {
                if (socketRef.current) {
                    socketRef.current.emit("leave_ride_chat", {
                        rideId,
                        userId: currentUserId,
                        userType,
                    });
                    socketRef.current.off("connect", handleConnect);
                    socketRef.current.off("disconnect", handleDisconnect);
                    socketRef.current.off("connect_error", handleConnectError);
                    socketRef.current.off("receive_ride_message", handleReceiveMessage);
                    socketRef.current.off("ride_typing_start", handleTypingStart);
                    socketRef.current.off("ride_typing_stop", handleTypingStop);
                    messageListenerAttached.current = false;
                }
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            };
        } catch (error) {
            console.error("Error initializing chat socket:", error);
            setConnectionError(true);
            toast.error("Chat connection failed");
        }
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

    const handleTyping = () => {
        if (!socketRef.current || !rideId || connectionError) return;

        try {
            socketRef.current.emit("ride_typing_start", {
                rideId,
                userId: currentUserId,
                userType,
            });

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                if (socketRef.current) {
                    socketRef.current.emit("ride_typing_stop", {
                        rideId,
                        userId: currentUserId,
                        userType,
                    });
                }
            }, 1000);
        } catch (error) {
            console.error("Error emitting typing indicator:", error);
        }
    };

    const handleSend = async () => {
        if (!message.trim() || !socketRef.current || !rideId || !currentUserId || connectionError) {
            if (connectionError) {
                toast.error("Connection error", {
                    description: "Please check your internet connection"
                });
            }
            return;
        }

        const messageText = message.trim();
        setMessage("");
        setSending(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        try {
            socketRef.current.emit("ride_typing_stop", {
                rideId,
                userId: currentUserId,
                userType,
            });
        } catch (error) {
            console.error("Error stopping typing indicator:", error);
        }

        try {
            const messageData = {
                rideId,
                senderId: currentUserId,
                senderType: userType,
                message: messageText,
                timestamp: new Date().toISOString(),
            };

            socketRef.current.emit("send_ride_message", messageData);

            const errorHandler = (error) => {
                console.error("Error sending message:", error);
                toast.error("Failed to send message", {
                    description: "Please try again"
                });
                setMessage(messageText);
                socketRef.current.off("message_error", errorHandler);
            };

            socketRef.current.once("message_error", errorHandler);

            setTimeout(() => {
                socketRef.current.off("message_error", errorHandler);
            }, 5000);

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

