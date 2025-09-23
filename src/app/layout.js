"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Shared/Navbar/Navbar";
import Footer from "@/components/Shared/Footer";
import { AuthProvider } from "./hooks/AuthProvider";


// // ✅ Roboto font config
// const roboto = Roboto({
//   variable: '--font-roboto',
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// });

// export const metadata = {
//   title: "Ridex | Home",
//   description: "Ride Sharing Platform",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbarFooter = pathname.startsWith("/dashboard");

  return (
    <html lang="en" data-theme="light">
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
