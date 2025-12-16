'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/research', label: 'Research' },
  { href: '/community', label: 'Community' },
  { href: '/media', label: 'Media' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' }
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          aria-label="The Collective Counsel Home"
        >
          <Image
            src="/CCLogo.png"
            alt="The Collective Counsel Logo"
            width={56}
            height={56}
            priority
          />
          <span className="font-semibold text-lg md:text-xl text-brand-dark tracking-tight">
            The Collective Counsel
          </span>
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
          
          {/* Auth Buttons */}
          {!loading && !session && (
            <button 
              onClick={() => signIn()}
              className="ml-4 px-4 py-2 text-sm font-medium text-brand-primary border-2 border-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200"
            >
              Sign In
            </button>
          )}
          
          {!loading && session && (
            <div className="ml-4 flex items-center gap-3">
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-brand-dark">
                  {session.user.name}
                  {session.user.isAdmin && (
                    <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded">Admin</span>
                  )}
                </span>
              </div>
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-brand-dark/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
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
            
            {/* Mobile Auth */}
            <div className="pt-4 px-4 space-y-2">
              {!loading && !session && (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    signIn();
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-brand-primary border-2 border-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-200"
                >
                  Sign In
                </button>
              )}
              
              {!loading && session && (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-brand-dark">{session.user.name}</p>
                      {session.user.isAdmin && (
                        <span className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded">Admin</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
