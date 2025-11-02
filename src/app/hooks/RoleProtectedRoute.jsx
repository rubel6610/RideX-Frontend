"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Admin Protected Route
export function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to login
      if (!user) {
        router.replace("/signIn");
        return;
      }
      
      // If user is not admin, redirect to their dashboard
      if (user.role !== "admin") {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  // If user is not admin, don't render anything (redirecting)
  if (user.role !== "admin") {
    return null;
  }

  return children;
}

// Rider Protected Route
export function RiderProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to login
      if (!user) {
        router.replace("/signIn");
        return;
      }
      
      // If user is not rider, redirect to their dashboard
      if (user.role !== "rider") {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  // If user is not rider, don't render anything (redirecting)
  if (user.role !== "rider") {
    return null;
  }

  return children;
}

// User Protected Route
export function UserProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to login
      if (!user) {
        router.replace("/signIn");
        return;
      }
      
      // If user is not regular user, redirect to their dashboard
      if (user.role !== "user") {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  // If not logged in, don't render anything
  if (!user) {
    return null;
  }

  // If user is not regular user, don't render anything (redirecting)
  if (user.role !== "user") {
    return null;
  }

  return children;
}