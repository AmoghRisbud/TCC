import Link from 'next/link';
import AdminCareersManager from './AdminCareersManager';

export const metadata = { title: 'Manage Careers | Admin | TCC' };

export default async function AdminCareersPage() {
  return (
    <div>
      <section className="section bg-gradient-to-r from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <nav className="mb-4">
              <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
                ← Back to Admin Dashboard
              </Link>
            </nav>
            <h1 className="h1 mb-6">Manage Careers</h1>
            <p className="text-xl text-white/80 leading-relaxed">Add, edit, or remove job listings and career opportunities.</p>
          </div>
        </div>
      </section>

      <section className="section bg-brand-light">
        <div className="container">
          <AdminCareersManager />
        </div>
      </section>
    </div>
  );
}
