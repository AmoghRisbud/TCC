'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Community' },
  { href: '/media', label: 'Media' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' }
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link 
          href="/" 
          className="font-bold text-2xl gradient-text hover:opacity-80 transition-opacity"
          aria-label="The Collective Counsel Home"
        >
          TCC
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {links.map(l => (
            <Link 
              key={l.href} 
              href={l.href} 
              className="px-4 py-2 text-sm font-medium text-brand-dark/70 hover:text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/community" className="ml-4 btn text-sm py-2">
            Join Us
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <svg 
            className="w-6 h-6 text-brand-dark" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav 
          className="md:hidden bg-white border-t border-gray-100 animate-fade-in"
          aria-label="Mobile navigation"
        >
          <div className="container py-4 space-y-1">
            {links.map(l => (
              <Link 
                key={l.href} 
                href={l.href} 
                className="block px-4 py-3 text-brand-dark/70 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <Link 
                href="/community" 
                className="btn w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Us
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
