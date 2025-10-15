"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {toast} from "sonner";

export default function RiderActions({ user, onAction }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/approveAndreject-rider/${user._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      
      if (!res.ok) throw new Error(`Failed to ${status} user`);
      
      toast.success(`User ${status} successfully`);
      // Trigger refetch after successful action
      if (onAction) onAction();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${status} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Button
        variant="primary"
        size="sm"
        
        onClick={() => handleAction("approved")}
        disabled={loading}
      >
        <Check className="h-4 w-4 mr-1" />
        {loading ? "Processing..." : "Approve"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleAction("rejected")}
        disabled={loading}
      >
        <X className="h-4 w-4 mr-1" />
        {loading ? "Processing..." : "Reject"}
      </Button>
    </div>
  );
}