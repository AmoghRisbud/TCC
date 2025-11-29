import SectionHeading from './components/SectionHeading';
import Link from 'next/link';
import { getPrograms, getTestimonials } from '../lib/content';

export default function HomePage() {
  const programs = getPrograms().slice(0, 2);
  const testimonials = getTestimonials().slice(0, 3);
  return (
    <div>
      <section className="section bg-white">
        <div className="container text-center">
          <h1 className="h1 mb-4">Helping Law Students Find Clarity, Skills & Direction.</h1>
          <p className="p mb-6">Join a community-led legal education ecosystem.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/community" className="btn">Join the Community</Link>
            <Link href="/programs" className="btn-secondary">Explore Programs</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <SectionHeading title="Featured Programs" />
        <div className="container grid md:grid-cols-2 gap-6">
          {programs.map(p => (
            <Link key={p.slug} href={`/programs/${p.slug}`} className="border p-5 rounded hover:shadow">
              <h3 className="h3 mb-2">{p.title}</h3>
              <p className="text-sm">{p.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="section bg-brand-light">
        <SectionHeading title="Testimonials" />
        <div className="container grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="border p-4 rounded bg-white">
              <p className="text-sm italic">“{t.quote}”</p>
              <p className="mt-3 text-xs font-semibold">{t.name}{t.role ? `, ${t.role}` : ''}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
