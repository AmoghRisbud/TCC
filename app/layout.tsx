import './globals.css';
import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SessionProvider from './components/SessionProvider';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'The Collective Counsel',
  description: 'Helping Law Students Find Clarity, Skills & Direction.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
