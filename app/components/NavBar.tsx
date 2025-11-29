import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Community' },
  { href: '/media', label: 'Media' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' }
];

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-brand-primary text-lg">TCC</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {links.map(l => <Link key={l.href} href={l.href} className="hover:text-brand-primary">{l.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
