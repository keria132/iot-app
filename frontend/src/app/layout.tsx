import type { Metadata } from 'next';
import './globals.css';
import { Manrope } from 'next/font/google';
import { ReactNode } from 'react';
import ThemeProvider from '@/components/ui/theme-provider';
import ReactQueryProvider from './providers';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart home dashboard',
  description: 'Description',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='dark'>
      <body className={`${manrope.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
