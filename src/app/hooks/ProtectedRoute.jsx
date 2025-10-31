"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signIn"); 
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return children;
}

// Role-based protected route component
export function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not logged in, redirect to login
      if (!user) {
        router.replace("/signIn");
        return;
      }
      
      // If user role is not in allowed roles, redirect to their dashboard
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router, allowedRoles]);

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

  // If role is not allowed, don't render anything (redirecting)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}