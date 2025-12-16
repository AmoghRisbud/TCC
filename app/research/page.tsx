import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getResearch } from '../../lib/content';

export const metadata = { title: 'Research | TCC' };

export default async function researchPage() {
  const research = await getResearch();
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Our Proof of Concept</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover the impact we&apos;ve made through our wide research.
            </p>
          </div>
        </div>
      </section>

      {/* research Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {research.map(p => (
              <Link
                key={p.slug}
                href={p.pdf || `/research/${p.slug}`}
                {...(p.pdf && { target: "_blank", rel: "noopener noreferrer" })}
                className="card-interactive group"
              >

                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {p.year && (
                      <span className="text-sm text-brand-muted">{p.year}</span>
                    )}
                  </div>
                  <h3 className="h3 mb-3 text-brand-dark group-hover:text-brand-primary transition-colors">{p.title}</h3>
                  <p className="text-brand-muted mb-6 leading-relaxed flex-1">{p.summary}</p>
                  
                  {p.impactMetrics && p.impactMetrics.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-6 pt-4 border-t border-gray-100">
                      {p.impactMetrics.slice(0, 2).map((metric, index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                          <div className="text-xs text-brand-muted">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                    View Research Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          {research.length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-muted text-lg">No researches to display yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
