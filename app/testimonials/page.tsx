import SectionHeading from '../components/SectionHeading';
import { getTestimonials } from '../../lib/content';

export const metadata = { title: 'Testimonials | TCC' };

export default function TestimonialsPage() {
  const testimonials = getTestimonials();
  return (
    <div className="section container">
      <SectionHeading title="Testimonials" />
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="border rounded p-5 bg-white">
            <p className="text-sm italic">“{t.quote}”</p>
            <p className="mt-3 text-xs font-semibold">{t.name}{t.role ? `, ${t.role}` : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
