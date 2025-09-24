"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signIn"); // not logged in → redirect
    }
  }, [user, router]);

  if (!user) return null; // prevent flicker

  return children;
}
