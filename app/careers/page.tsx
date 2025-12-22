import Link from 'next/link';
import { Suspense } from 'react';
import SectionHeading from '../components/SectionHeading';
import { getJobs } from '../../lib/content';
import CVSubmissionForm from './CVSubmissionForm';

export const metadata = { title: 'Careers | TCC' };
export const dynamic = 'force-dynamic';

export default async function CareersPage() {
  const jobs = await getJobs();

  const tccJobs = jobs.filter((j) => j.category === "tcc");
  const lawJobs = jobs.filter((j) => j.category === "law");

  return (
    <div>
      {/* Hero */}
      <section className="section bg-brand-hero text-white">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="h1 mb-4">Careers</h1>
          <p className="text-lg text-white/85 leading-relaxed mx-auto">
            Explore opportunities to work directly with The Collective Counsel
            and contribute to building impactful legal education initiatives.
          </p>
        </div>
      </section>

      {/* Careers Split */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Careers with TCC */}
            <div>
              {/* Heading block */}
              <div className="mb-10">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Careers with{" "}
                  <span className="text-brand-primary">TCC</span>
                </h2>

                <div className="mt-3 h-1 w-12 rounded-full bg-brand-primary/70" />

                <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-md">
                 Work at the core of The Collective Counsel, building programs, communities and initiatives shaping the next generation of legal upskilling.
                </p>
              </div>

              {tccJobs.length > 0 ? (
                <div className="space-y-6">
                  {tccJobs.map((job) => (
                    <Link
                      key={job.slug}
                      href={`/careers/${job.slug}`}
                      className="card-interactive block"
                    >
                      <h3 className="h3 mb-2">{job.title}</h3>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.location && (
                          <span className="badge">{job.location}</span>
                        )}
                        {job.type && (
                          <span className="badge">{job.type}</span>
                        )}
                      </div>

                      <p className="text-sm text-brand-muted line-clamp-2">
                        {job.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-brand-primary font-medium text-sm">
                        View Details →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-brand-muted">
                  No open positions currently.
                </p>
              )}
            </div>

            {/* Careers in Law */}
            <div>
              {/* Heading block */}
              <div className="mb-10">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Careers in{" "}
                  <span className="text-brand-accent">Law</span>
                </h2>

                <div className="mt-3 h-1 w-12 rounded-full bg-brand-accent/70" />

                <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-md">
                  Explore Curated internships, fellowships and early career legal opportunities shared through our trusted & reputed Network.
                </p>
              </div>

              {lawJobs.length > 0 ? (
                <div className="space-y-6">
                  {lawJobs.map((job) => (
                    <Link
                      key={job.slug}
                      href={`/careers/${job.slug}`}
                      className="card-interactive block"
                    >
                      <h3 className="h3 mb-2">{job.title}</h3>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.location && (
                          <span className="badge">{job.location}</span>
                        )}
                        {job.type && (
                          <span className="badge">{job.type}</span>
                        )}
                      </div>

                      <p className="text-sm text-brand-muted line-clamp-2">
                        {job.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-brand-secondary font-medium text-sm">
                        View Opportunity →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-brand-muted">
                  Career opportunities will be shared soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="apply" className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="h2 mb-6 text-brand-dark">Interested in Working With Us?</h2>
            <p className="text-xl text-brand-muted mb-8">
              Send your CV and a brief introduction. We&apos;ll reach out when opportunities arise.
            </p>
          </div>
          <Suspense fallback={<div className="text-center py-12">Loading form...</div>}>
            <CVSubmissionForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
