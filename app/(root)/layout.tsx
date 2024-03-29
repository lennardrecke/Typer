import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import TopBar from '@/components/shared/TopBar';
import LeftSideBar from '@/components/shared/LeftSideBar';
import RightSideBar from '@/components/shared/RightSideBar';
import BottomBar from '@/components/shared/BottomBar';
import { ThemeProvider } from '@/components/provider/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: 'Typer',
  description: 'Typer is a social media platform for FBI students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <TopBar />
            <main className='flex flex-row'>
              <LeftSideBar />
              <section className='main-container'>
                <div className='w-full max-w-4xl'>{children}</div>
              </section>
              <RightSideBar />
            </main>
            <BottomBar />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
