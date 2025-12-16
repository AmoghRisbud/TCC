'use client';

import { useState } from 'react';
import { Testimonial } from '../../lib/types';

// -------------------- TestimonialCard Component --------------------
function TestimonialCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false); // state per card
  const isLong = t.quote.length > 250; // show read more only if long

  return (
    <div
      className="card relative flex flex-col h-full
                 bg-gradient-to-br from-[#F8F6EE] via-[#F1F4EF] to-[#FBFAF6]
                 ring-1 ring-black/10 shadow-md hover:-translate-y-1 hover:shadow-xl
                 transition-all duration-300 p-4"
    >
      {/* Quote Icon */}
      <svg
        className="absolute top-4 right-4 w-8 h-8 text-brand-primary/20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Rating */}
      {t.rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < (t.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      <p className={`text-brand-dark leading-relaxed italic ${!expanded ? 'line-clamp-5' : ''}`}>
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Read more / less button */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-brand-primary font-medium self-start"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}

      <div className="flex-grow" />

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
        <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
          <span className="text-brand-primary font-semibold text-lg">{t.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-brand-dark">{t.name}</p>
          {t.role && <p className="text-sm text-brand-muted">{t.role}</p>}
          {t.organization && <p className="text-xs text-brand-muted">{t.organization}</p>}
        </div>
      </div>
    </div>
  );
}

// -------------------- TestimonialsGrid Component --------------------
export default function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-muted text-lg">No testimonials yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((t) => (
        <TestimonialCard key={t.id} t={t} />
      ))}
    </div>
  );
}
