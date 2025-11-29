import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getPrograms } from '../../lib/content';

export const metadata = { title: 'Programs | TCC' };

export default function ProgramsPage() {
  const programs = getPrograms();
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Programs You Can Join</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Explore our range of programs designed to enhance your legal skills and career prospects.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map(p => (
              <Link 
                key={p.slug} 
                href={`/programs/${p.slug}`} 
                className="card-interactive group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
                    <svg className="w-7 h-7 text-brand-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="h3 mb-3 text-brand-dark group-hover:text-brand-primary transition-colors">{p.title}</h3>
                    <p className="text-brand-muted mb-4 leading-relaxed">{p.shortDescription}</p>
                    {p.status && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                        p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {p.status === 'active' ? 'Enrolling Now' : p.status}
                      </span>
                    )}
                    <span className="flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {programs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-muted text-lg">No programs available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-6 text-brand-dark">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-xl text-brand-muted mb-10">
              We&apos;re constantly developing new programs. Let us know what you&apos;d like to see.
            </p>
            <Link href="/contact" className="btn">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
