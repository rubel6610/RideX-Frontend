'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideLogOut } from "lucide-react";
import { useAuth } from '@/app/hooks/AuthProvider';

const SignOutButton = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // check if user role is rider
      if (user?.id && user?.role === "rider") {
        // call API to set rider offline
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/status/offline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      }
    } catch (err) {
      console.error("Failed to set offline:", err);
    } finally {
      // perform normal logout in all cases
      logout();
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructiveOutline"
      size="lg"
      className="w-full m-3 text-md ml-1 flex items-center gap-2 justify-center"
    >
      <LucideLogOut className="w-5 h-5" />
      Logout
    </Button>
  );
};

export default SignOutButton;
