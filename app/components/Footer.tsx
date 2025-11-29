import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="h3 mb-2">TCC</h3>
          <p className="text-sm">Community-led legal education ecosystem.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            {['Home','About','Programs','Community','Careers','Contact'].map(i => (
              <li key={i}><Link href={`/${i.toLowerCase() === 'home' ? '' : i.toLowerCase()}`}>{i}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm">info.thecollectivecounsel@gmail.com</p>
          <p className="text-xs mt-4">© {new Date().getFullYear()} TCC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
