"use client";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/app/hooks/AuthProvider";
import { initSocket } from "@/components/Shared/socket/socket";
import { toast } from "sonner";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [riderId, setRiderId] = useState(null);
  const socketRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch riderId for rider role
  useEffect(() => {
    if (user?.role === "rider" && user?.id) {
      const fetchRiderId = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/user/rider/userId?userId=${user.id}`
          );
          const data = await res.json();
          if (data._id) {
            setRiderId(data._id);
          }
        } catch (err) {
          console.error("Error fetching rider profile for notifications:", err);
        }
      };
      fetchRiderId();
    }
  }, [user]);

  // Separate effect to handle rider room join (when riderId is available)
  useEffect(() => {
    if (user?.role === "rider" && riderId && socketRef.current) {
      const joinRiderRoom = () => {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('join_rider', riderId);
        }
      };

      // If socket is already connected, join immediately
      if (socketRef.current.connected) {
        joinRiderRoom();
      } else {
        // Wait for socket to connect
        socketRef.current.on('connect', joinRiderRoom);
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.off('connect', joinRiderRoom);
        }
      };
    }
  }, [user?.role, riderId]);

  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = initSocket(user.id, user.role === "admin");

    // Listen for ride notifications (for riders)
    if (user.role === "rider") {
      socketRef.current.on("new_ride_request", (data) => {
        const notification = {
          id: Date.now(),
          type: "ride_request",
          title: "New Ride Request",
          message: `New ride request nearby - ৳${data.ride?.fare}`,
          time: new Date(),
          read: false,
          data: data.ride,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.success("New Ride Request!", {
          description: `Fare: ৳${data.ride?.fare}`,
        });
      });

      socketRef.current.on("ride_cancelled_by_user", (data) => {
        const notification = {
          id: Date.now(),
          type: "ride_cancelled",
          title: "Ride Cancelled",
          message: "User has cancelled the ride",
          time: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.info("Ride Cancelled", {
          description: "User has cancelled the ride",
        });
      });

      // Listen for new message notifications from user (when user sends message from accept-ride page)
      socketRef.current.on("new_message_notification", (data) => {
        const notification = {
          id: Date.now(),
          type: "chat_message",
          title: "New Message from Passenger",
          message: data.message || "You have a new message",
          time: new Date(),
          read: false,
          rideId: data.rideId,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.info("New Message from Passenger", {
          description: data.message || "You have a new message",
          duration: 5000,
        });
      });
      
      // Listen for rider payment notifications (when admin marks rider as paid)
      socketRef.current.on("rider_payment_notification", (data) => {
        const notification = {
          id: Date.now(),
          type: "payment",
          title: "Payment Received",
          message: data.message,
          time: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.success("Payment Received!", {
          description: data.message,
          duration: 5000
        });
      });
    }

    // Listen for chat messages (for both users and riders)
    socketRef.current.on("receive_ride_message", (data) => {
      // Only show notification if message is from other party
      const isSentByMe = data.message.senderType === user.role;
      if (!isSentByMe) {
        const notification = {
          id: Date.now(),
          type: "chat_message",
          title: "New Message",
          message: data.message.text,
          time: new Date(),
          read: false,
          rideId: data.rideId,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.info("New Message", {
          description: data.message.text.substring(0, 50) + (data.message.text.length > 50 ? "..." : ""),
        });
      }
    });

    // Listen for support messages
    socketRef.current.on("new_message", (data) => {
      const notification = {
        id: Date.now(),
        type: "support_message",
        title: "Support Reply",
        message: data.message.text,
        time: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      toast.success("Support Reply", {
        description: "Admin has replied to your message",
      });
    });

    // Listen for payment notifications (for admins)
    if (user.role === "admin") {
      socketRef.current.on("new_payment_notification", (data) => {
        const notification = {
          id: Date.now(),
          type: "payment",
          title: "New Payment Received",
          message: data.message,
          time: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.success("New Payment Received!", {
          description: data.message,
          duration: 5000
        });
      });
    }

    // Listen for ride acceptance (for users)
    if (user.role === "user") {
      socketRef.current.on("ride_accepted", (data) => {
        const notification = {
          id: Date.now(),
          type: "ride_accepted",
          title: "Ride Accepted",
          message: `Rider ${data.riderInfo?.fullName} accepted your request`,
          time: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.success("Ride Accepted!", {
          description: `${data.riderInfo?.fullName} is coming`,
        });
      });

      // Listen for new message notifications from rider (when rider sends message from ongoing-ride page)
      socketRef.current.on("new_message_notification", (data) => {
        const notification = {
          id: Date.now(),
          type: "chat_message",
          title: "New Message from Rider",
          message: data.message || "You have a new message",
          time: new Date(),
          read: false,
          rideId: data.rideId,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.info("New Message from Rider", {
          description: data.message || "You have a new message",
          duration: 5000,
        });
      });

      // Also listen for receive_ride_message (when user is in accept-ride page)
      socketRef.current.on("receive_ride_message", (data) => {
        // Only show notification if message is from rider
        if (data.message.senderType === 'rider') {
          const notification = {
            id: Date.now(),
            type: "chat_message",
            title: "New Message from Rider",
            message: data.message.text,
            time: new Date(),
            read: false,
            rideId: data.rideId,
          };
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          toast.info("New Message from Rider", {
            description: data.message.text.substring(0, 50) + (data.message.text.length > 50 ? "..." : ""),
            duration: 5000,
          });
        }
      });
      
      // Listen for payment success notifications (for users)
      socketRef.current.on("payment_success_notification", (data) => {
        const notification = {
          id: Date.now(),
          type: "payment_success",
          title: "Payment Successful",
          message: data.message,
          time: new Date(),
          read: false,
        };
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        toast.success("Payment Successful!", {
          description: data.message,
          duration: 5000
        });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new_ride_request");
        socketRef.current.off("ride_cancelled_by_user");
        socketRef.current.off("receive_ride_message");
        socketRef.current.off("new_message");
        socketRef.current.off("ride_accepted");
        socketRef.current.off("new_message_notification");
        socketRef.current.off("new_payment_notification");
        socketRef.current.off("payment_success_notification");
        socketRef.current.off("rider_payment_notification");
      }
    };
  }, [user]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: 9999, position: 'relative' }}>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full p-2.5 bg-muted hover:bg-accent transition"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 9999, position: 'relative' }}
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-background border border-border rounded-lg shadow-lg" style={{ zIndex: 10000 }}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-accent cursor-pointer transition ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.read ? "bg-muted" : "bg-primary"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground break-words">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-normal break-words">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                          {formatTime(notification.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
