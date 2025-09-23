"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer";


export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbarFooter = pathname.startsWith("/dashboard");

  return (
    <html lang="en" data-theme="light">
      <body>
        {!hideNavbarFooter && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {!hideNavbarFooter && <Footer />}
      </body>
    </html>
  );
}
