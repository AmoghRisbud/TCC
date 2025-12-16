import { getTestimonials } from '../../lib/content';
import TestimonialsGrid from './TestimonialsGrid';

export const metadata = { title: 'Testimonials | TCC' };

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Testimonials</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Hear what our community members have to say about their experience with TCC.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-brand-light">
        <div className="container">
          <TestimonialsGrid testimonials={testimonials} />
        </div>
      </section>
    </div>
  );
}
