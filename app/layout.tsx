import './globals.css';
import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SessionProvider from './components/SessionProvider';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'The Collective Counsel',
  description: 'Helping Law Students Find Clarity, Skills & Direction.',
  icons: {
    icon: [
      { url: '/CCLogo.png' },
      { url: '/CCLogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/CCLogo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/CCLogo.png',
    shortcut: '/CCLogo.png',
  },
  openGraph: {
    title: 'The Collective Counsel',
    description: 'Helping Law Students Find Clarity, Skills & Direction.',
    url: 'https://www.thecollectivecounsel.com',
    siteName: 'The Collective Counsel',
    images: [
      {
        url: '/CCLogo.png',
        alt: 'The Collective Counsel Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'The Collective Counsel',
    description: 'Helping Law Students Find Clarity, Skills & Direction.',
    images: ['/CCLogo.png'],
  },
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
