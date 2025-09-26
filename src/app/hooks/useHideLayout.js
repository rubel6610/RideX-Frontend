"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const HIDE_PATHS = ["/signIn", "/register",];
const HIDE_PREFIXES = ["/reset-password", "/dashboard",];

export default function useHideLayout() {
  const pathname = usePathname();
  const { loading } = useAuth() || {}; 

  if (loading) return true;
  if (HIDE_PATHS.includes(pathname)) return true;
  if (HIDE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;

  return false;
}
