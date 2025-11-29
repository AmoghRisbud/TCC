import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getJobs } from '../../lib/content';

export const metadata = { title: 'Careers | TCC' };

export default function CareersPage() {
  const jobs = getJobs();
  const hasActiveJobs = jobs.length > 0;
  
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Work With TCC</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Join our mission to transform legal education and make a lasting impact on future lawyers.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="section bg-brand-light">
        <div className="container">
          {hasActiveJobs ? (
            <>
              <SectionHeading 
                title="Open Positions" 
                subtitle="Explore current opportunities to join our team."
              />
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {jobs.map(j => (
                  <Link 
                    key={j.slug} 
                    href={`/careers/${j.slug}`} 
                    className="card-interactive group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
                        <svg className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="h3 mb-2 text-brand-dark group-hover:text-brand-primary transition-colors">{j.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {j.department && (
                            <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full">
                              {j.department}
                            </span>
                          )}
                          {j.location && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {j.location}
                            </span>
                          )}
                          {j.type && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {j.type}
                            </span>
                          )}
                        </div>
                        <p className="text-brand-muted text-sm mb-4 line-clamp-2">{j.description}</p>
                        <span className="inline-flex items-center gap-2 text-brand-primary font-medium text-sm group-hover:gap-3 transition-all">
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
            </>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="h2 mb-6 text-brand-dark">No Open Positions</h2>
              <p className="text-xl text-brand-muted mb-8">
                Currently, we don&apos;t have any open roles. But we love hearing from passionate people who share our vision.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-6 text-brand-dark">Interested in Working With Us?</h2>
            <p className="text-xl text-brand-muted mb-8">
              Send your CV and a brief introduction to our email. We&apos;ll reach out when opportunities arise.
            </p>
            <a 
              href="mailto:info.thecollectivecounsel@gmail.com" 
              className="btn"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Your CV
              </span>
            </a>
            <p className="mt-4 text-sm text-brand-muted">
              info.thecollectivecounsel@gmail.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
