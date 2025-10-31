'use client';
import './globals.css';
import Navbar from '@/components/Shared/Navbar/Navbar';
import Footer from '@/components/Shared/Footer';
import { AuthProvider } from './hooks/AuthProvider';
import useHideLayout from './hooks/useHideLayout';
import { usePathname } from 'next/navigation';
import { useAuth } from './hooks/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from './hooks/themeContext';
import QueryClientProvider from './Providers/ReactQueryProvider';
import Toaster from '@/components/ui/sonner';
import { Roboto, Mulish } from 'next/font/google';
import CursorFollower from '@/components/Shared/CursorFollower';
import LenisProvider from '@/components/Shared/LenisProvider';
import { usePathname } from 'next/navigation';
import ChatBot from '@/components/Shared/ChatBot/ChatBot';

// Load Mulish first
const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mulish',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

function LayoutContent({ children }) {
  const hideLayout = useHideLayout();
  const { loading } = useAuth();

   const pathname = usePathname();

  const pathname = usePathname();


  // Check if we're on the home page
  const isHomePage = pathname === '/';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  return (
    <LenisProvider>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}

        {!isHomePage && !hideLayout && (

      {/* Show chatbot on all pages except home page */}
      {!isHomePage && !hideLayout && (
        <div className='fixed bottom-4 right-4 z-50'>
          <ChatBot/>
        </div>
      )}
    </LenisProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${mulish.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white">
        <ThemeProvider>
          <AuthProvider>
            <QueryClientProvider>
              <LayoutContent>{children}</LayoutContent>
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
        <CursorFollower />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}