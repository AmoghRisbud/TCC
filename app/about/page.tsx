import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';

export const metadata = { title: 'About | TCC' };

const sections = [
  {
    title: 'Vision',
    description: 'To create a world where every law student has access to quality mentorship, practical skills training, and a supportive community that guides them towards a fulfilling legal career.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    title: 'Mission',
    description: 'To bridge the gap between legal education and practical legal practice by providing comprehensive training programs, mentorship opportunities, and a collaborative learning environment.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Approach',
    description: 'We combine expert mentorship with structured courses and an engaged community model. Our holistic approach ensures students receive guidance, develop skills, and build lasting professional networks.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  }
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-br from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Who We Are</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              The Collective Counsel is a community-led legal education ecosystem dedicated to helping law students navigate their journey from academics to a successful legal career.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-brand-primary/10 text-brand-primary font-medium rounded-full text-sm mb-4">
                The Problem
              </span>
              <h2 className="h2 mb-6 text-brand-dark">Law Students Face a Gap</h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                Many law students graduate with theoretical knowledge but lack the practical skills, industry connections, and career clarity needed to succeed in the competitive legal landscape.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Traditional legal education often falls short in preparing students for the real-world challenges of legal practice, leaving them feeling lost and unprepared.
              </p>
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-brand-secondary/10 text-brand-secondary font-medium rounded-full text-sm mb-4">
                Our Solution
              </span>
              <h2 className="h2 mb-6 text-brand-dark">Community-Led Education</h2>
              <p className="text-brand-muted leading-relaxed mb-4">
                TCC bridges this gap through comprehensive mentorship programs, skill-building workshops, and a supportive community that connects students with experienced legal professionals.
              </p>
              <p className="text-brand-muted leading-relaxed">
                We provide the tools, guidance, and network that students need to confidently step into their legal careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Approach */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading 
            title="Our Foundation" 
            subtitle="The principles that guide everything we do at The Collective Counsel."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title} className="card text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                  {section.icon}
                </div>
                <h3 className="h3 mb-4 text-brand-dark">{section.title}</h3>
                <p className="text-brand-muted leading-relaxed">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-brand-dark">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 text-white mb-6">Want to Know More?</h2>
            <p className="text-xl text-gray-400 mb-10">
              Get in touch with us to learn more about our programs and how we can help you.
            </p>
            <Link href="/contact" className="btn">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
