import SectionHeading from './components/SectionHeading';
import Link from 'next/link';
import { getPrograms, getTestimonials } from '../lib/content';

export default function HomePage() {
  const programs = getPrograms().slice(0, 2);
  const allTestimonials = getTestimonials();
  // Prioritize featured testimonials, fall back to first 3 if none are featured
  const testimonials = allTestimonials
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 3);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="h1 text-white mb-6 animate-fade-in">
              Helping Law Students Find{' '}
              <span className="text-brand-secondary">Clarity</span>,{' '}
              <span className="text-brand-secondary">Skills</span> &{' '}
              <span className="text-brand-secondary">Direction</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              Join a community-led legal education ecosystem designed to empower the next generation of legal professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link 
                href="/community" 
                className="btn bg-white text-brand-primary hover:bg-gray-100 hover:text-brand-primary shadow-xl"
              >
                <span className="flex items-center gap-2">
                  Join the Community
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="/programs" 
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-brand-light -mt-1">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '500+', label: 'Students Mentored' },
              { value: '50+', label: 'Expert Educators' },
              { value: '20+', label: 'Programs Delivered' },
              { value: '10+', label: 'Partner Institutions' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-brand-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading 
            title="Featured Programs" 
            subtitle="Discover our carefully curated programs designed to enhance your legal career."
          />
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map(p => (
              <Link 
                key={p.slug} 
                href={`/programs/${p.slug}`} 
                className="card-interactive group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center group-hover:bg-brand-primary transition-colors duration-300">
                    <svg className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="h3 mb-3 text-brand-dark group-hover:text-brand-primary transition-colors">{p.title}</h3>
                    <p className="text-brand-muted mb-4">{p.shortDescription}</p>
                    <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                      Learn More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/programs" className="btn-secondary">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gradient-to-br from-brand-light to-white">
        <div className="container">
          <SectionHeading 
            title="What Our Community Says" 
            subtitle="Hear from students and educators who have been part of our journey."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.id} className="card relative">
                <svg className="absolute top-4 right-4 w-8 h-8 text-brand-primary/20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-brand-dark leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-brand-primary font-semibold">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-dark">{t.name}</p>
                    {t.role && <p className="text-sm text-brand-muted">{t.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/testimonials" className="btn-ghost">
              Read More Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-dark">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 text-white mb-6">Ready to Start Your Legal Journey?</h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of law students who are already part of our thriving community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community" className="btn">
                Join the Community
              </Link>
              <Link href="/contact" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-dark">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
