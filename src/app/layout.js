// import { Roboto } from 'next/font/google';
import Navbar from "@/components/Shared/Navbar/Navbar";
import "./globals.css";
import Footer from "@/components/Shared/Footer";
import { AuthProvider } from "./hooks/AuthProvider";


// // ✅ Roboto font config
// const roboto = Roboto({
//   variable: '--font-roboto',
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
// });

export const metadata = {
  title: "Ridex | Home",
  description: "Ride Sharing Platform",
};

export default function RootLayout({ children }) {
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
