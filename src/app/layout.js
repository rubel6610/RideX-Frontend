'use client';
import './globals.css';
import Navbar from '@/components/Shared/Navbar/Navbar';
import Footer from '@/components/Shared/Footer';
import { AuthProvider } from './hooks/AuthProvider';
import useHideLayout from './hooks/useHideLayout';
import { useAuth } from './hooks/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from './hooks/themeContext';
import QueryClientProvider from './Providers/ReactQueryProvider';
import Toaster from '@/components/ui/sonner';
import { Roboto, Mulish } from 'next/font/google';
import CursorFollower from '@/components/Shared/CursorFollower';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    );
  }

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${mulish.variable} ${roboto.variable}`}
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
