import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getTeam } from '../../lib/content';

export const metadata = { title: 'Team | TCC' };

export default function TeamPage() {
  const team = getTeam();
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Meet the Educators</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Our team of experienced legal professionals and educators dedicated to your success.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          {team.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map(m => (
                <Link 
                  key={m.slug} 
                  href={`/team/${m.slug}`} 
                  className="card-interactive group text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {m.name.charAt(0)}
                  </div>
                  <h3 className="h3 mb-2 text-brand-dark group-hover:text-brand-primary transition-colors">{m.name}</h3>
                  {m.title && (
                    <p className="text-brand-muted mb-4">{m.title}</p>
                  )}
                  {m.bio && (
                    <p className="text-sm text-brand-muted line-clamp-2 mb-4">{m.bio}</p>
                  )}
                  <span className="inline-flex items-center gap-2 text-brand-primary font-medium text-sm">
                    View Profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-brand-muted text-lg">Team profiles coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-6 text-brand-dark">Want to Join Our Team?</h2>
            <p className="text-xl text-brand-muted mb-10">
              We&apos;re always looking for passionate educators and legal professionals to join our mission.
            </p>
            <Link href="/careers" className="btn">
              View Open Positions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
