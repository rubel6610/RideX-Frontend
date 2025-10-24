"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const to = `/dashboard/${user?.role}`

  useEffect(() => {
    if (!loading && user) {
      router.replace(to);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  // Not logged in → allow access
  return children;
}
