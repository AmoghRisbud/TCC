import Link from 'next/link';
import SectionHeading from '../../components/SectionHeading';
import { getResearch } from '../../../lib/content';
import ResearchManagement from './ResearchManagement';

export const metadata = { title: 'Manage Research | Admin | TCC' };

export default async function AdminResearchPage() {
  const research = await getResearch();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <nav className="mb-4">
              <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
                ← Back to Admin Dashboard
              </Link>
            </nav>
            <h1 className="h1 mb-6">Manage Research</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Document and showcase past and ongoing research work with impact metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Research Management */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading 
            title="Research Articles" 
            subtitle="Manage your research articles and publications."
          />
          <ResearchManagement initialResearch={research} />
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-brand-secondary/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="h2 mb-6 text-brand-dark">How It Works</h2>
            <p className="text-xl text-brand-muted mb-8">
              Research articles are managed through the admin API. Changes are stored in Redis and appear immediately on the site.
            </p>
            <Link href="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
