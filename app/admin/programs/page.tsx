import Link from 'next/link';
import AdminProgramsManager from './AdminProgramsManager';

export const metadata = { title: 'Manage Programs | Admin | TCC' };

export default async function AdminProgramsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-r from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <nav className="mb-4">
              <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
                ← Back to Admin Dashboard
              </Link>
            </nav>
            <h1 className="h1 mb-6">Manage Programs</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Add, edit, or remove programs available to students.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Manager */}
      <section className="section bg-brand-light">
        <div className="container">
          <AdminProgramsManager />
        </div>
      </section>
    </div>
  );
}
