import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';

export const metadata = { title: 'Admin | TCC' };

const adminFeatures = [
  {
    title: 'Manage Programs',
    description: 'Add, edit, or remove programs available to students. Control visibility and enrollment settings.',
    href: '/admin/programs',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: 'Manage Testimonials',
    description: 'Review, approve, and publish testimonials from students, educators, and partners.',
    href: '/admin/testimonials',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  {
    title: 'Media Gallery',
    description: 'Upload and organize photos from events, workshops, and project activities.',
    href: '/admin/gallery',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'Job Listings',
    description: 'Post new career opportunities and manage existing job listings.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'Team Management',
    description: 'Manage educator profiles, team members, and their associated information.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: 'Research',
    description: 'Document and showcase past and ongoing research work with impact metrics.',
    href: '/admin/research',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  }
];

export default function AdminPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Admin Dashboard</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Manage content, programs, and resources for The Collective Counsel platform.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Features Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading 
            title="Content Management" 
            subtitle="Access admin features to manage and update platform content."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adminFeatures.map((feature) => {
              const content = (
                <>
                  <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="h3 mb-4 text-brand-dark">{feature.title}</h3>
                  <p className="text-brand-muted leading-relaxed">{feature.description}</p>
                  {feature.href && (
                    <span className="inline-flex items-center gap-2 mt-4 text-brand-primary font-medium group-hover:gap-3 transition-all">
                      Manage
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </>
              );
              
              if (feature.href) {
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="card text-center group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    aria-label={`${feature.title} - ${feature.description}`}
                  >
                    {content}
                  </Link>
                );
              }
              
              return (
                <article 
                  key={feature.title} 
                  className="card text-center group hover:shadow-lg transition-shadow duration-300"
                  aria-label={`${feature.title} - ${feature.description}`}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-brand-secondary/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="h2 mb-6 text-brand-dark">Getting Started</h2>
            <p className="text-xl text-brand-muted mb-8">
              This admin section displays the content management capabilities that will be available on this platform. 
              These features are currently in preview mode. To enable full admin functionality, 
              contact us to request appropriate access permissions for your role.
            </p>
            <Link href="/contact" className="btn">
              <span className="flex items-center gap-2">
                Request Access
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
