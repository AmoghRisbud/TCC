'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/research', label: 'Research' },
  { href: '/community', label: 'Community' },
  { href: '/media', label: 'Media' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container flex items-center justify-between gap-4 h-16 md:h-20">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          aria-label="The Collective Counsel Home"
        >
          <Image
            src="/CCLogo.png"
            alt="The Collective Counsel Logo"
            width={48}
            height={48}
            priority
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <span className="hidden lg:block font-semibold text-lg text-brand-dark tracking-tight whitespace-nowrap">
            The Collective Counsel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-end" aria-label="Main navigation">
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-brand-dark/70 hover:text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-all duration-200 whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
            
            {/* Admin Link - Only for Admin Users */}
            {!loading && session?.user?.isAdmin === true && (
              <Link
                href="/admin"
                className="px-3 py-2 text-sm font-medium text-brand-dark/70 hover:text-brand-primary rounded-lg hover:bg-brand-primary/5 transition-all duration-200 whitespace-nowrap"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!loading && !session && (
              <button
                onClick={() => signIn()}
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-dark rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            )}

            {!loading && session && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 rounded-lg border border-brand-primary/20 hover:border-brand-primary/40 transition-all duration-200"
                >
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-brand-primary/20"
                    />
                  )}
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-xs font-medium text-brand-dark truncate max-w-[100px]">
                      {session.user.name}
                    </span>
                    {session.user.isAdmin && (
                      <span className="text-[10px] font-medium bg-brand-primary text-white px-1.5 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-brand-dark/50 transition-transform duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
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
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-3 text-brand-dark/70 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            
            {/* Admin Link - Mobile - Only for Admin Users */}
            {!loading && session?.user?.isAdmin === true && (
              <Link
                href="/admin"
                className="block px-4 py-3 text-brand-dark/70 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

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
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 rounded-lg border-2 border-brand-primary/20">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-brand-primary/30"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-brand-dark">{session.user.name}</p>
                      {session.user.isAdmin && (
                        <span className="inline-block mt-1 text-xs font-medium bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-2 py-0.5 rounded-full shadow-sm">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
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
