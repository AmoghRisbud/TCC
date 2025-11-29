import './globals.css';
import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

export const metadata = {
  title: 'The Collective Counsel',
  description: 'Helping Law Students Find Clarity, Skills & Direction.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
